import json
from pathlib import Path
from typing import Dict, Any, Optional

DATA_DIR = Path(__file__).parent / "data"

def load_assumptions() -> Dict[str, Any]:
    with open(DATA_DIR / "assumptions.json", "r", encoding="utf-8") as f:
        return json.load(f)

def load_vehicles() -> list:
    with open(DATA_DIR / "vehicles.json", "r", encoding="utf-8") as f:
        return json.load(f)

def get_vehicle_by_id(vehicle_id: str) -> Optional[Dict[str, Any]]:
    vehicles = load_vehicles()
    for v in vehicles:
        if v["id"] == vehicle_id:
            return v
    return None

def compute_cost_per_km(
    fuel_type: str,
    mileage_kmpl: Optional[float] = None,
    battery_kwh: Optional[float] = None,
    range_km: Optional[float] = None,
    petrol_price: float = 102.0,
    electricity_tariff: float = 8.0,
) -> float:
    """
    Computes energy/fuel running cost per kilometer.
    Petrol: petrol_price / mileage_kmpl
    Electric: (battery_kwh / range_km) * electricity_tariff
    """
    if fuel_type == "petrol":
        kmpl = mileage_kmpl if mileage_kmpl and mileage_kmpl > 0 else 50.0
        return round(petrol_price / kmpl, 3)
    elif fuel_type == "electric":
        bat = battery_kwh if battery_kwh and battery_kwh > 0 else 3.5
        rng = range_km if range_km and range_km > 0 else 115.0
        return round((bat / rng) * electricity_tariff, 3)
    return 2.0

def calculate_vehicle_costs(
    vehicle: Dict[str, Any],
    daily_distance_km: float,
    monthly_usage_days: int,
    petrol_price: float = 102.0,
    electricity_tariff: float = 8.0,
) -> Dict[str, Any]:
    """
    Calculates detailed running costs and 1-year, 3-year, 5-year ownership costs.
    """
    fuel_type = vehicle.get("fuel_type", "petrol")
    purchase_price = float(vehicle.get("on_road_price_est", vehicle.get("price_ex_showroom", 80000)))
    annual_maint = float(vehicle.get("annual_maintenance_base", 3000))

    if fuel_type == "petrol":
        mileage = float(vehicle.get("mileage_kmpl", 50))
        cost_per_km = compute_cost_per_km(
            fuel_type="petrol",
            mileage_kmpl=mileage,
            petrol_price=petrol_price
        )
        formula = f"₹{petrol_price}/L ÷ {mileage} km/L = ₹{cost_per_km:.2f}/km"
    else:
        bat = float(vehicle.get("battery_capacity_kwh", 3.5))
        rng = float(vehicle.get("range_km", 110))
        cost_per_km = compute_cost_per_km(
            fuel_type="electric",
            battery_kwh=bat,
            range_km=rng,
            electricity_tariff=electricity_tariff
        )
        formula = f"({bat} kWh ÷ {rng} km) × ₹{electricity_tariff}/kWh = ₹{cost_per_km:.2f}/km"

    monthly_distance_km = round(daily_distance_km * monthly_usage_days, 1)
    annual_distance_km = round(monthly_distance_km * 12, 1)

    monthly_running_cost = round(monthly_distance_km * cost_per_km, 2)
    annual_running_cost = round(annual_distance_km * cost_per_km, 2)

    # CO2 calculation (approx tailpipe)
    # Petrol ~ 54g/km; EV direct = 0g/km
    co2_rate = 54.0 if fuel_type == "petrol" else 0.0

    horizons = {}
    for years in [1, 3, 5]:
        dist_total = round(annual_distance_km * years, 1)
        running_total = round(annual_running_cost * years, 2)
        maint_total = round(annual_maint * years, 2)
        total_ownership = round(purchase_price + running_total + maint_total, 2)
        running_share = round((running_total / total_ownership) * 100, 1) if total_ownership > 0 else 0
        co2_kg = round((dist_total * co2_rate) / 1000.0, 1)

        horizons[f"{years}_year"] = {
            "years": years,
            "distance_total_km": dist_total,
            "running_cost_total": running_total,
            "maintenance_cost_total": maint_total,
            "purchase_price": purchase_price,
            "total_ownership_cost": total_ownership,
            "running_cost_share_pct": running_share,
            "co2_tailpipe_kg": co2_kg,
        }

    summary_insight = (
        f"At {daily_distance_km:.0f} km/day over {monthly_usage_days} days/month, "
        f"you will travel {annual_distance_km:,.0f} km annually. "
        f"Fuel/energy running cost is ₹{monthly_running_cost:,.0f}/month (₹{annual_running_cost:,.0f}/year). "
        f"Over 5 years, cumulative running and maintenance add ₹{(annual_running_cost + annual_maint) * 5:,.0f} to the ₹{purchase_price:,.0f} purchase price."
    )

    return {
        "vehicle_id": vehicle.get("id"),
        "vehicle_name": vehicle.get("name", "Custom Vehicle"),
        "fuel_type": fuel_type,
        "daily_distance_km": daily_distance_km,
        "monthly_usage_days": monthly_usage_days,
        "monthly_distance_km": monthly_distance_km,
        "annual_distance_km": annual_distance_km,
        "cost_per_km": cost_per_km,
        "monthly_running_cost": monthly_running_cost,
        "annual_running_cost": annual_running_cost,
        "annual_maintenance_cost": annual_maint,
        "purchase_price": purchase_price,
        "horizons": horizons,
        "summary_insight": summary_insight,
        "formula_explanation": {
            "running_cost_formula": formula,
            "monthly_running_formula": f"{monthly_distance_km:,.1f} km × ₹{cost_per_km:.2f}/km",
            "ownership_formula": "Purchase Price (on-road) + (Annual Running × Years) + (Annual Service × Years)",
        }
    }

