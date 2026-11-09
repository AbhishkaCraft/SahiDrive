# ⚡ SahiDrive — Intelligent Mobility Decision Platform

> **The right vehicle. The right cost. The right decision.**

SahiDrive is an intelligent mobility decision platform built specifically for Indian consumers. It cuts through marketing hype to help riders make financially prudent, range-secure, and charging-compatible decisions when choosing between petrol (ICE) and electric (EV) two-wheelers.

---

## 🎯 The Problem SahiDrive Solves

In India's rapidly electrifying two-wheeler market, consumers face severe decision paralysis:
1. **The Showroom Price Illusion:** A ₹90,000 petrol scooter appears cheaper than a ₹1,30,000 electric scooter, but petrol running expenses over 5 years (> ₹1,00,000) often exceed the purchase price of the vehicle itself.
2. **The Blind EV Push:** Many EV advocates ignore Indian apartment parking realities. Recommending an EV to someone living in a high-rise without a parking socket leads to charging friction, public queues, and buyer remorse.
3. **Hidden Payback Timelines:** Consumers lack transparent answers to simple questions: *"At my daily 35 km commute, in how many months will the electric vehicle recover its higher purchase price?"*

SahiDrive provides objective, math-backed, rule-based answers with zero manufacturer bias.

---

## 🚀 Key Features & Application Pages

### 1. 🏠 Home Page (`/`)
- Bold landing interface introducing SahiDrive's mission and value proposition.
- **Interactive Quick-Decision Preview:** Live slider to instantly compare petrol vs electric monthly bills and annual savings at your daily commute distance.
- Direct quick-launch cards into popular Indian matchups (Activa vs Ola, Splendor vs S1 X, Jupiter vs iQube, Shine vs Revolt).
- 4-pillar explanation of our unbiased decision framework.

### 2. ⚖️ Compare Vehicles (`/compare`)
- Head-to-head comparison between any two Indian two-wheelers.
- **Break-Even & Payback Visualizer:** Native CSS milestone bar pinpointing the exact month and kilometer where operational savings pay off the upfront premium.
- **Stacked Ownership Horizon Chart:** Native HTML/CSS multi-year bars comparing On-Road Purchase Price vs Cumulative Fuel/Power vs Routine Servicing.
- **Comprehensive Specification & Expense Matrix:** Advantage badges, real mileage/range benchmarks, annual service costs, and practical pros/cons.

### 3. 🧮 Ownership Cost Calculator (`/calculator`)
- **Clear Distinction:** Explicitly separates immediate fuel/energy running expense (₹/km and ₹/month) from total cumulative ownership cost over 1, 3, and 5 years.
- **Dual Mode:** Calculate for preloaded Indian two-wheelers OR input custom vehicle specifications (petrol mileage, battery kWh, real range, price, maintenance).
- **Interactive Controls:** Customize daily distance (km), monthly usage days (10–31), petrol price (₹/L), and electricity tariff (₹/kWh).
- **Environmental Impact:** Estimated direct tailpipe CO2 emissions generated or avoided over 5 years.

### 4. 🎯 Find My Vehicle (`/recommend`)
- Rule-based, explainable recommendation wizard evaluating 6 essential Indian criteria:
  1. Maximum on-road budget (₹75k to ₹2.5L)
  2. Daily commute distance
  3. Real charging access in India (Dedicated Home 15A Plug, Apartment Shared Socket, Public Fast Chargers Only, No Charging Access)
  4. Travel pattern (City Errands, Regular Mixed Commute, Highway Touring)
  5. Top priority (Lowest Upfront Price, Lowest Running Cost, Green Zero-Emission, Convenience & Brand Trust, Performance & Tech)
  6. Vehicle type (Scooters, Motorcycles, or All)
- **Unbiased Rule Engine:** If a user has no charging access or travels long highway distances, petrol models are objectively recommended with clear trade-off explanations.
- **Transparent Output:** Compatibility score (0–100), customized badges, "Why SahiDrive recommends this", and "Key trade-offs to keep in mind".

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Design Constraints Strictly Followed |
|---|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, Tailwind CSS | **Zero chart libraries** (No Recharts, No Chart.js), **Zero icon packages** (No Lucide, No react-icons) |
| **Visualizations** | Native HTML5 & CSS3 Flexbox/Grid stacked progress bars | Custom responsive CSS visualizers with dynamic percentages and styling |
| **Icons & Symbols** | Clean Unicode symbols, emojis, and tailored CSS badges | ⚡, ⛽, 🏍️, 🛵, 💰, ⚖️, 🧭, 📊, 🛡️, 🌿, 🎯 |
| **Backend** | Python 3.12, FastAPI, Uvicorn, Pydantic v2 | Clean REST API with CORS middleware and validation |
| **Data Architecture** | Centralized JSON Datasets (`vehicles.json`, `assumptions.json`) | Consistent formulas across frontend and backend |

---

## 📊 Core Calculation Formulas

### 1. Fuel / Energy Running Cost per km
- **Petrol:**
  $$\text{Cost per km} = \frac{\text{Petrol Price (₹/L)}}{\text{Real-World Mileage (km/L)}}$$
  *Example (Honda Activa 6G):* $\frac{₹102/\text{L}}{50\text{ km/L}} = ₹2.04\text{ / km}$

- **Electric:**
  $$\text{Cost per km} = \left(\frac{\text{Battery Capacity (kWh)}}{\text{Real-World Range (km)}}\right) \times \text{Electricity Tariff (₹/kWh)}$$
  *Example (Ola S1 Pro Gen 2):* $\left(\frac{4.0\text{ kWh}}{145\text{ km}}\right) \times ₹8/\text{kWh} = ₹0.221\text{ / km}$

