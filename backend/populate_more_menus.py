import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sirlux.settings')
django.setup()

from sirlux.models.menus import CategoriaMenu, Platillo

data = {
    "Cremas": [
        {"nombre": "Crema de poro y papa con un toque de chipotle", "desc": ""},
        {"nombre": "Crema de champiñón", "desc": ""},
        {"nombre": "Crema a los tres quesos con uva", "desc": ""},
        {"nombre": "Crema de setas perfumada con vino blanco", "desc": ""},
        {"nombre": "Crema de tres morrones", "desc": ""},
        {"nombre": "Crema campesina", "desc": "calabacita, champiñón, grano de elote y queso panela"},
        {"nombre": "Crema de cilantro con un toque de jalapeño y nuez", "desc": ""},
        {"nombre": "Crema de poblano con almendras tostadas", "desc": ""},
    ],
    "Sopas": [
        {"nombre": "Sopa de milpa", "desc": "flor de calabaza, grano de elote, champiñón, raja poblana"},
        {"nombre": "Sopa azteca", "desc": "caldillo de jitomate, tortilla frita, queso panela, chicharrón y aguacate"},
        {"nombre": "Sopa de poro", "desc": "con mantequilla, pollo, perejil y huevo duro al gusto"},
        {"nombre": "Sopa de cebolla", "desc": "sazonada con mantequilla."},
        {"nombre": "Sopa de champiñón y nopales con un toque de chipotle frito", "desc": "aromatizado con epazote"},
    ],
    "Pastas": [
        {"nombre": "Spaghetti boloñesa", "desc": "salsa de tomate aromatizada con hierbas aromáticas y vino blanco, carne molida y vegetales."},
        {"nombre": "Pasta a los tres quesos", "desc": "gruyer, manchego y gouda"},
        {"nombre": "Fetuccine Alfredo", "desc": "acompañado salsa cremosa con jamón, tocino y perejil"},
        {"nombre": "Tornillos a la crema", "desc": "aromatizada con finas hierbas"},
        {"nombre": "Fideos secos a los tres chiles", "desc": ""},
        {"nombre": "Spaghetti en salsa de cilantro", "desc": "con tocino y queso parmesano"},
        {"nombre": "Pasta en salsa cremosa de chipotle adobado con camarón pacotilla", "desc": ""},
        {"nombre": "Pasta hawaiana", "desc": "jamón, piña, perejil"},
        {"nombre": "Tallarines cremosos con atún y espinaca", "desc": ""},
    ],
    "Ensaladas": [
        {"nombre": "Ensalada fresca", "desc": "lechugas, durazno, kiwi, naranja, toronja nueces caramelizadas"},
        {"nombre": "Ensalada silvestre", "desc": "mix de lechugas con fresa, durazno, aceituna, nuez y yogurt natural"},
        {"nombre": "Ensalada de espinaca con manzana, piña y nuez", "desc": ""},
        {"nombre": "Ensalada italiana", "desc": "lechuga, jitomate, pepino, morrones, crotones y vinagreta estilo italiana"},
        {"nombre": "Ensalada frutal", "desc": "lechuga sangría, mango, manzana, piña y nuez de la india, vinagreta de mostaza con miel"},
    ],
    "Platos Fuertes - Ave": [
        {"nombre": "Suprema de pollo rellena con espinaca en salsa de champiñones", "desc": "con un toque de chipotle aromatizada con vino blanco"},
        {"nombre": "Suprema de pollo rellena morrones estilo al ajo arriero", "desc": ""},
        {"nombre": "Pechuga de pollo en costra de cacahuate en salsa de balsámico", "desc": ""},
        {"nombre": "Pechuga de pollo rellena de requesón en salsa de jitomate deshidratado", "desc": ""},
        {"nombre": "Pechuga de pollo rellena de requesón en salsa de chipotle con champiñón", "desc": ""},
        {"nombre": "Pechuga horneada en salsa de naranja flameada", "desc": ""},
        {"nombre": "Pechuga en salsa cremosa de cilantro", "desc": ""},
        {"nombre": "Pechuga de pollo en salsa reina", "desc": "salsa de vino blanco, con champiñón y tocino"},
        {"nombre": "Pechuga en salsa cremosa de cascabel", "desc": ""},
    ],
    "Platos Fuertes - Lomo o Pierna": [
        {"nombre": "Lomo en salsa de vino tinto", "desc": ""},
        {"nombre": "Lomo almendrado", "desc": ""},
        {"nombre": "Lomo adobado", "desc": "con chile ancho"},
        {"nombre": "Lomo mechado en salsa de tamarindo", "desc": "con ciruela pasa y almendra"},
        {"nombre": "Lomo a la piña", "desc": "adobo de chile ancho con jugo de piña y trocitos de piña"},
        {"nombre": "Pierna mechada en salsa de ciruela", "desc": ""},
        {"nombre": "Pierna en agridulce, en salsa de tamarindo", "desc": ""},
        {"nombre": "Pierna enchilada a los tres chiles", "desc": "chile guajillo, chile ancho, chile chipotle meco"},
        {"nombre": "Pierna en salsa de manzana", "desc": ""},
        {"nombre": "Pierna en salsa de mango con un toque de habanero y miel de agave", "desc": ""},
    ],
    "Guarniciones": [
        {"nombre": "Puré de papa al parmesano", "desc": ""},
        {"nombre": "Papas cambray a la mantequilla con pimiento deshidratado", "desc": ""},
        {"nombre": "Papa horno", "desc": ""},
        {"nombre": "Risotto", "desc": ""},
        {"nombre": "Verduras de temporada a la mantequilla", "desc": ""},
        {"nombre": "Puré de papa y brócoli con crocante de frutas", "desc": ""},
    ],
    "Entradas": [
        {"nombre": "Ensalada de higos", "desc": "Mix de lechugas, fresa, higos, zarzamora, frambuesa queso cabra, jamón serrano, nuez y balsámico"},
        {"nombre": "Ensalada de pera", "desc": "Mix de lechugas, pera, fresa, queso cabra de arándano, durazno y nuez"},
        {"nombre": "Ensalada comalli", "desc": "Mix de lechugas, arándano, durazno, queso panela, manzana verde y nuez"},
        {"nombre": "Ensalada primavera", "desc": "germinado de trigo, arándanos, manzana verde, almendra fileteada, aceite de oliva, ejotes y queso cabra"},
        {"nombre": "Volovancito de ensalada rusa o vizcaina", "desc": ""},
        {"nombre": "Ceviche de zetas", "desc": ""},
        {"nombre": "Tostadita de pibil", "desc": ""},
    ]
}

print("Iniciando la inserción de platillos adicionales...")
inserted_count = 0

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
            # if exists but has a different description, update it
            if not p_created and platillo.descripcion != item["desc"]:
                 platillo.descripcion = item["desc"]
                 platillo.save()
            print(f"   - {platillo.nombre}")
            inserted_count += 1 if p_created else 0

    print(f"¡{inserted_count} platillos nuevos insertados correctamente! Total nuevos categorizados.")
except Exception as e:
    import traceback
    traceback.print_exc()
