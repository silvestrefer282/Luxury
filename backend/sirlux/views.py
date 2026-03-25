from rest_framework import viewsets, status, decorators, serializers, permissions
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
from decimal import Decimal

from .models import (
    Usuario, Cliente, Paquete, ImagenPaquete, Menu, CategoriaMenu, Platillo, ServicioAdicional, 
    Reservacion, Degustacion, ConfiguracionSistema, Galeria, Contrato, PagoContrato,
    Testimonio
)
from .serializers import (
    UsuarioSerializer, ClienteSerializer, PaqueteSerializer, 
    MenuSerializer, CategoriaMenuSerializer, PlatilloSerializer, 
    ServicioAdicionalSerializer, 
    ReservacionSerializer, DegustacionSerializer, 
    ConfiguracionSistemaSerializer, GaleriaSerializer, ContratoSerializer, PagoContratoSerializer,
    TestimonioSerializer
)
from .services import calcular_costo_reservacion, verificar_disponibilidad

class ConfiguracionSistemaViewSet(viewsets.ModelViewSet):
    queryset = ConfiguracionSistema.objects.all()
    serializer_class = ConfiguracionSistemaSerializer

    @decorators.action(detail=False, methods=['get', 'put'])
    def current(self, request):
        config = ConfiguracionSistema.get_solo()
        if request.method == 'PUT':
            serializer = self.get_serializer(config, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(config)
        return Response(serializer.data)

class ReservacionViewSet(viewsets.ModelViewSet):
    queryset = Reservacion.objects.all()
    serializer_class = ReservacionSerializer

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            # Para el calendario público permitimos ver todas las reservas
            return Reservacion.objects.all()
        
        if user.rol == Usuario.ADMINISTRADOR or user.is_staff or user.rol == Usuario.ENCARGADO:
            if self.request.query_params.get('personal') == 'true':
                return Reservacion.objects.filter(cliente__usuario=user)
            return Reservacion.objects.all()
        return Reservacion.objects.filter(cliente__usuario=user)

    def perform_create(self, serializer):
        # Lógica de creación con cálculo automático
        data = self.request.data
        paquete = Paquete.objects.get(id=data['paquete'])
        menu = Menu.objects.get(id=data['menu']) if data.get('menu') else None
        
        # Validar número de platillos vs tiempos del paquete
        platillos_ids = data.get('platillos_seleccionados', [])
        if len(platillos_ids) > paquete.numero_tiempos:
            raise serializers.ValidationError(
                f"El paquete '{paquete.nombre}' solo permite {paquete.numero_tiempos} tiempos (platillos). Ha seleccionado {len(platillos_ids)}."
            )
        
        hora_inicio = datetime.strptime(data['hora_inicio'], '%H:%M').time()
        hora_fin = datetime.strptime(data['hora_fin'], '%H:%M').time()
        fecha = datetime.strptime(data['fecha_evento'], '%Y-%m-%d').date()

        # Validar disponibilidad
        disponible, msg = verificar_disponibilidad(fecha, hora_inicio, hora_fin)
        if not disponible:
            raise serializers.ValidationError(msg)

        # Calcular costo
        calc_data = {
            'paquete': paquete,
            'menu': menu,
            'num_personas': data.get('num_personas', 0),
            'hora_inicio': hora_inicio,
            'hora_fin': hora_fin
        }
        total = calcular_costo_reservacion(calc_data, data.get('servicios_adicionales', []))
        
        reserva = serializer.save(total_estimado=total)
        
        # Guardar platillos seleccionados
        if platillos_ids:
            reserva.platillos_seleccionados.set(platillos_ids)

    @decorators.action(detail=False, methods=['get'])
    def disponibilidad(self, request):
        fecha_str = request.query_params.get('fecha')
        if not fecha_str:
            return Response({"error": "Fecha requerida"}, status=status.HTTP_400_BAD_REQUEST)
        
        # En una versión real, esto devolvería slots. 
        # Por ahora devolvemos las reservas existentes para que el front bloquee.
        fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
        reservas = Reservacion.objects.filter(fecha_evento=fecha).exclude(estado='Cancelada')
        config = ConfiguracionSistema.get_solo()
        
        data = {
            "ocupado": [
                {"inicio": r.hora_inicio, "fin": r.hora_fin} for r in reservas
            ],
            "config": {
                "apertura": config.hora_apertura,
                "cierre": config.hora_cierre,
                "limpieza": config.hora_limpieza
            }
        }
        return Response(data)

    @decorators.action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def calendario_publico(self, request):
        reservas = Reservacion.objects.exclude(estado='Cancelada')
        data = []
        for r in reservas:
            if r.fecha_evento:
                data.append({
                    "id": r.id,
                    "fecha": r.fecha_evento.strftime('%Y-%m-%d'),
                    "fecha_evento": r.fecha_evento.strftime('%Y-%m-%d'),
                    "estado": r.estado,
                    "paquete_nombre": r.paquete.nombre if r.paquete else None,
                    "nombre_evento": f"Evento de {r.nombre_festejado}" if r.nombre_festejado else "Evento Reservado",
                })
        return Response(data)

    @decorators.action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        reserva = self.get_object()
        config = ConfiguracionSistema.get_solo()
        hoy = timezone.now().date()
        dias_faltantes = (reserva.fecha_evento - hoy).days
        
        # Regla de penalización
        deposito = Decimal('1000.00')
        if dias_faltantes >= config.dias_limite_cancelacion:
            penalizacion = Decimal('2000.00')
        else:
            penalizacion = Decimal('4000.00')
            
        reserva.estado = 'Cancelada'
        reserva.observaciones = f"Cancelada el {hoy}. Retención: {deposito} (depósito) + {penalizacion} (penalización)."
        reserva.save()
        
        return Response({
            "status": "Cancelada",
            "retencion_total": deposito + penalizacion,
            "detalle": reserva.observaciones
        })

# ViewSets Básicos para las demás entidades
class PaqueteViewSet(viewsets.ModelViewSet):
    queryset = Paquete.objects.all()
    serializer_class = PaqueteSerializer

    def perform_create(self, serializer):
        paquete = serializer.save()
        galeria = self.request.FILES.getlist('galeria_imgs')
        for i, img in enumerate(galeria):
            ImagenPaquete.objects.create(paquete=paquete, imagen=img, orden=i)

    def perform_update(self, serializer):
        import json
        paquete = serializer.save()
        
        # 1. Eliminar imágenes específicas si se envían sus IDs
        deleted_ids = self.request.data.getlist('deleted_gallery_ids')
        if deleted_ids:
            ImagenPaquete.objects.filter(id__in=deleted_ids, paquete=paquete).delete()

        # 2. Reordenar y agregar nuevas imágenes
        gallery_order_str = self.request.data.get('gallery_order', None)
        galeria = self.request.FILES.getlist('galeria_imgs')
        
        if gallery_order_str:
            try:
                gallery_order = json.loads(gallery_order_str)
                new_file_idx = 0
                
                for idx, item in enumerate(gallery_order):
                    if item == 'new':
                        if new_file_idx < len(galeria):
                            img = galeria[new_file_idx]
                            ImagenPaquete.objects.create(paquete=paquete, imagen=img, orden=idx)
                            new_file_idx += 1
                    else:
                        try:
                            existing_img = ImagenPaquete.objects.get(id=int(item), paquete=paquete)
                            existing_img.orden = idx
                            existing_img.save()
                        except (ImagenPaquete.DoesNotExist, ValueError):
                            pass
            except json.JSONDecodeError:
                pass
        else:
            # Fallback for append if order is not explicitly provided
            if galeria:
                ultimo_orden = paquete.galeria.count()
                for i, img in enumerate(galeria):
                    ImagenPaquete.objects.create(paquete=paquete, imagen=img, orden=ultimo_orden + i)

class MenuViewSet(viewsets.ModelViewSet):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

class ServicioAdicionalViewSet(viewsets.ModelViewSet):
    queryset = ServicioAdicional.objects.all()
    serializer_class = ServicioAdicionalSerializer

class CategoriaMenuViewSet(viewsets.ModelViewSet):
    queryset = CategoriaMenu.objects.all()
    serializer_class = CategoriaMenuSerializer

class PlatilloViewSet(viewsets.ModelViewSet):
    queryset = Platillo.objects.all()
    serializer_class = PlatilloSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class DegustacionViewSet(viewsets.ModelViewSet):
    queryset = Degustacion.objects.all()
    serializer_class = DegustacionSerializer

class GaleriaViewSet(viewsets.ModelViewSet):
    queryset = Galeria.objects.all()
    serializer_class = GaleriaSerializer

class ContratoViewSet(viewsets.ModelViewSet):
    queryset = Contrato.objects.all()
    serializer_class = ContratoSerializer

class PagoContratoViewSet(viewsets.ModelViewSet):
    queryset = PagoContrato.objects.all()
    serializer_class = PagoContratoSerializer

    def perform_create(self, serializer):
        pago = serializer.save()
        contrato = pago.contrato
        # Recalcular saldo total pagado (incluyendo anticipo)
        total_pagado = sum(p.monto for p in contrato.pagos.all()) + contrato.anticipo_monto
        # Total a pagar = Inversión + Depósito
        deuda_total = contrato.total_operacion + contrato.deposito_garantia
        
        if total_pagado >= deuda_total:
            reserva = contrato.reservacion
            if reserva.estado != 'Confirmada':
                reserva.estado = 'Confirmada'
                reserva.save()
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    @decorators.action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def registro(self, request):
        data = request.data.copy()
        
        # Mapeo del frontend para ajustarse al modelo
        if 'nombre' in data and not data.get('first_name'):
            data['first_name'] = data.pop('nombre')
        if 'apellidos' in data and not data.get('apellido_paterno'):
            apellidos = data.pop('apellidos').split(' ', 1)
            data['apellido_paterno'] = apellidos[0]
            if len(apellidos) > 1:
                data['apellido_materno'] = apellidos[1]
                
        # Username autogenerado si no viene
        if not data.get('username') and data.get('email'):
            data['username'] = data['email'].split('@')[0][:150]
            
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            # Todos los roles ahora pueden tener un perfil de cliente para hacer sus propias reservas
            Cliente.objects.get_or_create(usuario=user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user": UsuarioSerializer(user).data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @decorators.action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        username_or_email = request.data.get('username') or request.data.get('email')
        password = request.data.get('password')
        
        username = username_or_email
        if username_or_email and '@' in username_or_email:
            user_obj = Usuario.objects.filter(email=username_or_email).first()
            if user_obj:
                username = user_obj.username
                
        user = authenticate(username=username, password=password)
        if user:
            if hasattr(user, 'estatus') and not user.estatus:
                return Response({"error": "Cuenta desactivada. Por favor, contacte a un administrador."}, status=status.HTTP_403_FORBIDDEN)
            if not user.is_active:
                return Response({"error": "Cuenta inactiva."}, status=status.HTTP_403_FORBIDDEN)
            
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user": UsuarioSerializer(user).data})
        
        # Check if the user exists but is deactivated, authenticate() returns None if is_active is boolean False
        user_check = Usuario.objects.filter(username=username).first()
        if user_check and not user_check.estatus:
            return Response({"error": "Cuenta desactivada. Por favor, contacte a un administrador."}, status=status.HTTP_403_FORBIDDEN)
            
        return Response({"error": "Usuario no registrado o contraseña incorrecta."}, status=status.HTTP_401_UNAUTHORIZED)

class TestimonioViewSet(viewsets.ModelViewSet):
    queryset = Testimonio.objects.all()
    serializer_class = TestimonioSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.query_params.get('approved_only', '').lower() == 'true':
            return queryset.filter(aprobado=True)
        return queryset

    def update(self, request, *args, **kwargs):
        print("UPDATE CALLED ON TESTIMONIO WITH METHOD:", request.method)
        print("DATA RECEIVED:", request.data)
        response = super().update(request, *args, **kwargs)
        print("UPDATE RESPONSE:", response.data)
        return response

    def partial_update(self, request, *args, **kwargs):
        print("PARTIAL UPDATE CALLED ON TESTIMONIO WITH METHOD:", request.method)
        print("DATA:", request.data)
        return super().partial_update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("TESTIMONIO VALIDATION ERROR:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        # Al crear un testimonio, verificamos que la reserva esté finalizada
        reserva = serializer.validated_data['reservacion']
        if reserva.estado != 'Finalizada':
            raise serializers.ValidationError("Solo se pueden dejar testimonios de eventos finalizados.")
        serializer.save()