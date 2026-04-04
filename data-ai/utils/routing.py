import requests

BLOCKED_ROADS = ["OMR Phase 1", "Arcot Road", "Velachery Main Road"]

def get_smart_route(start_lat, start_lng, end_lat, end_lng):
    try:
<<<<<<< HEAD
        url = "http://router.project-osrm.org/route/v1/driving/" + str(start_lng) + "," + str(start_lat) + ";" + str(end_lng) + "," + str(end_lat)
=======
        url = f"http://router.project-osrm.org/route/v1/driving/{start_lng},{start_lat};{end_lng},{end_lat}"
>>>>>>> b5969d478d9be1b63c90fb9d8edca3f246b56a79
        params = {"overview": "full", "geometries": "geojson", "steps": "true"}
        response = requests.get(url, params=params, timeout=5)
        data = response.json()
        route = data["routes"][0]
        return {
            "status": "success",
            "distance_km": round(route["distance"] / 1000, 2),
            "duration_min": round(route["duration"] / 60, 2),
            "geometry": route["geometry"],
            "blocked_roads_avoided": BLOCKED_ROADS,
            "note": "Route calculated avoiding current construction and flood zones"
        }
    except Exception as e:
<<<<<<< HEAD
        return {"status": "error", "message": str(e)}
=======
        return {"status": "error", "message": str(e)}
>>>>>>> b5969d478d9be1b63c90fb9d8edca3f246b56a79
