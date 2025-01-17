// Windy plugin for Thunderstorm Power Index (TPI) calculation
// Requires Windy API to access weather data

(function () {
    const options = {
        key: 'plugin-key', // Unique plugin key
        name: 'Thunderstorm Power Index Calculator',
        version: '1.0.0',
        author: 'CropCrusaders',
        description: 'Calculate and rate thunderstorms using CAPE, Shear, Lightning, Updraft, and Precipitation factors.',
    };

    windyInit(options, (windyAPI) => {
        const { map } = windyAPI;

        // Create the plugin UI
        const pluginContainer = L.DomUtil.create('div', 'plugin-container');
        pluginContainer.innerHTML = `
            <div class="plugin-header">
                <h3>Thunderstorm Power Index (TPI)</h3>
                <p>Select an area and calculate TPI</p>
            </div>
            <div class="plugin-controls">
                <button id="start-selection">Draw Box</button>
                <button id="calculate-tpi" disabled>Calculate TPI</button>
                <div id="tpi-result"></div>
            </div>
        `;

        const startSelectionButton = pluginContainer.querySelector('#start-selection');
        const calculateTPIButton = pluginContainer.querySelector('#calculate-tpi');
        const resultContainer = pluginContainer.querySelector('#tpi-result');

        let selectedBounds = null;

        // Add plugin UI to the map
        const control = L.control({ position: 'topright' });
        control.onAdd = () => pluginContainer;
        control.addTo(map);

        // Initialize drawing tool
        const drawControl = new L.Draw.Rectangle(map, {
            shapeOptions: {
                color: '#3388ff',
                weight: 2
            }
        });

        // Event: Start drawing
        startSelectionButton.addEventListener('click', () => {
            drawControl.enable();
            startSelectionButton.disabled = true;
            calculateTPIButton.disabled = true;
        });

        // Event: Rectangle created
        map.on(L.Draw.Event.CREATED, (e) => {
            selectedBounds = e.layer.getBounds();
            e.layer.addTo(map);
            startSelectionButton.disabled = false;
            calculateTPIButton.disabled = false;
        });

        // Fetch data and calculate TPI
        calculateTPIButton.addEventListener('click', async () => {
            if (!selectedBounds) {
                resultContainer.textContent = 'Please select an area first.';
                return;
            }

            resultContainer.textContent = 'Calculating...';

            try {
                const data = await fetchWeatherData(selectedBounds);
                const tpi = calculateTPI(data);

                resultContainer.innerHTML = `
                    <h4>TPI Result</h4>
                    <p>Total TPI: ${tpi.value}</p>
                    <p>Interpretation: ${tpi.interpretation}</p>
                `;
            } catch (error) {
                resultContainer.textContent = 'Error calculating TPI. Please try again.';
            }
        });

        // Fetch weather data for selected area (mock function)
        async function fetchWeatherData(bounds) {
            // Mocked data for demonstration
            return {
                cape: 3,
                shear: 3,
                lightning: 3,
                updraft: 3,
                precip: 3
            };
        }

        // Calculate TPI based on data
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
