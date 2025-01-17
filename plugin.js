/* global windyInit, L */

/**
 * Thunderstorm Power Index (TPI) Plugin
 * Author: CropCrusaders
 * Version: 1.0.0
 */
(function () {
    const options = {
        // Unique key for your plugin
        key: 'plugin-thunderstorm-power-index',

        // Display name in the plugin list (if published on windy.com)
        name: 'Thunderstorm Power Index',

        // Plugin version
        version: '1.0.0',

        // Author / organization name
        author: 'CropCrusaders',

        // Brief description
        description: 'Draw a rectangle on the map and calculate TPI.'
    };

    // Initialize the plugin once Windy is ready
    windyInit(options, (windyAPI) => {
        const { map } = windyAPI;

        // Create plugin container
        const pluginContainer = L.DomUtil.create('div', 'plugin-container');
        pluginContainer.innerHTML = `
            <div class="plugin-header">
                <h3>TPI Calculator</h3>
                <p>Select an area to calculate TPI.</p>
            </div>
            <div class="plugin-controls">
                <button id="start-selection">Draw Box</button>
                <button id="calculate-tpi" disabled>Calculate TPI</button>
                <div id="tpi-result" style="margin-top: 10px;"></div>
            </div>
        `;

        // DOM references
        const startSelectionButton = pluginContainer.querySelector('#start-selection');
        const calculateTPIButton   = pluginContainer.querySelector('#calculate-tpi');
        const resultContainer      = pluginContainer.querySelector('#tpi-result');

        let selectedBounds = null;
        let drawnLayer     = null;

        // Add the container as a Leaflet control in the top-right corner
        const control = L.control({ position: 'topright' });
        control.onAdd = () => pluginContainer;
        control.addTo(map);

        // Prepare Leaflet Draw for rectangle selection
        const drawControl = new L.Draw.Rectangle(map, {
            shapeOptions: {
                color: '#3388ff',
                weight: 2
            }
        });

        // ---- Event Listeners ----

        // 1) Start drawing
        startSelectionButton.addEventListener('click', () => {
            // Remove previous rectangle if it exists
            if (drawnLayer) {
                map.removeLayer(drawnLayer);
                drawnLayer = null;
            }

            drawControl.enable();
            startSelectionButton.disabled = true;
            calculateTPIButton.disabled   = true;
            resultContainer.textContent   = '';
        });

        // 2) Once drawing is complete
        map.on(L.Draw.Event.CREATED, (e) => {
            drawnLayer = e.layer;
            selectedBounds = drawnLayer.getBounds();
            drawnLayer.addTo(map);

            startSelectionButton.disabled = false;
            calculateTPIButton.disabled   = false;
        });

        // 3) Calculate TPI
        calculateTPIButton.addEventListener('click', async () => {
            if (!selectedBounds) {
                resultContainer.textContent = 'No area selected.';
                return;
            }

            resultContainer.textContent = 'Calculating...';

            try {
                // Fetch or compute weather data for selected area
                const data = await fetchWeatherData(selectedBounds);

                // Calculate the TPI
                const tpi = calculateTPI(data);

                // Show the result
                resultContainer.innerHTML = `
                    <div><strong>Total TPI:</strong> ${tpi.value}</div>
                    <div><strong>Interpretation:</strong> ${tpi.interpretation}</div>
                    <hr/>
                    <small>(CAPE: ${data.cape}, Shear: ${data.shear}, Lightning: ${data.lightning}, Updraft: ${data.updraft}, Precip: ${data.precip})</small>
                `;
            } catch (err) {
                console.error(err);
                resultContainer.textContent = 'Error while calculating TPI. Please try again.';
            }
        });

        // ---- Helper Functions ----

        /**
         * fetchWeatherData(bounds)
         * In a real plugin, you would fetch or interpolate actual data from:
         * - windyAPI.store or windyAPI.interpolator
         * - an external weather API
         * For demonstration, we return static values.
         */
        async function fetchWeatherData(bounds) {
            // Example of how you might do sampling with windyAPI.interpolator:
            // const { lat: lat1, lng: lon1 } = bounds.getNorthWest();
            // const { lat: lat2, lng: lon2 } = bounds.getSouthEast();
            // ...
            // For now, just return mock data:
            return {
                cape: 3,
                shear: 3,
                lightning: 3,
                updraft: 3,
                precip: 3
            };
        }

        /**
         * calculateTPI({ cape, shear, lightning, updraft, precip })
         * Simple summation approach to TPI.
         */
        function calculateTPI(data) {
            const { cape, shear, lightning, updraft, precip } = data;
            const tpiValue = cape + shear + lightning + updraft + precip;

            let interpretation;
            if (tpiValue <= 10) {
                interpretation = 'Weak to Moderate Thunderstorm Potential';
            } else if (tpiValue <= 15) {
                interpretation = 'Strong Storm Potential (could be locally severe)';
            } else if (tpiValue <= 20) {
                interpretation = 'Severe Storm Potential (large hail, damaging winds, maybe tornadoes)';
            } else {
                interpretation = 'Extreme Storm Potential (significant severe threat)';
            }

            return { value: tpiValue, interpretation };
        }
    });
})();

