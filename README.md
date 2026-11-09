# SahiDrive

**The right vehicle. The right cost. The right decision.**

SahiDrive is an intelligent mobility decision platform that helps Indian consumers choose between petrol and electric two-wheelers based on their budget, travel needs, running costs, and charging availability.

## Features

**1. Compare Vehicles**
- Compare petrol and electric two-wheelers.
- View prices, mileage, range, maintenance, and running costs.
- Understand long-term cost differences.

**2. Cost Calculator**
- Calculate daily, monthly, and annual running expenses.
- Estimate ownership costs over 1, 3, and 5 years.
- Compare petrol and electricity expenses.

**3. Find My Vehicle**
- Get personalised vehicle recommendations.
- Consider budget, daily distance, charging access, and preferences.
- Understand why a vehicle is recommended.

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router DOM
- **Backend:** Python, FastAPI
- **Data:** JSON

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### Run the Backend

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Backend: `http://127.0.0.1:8000`

API documentation: `http://127.0.0.1:8000/docs`

### Run the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## Data Disclaimer

Vehicle prices, specifications, fuel prices, electricity tariffs, and maintenance costs are illustrative estimates. Actual costs may vary depending on location, usage, and vehicle condition.

Calculations may exclude insurance, financing, depreciation, registration variations, battery replacement, and resale value.

## Future Scope

- Live fuel and electricity prices.
- Charging station locator.
- Verified vehicle database.
- Route-based cost estimation.
- Additional vehicle categories.

## Team

**OffScript**
