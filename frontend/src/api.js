const API_BASE = '/api';

export async function fetchAssumptions() {
  try {
    const res = await fetch(`${API_BASE}/assumptions`);
    if (!res.ok) throw new Error('Failed to load assumptions');
    return await res.json();
  } catch (err) {
    console.warn('API error, using local fallback for assumptions:', err);
    return {
      default_petrol_price_per_litre: 102.0,
      default_electricity_tariff_per_kwh: 8.0,
      default_daily_distance_km: 30,
      default_monthly_usage_days: 25,
      disclaimers: {
        illustrative_data: "All vehicle specifications and costs are sample illustrative estimates for Indian two-wheelers.",
        cost_exclusions: "Calculations exclude insurance premiums, financing interest, RTO state tax variations, and battery replacement.",
      }
    };
  }
}

export async function fetchVehicles(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.fuel_type) params.append('fuel_type', filters.fuel_type);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (filters.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/vehicles?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load vehicles');
    return await res.json();
  } catch (err) {
    console.warn('API error, using fallback vehicle catalog:', err);
    return getFallbackVehicles();
  }
}

export async function fetchVehicleById(id) {
  try {
    const res = await fetch(`${API_BASE}/vehicles/${id}`);
    if (!res.ok) throw new Error('Failed to load vehicle');
    return await res.json();
  } catch (err) {
    const fallback = getFallbackVehicles().find(v => v.id === id);
    if (fallback) return fallback;
    throw err;
  }
}

