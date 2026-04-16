function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
}

function updateFavButton(currentCity) {

  if (!currentCity) return;

  
  $("#favBtn").removeClass("active").text("☆");

  const favs = getFavorites();

  if (favs.includes(currentCity)) {
    $("#favBtn").addClass("active").text("★");
  }
}

$("#favoritesToggle").on("click", function (e) {
   e.stopPropagation();

  $("#favoritesMenu").toggle();
  
  
});

function renderFavorites() {
  const favs = getFavorites();
  const $list = $("#favoritesList");
  $list.empty();

  if (favs.length === 0) {
    $list.append("<li>No hay favoritos</li>");
    return;
  }

  favs.forEach(city => {
    $list.append(`<li class="fav-item">${city}</li>`);
  });
}

$(document).on("click", function (e) { //Funcion para que el menú se cierre desde cualquier click
  const $menu = $("#favoritesMenu");
  const $btn = $("#favoritesToggle");

  
  if (
    !$menu.is(e.target) &&
    $menu.has(e.target).length === 0 &&
    !$btn.is(e.target)
  ) {
    $menu.hide();
  }
});

// Función que genera la lluvia
function createRain() {
  const rainBg = document.querySelector(".rain-bg");
  if (!rainBg) return;
  rainBg.innerHTML = ""; //Vacío el div por si acaso
  for (let i = 0; i < 55; i++) {
    //Creo un bucle con 55 gotas
    const drop = document.createElement("div");
    drop.className = "raindrop";
    drop.style.left = Math.random() * 100 + "vw"; //Para cambiar la posición de cada gota
    drop.style.animationDelay = Math.random() * 0.9 + "s"; //Con esto hago que las 55 gotas no caigan a la vez
    drop.style.height = 16 + Math.random() * 16 + "px";
    drop.style.opacity = 0.92 + Math.random() * 0.18;
    drop.style.width = 1.7 + Math.random() * 1.2 + "px";
    drop.style.background =
      "linear-gradient(to bottom, rgba(80,120,255,0.45) 60%, rgba(80,120,255,0.18) 100%)";
    drop.style.animationDuration = 0.9 + Math.random() * 0.7 + "s";
    rainBg.appendChild(drop);
  }
}
createRain();

