**## 🌐 Geocoding API Analysis \& Selection**



**In the development of this WebGIS project, a comparative analysis was conducted to select the most suitable Geocoding provider. The selection criteria were based on \*\*Free Tier Limits\*\*, \*\*Cost Scalability\*\*, and \*\*Rate Limiting\*\*.**



**### 📊 Comparative Table**



**| Feature | \*\*Google Maps Platform\*\* | \*\*Mapbox Geocoding\*\* | \*\*OpenCage / Nominatim\*\* |**

**| :--- | :--- | :--- | :--- |**

**| \*\*Data Source\*\* | Proprietary (Google) | Mixed (Proprietary + Open Data) | Open Data (OSM based) |**

**| \*\*Free Tier Limit\*\* | 40,000 req/month ($200 credit) | \*\*100,000 req/month\*\* | ~75,000 req/month (2,500/day) |**

**| \*\*Cost (per 1k req)\*\* | $5.00 | ~$0.75 | Free / Subscription |**

**| \*\*Rate Limits\*\* | High (Scalable) | 600 req/min | Strict (1 req/sec) |**

**| \*\*Auth Requirement\*\* | Credit Card Required | Token Required | No Token (Nominatim) / Token (OpenCage) |**



**### 💰 Price Ratio Analysis**

**Comparing the costs after exceeding the free tier:**

**- \*\*Google Maps vs. Mapbox:\*\* Google Maps is approximately \*\*6.6x more expensive\*\* than Mapbox per 1,000 requests.**

**- \*\*Nominatim vs. Others:\*\* While Nominatim provides infinite cost efficiency (Ratio $\\infty$), its \*\*1 request/second\*\* policy makes it unsuitable for high-concurrency production environments.**



**### ✅ Final Decision: Nominatim (with OpenCage fallback plan)**

**For the current \*\*Educational/Development phase\*\*, we selected \*\*Nominatim (OSM)\*\* because:**

**1.  \*\*Zero Cost:\*\* No credit card entry is required, eliminating the risk of accidental billing during debugging.**

**2.  \*\*Open Source Philosophy:\*\* Aligns with the project's use of OpenLayers and OpenStreetMap.**

**3.  \*\*Ease of Implementation:\*\* RESTful API without complex authentication headers for the base version.**



**\*\*Future Roadmap:\*\***

**If the project scales to a production environment with concurrent users, the Geocoding engine will be switched to \*\*Mapbox\*\* due to its generous free tier (100k requests) and lower scaling costs compared to Google.**



**## 🌦️ Weather Data Provider Analysis**



**Selecting the right Weather API involved evaluating trade-offs between \*\*Data Granularity\*\* (e.g., availability of AQI), \*\*Free Tier Quotas\*\*, and \*\*Ease of Integration\*\*.**



**### 📊 Comparative Table**



**| Feature | \*\*OpenWeatherMap (OWM)\*\* | \*\*WeatherAPI.com\*\* | \*\*Tomorrow.io\*\* |**

**| :--- | :--- | :--- | :--- |**

**| \*\*Focus\*\* | Developer Community / Education | High Volume / General Use | Hyper-local / Enterprise Intelligence |**

**| \*\*Free Tier Limit\*\* | 1,000 calls/day (One Call 3.0) | \*\*1,000,000 calls/month\*\* | 500 calls/day |**

**| \*\*Pollution Data\*\* | Included (Air Pollution API) | Included in Free Tier | Separate/Limited |**

**| \*\*Price Scalability\*\* | Linear Pay-as-you-go | Flat Subscription | High-Tier Subscription |**

**| \*\*JSON Structure\*\* | Simple \& Modular | Flat \& Verbose | Complex \& Nested |**



**### 💰 Price Efficiency Analysis**

**In a hypothetical production scenario (1.5M requests/month):**

**- \*\*WeatherAPI.com\*\* is the most cost-effective solution (approx. $4/month via Pro plan).**

**- \*\*OpenWeatherMap\*\* would cost significantly more (~$220/month) due to its per-call overage fees.**

**- \*\*Ratio:\*\* OWM is approx. \*\*55x more expensive\*\* than WeatherAPI for high-volume simple requests.**



**### ✅ Final Decision: OpenWeatherMap**

**Despite the higher potential cost at scale, \*\*OpenWeatherMap\*\* was selected for this \*\*WebGIS prototype\*\* because:**

**1.  \*\*Integrated Ecosystem:\*\* It provides both \*Current Weather\* and \*Air Pollution\* endpoints with a unified API Key structure, simplifying the JavaScript logic.**

**2.  \*\*Standardization:\*\* Its widespread use in the academic community ensures better documentation and community support for troubleshooting.**

**3.  \*\*Sufficient Quota:\*\* The 1,000 calls/day limit is more than sufficient for development and demonstration purposes.**



**> \*\*Note:\*\* For a commercial release, the backend would be migrated to \*\*WeatherAPI.com\*\* to leverage its generous 1M calls/month quota.**



