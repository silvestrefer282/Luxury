from datetime import datetime, timedelta
from decimal import Decimal
from django.db.models import Q
from .models import Reservacion, ConfiguracionSistema

def calcular_costo_reservacion(reservacion_data, servicios_ids=None):
    """
    Lógica de negocio para calcular el total estimado de una reservación.
    """
    config = ConfiguracionSistema.get_solo()
    paquete = reservacion_data['paquete']
    menu = reservacion_data.get('menu')
    num_personas = reservacion_data.get('num_personas', 0)
    hora_inicio = reservacion_data['hora_inicio']
    hora_fin = reservacion_data['hora_fin']
    
    # 1. Precio Base del Paquete
    total = paquete.precio_base
    
    # 2. Tiempos extra de menú
    # Si el paquete incluye N tiempos y el menú seleccionado tiene más, se cobra la diferencia
    if menu and paquete.incluye_menu:
        tiempos_extra = max(0, menu.tipo_tiempos - paquete.numero_tiempos)
        if tiempos_extra > 0:
            # Asumimos que el precio_por_persona del menú ya contempla los tiempos, 
            # o podrías tener una regla específica. Aquí sumamos el precio del menú por persona.
            total += (menu.precio_por_persona * Decimal(num_personas))

    # 3. Servicios Adicionales
    if servicios_ids:
        from .models import ServicioAdicional
        servicios = ServicioAdicional.objects.filter(id__in=servicios_ids)
        for s in servicios:
            if s.tipo_cobro == "Por Evento":
                total += s.precio_unitario
            else: # Por Persona
                total += (s.precio_unitario * Decimal(num_personas))

    # 4. Horas Extra
    # Calculamos la duración
    dt_inicio = datetime.combine(datetime.today(), hora_inicio)
    dt_fin = datetime.combine(datetime.today(), hora_fin)
    if dt_fin <= dt_inicio: # Si termina el día siguiente
        dt_fin += timedelta(days=1)
    
    duracion_actual = (dt_fin - dt_inicio).total_seconds() / 3600
    horas_extra = max(0, Decimal(duracion_actual) - Decimal(paquete.duracion_horas))
    if horas_extra > 0:
        total += (horas_extra * config.precio_hora_extra)
        
    return total

def verificar_disponibilidad(fecha, hora_inicio, hora_fin, reserva_id_ignore=None):
    """
    Verifica si hay traslape considerando el tiempo de limpieza.
    """
    config = ConfiguracionSistema.get_solo()
    limpieza = timedelta(hours=config.hora_limpieza)
    
    # Rango Operativo (Soporta cierre tras medianoche)
    start_m = hora_inicio.hour * 60 + hora_inicio.minute
    end_m = hora_fin.hour * 60 + hora_fin.minute
    open_m = config.hora_apertura.hour * 60 + config.hora_apertura.minute
    close_m = config.hora_cierre.hour * 60 + config.hora_cierre.minute

    if close_m <= open_m: close_m += 1440
    if end_m <= start_m: end_m += 1440
    
    # Si el inicio es muy temprano, intentamos ver si encaja como "final de jornada" del día anterior
    if start_m < open_m:
        start_m += 1440
        end_m += 1440

    if start_m < open_m or end_m > close_m:
        return False, "La reserva está fuera del horario de operación."

    dt_inicio_nueva = datetime.combine(fecha, hora_inicio)
    dt_fin_nueva = datetime.combine(fecha, hora_fin)

    # Buscar todas las reservas del día
    reservas_dia = Reservacion.objects.filter(fecha_evento=fecha).exclude(estado='Cancelada')
    if reserva_id_ignore:
        reservas_dia = reservas_dia.exclude(id=reserva_id_ignore)

    for r in reservas_dia:
        dt_inicio_existente = datetime.combine(r.fecha_evento, r.hora_inicio)
        dt_fin_existente = datetime.combine(r.fecha_evento, r.hora_fin)
        
        # Considerar limpieza: No puede empezar antes de que la anterior termine + limpieza
        # Y no puede terminar después de que la siguiente empiece - limpieza
        bloque_existente_inicio = dt_inicio_existente - limpieza
        bloque_existente_fin = dt_fin_existente + limpieza
        
        # Hay traslape si: (Inicio1 < Fin2) AND (Fin1 > Inicio2)
        if dt_inicio_nueva < bloque_existente_fin and dt_fin_nueva > bloque_existente_inicio:
            return False, f"Conflicto con evento de {r.hora_inicio} a {r.hora_fin} (incluyendo {config.hora_limpieza}h limpieza)."

    return True, "Disponible"