// 1. تنظیمات اولیه و کلید API
// نکته: کلید API خود را در خط زیر جایگزین کنید
const API_KEY = 'be816743cf6146cf83d0097c69592e06'; 

// تعریف نقشه در فضای سراسری
let map;

// اجرای کد پس از بارگذاری کامل صفحه
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupEventListeners();
});

// 2. تابع راه‌اندازی نقشه
function initMap() {
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([51.3890, 35.6892]), // تهران
            zoom: 12
        })
    });

    // رویداد کلیک روی نقشه
    map.on('click', function (evt) {
        const coords = ol.proj.toLonLat(evt.coordinate);
        const lon = coords[0];
        const lat = coords[1];

        fetchWeatherData(lat, lon);
    });
}

// 3. تنظیم رویدادهای ورودی
function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    
    searchInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchLocation();
        }
    });
}

// 4. تابع جستجوی مکان
function searchLocation() {
    const query = document.getElementById('search-input').value;
    if (!query) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);

                map.getView().animate({
                    center: ol.proj.fromLonLat([lon, lat]),
                    zoom: 14,
                    duration: 1000
                });
                
                fetchWeatherData(lat, lon);
            } else {
                alert('Location not found!');
            }
        })
        .catch(error => {
            console.error('Error finding location:', error);
            alert('Error searching for location.');
        });
}

// 5. تابع اصلی دریافت داده‌ها (اصلاح شده برای نمایش مختصات)
function fetchWeatherData(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    const infoBox = document.getElementById('weather-info');
    
    infoBox.classList.add('active');
    infoBox.innerHTML = '<div style="text-align:center;">Loading Data...</div>';

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) throw new Error("Weather API Error");
            return response.json();
        })
        .then(weatherData => {
            const temp = weatherData.main.temp;
            const humidity = weatherData.main.humidity;
            const cityName = weatherData.name || "Unknown Location";
            const weatherDesc = weatherData.weather[0].description;

            return fetch(pollutionUrl)
                .then(res => res.json())
                .then(pollutionData => {
                    const aqi = pollutionData.list[0].main.aqi;
                    const pm25 = pollutionData.list[0].components.pm2_5;
                    const co = pollutionData.list[0].components.co;

                    // بخش HTML اصلاح شده: اضافه شدن مختصات
                    infoBox.innerHTML = `
                        <h3>${cityName}</h3>
                        <p style="font-size: 13px; color: #666; margin-bottom: 10px;">
                           📍 <strong>Lat:</strong> ${lat.toFixed(4)}, <strong>Lon:</strong> ${lon.toFixed(4)}
                        </p>
                        <p style="text-transform: capitalize;">☁️ <strong>Status:</strong> ${weatherDesc}</p>
                        <p>🌡️ <strong>Temp:</strong> ${temp} °C</p>
                        <p>💧 <strong>Humidity:</strong> ${humidity}%</p>
                        <hr style="margin: 10px 0; border: 0; border-top: 1px solid #ddd;">
                        <h4>Air Quality Metrics</h4>
                        <p>🏭 <strong>AQI Index:</strong> ${aqi} <small>(Scale 1-5)</small></p>
                        <p>🌫️ <strong>PM2.5:</strong> ${pm25} μg/m³</p>
                        <p>🚗 <strong>CO:</strong> ${co} μg/m³</p>
                    `;
                });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            infoBox.innerHTML = `
                <h3>Error</h3>
                <p style="color:red;">Failed to load data.</p>
            `;
        });
}


