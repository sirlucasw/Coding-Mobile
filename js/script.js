function buscarCoordenadas(cidade) {
            const url = `https://nominatim.openstreetmap.org/search?city=${cidade}&format=json&limit=1`;

            return fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        return {
                            latitude: data[0].lat,
                            longitude: data[0].lon
                        };
                    } else {
                        throw new Error("Cidade não encontrada");
                    }
                });
        }

        function buscarClima() {
            const cidade = document.getElementById("cidade").value;

            buscarCoordenadas(cidade)
            .then(coord => {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${coord.latitude}&longitude=${coord.longitude}&current_weather=true`;
                return fetch(url);
            })
            .then(response => response.json())
            .then(data => {
                const clima = data.current_weather;

                document.getElementById("resultado").innerHTML =
                    `<div>📍 Cidade: ${cidade}</div>
                     <div>🌡️ Temperatura: ${clima.temperature}°C</div>
                     <div>💨 Vento: ${clima.windspeed} km/h</div>`;
            })
            .catch(error => {
                document.getElementById("resultado").innerHTML =
                    "❌ Erro: " + error.message;
            });
        }