export async function calculateCostsApi(payload) {
  try {
    const res = await fetch(`${API_BASE}/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Calculation request failed');
    return await res.json();
  } catch (err) {
    console.warn('API error, computing calculation locally:', err);
    return localCalculate(payload);
  }
}

export async function compareVehiclesApi(payload) {
  try {
    const res = await fetch(`${API_BASE}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Comparison request failed');
    return await res.json();
  } catch (err) {
    console.warn('API error, computing comparison locally:', err);
    return localCompare(payload);
  }
}

export async function recommendVehiclesApi(payload) {
  try {
    const res = await fetch(`${API_BASE}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Recommendation request failed');
    return await res.json();
  } catch (err) {
    console.warn('API error, computing recommendations locally:', err);
    return localRecommend(payload);
  }
}

// Fallback catalog in case backend is reloading
function getFallbackVehicles() {
  return [
    {
      id: "honda-activa-6g",
      name: "Honda Activa 6G (DLX)",
      brand: "Honda",
      category: "scooter",
      fuel_type: "petrol",
      price_ex_showroom: 79000,
      on_road_price_est: 92500,
      mileage_kmpl: 50,
      annual_maintenance_base: 3400,
      top_speed_kmh: 85,
      description: "India's highest-selling petrol scooter. Extremely reliable, hassle-free maintenance.",
      tags: ["city_commute", "family_convenience", "high_resale"],
      pros: ["Unmatched brand reliability", "Instant refueling anywhere", "Robust metal body"],
      cons: ["Higher running cost (~₹2.04/km)", "Basic instrument console", "Periodic engine maintenance required"]
    },
    {
      id: "tvs-jupiter-110",
      name: "TVS Jupiter 110",
      brand: "TVS",
      category: "scooter",
      fuel_type: "petrol",
      price_ex_showroom: 76500,
      on_road_price_est: 89000,
      mileage_kmpl: 52,
      annual_maintenance_base: 3200,
      top_speed_kmh: 82,
      description: "A refined family scooter offering plush suspension and external fuel lid.",
      tags: ["family_convenience", "city_commute"],
      pros: ["External fuel cap", "Comfortable telescopic suspension", "Great value"],
      cons: ["Petrol expense accumulates", "Modest top speed", "Routine servicing needed"]
    },
    {
      id: "hero-splendor-plus",
      name: "Hero Splendor Plus XTEC",
      brand: "Hero",
      category: "motorcycle",
      fuel_type: "petrol",
      price_ex_showroom: 78000,
      on_road_price_est: 91000,
      mileage_kmpl: 65,
      annual_maintenance_base: 2800,
      top_speed_kmh: 85,
      description: "India's undisputed mileage king with 65 km/l and lowest upkeep.",
      tags: ["budget_conscious", "high_mileage"],
      pros: ["Outstanding 65 km/l mileage", "Lowest spare parts cost", "600+ km tank range"],
      cons: ["Modest power output", "Basic drum brakes", "Emits exhaust CO2"]
    },
    {
      id: "ola-s1-pro-gen2",
      name: "Ola S1 Pro (Gen 2)",
      brand: "Ola Electric",
      category: "scooter",
      fuel_type: "electric",
      price_ex_showroom: 134000,
      on_road_price_est: 145000,
      battery_capacity_kwh: 4.0,
      range_km: 145,
      annual_maintenance_base: 1800,
      top_speed_kmh: 120,
      description: "High performance electric scooter with 4 kWh battery and 120 km/h top speed.",
      tags: ["high_performance", "tech_loaded", "green_eco"],
      pros: ["0-40 in 2.6s and 120 km/h top speed", "Ultralow ~₹0.22/km running expense", "8-year battery warranty"],
      cons: ["Requires home/office charging socket", "Higher upfront cost", "App dependency"]
    },
    {
      id: "ola-s1-x-3kwh",
      name: "Ola S1 X (3 kWh)",
      brand: "Ola Electric",
      category: "scooter",
      fuel_type: "electric",
      price_ex_showroom: 89000,
      on_road_price_est: 99000,
      battery_capacity_kwh: 3.0,
      range_km: 110,
      annual_maintenance_base: 1600,
      top_speed_kmh: 90,
      description: "Mass-market electric scooter bringing EV economics to petrol 110cc scooter price points.",
      tags: ["budget_conscious", "green_eco"],
      pros: ["Sub-₹1 Lakh on-road EV", "Extremely low running bill", "8-year battery warranty"],
      cons: ["Segmented LCD display", "7.4 hour charging time", "Parking socket required"]
    },
    {
      id: "ather-450x-3-7kwh",
      name: "Ather 450X (3.7 kWh)",
      brand: "Ather Energy",
      category: "scooter",
      fuel_type: "electric",
      price_ex_showroom: 145000,
      on_road_price_est: 158000,
      battery_capacity_kwh: 3.7,
      range_km: 115,
      annual_maintenance_base: 2200,
      top_speed_kmh: 90,
      description: "Engineering benchmark with sports handling and Ather Grid fast charging.",
      tags: ["high_performance", "premium_build"],
      pros: ["Superb handling and reliability", "Ather Grid fast chargers", "Built-in Google Maps"],
      cons: ["Higher purchase price", "115 km real range", "Smaller boot"]
    },
    {
      id: "tvs-iqube-3-4kwh",
      name: "TVS iQube (3.4 kWh)",
      brand: "TVS",
      category: "scooter",
      fuel_type: "electric",
      price_ex_showroom: 126000,
      on_road_price_est: 137000,
      battery_capacity_kwh: 3.4,
      range_km: 100,
      annual_maintenance_base: 1900,
      top_speed_kmh: 78,
      description: "Conventional, whisper-quiet electric scooter with trusted TVS backing.",
      tags: ["family_convenience", "dependable"],
      pros: ["Comfortable family ergonomics", "Smooth linear throttle", "Wide TVS network"],
      cons: ["78 km/h top speed", "100 km real range", "Bulkier charger"]
    }
  ];
}

function localCalculate(p) {
  const daily = p.daily_distance_km || 30;
  const days = p.monthly_usage_days || 25;
  const petrolPrice = p.petrol_price_per_litre || 102;
  const tariff = p.electricity_tariff_per_kwh || 8;

  let fuelType = p.custom_fuel_type || "petrol";
  let price = p.custom_price || 92500;
  let maint = p.custom_annual_maintenance || 3400;
  let costPerKm = 2.04;
  let vehicleName = "Custom Vehicle";

  if (p.vehicle_id) {
    const v = getFallbackVehicles().find(x => x.id === p.vehicle_id);
    if (v) {
      vehicleName = v.name;
      fuelType = v.fuel_type;
      price = v.on_road_price_est;
      maint = v.annual_maintenance_base;
      if (v.fuel_type === "petrol") {
        costPerKm = petrolPrice / v.mileage_kmpl;
      } else {
        costPerKm = (v.battery_capacity_kwh / v.range_km) * tariff;
      }
    }
  }

  const monthlyDist = daily * days;
  const annualDist = monthlyDist * 12;
  const monthlyRun = monthlyDist * costPerKm;
  const annualRun = annualDist * costPerKm;

  const horizons = {};
  [1, 3, 5].forEach(yr => {
    const runTotal = annualRun * yr;
    const maintTotal = maint * yr;
    const total = price + runTotal + maintTotal;
    horizons[`${yr}_year`] = {
      years: yr,
      distance_total_km: annualDist * yr,
      running_cost_total: runTotal,
      maintenance_cost_total: maintTotal,
      purchase_price: price,
      total_ownership_cost: total,
      running_cost_share_pct: ((runTotal / total) * 100).toFixed(1),
      co2_tailpipe_kg: fuelType === "petrol" ? ((annualDist * yr * 54) / 1000).toFixed(1) : 0,
    };
  });

  return {
    vehicle_id: p.vehicle_id || null,
    vehicle_name: vehicleName,
    fuel_type: fuelType,
    daily_distance_km: daily,
    monthly_usage_days: days,
    monthly_distance_km: monthlyDist,
    annual_distance_km: annualDist,
    cost_per_km: parseFloat(costPerKm.toFixed(3)),
    monthly_running_cost: Math.round(monthlyRun),
    annual_running_cost: Math.round(annualRun),
    annual_maintenance_cost: maint,
    purchase_price: price,
    horizons,
    summary_insight: `At ${daily} km/day, you ride ${annualDist.toLocaleString()} km/yr. Monthly running cost is ₹${Math.round(monthlyRun).toLocaleString()}.`,
    formula_explanation: {
      running_cost_formula: fuelType === 'petrol' ? `₹${petrolPrice}/L ÷ mileage` : `(Battery kWh ÷ Range) × ₹${tariff}/kWh`,
      monthly_running_formula: `${monthlyDist} km × ₹${costPerKm.toFixed(2)}/km`,
      ownership_formula: 'Purchase Price + (Running × Years) + (Service × Years)',
    }
  };
}

function localCompare(p) {
  const vA = getFallbackVehicles().find(v => v.id === p.vehicle_a_id) || getFallbackVehicles()[0];
  const vB = getFallbackVehicles().find(v => v.id === p.vehicle_b_id) || getFallbackVehicles()[3];

  const calcA = localCalculate({ ...p, vehicle_id: vA.id });
  const calcB = localCalculate({ ...p, vehicle_id: vB.id });

  const diffPrice = Math.abs(calcA.purchase_price - calcB.purchase_price);
  const opsA = calcA.annual_running_cost + calcA.annual_maintenance_cost;
  const opsB = calcB.annual_running_cost + calcB.annual_maintenance_cost;
  const opsDiff = Math.abs(opsA - opsB);

  const breakEvenMonths = opsDiff > 0 ? ((diffPrice / opsDiff) * 12).toFixed(1) : null;

  return {
    vehicle_a: { ...vA, calc: calcA },
    vehicle_b: { ...vB, calc: calcB },
    comparison_table: [
      { metric: "Propulsion Type", vehicle_a: vA.fuel_type.toUpperCase(), vehicle_b: vB.fuel_type.toUpperCase() },
      { metric: "On-Road Price", vehicle_a: `₹${vA.on_road_price_est.toLocaleString()}`, vehicle_b: `₹${vB.on_road_price_est.toLocaleString()}` },
      { metric: "Running Cost / km", vehicle_a: `₹${calcA.cost_per_km.toFixed(2)}`, vehicle_b: `₹${calcB.cost_per_km.toFixed(2)}` },
      { metric: "Monthly Running Bill", vehicle_a: `₹${calcA.monthly_running_cost.toLocaleString()}`, vehicle_b: `₹${calcB.monthly_running_cost.toLocaleString()}` },
      { metric: "5-Year Total Cost", vehicle_a: `₹${Math.round(calcA.horizons["5_year"].total_ownership_cost).toLocaleString()}`, vehicle_b: `₹${Math.round(calcB.horizons["5_year"].total_ownership_cost).toLocaleString()}` },
    ],
    break_even: {
      has_break_even: !!breakEvenMonths,
      break_even_months: breakEvenMonths ? parseFloat(breakEvenMonths) : null,
      cheaper_upfront_vehicle_id: calcA.purchase_price < calcB.purchase_price ? vA.id : vB.id,
      cheaper_running_vehicle_id: opsA < opsB ? vA.id : vB.id,
      annual_savings_of_running_champ: opsDiff,
      five_year_net_difference: Math.abs(calcA.horizons["5_year"].total_ownership_cost - calcB.horizons["5_year"].total_ownership_cost),
      verdict: breakEvenMonths ? `The higher upfront cost is recovered in approximately ${breakEvenMonths} months.` : 'Consistent cost profile across vehicles.',
    },
    pros_comparison: { [vA.id]: vA.pros, [vB.id]: vB.pros },
    cons_comparison: { [vA.id]: vA.cons, [vB.id]: vB.cons },
    summary_verdict: `Comparison between ${vA.name} and ${vB.name}.`,
  };
}

function localRecommend(p) {
  const vehicles = getFallbackVehicles();
  const scored = vehicles.map(v => {
    let score = 70;
    const reasons = [];
    const tradeoffs = [];

    if (v.fuel_type === 'electric' && p.charging_access === 'no_charging_access') {
      score -= 40;
      tradeoffs.push('No home/work charging access makes EV ownership impractical.');
    } else if (v.fuel_type === 'electric' && p.charging_access === 'home_dedicated_plug') {
      score += 20;
      reasons.push('Dedicated home charging makes daily overnight charging effortless.');
    }

    if (v.on_road_price_est <= p.budget_max) {
      score += 15;
      reasons.push(`Comfortably within your ₹${p.budget_max.toLocaleString()} budget.`);
    } else {
      score -= 20;
      tradeoffs.push(`Exceeds specified budget by ₹${(v.on_road_price_est - p.budget_max).toLocaleString()}.`);
    }

    const calc = localCalculate({ daily_distance_km: p.daily_distance_km, vehicle_id: v.id });

    return {
      vehicle: v,
      match_score: Math.max(10, Math.min(98, score)),
      badge: score >= 80 ? "Top Pick" : "Alternative",
      suitability: score >= 80 ? "Highly Recommended" : "Consider with Caveats",
      reasons_for: reasons,
      trade_offs: tradeoffs,
      monthly_cost_estimate: calc.monthly_running_cost,
      cost_per_km: calc.cost_per_km,
      five_year_total_ownership: calc.horizons["5_year"].total_ownership_cost,
    };
  }).sort((a, b) => b.match_score - a.match_score);

  return {
    recommendations: scored,
    key_takeaway: `Evaluated ${vehicles.length} vehicles against your commute and charging profile.`,
    charging_guidance: p.charging_access === 'no_charging_access' ? 'Without private parking charging, petrol offers far greater convenience.' : 'Charging access confirmed.',
    disclaimer: 'Illustrative estimates based on sample data.',
  };
}
