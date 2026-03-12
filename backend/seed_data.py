import os
import django
import sys

# Setup Django environment
sys.path.append('c:/Users/parra/OneDrive/Desktop/SIRLUX/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from sirlux.models import Paquete, Menu, CategoriaMenu, Platillo, ServicioAdicional, Reservacion, Cliente, Usuario

def seed():
    # Clear existing data
    ServicioAdicional.objects.all().delete()
    Paquete.objects.all().delete()
    CategoriaMenu.objects.all().delete()
    
    # Paquetes
    p1 = Paquete.objects.create(nombre='Básico 150 Personas', precio_base=17900, capacidad_personas=150, descripcion='Paquete esencial para eventos medianos', duracion_horas=5)
    p2 = Paquete.objects.create(nombre='Banquete Clásico', precio_base=39000, capacidad_personas=100, descripcion='Banquete tradicional con alta calidad', duracion_horas=6)
    p3 = Paquete.objects.create(nombre='Banquete Premium', precio_base=73500, capacidad_personas=150, descripcion='Experiencia gourmet completa y exclusiva', duracion_horas=8)

    # Adicionales
    ServicioAdicional.objects.create(nombre='DJ Profesional & Audio', precio_unitario=8500, categoria='Entretenimiento', tipo_cobro='Por Evento', descripcion='DJ con equipo de audio profesional')
    ServicioAdicional.objects.create(nombre='Iluminación Arquitectónica', precio_unitario=4200, categoria='Decoración', tipo_cobro='Por Evento', descripcion='Luces LED para decorar el salón')
    ServicioAdicional.objects.create(nombre='Mesa de Postres Gourmet', precio_unitario=6500, categoria='Gastronomía', tipo_cobro='Por Evento', descripcion='Variedad de postres finos')
    ServicioAdicional.objects.create(nombre='Pista de Cristal', precio_unitario=12000, categoria='Estructura', tipo_cobro='Por Evento', descripcion='Pista iluminada de cristal')

    # Menus categories and dishes
    cats = {
        'cremas': ['Crema de poro y papa con chipotle', 'Crema de champiñón', 'Crema a los tres quesos'],
        'pastas': ['Spaghetti boloñesa', 'Fetuccine Alfredo', 'Pasta tres quesos'],
        'ensaladas': ['Ensalada fresca', 'Ensalada silvestre', 'Ensalada italiana'],
        'fuertes': ['Suprema en salsa reina', 'Lomo en vino tinto', 'Pierna en salsa de ciruela'],
        'guarniciones': ['Puré de papa al parmesano', 'Risotto poblano', 'Papas cambray'],
    }

    for cat_name, dishes in cats.items():
        c = CategoriaMenu.objects.create(nombre=cat_name)
        for dish_name in dishes:
            Platillo.objects.create(categoria=c, nombre=dish_name)

    print("Seed data created successfully.")

if __name__ == '__main__':
    seed()
