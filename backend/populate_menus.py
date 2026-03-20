import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sirlux.settings')
django.setup()

from sirlux.models.menus import CategoriaMenu, Platillo

data = {
    "Platos Fuertes - Ave": [
        {"nombre": "Suprema de pollo en salsa reina", "desc": "Salsa cremosa de chipotle y trozos de champiñón. Rellenos posibles: Espinaca, Pimiento morrón, Queso requesón, Queso crema, Poblano, Setas."},
        {"nombre": "Filete de ave en salsa de naranja", "desc": ""},
        {"nombre": "Suprema de pollo en salsa roqueford", "desc": "Rellenos posibles: Espinaca, Pimiento morrón, Queso requesón, Queso crema, Poblano, Setas."},
        {"nombre": "Suprema de pollo en salsa de pimiento morrón", "desc": "Rellenos posibles: Espinaca, Pimiento morrón, Queso requesón, Queso crema, Poblano, Setas."},
        {"nombre": "Suprema de pollo en salsa de flor de calabaza", "desc": "Rellenos posibles: Espinaca, Pimiento morrón, Queso requesón, Queso crema, Poblano, Setas."},
        {"nombre": "Suprema de pollo en salsa de jitomate deshidratada", "desc": "Rellenos posibles: Espinaca, Pimiento morrón, Queso requesón, Queso crema, Poblano, Setas."},
        {"nombre": "Filete de pollo en salsa de miel y mostaza", "desc": ""},
        {"nombre": "Suprema de pollo a la beurre blanc", "desc": "Salsa blanca a base de mantequilla. Rellenos posibles: Espinaca, Pimiento morrón, Queso requesón, Queso crema, Poblano, Setas."},
    ],
    "Platos Fuertes - Lomo o Pierna": [
        {"nombre": "Pierna o lomo en salsa española", "desc": ""},
        {"nombre": "Pierna o lomo en salsa de mostaza", "desc": ""},
        {"nombre": "Pierna o lomo en salsa blanca de romero", "desc": ""},
        {"nombre": "Pierna o lomo en salsa de chile cascabel", "desc": "Rica salsa cremosa de chile cascabel."},
        {"nombre": "Pierna o lomo en salsa de chabacano", "desc": ""},
        {"nombre": "Pierna o lomo en salsa blanca", "desc": "Salsa cremosa de champiñón."},
        {"nombre": "Pierna o lomo en salsa roqueford", "desc": ""},
    ],
    "Guarniciones": [
        {"nombre": "Puré de papa", "desc": ""},
        {"nombre": "Puré de camote", "desc": ""},
        {"nombre": "Rollitos de ejotes con pimiento morrón envuelto en tocino", "desc": ""},
        {"nombre": "Rissoto poblano", "desc": ""},
        {"nombre": "Rissoto al parmesano", "desc": ""},
        {"nombre": "Papa cambray a las finas hierbas", "desc": ""},
        {"nombre": "Papas cambray con pimiento seco", "desc": ""},
        {"nombre": "Papa cambray con tocino, cebolla y perejil", "desc": ""},
        {"nombre": "Ejotes rellenos de tocino", "desc": ""},
        {"nombre": "Verduras al vapor", "desc": ""},
        {"nombre": "Rollitos de tocino con ejotes", "desc": ""},
    ],
    "Pastas": [
        {"nombre": "Pasta cremosa de cilantro con nuez", "desc": ""},
        {"nombre": "Pasta a los tres quesos", "desc": ""},
        {"nombre": "Pasta pomodoro", "desc": "Jitomate & albahaca."},
        {"nombre": "Espagueti a la boloñesa", "desc": ""},
        {"nombre": "Fetuccini Alfredo", "desc": ""},
        {"nombre": "Espagueti en salsa cremosa de chipotle con pacotilla", "desc": ""},
        {"nombre": "Fetuccini en salsa cremosa de roqueford", "desc": ""},
        {"nombre": "Penne a la puttanesca", "desc": ""},
        {"nombre": "Penne en salsa de pimiento morrón", "desc": ""},
    ],
    "Sopas": [
        {"nombre": "Sopa tlalpeña", "desc": ""},
        {"nombre": "Sopa azteca", "desc": ""},
        {"nombre": "Sopa campesina", "desc": ""},
        {"nombre": "Sopa ministron", "desc": ""},
        {"nombre": "Sopa de setas", "desc": ""},
        {"nombre": "Sopa de poro y papa", "desc": ""},
    ],
    "Cremas": [
        {"nombre": "Crema de tomate rostizado aromatizado con tocino", "desc": ""},
        {"nombre": "Crema silvestre de hongos", "desc": "Trilogía de hongos silvestres: setas, champiñones y cremino."},
        {"nombre": "Bisquet de camarón", "desc": "Sopa de camarón cremosa."},
        {"nombre": "Crema de espárragos", "desc": ""},
        {"nombre": "Crema de huitlacoche", "desc": ""},
        {"nombre": "Crema de nuez", "desc": ""},
        {"nombre": "Crema de espinacas con esencia de romero y aceite de jitomate", "desc": ""},
        {"nombre": "Crema de 4 maggio", "desc": ""},
        {"nombre": "Crema dubarry", "desc": "Excelente sabor de coliflor, una crema de altura."},
        {"nombre": "Crema mina", "desc": "Mix de hongos, espinaca y nuez."},
    ]
}

print("Iniciando la inserción de platillos...")

try:
    for cat_name, items in data.items():
        categoria, created = CategoriaMenu.objects.get_or_create(nombre=cat_name)
        print(f"[{'NUEVA' if created else 'EXISTENTE'}] Categoría: {categoria.nombre}")

        for item in items:
            platillo, p_created = Platillo.objects.get_or_create(
                nombre=item["nombre"],
                categoria=categoria,
                defaults={'descripcion': item["desc"]}
            )
            if not p_created and platillo.descripcion != item["desc"]:
                 platillo.descripcion = item["desc"]
                 platillo.save()
            print(f"   - {platillo.nombre}")

    print("¡Todos los platillos insertados correctamente!")
except Exception as e:
    import traceback
    traceback.print_exc()
