    // تعریف نقشه
    const map = new ol.Map({
        target: 'map', // به کدام div در HTML متصل شود
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM() // استفاده از نقشه OpenStreetMap
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([51.3890, 35.6892]), // مرکز روی تهران
            zoom: 12
        })
    });

    console.log("Map initialized!");
