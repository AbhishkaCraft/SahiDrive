import sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, str(Path(__file__).parent))

from main import (
    health_check,
    get_assumptions,
    get_vehicles,
    get_vehicle_details,
    calculate_costs,
    compare_vehicles_endpoint,
    recommend_endpoint,
)
from models import CalculateRequest, CompareRequest, RecommendRequest

def test_endpoints():
    # 1. Health
    h = health_check()
    assert h["status"] == "healthy"
    print("✓ GET /api/health:", h["status"], "-", h["tagline"])

    # 2. Assumptions
    assumptions = get_assumptions()
    assert assumptions["default_petrol_price_per_litre"] == 102.0
    print("✓ GET /api/assumptions: Petrol ₹", assumptions["default_petrol_price_per_litre"], "/L")

    # 3. Vehicles
    vehicles = get_vehicles(category=None, fuel_type=None, max_price=None, search=None)
    assert len(vehicles) >= 10
    print(f"✓ GET /api/vehicles: {len(vehicles)} vehicles loaded")

    # 4. Single vehicle
    v = get_vehicle_details("ola-s1-pro-gen2")
    assert v["brand"] == "Ola Electric"
    print("✓ GET /api/vehicles/ola-s1-pro-gen2: Loaded successfully")

    # 5. Calculate
    calc = calculate_costs(CalculateRequest(
        vehicle_id="honda-activa-6g",
        daily_distance_km=30,
        monthly_usage_days=25,
        petrol_price_per_litre=102.0,
        electricity_tariff_per_kwh=8.0
    ))
    assert calc["monthly_running_cost"] == 1530.0
    print(f"✓ POST /api/calculate: Monthly = ₹{calc['monthly_running_cost']}, Cost/km = ₹{calc['cost_per_km']}")

    # 6. Compare
    cmp = compare_vehicles_endpoint(CompareRequest(
        vehicle_a_id="honda-activa-6g",
        vehicle_b_id="ola-s1-pro-gen2",
        daily_distance_km=40,
        monthly_usage_days=25,
        petrol_price_per_litre=102.0,
        electricity_tariff_per_kwh=8.0
    ))
    assert cmp["break_even"]["has_break_even"] is True
    print(f"✓ POST /api/compare: Break-even = {cmp['break_even']['break_even_months']} months")

    # 7. Recommend
    rec = recommend_endpoint(RecommendRequest(
        budget_max=110000,
        daily_distance_km=30,
        charging_access="no_charging_access",
        travel_pattern="short_city_errands",
        primary_priority="lowest_running_expense"
    ))
    top_veh = rec["recommendations"][0]["vehicle"]
    # Without charging, petrol must be recommended!
    assert top_veh["fuel_type"] == "petrol", "Should recommend petrol when no charging access!"
    print(f"✓ POST /api/recommend: Top match without charging = {top_veh['name']} (Score {rec['recommendations'][0]['match_score']})")

    # 8. Recommend with Home Plug
    rec_ev = recommend_endpoint(RecommendRequest(
        budget_max=160000,
        daily_distance_km=45,
        charging_access="home_dedicated_plug",
        travel_pattern="regular_commute_mixed",
        primary_priority="lowest_running_expense"
    ))
    top_ev = rec_ev["recommendations"][0]["vehicle"]
    assert top_ev["fuel_type"] == "electric", "Should recommend EV when home charging is available and low running cost is priority!"
    print(f"✓ POST /api/recommend: Top match with home charging = {top_ev['name']} (Score {rec_ev['recommendations'][0]['match_score']})")

    print("\nALL FASTAPI ENDPOINTS & BUSINESS LOGIC PASSED WITH 100% SUCCESS! 🚀")

if __name__ == "__main__":
    test_endpoints()
