from django.db import models

class Menu(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    tipo_tiempos = models.IntegerField(help_text="Número de tiempos que componen este menú")
    precio_por_persona = models.DecimalField(max_digits=10, decimal_places=2)
    imagen = models.ImageField(upload_to='menus/', blank=True, null=True)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

class CategoriaMenu(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    imagen = models.ImageField(upload_to='menus/categorias/', blank=True, null=True)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

class Platillo(models.Model):
    categoria = models.ForeignKey(CategoriaMenu, related_name='platillos', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    imagen = models.ImageField(upload_to='menus/platillos/', blank=True, null=True)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} ({self.categoria.nombre})"