// Función para mostrar mensajes de error en diferentes puntos de la ejecución
function showError(msg) {
  $(".error-message").text(msg).show();
}
// Modo noche
$("#toggleTheme").on("click", function () {
  $("body").toggleClass("dark-mode");
  const isDark = $("body").hasClass("dark-mode");
  const $icon = $("#themeIcon");
  if (isDark) {    
    $icon.html(
      '<circle cx="12" cy="12" r="5" fill="#f7fafd"/><g stroke="#f7fafd" stroke-width="2"><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></g>',
    );
  } else {    
    $icon.html(
      '<path d="M21 12.79A9 9 0 0112.79 3a7 7 0 100 14 9 9 0 008.21-4.21z" fill="#232b3b"/>',
    );
  }
});
$(document).ready(function () {
  const API_KEY = "5a5198eed4bf92a4f862270330b61173";


  renderFavorites();


  $("#searchForm").on("submit", function (e) {
    e.preventDefault();
    
    const city = $("#cityInput").val().trim();
    $(".weather-result").hide();
    $(".error-message").hide();
    if (!API_KEY) {
      $(".api-warning").show();
      return;
    } else {
      $(".api-warning").hide();
    }
    if (city === "") {
      showError("Por favor, escribe el nombre de una ciudad.");
      return;
    }
    getWeather(city);
    updateFavButton();
  });

  let weatherChart = null;
  let lastForecastData = null;
  function getWeather(city) {
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast`,
      method: "GET",
      data: {
        q: city,
        appid: API_KEY,
        units: "metric",
        lang: "es",
      },
      success: function (data) {
        lastForecastData = data;
        showWeather(data, false);
      },
      error: function (xhr) {
        $(".weather-result").hide();
        if (xhr.status === 404) {
          showError("Ciudad no encontrada. Intenta con otro nombre.");
        } else {
          showError("Error al obtener datos del clima.");
        }
      },
    });
  }

  let currentCity = "";


  $(document).on("click", "#favBtn", function () {
  if (!currentCity) return;

  let favs = getFavorites();

  if (favs.includes(currentCity)) {
    favs = favs.filter(c => c !== currentCity);
    $(this).removeClass("active").text("☆");
  } else {
    favs.push(currentCity);
    $(this).addClass("active").text("★");
  }

 
  saveFavorites(favs);
  renderFavorites(); 
  
});

$(document).on("click", ".fav-item", function () {
  const city = $(this).text();
  $("#cityInput").val(city);
  getWeather(city);
  $("#favoritesMenu").hide();
});


  function showWeather(data, showGraph) {
    // Mostrar ciudad y país
    $("#weatherCity").text(`${data.city.name}, ${data.city.country}`);

    // Aquí ponemos la primera letra de la descripcion en mayúscula
    let desc = data.list[0].weather[0].description;
    desc = desc.charAt(0).toUpperCase() + desc.slice(1);
    $("#weatherDesc").text(desc);
    // Mostrar icono del primer pronóstico
    const iconCode = data.list[0].weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    $("#weatherIcon").attr("src", iconUrl);

    currentCity = `${data.city.name}, ${data.city.country}`;
    
    

    if (!showGraph) {
      // Mostrar solo temperatura actual
      $("#weatherTemp").text(`${Math.round(data.list[0].main.temp)}°C`);
      $("#weatherTemp").show();
      $("#toggleGraph").text("Ver gráfico por horas");
      $("#weatherChart").hide();
    } else {
      // Preparar datos para el gráfico (próximas 48h)
      const labels = [];
      const temps = [];
      const hums = [];
      for (let i = 0; i < 16; i++) {
        // 16 x 3h = 48h
        const item = data.list[i];
        const fecha = new Date(item.dt * 1000);
        const hora =
          fecha.getHours().toString().padStart(2, "0") +
          ":00\n" +
          fecha.getDate() +
          "/" +
          (fecha.getMonth() + 1);
        labels.push(hora); //Posteriormente utilizaré esto para marcas las franjas del gráfico de ChartJS
        temps.push(item.main.temp);
        hums.push(item.main.humidity);
      }
      // Destruir gráfico anterior si existe
      if (weatherChart) {
        weatherChart.destroy();
      }
      // Creamos el gráfico con ChartJS
      const ctx = document.getElementById("weatherChart").getContext("2d");
      weatherChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            //Aquí creo los datos a utilizar (en este caso la temperatura y la humedad)
            {
              label: "Temperatura (°C)",
              data: temps,
              borderColor: "#2a7ecb",
              backgroundColor: "rgba(42,126,203,0.10)",
              pointBackgroundColor: "#2a7ecb",
              pointRadius: 4,
              fill: true,
              tension: 0.3,
              yAxisID: "y",
            },
            {
              label: "Humedad (%)",
              data: hums,
              borderColor: "#4bc0c0",
              backgroundColor: "rgba(75,192,192,0.10)",
              pointBackgroundColor: "#4bc0c0",
              pointRadius: 4,
              fill: false,
              tension: 0.3,
              yAxisID: "y1",
              type: "line",
              borderDash: [6, 4], //Hago que la humedad tenga un borde dotted en vez de lineal
            },
          ],
        },
        options: {
          responsive: false,
          plugins: {
            legend: { display: true },
            tooltip: { enabled: true }, //Gracias a esto al pasar el ratón por encima de un punto se muestra información del gráfico
          },
          scales: {
            x: {
              title: { display: true, text: "Hora y día" },
              grid: { display: false },
            },
            y: {
              title: { display: true, text: "Temperatura (°C)" },
              grid: { color: "#e3ecf7" },
              beginAtZero: false,
              position: "left",
            },
            y1: {
              title: { display: true, text: "Humedad (%)" },
              grid: { drawOnChartArea: false },
              beginAtZero: true,
              position: "right",
              min: 0,
              max: 100,
            },
          },
        },
      });
      $("#weatherTemp").hide();
      $("#toggleGraph").text("Ver temperatura actual");
      $("#weatherChart").show();
    }
    
    $(".weather-result").show();
    $(".error-message").hide();
    updateFavButton(currentCity);
    
  }
  // Alternar entre vista de temperatura y gráfico
  $(document).on("click", "#toggleGraph", function () {
    if (!lastForecastData) return;
    const isGraph = $("#weatherChart").is(":visible");
    showWeather(lastForecastData, !isGraph);
  });
});
