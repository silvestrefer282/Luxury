
class TestimonioSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.ReadOnlyField(source='reservacion.cliente.usuario.first_name')
    cliente_apellido = serializers.ReadOnlyField(source='reservacion.cliente.usuario.apellido_paterno')
    
    class Meta:
        model = Testimonio
        fields = '__all__'
