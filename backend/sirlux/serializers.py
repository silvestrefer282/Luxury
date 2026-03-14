from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Cliente, Paquete, ImagenPaquete, Menu, CategoriaMenu, Platillo, ServicioAdicional, 
    Reservacion, Degustacion, ConfiguracionSistema, Galeria, Contrato, PagoContrato,
    Testimonio
)

Usuario = get_user_model()

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    cliente_id = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'password', 'first_name', 'email', 'apellido_paterno', 'apellido_materno', 'telefono', 'rol', 'estatus', 'cliente_id']
    
    def get_cliente_id(self, obj):
        if hasattr(obj, 'perfil_cliente'):
            return obj.perfil_cliente.id
        return None
    
    def create(self, validated_data):
        user = Usuario.objects.create_user(**validated_data)
        Cliente.objects.get_or_create(usuario=user)
        from rest_framework.authtoken.models import Token
        Token.objects.get_or_create(user=user)
        return user

class ClienteSerializer(serializers.ModelSerializer):
    usuario_detalle = UsuarioSerializer(source='usuario', read_only=True)
    class Meta:
        model = Cliente
        fields = '__all__'

class ImagenPaqueteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenPaquete
        fields = ['id', 'imagen', 'orden']

class PaqueteSerializer(serializers.ModelSerializer):
    galeria = ImagenPaqueteSerializer(many=True, read_only=True)
    class Meta:
        model = Paquete
        fields = '__all__'

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = '__all__'

class ServicioAdicionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicioAdicional
        fields = '__all__'

class CategoriaMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaMenu
        fields = '__all__'

class PlatilloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platillo
        fields = '__all__'

class ConfiguracionSistemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionSistema
        fields = '__all__'

class ReservacionSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.ReadOnlyField(source='cliente.usuario.get_full_name')
    paquete_nombre = serializers.ReadOnlyField(source='paquete.nombre')
    has_testimonio = serializers.SerializerMethodField()
    
    class Meta:
        model = Reservacion
        fields = '__all__'

    def get_has_testimonio(self, obj):
        return hasattr(obj, 'testimonio')

class PagoContratoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PagoContrato
        fields = '__all__'

class ContratoSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.ReadOnlyField(source='reservacion.cliente.usuario.get_full_name')
    fecha_evento = serializers.ReadOnlyField(source='reservacion.fecha_evento')
    pagos = PagoContratoSerializer(many=True, read_only=True)
    total_pagado = serializers.SerializerMethodField()
    saldo_pendiente = serializers.SerializerMethodField()
    
    class Meta:
        model = Contrato
        fields = '__all__'

    def get_total_pagado(self, obj):
        return sum(p.monto for p in obj.pagos.all()) + obj.anticipo_monto

    def get_saldo_pendiente(self, obj):
        return (obj.total_operacion + obj.deposito_garantia) - self.get_total_pagado(obj)

class DegustacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Degustacion
        fields = '__all__'

class GaleriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Galeria
        fields = '__all__'

class TestimonioSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.ReadOnlyField(source='reservacion.cliente.usuario.first_name')
    cliente_apellido = serializers.ReadOnlyField(source='reservacion.cliente.usuario.apellido_paterno')
    
    class Meta:
        model = Testimonio
        fields = '__all__'