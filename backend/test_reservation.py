import sys
import os
import django
import json
from rest_framework.test import APIRequestFactory

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from sirlux.views import ReservacionViewSet
from sirlux.models import Usuario, Paquete

# 1. Preparar un usuario de prueba
user = Usuario.objects.filter(rol='Cliente').first()
if getattr(user, 'perfil_cliente', None) is None:
    from sirlux.models import Cliente
    Cliente.objects.create(usuario=user)

# 2. Obtener un paquete valido
paquete = Paquete.objects.first()

# 3. Payload como si viniera del frontend
payload = {
    'paquete': paquete.id if paquete else 1,
    'tipo_evento': 'Boda',
    'fecha_evento': '2026-03-24',
    'num_personas': 100,
    'hora_inicio': '14:00',
    'hora_fin': '19:00',
    'horas_adicionales': 0,
    'servicios_adicionales': [],
    'platillos_seleccionados': [],
    'nombre_festejado': 'Test Festejado',
    'domicilio_contacto': 'Test Domicilio',
    'telefono_contacto': '1234567890',
    'notas': 'Test notas',
    'cliente': user.perfil_cliente.id if hasattr(user, 'perfil_cliente') else 1,
    'observaciones': 'Evento: Boda. Festejado: Test Festejado. Notas: Test'
}

print("Simulando POST con payload:", json.dumps(payload, indent=2))

factory = APIRequestFactory()
request = factory.post('/api/reservaciones/', payload, format='json')
request.user = user

view = ReservacionViewSet.as_view({'post': 'create'})
try:
    response = view(request)
    if response.status_code == 400:
        print("\n\n--- DRF VALIDATION ERROR (400) ---")
        print(response.data)
    elif response.status_code == 201:
        print("\n\n--- ÉXITO (201) ---")
        print(response.data)
    else:
        print(f"\n\n--- OTRO ESTADO ({response.status_code}) ---")
        print(response.data)
except Exception as e:
    print("\n\n--- EXCEPTION AL EJECUTAR LA VISTA ---")
    import traceback
    traceback.print_exc()
