import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from sirlux.models import Reservacion, Cliente, Paquete
from datetime import date, time

cliente = Cliente.objects.first()
paquete = Paquete.objects.first()

if cliente and paquete:
    try:
        reserva1 = Reservacion.objects.create(
            cliente=cliente,
            paquete=paquete,
            fecha_evento=date(2026, 3, 30),
            hora_inicio=time(19, 0),
            hora_fin=time(23, 0),
            num_personas=100,
            estado='Pendiente',
            total_estimado=paquete.precio_base
        )
        print(f"Reserva 1 creada: 30 de marzo (ID: {reserva1.id})")

        reserva2 = Reservacion.objects.create(
            cliente=cliente,
            paquete=paquete,
            fecha_evento=date(2026, 4, 2),
            hora_inicio=time(16, 0),
            hora_fin=time(21, 0),
            num_personas=50,
            estado='Pendiente',
            total_estimado=paquete.precio_base
        )
        print(f"Reserva 2 creada: 2 de abril (ID: {reserva2.id})")
        
    except Exception as e:
        print(f"Error: {e}")
else:
    print("Faltan clientes o paquetes en la base de datos.")
