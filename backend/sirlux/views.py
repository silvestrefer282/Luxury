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

class ReservacionViewSet(viewsets.ModelViewSet):
    queryset = Reservacion.objects.all()
    serializer_class = ReservacionSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Reservacion.objects.none()
        if user.rol == Usuario.ADMINISTRADOR or user.is_staff or user.rol == Usuario.ENCARGADO:
            # Si se pide específicamente "solo las mías" o si no es una petición del dashboard admin
            if self.request.query_params.get('personal') == 'true':
                return Reservacion.objects.filter(cliente__usuario=user)
            return Reservacion.objects.all()
        return Reservacion.objects.filter(cliente__usuario=user)

    def perform_create(self, serializer):
        # Lógica de creación con cálculo automático
        data = self.request.data
        paquete = Paquete.objects.get(id=data['paquete'])
        menu = Menu.objects.get(id=data['menu']) if data.get('menu') else None
        
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
        
        serializer.save(total_estimado=total)

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
        paquete = serializer.save()
        
        # 1. Eliminar imágenes específicas si se envían sus IDs
        deleted_ids = self.request.data.getlist('deleted_gallery_ids')
        if deleted_ids:
            ImagenPaquete.objects.filter(id__in=deleted_ids, paquete=paquete).delete()

        # 2. Agregar nuevas imágenes sin borrar las anteriores (Append)
        galeria = self.request.FILES.getlist('galeria_imgs')
        if galeria:
            # Calculamos el orden inicial basado en cuántas ya hay
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
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    @decorators.action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def registro(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Todos los roles ahora pueden tener un perfil de cliente para hacer sus propias reservas
            Cliente.objects.get_or_create(usuario=user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user": UsuarioSerializer(user).data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @decorators.action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        username_or_email = request.data.get('username')
        password = request.data.get('password')
        
        username = username_or_email
        if username_or_email and '@' in username_or_email:
            user_obj = Usuario.objects.filter(email=username_or_email).first()
            if user_obj:
                username = user_obj.username
                
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user": UsuarioSerializer(user).data})
        return Response({"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED)

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