### 2. Monthly & Annual Running Expenses
$$\text{Monthly Running Expense} = (\text{Daily km} \times \text{Monthly Days}) \times \text{Cost per km}$$
$$\text{Annual Running Expense} = \text{Monthly Running Expense} \times 12$$

### 3. Total Cumulative Ownership Cost ($N$ Years)
$$\text{Total Ownership Cost} = \text{On-Road Purchase Price} + (\text{Annual Running Expense} \times N) + (\text{Annual Routine Service} \times N)$$

### 4. Break-Even Payback Period
$$\text{Break-Even Months} = \left(\frac{\text{On-Road Price Gap}}{\text{Net Annual Operational Savings}}\right) \times 12$$

---

## ⚠️ Important Disclaimers & Disclosures

1. **Sample Illustrative Data:** All vehicle specifications, ex-showroom and on-road prices, mileage, range, and maintenance rates are indicative models of Indian two-wheelers for demonstration and hackathon evaluation. They do not constitute verified live dealer quotations.
2. **Benchmark Rates:** Baseline fuel prices (₹102.0/L) and domestic residential power tariffs (₹8.0/kWh) are illustrative national benchmarks and can be adjusted interactively by users.
3. **Excluded Variables Disclosed:** Calculations include vehicle purchase price, energy/fuel running expenses, and routine periodic servicing. Calculations **exclude** multi-year insurance renewals, vehicle financing loan interest (EMI charges), state-level RTO registration fee variations, periodic tyre replacements, battery degradation replacements beyond warranty, and resale liquidation value.
4. **Neutrality Pledge:** SahiDrive does not default to electric vehicles. For users without charging access or low monthly travel, high-efficiency petrol two-wheelers are recommended as the economically and practically superior option.

---

## 📁 Project Directory Structure

```
SahiDrive/
├── backend/
│   ├── main.py                  # FastAPI application with REST endpoints
│   ├── models.py                # Pydantic data schemas
│   ├── calculator.py            # Mathematical calculation engine
│   ├── recommender.py           # Rule-based explainable recommendation engine
│   ├── test_backend.py          # Unit tests verifying calculations & rules
│   ├── requirements.txt         # Python dependencies
│   └── data/
│       ├── vehicles.json        # Centralized Indian two-wheeler specifications
│       └── assumptions.json     # Market benchmarks, factors, and disclosures
├── frontend/
│   ├── index.html               # Main HTML entry point
│   ├── vite.config.js           # Vite configuration with API proxy
│   ├── tailwind.config.js       # Modern Tailwind theme (navy, blue, emerald)
│   ├── postcss.config.js        # PostCSS configuration
│   ├── package.json             # Frontend dependencies
│   └── src/
│       ├── main.jsx             # React DOM root
│       ├── App.jsx              # Main router & state coordinator
│       ├── index.css            # Tailwind directives & CSS chart helpers
│       ├── api.js               # API service with resilient fallback handlers
│       ├── components/
│       │   ├── Navbar.jsx              # Brand header & active navigation
│       │   ├── Footer.jsx              # Hackathon footer & disclosures
│       │   ├── DisclaimerBanner.jsx    # Illustrative data notice banner
│       │   ├── MetricCard.jsx          # Reusable statistic cards
│       │   ├── CostBreakdownChart.jsx  # Native CSS stacked multi-year chart
│       │   ├── BreakEvenVisualizer.jsx # Payback crossover timeline visualizer
│       │   ├── ComparisonTable.jsx     # Side-by-side spec & pros/cons matrix
│       │   └── AssumptionsModal.jsx    # Methodology & disclosure modal
│       └── pages/
│           ├── HomePage.jsx            # Landing page with interactive preview
│           ├── ComparePage.jsx         # Head-to-head two-wheeler comparison
│           ├── CalculatorPage.jsx      # Running vs 5-year ownership calculator
│           └── RecommendPage.jsx       # Rule-based vehicle finder
├── run_backend.bat              # Windows batch script to launch backend
├── run_frontend.bat             # Windows batch script to launch frontend
├── .gitignore                   # Standard git exclusions
└── README.md                    # Project documentation
```

---

## 🚀 How to Run SahiDrive

### Prerequisites
- **Python 3.10+** (FastAPI, Uvicorn, Pydantic)
- **Node.js v18+ & npm**

### Method 1: One-Click Launchers (Windows)
1. Double-click `run_backend.bat` to launch the FastAPI server at `http://127.0.0.1:8000`.
2. Double-click `run_frontend.bat` to start the Vite development server at `http://localhost:5173`.
3. Open `http://localhost:5173` in your browser.

### Method 2: Manual Terminal Commands

#### Step 1: Start the Backend
Open a terminal in the project root:
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be available at `http://127.0.0.1:8000/docs`.

#### Step 2: Start the Frontend
Open a second terminal in the project root:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173`.

#### Step 3: Run Backend Verification Tests
```bash
python -m unittest backend/test_backend.py
```

---

## 🏆 Hackathon Highlights
- **100% Native Visualizations:** Zero charting or icon libraries loaded, maintaining ultra-lean bundle size and total styling control.
- **Real-World Indian Focus:** Tailored for domestic electricity slabs (₹8/kWh), petrol benchmarks (₹102/L), and urban charging constraints.
- **Explainable Decisions:** Every recommendation explains *why* a vehicle was selected and *what trade-offs* to consider.
- **Robust Engineering:** Clean separation of concerns with dual-layer calculation engines (FastAPI backend + resilient local fallback).
