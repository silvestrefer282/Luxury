from django.db import models
from .reservaciones import Reservacion

class Testimonio(models.Model):
    reservacion = models.OneToOneField(Reservacion, on_delete=models.CASCADE, related_name='testimonio')
    calificacion = models.PositiveSmallIntegerField(default=5, verbose_name="Calificación")  # 1-5 estrellas
    comentario = models.TextField(verbose_name="Comentario")
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    aprobado = models.BooleanField(default=False, verbose_name="¿Aprobado para mostrar?")

    class Meta:
        verbose_name = "Testimonio"
        verbose_name_plural = "Testimonios"
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"Testimonio de {self.reservacion.cliente} - {self.calificacion} estrellas"
