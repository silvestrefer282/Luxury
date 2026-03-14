import os
import django
import sys
from datetime import date, time

# Setup Django environment
sys.path.append('c:/Users/parra/OneDrive/Desktop/SIRLUX/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from sirlux.models import Usuario, Reservacion, Cliente, Paquete

def prepare_test_reservation():
    # Buscamos al usuario admin@luxury.com
    try:
        user = Usuario.objects.get(username='admin@luxury.com')
        cliente, _ = Cliente.objects.get_or_create(usuario=user)
        
        # Necesitamos un paquete para la reserva
        paquete = Paquete.objects.first()
        if not paquete:
            paquete = Paquete.objects.create(
                nombre='Paquete de Prueba',
                precio_base=10000,
                capacidad_personas=100,
                duracion_horas=5
            )

        # Crear una reserva finalizada ayer
        reserva = Reservacion.objects.create(
            cliente=cliente,
            paquete=paquete,
            fecha_evento=date.today(),
            hora_inicio=time(10, 0),
            hora_fin=time(15, 0),
            estado='Finalizada',
            num_personas=50,
            total_estimado=10000
        )
        print(f"Reserva de prueba creada con ID: {reserva.id} y estado 'Finalizada'")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    prepare_test_reservation()
