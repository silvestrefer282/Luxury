import requests

url = "http://127.0.0.1:8000/api/paquetes/"
response = requests.get(url)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    packages = response.json()
    if packages:
        pkg_id = packages[0]['id']
        print(f"Testing update for package {pkg_id}")
        update_url = f"{url}{pkg_id}/"
        data = {
            "nombre": "Test Update Name",
            "precio_base": "12345.00",
            "capacidad_personas": 100,
            "duracion_horas": 5,
            "precio_hora_adicional": "500.00"
        }
        resp = requests.patch(update_url, data=data)
        print(f"Patch Status: {resp.status_code}")
        print(f"Patch Response: {resp.text}")
    else:
        print("No packages found to test.")
else:
    print(f"Failed to fetch packages: {response.text}")
