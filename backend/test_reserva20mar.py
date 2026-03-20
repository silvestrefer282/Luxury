import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from sirlux.models import Reservacion, Cliente, Paquete
from datetime import date, time

# Obtener un cliente y un paquete existentes
cliente = Cliente.objects.first()
paquete = Paquete.objects.first()

if not cliente:
    print("Error: No hay clientes en la base de datos para asignar la reserva.")
elif not paquete:
    print("Error: No hay paquetes en la base de datos.")
else:
    try:
        reserva = Reservacion.objects.create(
            cliente=cliente,
            paquete=paquete,
            fecha_evento=date(2026, 3, 20),
            hora_inicio=time(18, 0),
            hora_fin=time(23, 0),
            num_personas=80,
            estado='Pendiente',
            total_estimado=paquete.precio_base
        )
        print(f"¡Reserva creada exitosamente! ID: {reserva.id}")
    except Exception as e:
        print(f"Error al crear reserva: {e}")
