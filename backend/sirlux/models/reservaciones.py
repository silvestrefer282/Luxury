from django.db import models
from .clientes import Cliente
from .paquetes import Paquete
from .servicios import ServicioAdicional

class Reservacion(models.Model):
    ESTADO_CHOICES = [
        ('Pendiente', 'Pendiente'),
        ('Confirmada', 'Confirmada'),
        ('Cancelada', 'Cancelada'),
        ('Finalizada', 'Finalizada'),
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='reservaciones')
    paquete = models.ForeignKey(Paquete, on_delete=models.PROTECT)
    menu = models.ForeignKey('Menu', on_delete=models.PROTECT, null=True, blank=True)
    num_personas = models.PositiveIntegerField(default=0)
    servicios_adicionales = models.ManyToManyField(ServicioAdicional, blank=True)
    platillos_seleccionados = models.ManyToManyField('Platillo', blank=True, related_name='reservaciones_donde_esta')
    
    fecha_evento = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    horas_adicionales = models.PositiveIntegerField(default=0)
    
    total_estimado = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='Pendiente')
    
    # Datos de contacto para contrato
    domicilio_contacto = models.TextField(blank=True, null=True)
    telefono_contacto = models.CharField(max_length=20, blank=True, null=True)
    nombre_festejado = models.CharField(max_length=200, blank=True, null=True)
    
    fecha_registro = models.DateTimeField(auto_now_add=True)
    observaciones = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Reserva {self.id} - {self.cliente} ({self.fecha_evento})"
