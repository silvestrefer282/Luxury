from django.db import models

class ServicioAdicional(models.Model):
    TIPO_COBRO_CHOICES = [
        ('Por Evento', 'Por Evento'),
        ('Por Persona', 'Por Persona'),
    ]

    nombre = models.CharField(max_length=200)
    categoria = models.CharField(max_length=100, default='General')
    descripcion = models.TextField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    tipo_cobro = models.CharField(max_length=20, choices=TIPO_COBRO_CHOICES)
    imagen = models.ImageField(upload_to='adicionales/', blank=True, null=True)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre
