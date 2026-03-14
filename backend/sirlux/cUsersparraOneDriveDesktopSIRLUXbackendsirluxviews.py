
class TestimonioViewSet(viewsets.ModelViewSet):
    queryset = Testimonio.objects.all()
    serializer_class = TestimonioSerializer

    def get_queryset(self):
        # El home solo muestra los aprobados
        if self.request.query_params.get('approved_only'):
            return self.queryset.filter(aprobado=True)
        return self.queryset

    def perform_create(self, serializer):
        # Al crear un testimonio, verificamos que la reserva esté finalizada
        reserva = serializer.validated_data['reservacion']
        if reserva.estado != 'Finalizada':
            raise serializers.ValidationError("Solo se pueden dejar testimonios de eventos finalizados.")
        serializer.save()
