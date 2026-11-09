import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

import unittest
from calculator import (
    load_assumptions,
    load_vehicles,
    get_vehicle_by_id,
    calculate_vehicle_costs,
    compare_two_vehicles,
)
from recommender import generate_recommendations

class TestSahiDriveBackend(unittest.TestCase):
    def test_load_data(self):
        assumptions = load_assumptions()
        self.assertIn("default_petrol_price_per_litre", assumptions)
        self.assertEqual(assumptions["default_petrol_price_per_litre"], 102.0)

        vehicles = load_vehicles()
        self.assertGreaterEqual(len(vehicles), 10)
        petrol_vehicles = [v for v in vehicles if v["fuel_type"] == "petrol"]
        ev_vehicles = [v for v in vehicles if v["fuel_type"] == "electric"]
        self.assertGreaterEqual(len(petrol_vehicles), 4)
        self.assertGreaterEqual(len(ev_vehicles), 4)

    def test_running_and_ownership_calculations(self):
        activa = get_vehicle_by_id("honda-activa-6g")
        self.assertIsNotNone(activa)
        calc = calculate_vehicle_costs(activa, daily_distance_km=30, monthly_usage_days=25)

        # 30 km * 25 days = 750 km / month
        self.assertEqual(calc["monthly_distance_km"], 750)
        self.assertEqual(calc["annual_distance_km"], 9000)
        # Cost per km at 50 kmpl & ₹102/L = 102 / 50 = 2.04
        self.assertAlmostEqual(calc["cost_per_km"], 2.04, places=2)
        # Monthly running = 750 * 2.04 = 1530
        self.assertAlmostEqual(calc["monthly_running_cost"], 1530.0, places=1)
        # Annual running = 9000 * 2.04 = 18360
        self.assertAlmostEqual(calc["annual_running_cost"], 18360.0, places=1)

        # Horizons: 1, 3, 5 years
        h3 = calc["horizons"]["3_year"]
        expected_total_3yr = activa["on_road_price_est"] + (18360 * 3) + (activa["annual_maintenance_base"] * 3)
        self.assertAlmostEqual(h3["total_ownership_cost"], expected_total_3yr, places=1)

    def test_compare_and_breakeven(self):
        activa = get_vehicle_by_id("honda-activa-6g")
        ola = get_vehicle_by_id("ola-s1-pro-gen2")
        self.assertIsNotNone(activa)
        self.assertIsNotNone(ola)

        cmp = compare_two_vehicles(activa, ola, daily_distance_km=40, monthly_usage_days=25)
        self.assertTrue(cmp["break_even"]["has_break_even"])
        self.assertIsNotNone(cmp["break_even"]["break_even_months"])
        self.assertGreater(cmp["break_even"]["annual_savings_of_running_champ"], 0)
        print(f"Ola vs Activa Break-even: {cmp['break_even']['break_even_months']} months")

    def test_recommender_charging_constraint(self):
        # Case 1: User has NO CHARGING ACCESS
        rec_no_charge = generate_recommendations(
            budget_max=150000,
            daily_distance_km=40,
            charging_access="no_charging_access",
            travel_pattern="regular_commute_mixed",
            primary_priority="lowest_running_expense"
        )
        # Top recommended vehicle MUST NOT be an EV when charging is unavailable!
        top_rec = rec_no_charge["recommendations"][0]
        self.assertEqual(top_rec["vehicle"]["fuel_type"], "petrol",
                         "Top recommendation must be Petrol if user has no charging access!")
        print(f"Top pick without charging: {top_rec['vehicle']['name']} ({top_rec['match_score']} pts)")

        # Case 2: User has HOME DEDICATED PLUG and travels 50 km/day
        rec_with_charge = generate_recommendations(
            budget_max=150000,
            daily_distance_km=50,
            charging_access="home_dedicated_plug",
            travel_pattern="regular_commute_mixed",
            primary_priority="lowest_running_expense"
        )
        top_ev = rec_with_charge["recommendations"][0]
        self.assertEqual(top_ev["vehicle"]["fuel_type"], "electric")
        print(f"Top pick with home charging: {top_ev['vehicle']['name']} ({top_ev['match_score']} pts)")

if __name__ == "__main__":
    unittest.main()
