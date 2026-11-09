from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal

class VehicleSpec(BaseModel):
    id: str
    name: str
    brand: str
    category: Literal["scooter", "motorcycle"]
    fuel_type: Literal["petrol", "electric"]
    price_ex_showroom: float
    on_road_price_est: float
    engine_displacement_cc: Optional[float] = None
    fuel_tank_capacity_l: Optional[float] = None
    mileage_kmpl: Optional[float] = None
    battery_capacity_kwh: Optional[float] = None
    range_km: Optional[float] = None
    charging_time_hrs: Optional[float] = None
    annual_maintenance_base: float
    top_speed_kmh: float
    warranty_years: int
    warranty_km: int
    description: str
    tags: List[str]
    best_suited_for: str
    pros: List[str]
    cons: List[str]

class CalculateRequest(BaseModel):
    vehicle_id: Optional[str] = None
    daily_distance_km: float = Field(default=30.0, ge=1.0, le=500.0)
    monthly_usage_days: int = Field(default=25, ge=1, le=31)
    petrol_price_per_litre: float = Field(default=102.0, ge=50.0, le=200.0)
    electricity_tariff_per_kwh: float = Field(default=8.0, ge=1.0, le=30.0)
    # Optional custom vehicle overrides for "what-if" explorations
    custom_fuel_type: Optional[Literal["petrol", "electric"]] = None
    custom_mileage_kmpl: Optional[float] = None
    custom_range_km: Optional[float] = None
    custom_battery_kwh: Optional[float] = None
    custom_price: Optional[float] = None
    custom_annual_maintenance: Optional[float] = None

class CostHorizonBreakdown(BaseModel):
    years: int
    distance_total_km: float
    running_cost_total: float
    maintenance_cost_total: float
    purchase_price: float
    total_ownership_cost: float
    running_cost_share_pct: float
    co2_tailpipe_kg: float

class CalculateResponse(BaseModel):
    vehicle_id: Optional[str]
    vehicle_name: str
    fuel_type: str
    daily_distance_km: float
    monthly_usage_days: int
    monthly_distance_km: float
    annual_distance_km: float
    cost_per_km: float
    monthly_running_cost: float
    annual_running_cost: float
    annual_maintenance_cost: float
    horizons: Dict[str, CostHorizonBreakdown]
    summary_insight: str
    formula_explanation: Dict[str, str]

class CompareRequest(BaseModel):
    vehicle_a_id: str
    vehicle_b_id: str
    daily_distance_km: float = Field(default=30.0, ge=1.0, le=500.0)
    monthly_usage_days: int = Field(default=25, ge=1, le=31)
    petrol_price_per_litre: float = Field(default=102.0, ge=50.0, le=200.0)
    electricity_tariff_per_kwh: float = Field(default=8.0, ge=1.0, le=30.0)

class BreakEvenAnalysis(BaseModel):
    has_break_even: bool
    break_even_months: Optional[float] = None
    break_even_km: Optional[float] = None
    cheaper_upfront_vehicle_id: str
    cheaper_running_vehicle_id: str
    annual_savings_of_running_champ: float
    five_year_net_difference: float
    verdict: str

class CompareResponse(BaseModel):
    vehicle_a: Dict[str, Any]
    vehicle_b: Dict[str, Any]
    calculation_params: Dict[str, Any]
    comparison_table: List[Dict[str, Any]]
    break_even: BreakEvenAnalysis
    pros_comparison: Dict[str, List[str]]
    cons_comparison: Dict[str, List[str]]
    summary_verdict: str

class RecommendRequest(BaseModel):
    budget_max: float = Field(..., ge=60000.0, le=400000.0)
    daily_distance_km: float = Field(..., ge=2.0, le=300.0)
    charging_access: Literal["home_dedicated_plug", "apartment_shared_socket", "public_chargers_only", "no_charging_access"]
    travel_pattern: Literal["short_city_errands", "regular_commute_mixed", "highway_long_distance"]
    primary_priority: Literal["lowest_upfront_price", "lowest_running_expense", "green_eco_friendly", "convenience_reliability", "performance_and_features"]
    preferred_category: Optional[Literal["all", "scooter", "motorcycle"]] = "all"

class ScoredVehicle(BaseModel):
    vehicle: Dict[str, Any]
    match_score: int # 0 to 100
    badge: str
    suitability: str
    reasons_for: List[str]
    trade_offs: List[str]
    monthly_cost_estimate: float
    cost_per_km: float
    five_year_total_ownership: float

class RecommendResponse(BaseModel):
    user_inputs: Dict[str, Any]
    recommendations: List[ScoredVehicle]
    key_takeaway: str
    charging_guidance: str
    disclaimer: str
