from typing import Dict, Any, List
from calculator import load_vehicles, calculate_vehicle_costs

def generate_recommendations(
    budget_max: float,
    daily_distance_km: float,
    charging_access: str,
    travel_pattern: str,
    primary_priority: str,
    preferred_category: str = "all",
    petrol_price: float = 102.0,
    electricity_tariff: float = 8.0,
    monthly_usage_days: int = 25,
) -> Dict[str, Any]:
    """
    Rule-based, explainable recommendation engine tailored for Indian two-wheeler buyers.
    Evaluates budget fit, charging practicality, range security, and priority alignment.
    """
    all_vehicles = load_vehicles()
    scored_list = []

    # Filter by category if user requested scooter or motorcycle specifically
    candidates = all_vehicles
    if preferred_category in ["scooter", "motorcycle"]:
        candidates = [v for v in all_vehicles if v["category"] == preferred_category]
        # fallback if empty
        if not candidates:
            candidates = all_vehicles

    for vehicle in candidates:
        v_id = vehicle["id"]
        v_name = vehicle["name"]
        fuel_type = vehicle["fuel_type"]
        price = float(vehicle["on_road_price_est"])
        calc = calculate_vehicle_costs(vehicle, daily_distance_km, monthly_usage_days, petrol_price, electricity_tariff)
        monthly_run = calc["monthly_running_cost"]
        cost_km = calc["cost_per_km"]
        five_yr_total = calc["horizons"]["5_year"]["total_ownership_cost"]

        score = 60 # Base starting score
        reasons_for = []
        trade_offs = []
        is_dealbreaker = False
        dealbreaker_note = ""

        # ----------------------------------------------------
        # 1. BUDGET EVALUATION
        # ----------------------------------------------------
        if price <= budget_max:
            # Within budget
            savings_under_budget = budget_max - price
            score += 15
            if savings_under_budget > 25000:
                reasons_for.append(f"Comfortably ₹{savings_under_budget:,.0f} under your maximum budget limit.")
            else:
                reasons_for.append(f"Fits neatly within your ₹{budget_max:,.0f} on-road budget.")
        elif price <= budget_max * 1.10:
            # Slight stretch (< 10%)
            score += 5
            trade_offs.append(f"Slightly exceeds target budget by ₹{price - budget_max:,.0f} (requires a ~10% stretch).")
        else:
            # Substantially over budget
            score -= 30
            trade_offs.append(f"Substantially over budget by ₹{price - budget_max:,.0f} (Ex-showroom/on-road ₹{price:,.0f}).")

        # ----------------------------------------------------
        # 2. CHARGING REALITY CHECK (CRITICAL FOR INDIA)
        # ----------------------------------------------------
        if fuel_type == "electric":
            if charging_access == "no_charging_access":
                score -= 45
                is_dealbreaker = True
                dealbreaker_note = "Lack of home or work charging makes daily EV ownership very inconvenient in India."
                trade_offs.append("CRITICAL: You indicated no reliable home/work charging access. Relying solely on public charging stations creates high queueing and range anxiety.")
            elif charging_access == "public_chargers_only":
                score -= 20
                trade_offs.append("Relying only on public charging infrastructure requires visiting fast-chargers 2-3 times per week.")
            elif charging_access == "apartment_shared_socket":
                score += 5
                reasons_for.append("Compatible with shared apartment parking 15A socket setups.")
            elif charging_access == "home_dedicated_plug":
                score += 20
                reasons_for.append("Perfect match for your private home charging plug: wake up to 100% full charge every morning.")
        else: # Petrol
            if charging_access in ["no_charging_access", "public_chargers_only"]:
                score += 20
                reasons_for.append("Instant, ubiquitous petrol refuelling everywhere: 0 charging friction or parking plug hassles.")
            else:
                score += 5

        # ----------------------------------------------------
        # 3. DAILY DISTANCE & TRAVEL PATTERN
        # ----------------------------------------------------
        if fuel_type == "electric":
            range_km = float(vehicle.get("range_km", 100))
            daily_buffer = range_km / max(daily_distance_km, 1)

            if daily_buffer < 1.15:
                # Dangerous daily range
                score -= 35
                trade_offs.append(f"Daily commute of {daily_distance_km:.0f} km nearly exhausts the real-world {range_km:.0f} km range without mid-day charging.")
            elif daily_buffer >= 2.0:
                score += 15
                reasons_for.append(f"Abundant range buffer: {range_km:.0f} km real range easily handles your {daily_distance_km:.0f} km daily travel with 50%+ reserve.")

            # Travel pattern
            if travel_pattern == "highway_long_distance":
                score -= 20
                trade_offs.append("Highway/intercity trips demand careful route planning around high-speed fast chargers.")
            elif travel_pattern in ["short_city_errands", "regular_commute_mixed"]:
                score += 12
                reasons_for.append("Ideal for stop-and-go city traffic with smooth gearless throttle and zero idle fuel waste.")
        else: # Petrol
            mileage = float(vehicle.get("mileage_kmpl", 50))
            if travel_pattern == "highway_long_distance":
                score += 20
                reasons_for.append("Unrestricted highway touring freedom: refill in 2 minutes at any highway fuel pump.")
            if daily_distance_km >= 50:
                trade_offs.append(f"At {daily_distance_km:.0f} km/day, cumulative petrol fuel expense is substantial (approx ₹{monthly_run:,.0f}/month).")

        # ----------------------------------------------------
        # 4. USER PRIORITY ALIGNMENT
        # ----------------------------------------------------
        if primary_priority == "lowest_upfront_price":
            if price <= 100000:
                score += 20
                reasons_for.append(f"One of the most accessible purchase prices in the market at ₹{price:,.0f} on-road.")
            else:
                score -= 10

        elif primary_priority == "lowest_running_expense":
            if fuel_type == "electric":
                if charging_access != "no_charging_access":
                    score += 25
                    reasons_for.append(f"Ultralow running expense of just ₹{cost_km:.2f}/km saves ₹{(2.00 - cost_km) * calc['annual_distance_km']:,.0f} annually vs typical petrol.")
            else:
                # High mileage petrol
                mileage = float(vehicle.get("mileage_kmpl", 50))
                if mileage >= 60:
                    score += 15
                    reasons_for.append(f"Class-leading petrol mileage of {mileage} km/l minimizes your monthly petrol bills.")
                else:
                    score -= 10
                    trade_offs.append(f"Petrol running cost is ₹{cost_km:.2f}/km, higher than EV alternatives.")

        elif primary_priority == "green_eco_friendly":
            if fuel_type == "electric":
                score += 30
                reasons_for.append("Zero direct tailpipe emissions: eliminates urban smoke, exhaust fumes, and engine noise.")
            else:
                score -= 20
                trade_offs.append("Internal combustion engine produces exhaust CO2 emissions and urban particulate matter.")

        elif primary_priority == "convenience_reliability":
            if vehicle["brand"] in ["Honda", "Hero", "TVS", "Bajaj"] and fuel_type == "petrol":
                score += 20
                reasons_for.append(f"Backed by {vehicle['brand']}'s massive pan-India authorized dealer and mechanics network.")
            elif fuel_type == "electric" and vehicle["brand"] in ["Ather Energy", "TVS"]:
                score += 10
                reasons_for.append(f"Proven engineering reliability and consistent customer satisfaction track record.")

        elif primary_priority == "performance_and_features":
            top_spd = float(vehicle.get("top_speed_kmh", 80))
            if top_spd >= 90 or "high_performance" in vehicle.get("tags", []):
                score += 20
                reasons_for.append(f"Exciting performance: {top_spd} km/h top speed with instant torque delivery.")
            else:
                score -= 5

        # Bound score between 5 and 99
        score = max(5, min(98, score))

        # Assign badge & suitability
        if is_dealbreaker:
            badge = "Charging Incompatible"
            suitability = "Not Recommended (Charging Barrier)"
        elif score >= 85:
            badge = "Best Overall Match" if len(scored_list) == 0 else "Strong Top Pick"
            suitability = "Highly Recommended"
        elif score >= 70:
            badge = "Value Alternative"
            suitability = "Recommended"
        elif score >= 50:
            badge = "Consider with Caveats"
            suitability = "Moderate Fit"
        else:
            badge = "Low Compatibility"
            suitability = "Not Recommended"

        scored_list.append({
            "vehicle": vehicle,
            "match_score": score,
            "badge": badge,
            "suitability": suitability,
            "reasons_for": reasons_for[:3], # Top 3 reasons
            "trade_offs": trade_offs[:3],   # Top 3 trade-offs
            "daily_cost_estimate": calc.get("daily_running_cost", round(daily_distance_km * cost_km, 2)),
            "monthly_cost_estimate": monthly_run,
            "annual_cost_estimate": calc.get("annual_running_cost", round(monthly_run * 12, 2)),
            "cost_per_km": cost_km,
            "five_year_total_ownership": five_yr_total,
        })

    # Sort descending by match score
    scored_list.sort(key=lambda x: x["match_score"], reverse=True)

    # Ensure unique badges for top 3
    if len(scored_list) > 0 and scored_list[0]["match_score"] >= 75:
        scored_list[0]["badge"] = "🌟 Best Overall Match"
    if len(scored_list) > 1 and scored_list[1]["match_score"] >= 65:
        if scored_list[1]["vehicle"]["fuel_type"] != scored_list[0]["vehicle"]["fuel_type"]:
            scored_list[1]["badge"] = f"⚡ Top {scored_list[1]['vehicle']['fuel_type'].capitalize()} Pick"
        else:
            scored_list[1]["badge"] = "🥈 Best Value Contender"
    if len(scored_list) > 2 and scored_list[2]["match_score"] >= 55:
        scored_list[2]["badge"] = "🥉 Balanced Alternative"

    # Generate overarching recommendation takeaway
    top_veh = scored_list[0]["vehicle"]
    if top_veh["fuel_type"] == "electric":
        key_takeaway = (
            f"Based on your daily travel of {daily_distance_km:.0f} km and charging availability, "
            f"an electric two-wheeler like the {top_veh['name']} offers substantial long-term financial "
            f"and environmental advantages, slashing running costs down to ~₹{scored_list[0]['cost_per_km']:.2f}/km."
        )
    else:
        key_takeaway = (
            f"Considering your constraints (budget, charging setup, or travel habits), "
            f"a proven high-efficiency petrol two-wheeler like the {top_veh['name']} is your safest, "
            f"most practical choice without charging friction or range anxiety."
        )

    if charging_access == "no_charging_access":
        charging_guidance = (
            "⚠️ Notice on Charging: You noted having no dedicated home or work charging plug. "
            "In Indian metro and non-metro cities, relying solely on commercial public DC chargers for daily two-wheeler commuting "
            "leads to waiting queues, varying tariffs, and potential inconvenience. Petrol models are recommended until parking charging is accessible."
        )
    elif charging_access == "home_dedicated_plug":
        charging_guidance = (
            "✅ Great charging conditions: Having a dedicated 5A/15A socket at your private parking is the single most important factor "
            "for a seamless EV experience. You can charge overnight during low-tariff hours and avoid commercial charging queues entirely."
        )
    else:
        charging_guidance = (
            "ℹ️ Shared / Public charging: Ensure your apartment society or residential parking allows installing an sub-metered 15A socket, "
            "or map out nearby fast-charging hubs before finalizing an EV purchase."
        )

    disclaimer = (
        "Calculations are illustrative estimates based on benchmark fuel (₹102/L) and electricity (₹8/kWh) rates. "
        "Excludes insurance, financing interest (EMI), state road tax variations, and battery replacement unless noted."
    )

    return {
        "user_inputs": {
            "budget_max": budget_max,
            "daily_distance_km": daily_distance_km,
            "charging_access": charging_access,
            "travel_pattern": travel_pattern,
            "primary_priority": primary_priority,
            "preferred_category": preferred_category,
        },
        "recommended_vehicle": scored_list[0] if scored_list else None,
        "alternatives": scored_list[1:] if len(scored_list) > 1 else [],
        "recommendations": scored_list,
        "key_takeaway": key_takeaway,
        "charging_guidance": charging_guidance,
        "disclaimer": disclaimer,
    }
