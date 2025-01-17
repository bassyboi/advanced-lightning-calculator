# Windy Plugin - Thunderstorm Power Index (TPI)

This repository contains a Windy plugin that allows users to draw a bounding box on the map and compute a simple **Thunderstorm Power Index (TPI)** based on several weather parameters (e.g., CAPE, wind shear, lightning potential, updraft, precipitation).

## Features

- **Draw a rectangle** on the map (using [Leaflet.Draw](https://github.com/Leaflet/Leaflet.draw)).
- **Fetch or mock weather data** within the selected rectangle.
- **Calculate** a TPI value and provide an **interpretation** of the thunderstorm severity.

## Getting Started

1. **Clone** the repo:

   ```bash
   git clone https://github.com/yourname/windy-plugin-thunderstorm-power-index.git
   cd windy-plugin-thunderstorm-power-index
