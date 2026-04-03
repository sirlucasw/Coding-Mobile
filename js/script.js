// =============================
// 🔎 BUSCA COORDENADAS DA CIDADE
// =============================
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

// =============================
// 🌆 BUSCA CLIMA POR NOME DA CIDADE
// =============================
function buscarClima() {
  const cidade = document.getElementById("cidade").value;

  buscarCoordenadas(cidade)
    .then(coord => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coord.latitude}&longitude=${coord.longitude}&current_weather=true`;
      return fetch(url);
    })
    .then(response => response.json())
    .then(data => {
      exibirResultado(data, cidade); // reaproveita função
    })
    .catch(error => {
      document.getElementById("resultado").innerHTML =
        "❌ Erro: " + error.message;
    });
}

// =============================
// 📍 USA LOCALIZAÇÃO DO USUÁRIO (GPS)
// =============================
function usarLocalizacao() {
  if (!navigator.geolocation) {
    alert("Geolocalização não é suportada.");
    return;
  }

  document.getElementById("resultado").innerText = "Obtendo localização...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      buscarClimaPorCoordenadas(lat, lon);
    },
    () => {
      alert("Permissão de localização negada.");
    }
  );
}

// =============================
// 🌍 BUSCA CLIMA POR COORDENADAS
// =============================
function buscarClimaPorCoordenadas(lat, lon) {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    .then(res => res.json())
    .then(data => {
      exibirResultado(data, "Sua localização");
    })
    .catch(() => {
      document.getElementById("resultado").innerHTML =
        "📡 Sem conexão com a internet.";
    });
}

// =============================
// 📊 EXIBE RESULTADO NA TELA
// =============================
function exibirResultado(data, local) {
  const clima = data.current_weather;
  document.getElementById("resultado").innerHTML = `
      <div>📍 Local: ${local}</div>
      <div>🌡️ Temperatura: ${clima.temperature}°C</div>
      <div>💨 Vento: ${clima.windspeed} km/h</div>
  `;
}


// =============================
// 🔘 EVENTO DO BOTÃO LOCALIZAÇÃO
// =============================
document.getElementById("btnLocalizacao")
  .addEventListener("click", usarLocalizacao);

// =============================
// ⚙️ REGISTRO DO SERVICE WORKER
// =============================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js")
    .then(() => console.log("Service Worker registrado"))
    .catch((error) => console.log("Erro no SW:", error));
}