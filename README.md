# Advanced Lightning Potential Calculator

This is a standalone HTML/JavaScript page that estimates lightning threat using basic skew-T–style parameters (temperature, dewpoint at various levels) or data fetched from a weather API. The tool returns an approximate “Lightning Factor” on a 1–5 scale, using simple formulas for the K-Index and an approximate Lifted Index.

> **Disclaimer:** This calculator is a simplified demonstration. Real-world lightning forecasting often requires more advanced meteorological data and calculations (e.g., full CAPE integration, multiple levels, shear). Use official weather forecasts and warnings for safety-critical decisions.

---

## Features

### Manual Input Mode
- Enter approximate temperature/dewpoint for surface, 850 hPa, 700 hPa, and 500 hPa levels.
- Click **“Calculate Lightning Potential (Manual)”** to get:
  - K-Index (simplified formula).
  - Lifted Index (LI) (rough estimate).
  - Lightning Factor (1–5).

### Mock Weather API Fetch
- Demonstrates how to retrieve data programmatically from an API or local model.
- Click **“Fetch Mock Data & Calculate”** to pull example data and perform the same calculation.
- In a real application, replace the mock function with a real weather service endpoint.

### Simple UI
- All code is contained in a single `.html` file. Just open it in your browser—no server needed.

---

## Getting Started

1. Clone or download this repository (or simply save the `.html` file).
2. Open `advanced-lightning-calculator.html` in any modern web browser.
3. Use one of the two modes:
   - **Manual Input**: Enter temperature/dewpoint values, click **Calculate Lightning Potential (Manual)**, and view the K-Index, Lifted Index, and final Lightning Factor.
   - **Fetch Mock API Data**: Click **Fetch Mock Data & Calculate** to see results driven by data from a fake API call.

---

## How It Works (Under the Hood)

### K-Index Calculation
**Formula:**
```
K = (T850 − T500) + (Td850) − (T700 − Td700)
```
This simplified version reflects temperature and moisture in the lower and mid-level atmosphere.

### Lifted Index (LI) Calculation
**Formula:**
```
LI = T500 − Tparcel,500
```
In this demo, `Tparcel,500` is estimated using a rough dry adiabatic approach, with a small dewpoint-based correction. Real computations require more detailed vertical integration.

### Lightning Factor (1–5)
- The script assigns “points” based on certain K-Index and LI thresholds, then clamps the total between 1 and 5.
- This is a demonstration—actual indices (like CAPE, LPI, or advanced microphysics) may be more accurate.

---

## Customizing & Extending

- **More Levels**: Add 925 hPa or 300 hPa lines to refine calculations.
- **Real CAPE**: Implement a full parcel-lift routine (integrating the temperature difference over each layer).
- **Wind/Shear**: Include wind speeds at various levels to factor in storm organization.
- **Real Data**: Modify `fetchMockForecastData()` to call a real API (e.g., NOAA, local meteorological services) that returns JSON with the needed temperature/dewpoint fields.

---

## Notes & Limitations

- This demo does not handle all atmospheric complexities (e.g., inversions, multiple moisture layers).
- The logic for converting indices to a 1–5 scale is arbitrary. Adjust thresholds to suit your region’s climate or personal experience.
- Always rely on official forecasts, bulletins, and severe weather warnings for final decisions.

---

## Contributing

1. Fork this repository.
2. Create a branch (e.g., `feature/cape-iteration`).
3. Commit and push your changes, then open a Pull Request.

### Ideas for Contributions

- Implement a more robust CAPE calculation.
- Integrate real API data from a known weather service.
- Enhance the user interface (e.g., graphs, charts, or interactive skew-T diagrams).

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Feel free to adapt or expand this README based on your project’s development.

