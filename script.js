/**
 * WebGIS Dashboard Main Script
 * Version: 4.0
 * Dependencies: OpenLayers v6+, OpenWeatherMap API, Nominatim API
 */

// ---------------------------------------------------------
// 1. CONFIGURATION & CONSTANTS
// ---------------------------------------------------------
// IMPORTANT: Replace with your actual API key before deployment, 
// but remove it before pushing to public GitHub if using a paid plan.
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY_HERE"; 

const VIEW_CONFIG = {
    center: ol.proj.fromLonLat([51.3890, 35.6892]), // Default: Tehran
    zoom: 12,
    maxZoom: 19,
    minZoom: 2
};

// ---------------------------------------------------------
// 2. DOM ELEMENTS
// ---------------------------------------------------------
const elements = {
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    temp: document.getElementById('temp-val'),
    desc: document.getElementById('weather-desc'),
    humidity: document.getElementById('humidity-val'),
    wind: document.getElementById('wind-speed'),
    aqiIndex: document.getElementById('aqi-index'),
    aqiText: document.getElementById('aqi-text'),
    pm25: document.getElementById('pm25-val'),
    co: document.getElementById('co-val'),
    lat: document.getElementById('lat-val'),
    lon: document.getElementById('lon-val')
};

// ---------------------------------------------------------
// 3. MAP INITIALIZATION
// ---------------------------------------------------------

// Create Vector Source and Layer for the Marker (Pin)
const markerSource = new ol.source.Vector();
const markerLayer = new ol.layer.Vector({
    source: markerSource,
    style: new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1], // Bottom center of the icon
            src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Red Pin Icon
            scale: 0.07
        })
    })
});

// Initialize Map
const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM() // OpenStreetMap Base Layer
        }),
        markerLayer
    ],
    view: new ol.View(VIEW_CONFIG)
});

// ---------------------------------------------------------
// 4. CORE FUNCTIONS
// ---------------------------------------------------------

/**
 * Updates the map marker position and animates the view.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
function updateMapLocation(lat, lon) {
    const coords = ol.proj.fromLonLat([lon, lat]);

    // Clear previous markers and add new one
    markerSource.clear();
    const marker = new ol.Feature({
        geometry: new ol.geom.Point(coords)
    });
    markerSource.addFeature(marker);

    // Smooth animation (FlyTo effect)
    map.getView().animate({
        center: coords,
        zoom: 13,
        duration: 1500 // 1.5 seconds
    });

    // Update coordinates in UI
    elements.lat.innerText = lat.toFixed(4);
    elements.lon.innerText = lon.toFixed(4);
}

/**
 * Fetches Weather and AQI data from OpenWeatherMap.
 * @param {number} lat 
 * @param {number} lon 
 */
async function fetchEnvironmentalData(lat, lon) {
    // UI Loading State
    elements.desc.innerText = "Loading data...";
    
    try {
        if (API_KEY === "YOUR_OPENWEATHERMAP_API_KEY_HERE") {
            throw new Error("API Key is missing! Please set your API Key in script.js");
        }

        // Parallel Fetching for performance
        const [weatherRes, aqiRes] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
            fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        ]);

        if (!weatherRes.ok || !aqiRes.ok) throw new Error("API Response Error (Check Limit or Key)");

        const weatherData = await weatherRes.json();
        const aqiData = await aqiRes.json();

        updateDashboardUI(weatherData, aqiData);

    } catch (error) {
        console.error("Data Fetch Error:", error);
        alert(error.message);
        elements.desc.innerText = "Error loading data.";
    }
}

/**
 * Updates the HTML elements with fetched data.
 */
function updateDashboardUI(weather, aqi) {
    // Update Weather
    elements.temp.innerText = Math.round(weather.main.temp);
    elements.desc.innerText = weather.weather[0].description;
    elements.humidity.innerText = weather.main.humidity;
    elements.wind.innerText = weather.wind.speed;

    // Update AQI
    const aqiVal = aqi.list[0].main.aqi; // 1 to 5
    const components = aqi.list[0].components;

    elements.aqiIndex.innerText = aqiVal;
    elements.pm25.innerText = components.pm2_5;
    elements.co.innerText = components.co;

    // Textual description of AQI
    const aqiLevels = {
        1: "Good",
        2: "Fair",
        3: "Moderate",
        4: "Poor",
        5: "Very Poor"
    };
    elements.aqiText.innerText = aqiLevels[aqiVal] || "Unknown";
    
    // Color coding for AQI
    elements.aqiText.style.color = (aqiVal >= 4) ? '#ff4d4d' : '#ffffff';
}

/**
 * Geocoding function: Converts City Name -> Coordinates
 */
async function searchLocation() {
    const query = elements.searchInput.value.trim();
    if (!query) return;

    try {
        // Using Nominatim (OpenStreetMap Geocoder)
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            updateMapLocation(lat, lon);
            fetchEnvironmentalData(lat, lon);
        } else {
            alert("Location not found! Please try another city.");
        }
    } catch (error) {
        console.error("Geocoding Error:", error);
        alert("Failed to search location.");
    }
}

// ---------------------------------------------------------
// 5. EVENT LISTENERS
// ---------------------------------------------------------

// Search Button Click
elements.searchBtn.addEventListener('click', searchLocation);

// Enter Key in Input
elements.searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchLocation();
    }
});

// Click on Map to get data
map.on('singleclick', function (evt) {
    const coords = ol.proj.toLonLat(evt.coordinate);
    const lon = coords[0];
    const lat = coords[1];

    updateMapLocation(lat, lon);
    fetchEnvironmentalData(lat, lon);
    
    // Reverse Geocoding (Optional: update input with clicked place name)
    // You can add logic here if needed, but keeping it simple for now.
    elements.searchInput.value = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
});

// Initial Load (Tehran Data)
window.addEventListener('load', () => {
    fetchEnvironmentalData(35.6892, 51.3890);
});
