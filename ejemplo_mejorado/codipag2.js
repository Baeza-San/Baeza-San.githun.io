const map = L.map('mapa_mio').setView([19.346041, -90.722276], 17);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Equipo de testeo'
    }).addTo(map);

    let lastMarker = null;
    let usuarioMarker = null;
    let rutaLayer = null;

    const destinoCoords = localStorage.getItem('destino');
    if (!destinoCoords) {
        alert("No hay destino seleccionado");
    }

    const destino = destinoCoords.split(",").map(Number);
    lastMarker = L.marker(destino).addTo(map)
        .bindPopup("Destino seleccionado")
        .openPopup();

    map.flyTo(destino, 17);

    // Obtener ubicación del usuario
    navigator.geolocation.getCurrentPosition(
        function (position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            const icono = L.icon({
                iconUrl: 'iconoxd.jpg',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });

            usuarioMarker = L.marker([userLat, userLon], { icon: icono }).addTo(map)
                .bindPopup("Tu ubicación")
                .openPopup();

            calcularRuta(userLat, userLon, destino[0], destino[1]);
        },
        function (error) {
            alert("No se pudo obtener tu ubicación");
        },
        {
            enableHighAccuracy: true,
            timeout: 150,
            maximumAge: 0
        }
    );

    function calcularRuta(userLat, userLon, destLat, destLon) {
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${userLon},${userLat};${destLon},${destLat}?overview=full&geometries=geojson`;

        fetch(osrmUrl)
            .then(response => response.json())
            .then(data => {
                if (!data.routes || data.routes.length === 0) {
                    alert("No se encontró una ruta");
                    return;
                }

                const ruta = data.routes[0];
                const coordenadasRuta = ruta.geometry.coordinates.map(c => [c[1], c[0]]);

                rutaLayer = L.polyline(coordenadasRuta, { color: 'blue', weight: 5 }).addTo(map);
                map.fitBounds(rutaLayer.getBounds());

                document.getElementById("info").innerText = `Distancia: ${(ruta.distance / 1000).toFixed(2)} km`;
            })
            .catch(error => {
                console.error("Error al calcular la ruta:", error);
            });
    }