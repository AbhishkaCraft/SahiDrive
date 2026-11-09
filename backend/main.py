from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import uvicorn

from models import (
    CalculateRequest,
    CalculateResponse,
    CompareRequest,
    CompareResponse,
    RecommendRequest,
    RecommendResponse,
)
from calculator import (
    load_assumptions,
    load_vehicles,
    get_vehicle_by_id,
    calculate_vehicle_costs,
    compare_two_vehicles,
)
from recommender import generate_recommendations

app = FastAPI(
    title="SahiDrive API",
    description="Intelligent Mobility Decision Platform for Indian Consumers (Petrol vs EV)",
    version="1.0.0",
)

# Enable CORS for frontend Vite development server and production builds
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SahiDrive Intelligent Mobility API",
        "version": "1.0.0",
        "tagline": "The right vehicle. The right cost. The right decision.",
    }

@app.get("/api/assumptions")
def get_assumptions():
    """Returns baseline calculation benchmarks, currency, CO2 factors and disclaimers."""
    return load_assumptions()

@app.get("/api/vehicles")
def get_vehicles(
    category: Optional[str] = Query(None, description="scooter or motorcycle"),
    fuel_type: Optional[str] = Query(None, description="petrol or electric"),
    max_price: Optional[float] = Query(None, description="Filter by max on-road price"),
    search: Optional[str] = Query(None, description="Text search by name or brand"),
):
    """Returns list of two-wheeler vehicles with optional filtering."""
    vehicles = load_vehicles()
    results = vehicles

    if category:
        results = [v for v in results if v.get("category", "").lower() == category.lower()]
    if fuel_type:
        results = [v for v in results if v.get("fuel_type", "").lower() == fuel_type.lower()]
    if max_price:
        results = [v for v in results if float(v.get("on_road_price_est", 0)) <= max_price]
    if search:
        s = search.lower().strip()
        results = [
            v for v in results
            if s in v.get("name", "").lower()
            or s in v.get("brand", "").lower()
            or any(s in t.lower() for t in v.get("tags", []))
        ]

    return results

@app.get("/api/vehicles/{vehicle_id}")
def get_vehicle_details(vehicle_id: str):
    """Returns specific vehicle details by unique ID."""
    v = get_vehicle_by_id(vehicle_id)
    if not v:
        raise HTTPException(status_code=404, detail=f"Vehicle '{vehicle_id}' not found.")
    return v

@app.post("/api/calculate", response_model=CalculateResponse)
def calculate_costs(req: CalculateRequest):
    """
    Computes running cost per km, monthly/annual running expenses,
    and 1-yr, 3-yr, 5-yr total ownership costs.
    """
    if req.vehicle_id:
        v = get_vehicle_by_id(req.vehicle_id)
        if not v:
            raise HTTPException(status_code=404, detail=f"Vehicle '{req.vehicle_id}' not found.")
        vehicle_dict = dict(v)
    else:
        # Custom user-defined vehicle
        fuel_type = req.custom_fuel_type or "petrol"
        price = req.custom_price or (85000 if fuel_type == "petrol" else 125000)
        maint = req.custom_annual_maintenance or (3000 if fuel_type == "petrol" else 2000)
        vehicle_dict = {
            "id": "custom-vehicle",
            "name": f"Custom {fuel_type.capitalize()} Vehicle",
            "fuel_type": fuel_type,
            "on_road_price_est": price,
            "annual_maintenance_base": maint,
        }
        if fuel_type == "petrol":
            vehicle_dict["mileage_kmpl"] = req.custom_mileage_kmpl or 50.0
        else:
            vehicle_dict["battery_capacity_kwh"] = req.custom_battery_kwh or 3.5
            vehicle_dict["range_km"] = req.custom_range_km or 110.0

    result = calculate_vehicle_costs(
        vehicle=vehicle_dict,
        daily_distance_km=req.daily_distance_km,
        monthly_usage_days=req.monthly_usage_days,
        petrol_price=req.petrol_price_per_litre,
        electricity_tariff=req.electricity_tariff_per_kwh,
    )
    return result

@app.post("/api/compare", response_model=CompareResponse)
def compare_vehicles_endpoint(req: CompareRequest):
    """
    Performs comprehensive head-to-head comparison between two vehicles
    including payback / break-even timeline.
    """
    v_a = get_vehicle_by_id(req.vehicle_a_id)
    v_b = get_vehicle_by_id(req.vehicle_b_id)

    if not v_a:
        raise HTTPException(status_code=404, detail=f"Vehicle A '{req.vehicle_a_id}' not found.")
    if not v_b:
        raise HTTPException(status_code=404, detail=f"Vehicle B '{req.vehicle_b_id}' not found.")

    res = compare_two_vehicles(
        vehicle_a=v_a,
        vehicle_b=v_b,
        daily_distance_km=req.daily_distance_km,
        monthly_usage_days=req.monthly_usage_days,
        petrol_price=req.petrol_price_per_litre,
        electricity_tariff=req.electricity_tariff_per_kwh,
    )
    return res

@app.post("/api/recommend", response_model=RecommendResponse)
def recommend_endpoint(req: RecommendRequest):
    """
    Generates rule-based, explainable recommendations matching
    user budget, distance, charging setup, commute pattern, and priorities.
    """
    result = generate_recommendations(
        budget_max=req.budget_max,
        daily_distance_km=req.daily_distance_km,
        charging_access=req.charging_access,
        travel_pattern=req.travel_pattern,
        primary_priority=req.primary_priority,
        preferred_category=req.preferred_category or "all",
    )
    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
