from django.db import models

class Galeria(models.Model):
    titulo = models.CharField(max_length=200)
    imagen = models.ImageField(upload_to='galeria/')
    descripcion = models.TextField(blank=True, null=True)
    categoria = models.CharField(max_length=100, default='General')
    orden = models.IntegerField(default=0)
    estado = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['orden', '-fecha_creacion']
        verbose_name = "Galería"
        verbose_name_plural = "Galerías"

    def __str__(self):
        return self.titulo
