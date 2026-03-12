from django.db import models

class Paquete(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    servicios_incluidos = models.TextField(blank=True, null=True)
    precio_base = models.DecimalField(max_digits=12, decimal_places=2)
    precio_hora_adicional = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    capacidad_personas = models.IntegerField()
    duracion_horas = models.IntegerField(default=5)
    incluye_menu = models.BooleanField(default=True)
    numero_tiempos = models.IntegerField(default=3)
    notas = models.TextField(blank=True, null=True)
    estado = models.BooleanField(default=True)
    imagen = models.ImageField(upload_to='paquetes/portadas/', blank=True, null=True)

    def __str__(self):
        return self.nombre

class ImagenPaquete(models.Model):
    paquete = models.ForeignKey(Paquete, related_name='galeria', on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='paquetes/galeria/')
    orden = models.IntegerField(default=0)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return f"Imagen de {self.paquete.nombre}"