def compare_two_vehicles(
    vehicle_a: Dict[str, Any],
    vehicle_b: Dict[str, Any],
    daily_distance_km: float,
    monthly_usage_days: int,
    petrol_price: float = 102.0,
    electricity_tariff: float = 8.0,
) -> Dict[str, Any]:
    """
    Performs head-to-head comparison including break-even timeline.
    """
    calc_a = calculate_vehicle_costs(vehicle_a, daily_distance_km, monthly_usage_days, petrol_price, electricity_tariff)
    calc_b = calculate_vehicle_costs(vehicle_b, daily_distance_km, monthly_usage_days, petrol_price, electricity_tariff)

    price_a = calc_a["purchase_price"]
    price_b = calc_b["purchase_price"]

    # Annual operational cost = running + maintenance
    annual_ops_a = calc_a["annual_running_cost"] + calc_a["annual_maintenance_cost"]
    annual_ops_b = calc_b["annual_running_cost"] + calc_b["annual_maintenance_cost"]

    # 5-year ownership
    own_5yr_a = calc_a["horizons"]["5_year"]["total_ownership_cost"]
    own_5yr_b = calc_b["horizons"]["5_year"]["total_ownership_cost"]

    # Break-even analysis
    has_break_even = False
    break_even_months = None
    break_even_km = None
    annual_savings = 0.0

    if price_a != price_b and annual_ops_a != annual_ops_b:
        # Determine who is cheaper upfront vs cheaper to run
        if price_a < price_b:
            cheaper_upfront_id = vehicle_a["id"]
            costlier_upfront_id = vehicle_b["id"]
            upfront_premium = price_b - price_a
            # Is vehicle B cheaper to run?
            ops_saving_b = annual_ops_a - annual_ops_b
            if ops_saving_b > 0:
                has_break_even = True
                annual_savings = ops_saving_b
                years_to_even = upfront_premium / annual_savings
                break_even_months = round(years_to_even * 12, 1)
                break_even_km = round(years_to_even * calc_a["annual_distance_km"], 0)
                cheaper_running_id = vehicle_b["id"]
            else:
                cheaper_running_id = vehicle_a["id"]
        else:
            cheaper_upfront_id = vehicle_b["id"]
            costlier_upfront_id = vehicle_a["id"]
            upfront_premium = price_a - price_b
            ops_saving_a = annual_ops_b - annual_ops_a
            if ops_saving_a > 0:
                has_break_even = True
                annual_savings = ops_saving_a
                years_to_even = upfront_premium / annual_savings
                break_even_months = round(years_to_even * 12, 1)
                break_even_km = round(years_to_even * calc_b["annual_distance_km"], 0)
                cheaper_running_id = vehicle_a["id"]
            else:
                cheaper_running_id = vehicle_b["id"]
    else:
        cheaper_upfront_id = vehicle_a["id"]
        cheaper_running_id = vehicle_a["id"]

    five_year_net_diff = abs(own_5yr_a - own_5yr_b)

    # Narrative verdict
    if has_break_even:
        champ_name = vehicle_a["name"] if cheaper_running_id == vehicle_a["id"] else vehicle_b["name"]
        cheap_up_name = vehicle_a["name"] if cheaper_upfront_id == vehicle_a["id"] else vehicle_b["name"]
        if break_even_months <= 36:
            verdict = (
                f"{champ_name} recovers its higher initial price in approx {break_even_months:.0f} months "
                f"({break_even_km:,.0f} km of riding) through annual operational savings of ₹{annual_savings:,.0f}. "
                f"Over 5 years, it saves a net ₹{five_year_net_diff:,.0f} in total ownership."
            )
        else:
            verdict = (
                f"{champ_name} takes {break_even_months:.0f} months ({break_even_months/12:.1f} years) to recover its upfront premium. "
                f"For users with lower daily mileage, {cheap_up_name} may remain financially simpler unless your daily commute increases."
            )
    else:
        if own_5yr_a < own_5yr_b:
            verdict = f"{vehicle_a['name']} is cheaper both upfront and cumulatively over 5 years."
        else:
            verdict = f"{vehicle_b['name']} is cheaper both upfront and cumulatively over 5 years."

    comparison_table = [
        {
            "metric": "Fuel / Propulsion Type",
            "vehicle_a": vehicle_a["fuel_type"].capitalize(),
            "vehicle_b": vehicle_b["fuel_type"].capitalize(),
            "advantage": "electric" if vehicle_a["fuel_type"] != vehicle_b["fuel_type"] else "neutral"
        },
        {
            "metric": "Estimated On-Road Price",
            "vehicle_a": f"₹{price_a:,.0f}",
            "vehicle_b": f"₹{price_b:,.0f}",
            "advantage": "vehicle_a" if price_a < price_b else "vehicle_b"
        },
        {
            "metric": "Energy / Fuel Running Cost per km",
            "vehicle_a": f"₹{calc_a['cost_per_km']:.2f}",
            "vehicle_b": f"₹{calc_b['cost_per_km']:.2f}",
            "advantage": "vehicle_a" if calc_a["cost_per_km"] < calc_b["cost_per_km"] else "vehicle_b"
        },
        {
            "metric": "Monthly Running Expense",
            "vehicle_a": f"₹{calc_a['monthly_running_cost']:,.0f}",
            "vehicle_b": f"₹{calc_b['monthly_running_cost']:,.0f}",
            "advantage": "vehicle_a" if calc_a["monthly_running_cost"] < calc_b["monthly_running_cost"] else "vehicle_b"
        },
        {
            "metric": "Annual Running Expense",
            "vehicle_a": f"₹{calc_a['annual_running_cost']:,.0f}",
            "vehicle_b": f"₹{calc_b['annual_running_cost']:,.0f}",
            "advantage": "vehicle_a" if calc_a["annual_running_cost"] < calc_b["annual_running_cost"] else "vehicle_b"
        },
        {
            "metric": "Annual Routine Maintenance",
            "vehicle_a": f"₹{calc_a['annual_maintenance_cost']:,.0f}",
            "vehicle_b": f"₹{calc_b['annual_maintenance_cost']:,.0f}",
            "advantage": "vehicle_a" if calc_a["annual_maintenance_cost"] < calc_b["annual_maintenance_cost"] else "vehicle_b"
        },
        {
            "metric": "3-Year Total Ownership Cost",
            "vehicle_a": f"₹{calc_a['horizons']['3_year']['total_ownership_cost']:,.0f}",
            "vehicle_b": f"₹{calc_b['horizons']['3_year']['total_ownership_cost']:,.0f}",
            "advantage": "vehicle_a" if calc_a['horizons']['3_year']['total_ownership_cost'] < calc_b['horizons']['3_year']['total_ownership_cost'] else "vehicle_b"
        },
        {
            "metric": "5-Year Total Ownership Cost",
            "vehicle_a": f"₹{own_5yr_a:,.0f}",
            "vehicle_b": f"₹{own_5yr_b:,.0f}",
            "advantage": "vehicle_a" if own_5yr_a < own_5yr_b else "vehicle_b"
        },
        {
            "metric": "Mileage / Real-World Range",
            "vehicle_a": f"{vehicle_a.get('mileage_kmpl', 'N/A')} km/L" if vehicle_a["fuel_type"] == "petrol" else f"{vehicle_a.get('range_km', 'N/A')} km range",
            "vehicle_b": f"{vehicle_b.get('mileage_kmpl', 'N/A')} km/L" if vehicle_b["fuel_type"] == "petrol" else f"{vehicle_b.get('range_km', 'N/A')} km range",
            "advantage": "contextual"
        },
        {
            "metric": "5-Year Tailpipe CO2 Emissions",
            "vehicle_a": f"{calc_a['horizons']['5_year']['co2_tailpipe_kg']:.0f} kg",
            "vehicle_b": f"{calc_b['horizons']['5_year']['co2_tailpipe_kg']:.0f} kg",
            "advantage": "vehicle_a" if calc_a['horizons']['5_year']['co2_tailpipe_kg'] < calc_b['horizons']['5_year']['co2_tailpipe_kg'] else "vehicle_b"
        }
    ]

    return {
        "vehicle_a": {**vehicle_a, "calc": calc_a},
        "vehicle_b": {**vehicle_b, "calc": calc_b},
        "calculation_params": {
            "daily_distance_km": daily_distance_km,
            "monthly_usage_days": monthly_usage_days,
            "petrol_price": petrol_price,
            "electricity_tariff": electricity_tariff,
            "annual_km": calc_a["annual_distance_km"],
        },
        "comparison_table": comparison_table,
        "break_even": {
            "has_break_even": has_break_even,
            "break_even_months": break_even_months,
            "break_even_km": break_even_km,
            "cheaper_upfront_vehicle_id": cheaper_upfront_id,
            "cheaper_running_vehicle_id": cheaper_running_id,
            "annual_savings_of_running_champ": annual_savings,
            "five_year_net_difference": five_year_net_diff,
            "verdict": verdict,
        },
        "pros_comparison": {
            vehicle_a["id"]: vehicle_a.get("pros", []),
            vehicle_b["id"]: vehicle_b.get("pros", []),
        },
        "cons_comparison": {
            vehicle_a["id"]: vehicle_a.get("cons", []),
            vehicle_b["id"]: vehicle_b.get("cons", []),
        },
        "summary_verdict": verdict,
    }
