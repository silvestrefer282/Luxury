from django.db import models
from .reservaciones import Reservacion

class Contrato(models.Model):
    reservacion = models.OneToOneField(Reservacion, on_delete=models.CASCADE, related_name='contrato')
    folio = models.CharField(max_length=20, unique=True, verbose_name="Folio")
    fecha_emision = models.DateField(auto_now_add=True)
    
    # Datos del Proveedor (Salón)
    representante_salon = models.CharField(max_length=200, default="Graciela Herrera Ramírez")
    
    # Datos del Evento (Extraídos o ajustados para el contrato)
    lugar_evento = models.CharField(max_length=255, default="2 de Abril 2503 Col. El Carmen, Apizaco, Tlax.")
    cantidad_personas = models.PositiveIntegerField(default=0)
    duracion_horas = models.PositiveIntegerField(default=5)
    
    # Desglose Financiero
    total_operacion = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    deposito_garantia = models.DecimalField(max_digits=12, decimal_places=2, default=1000.00)
    anticipo_monto = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    anticipo_porcentaje = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    fecha_limite_pago = models.DateField(null=True, blank=True)
    
    # Estado del contrato
    esta_firmado = models.BooleanField(default=False)
    notas_especiales = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Contrato {self.folio} - {self.reservacion.cliente}"

    class Meta:
        verbose_name = "Contrato"
        verbose_name_plural = "Contratos"

class PagoContrato(models.Model):
    METODOS_PAGO = [
        ('Efectivo', 'Efectivo'),
        ('Transferencia', 'Transferencia'),
        ('Tarjeta', 'Tarjeta'),
        ('Otro', 'Otro'),
    ]

    contrato = models.ForeignKey(Contrato, on_delete=models.CASCADE, related_name='pagos')
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    fecha_pago = models.DateTimeField(auto_now_add=True)
    metodo_pago = models.CharField(max_length=50, choices=METODOS_PAGO, default='Efectivo')
    notas = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Pago de {self.monto} para {self.contrato.folio}"

    class Meta:
        verbose_name = "Pago de Contrato"
        verbose_name_plural = "Pagos de Contrato"
