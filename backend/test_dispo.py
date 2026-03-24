import sys
import os
import django
from datetime import datetime, time, date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from sirlux.services import verificar_disponibilidad
from sirlux.models import ConfiguracionSistema

# Configuracion simulada:
config = ConfiguracionSistema.get_solo()
print("Config:", config.hora_apertura, config.hora_cierre, config.hora_limpieza)

fecha = date.today()
hora_inicio = time(14, 0)
hora_fin = time(19, 0)

disp, msg = verificar_disponibilidad(fecha, hora_inicio, hora_fin)
print("Resultado:", disp, msg)
