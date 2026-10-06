# SkyTracker 🌦️

Aplicación web de consulta del tiempo que usa la API de [OpenWeatherMap](https://openweathermap.org/api). Busca una ciudad y obtén su temperatura, descripción del clima y un gráfico de temperatura y humedad para las próximas 48 horas.

## Características

- 🔎 Búsqueda del clima por nombre de ciudad (resultados en español y en °C).
- 🌡️ Vista de temperatura actual con el icono del clima.
- 📈 Gráfico por horas (próximas 48 h) de temperatura y humedad, hecho con Chart.js.
- ⭐ Sistema de favoritos guardado en `localStorage`: añade o quita ciudades y consúltalas desde el menú.
- 🌙 Modo oscuro / claro.
- 🌧️ Fondo animado de lluvia.
- ⚠️ Gestión de errores (ciudad no encontrada, fallo de la API, campo vacío).

## Tecnologías

- HTML5, CSS3 y JavaScript
- [jQuery 3.7.1](https://jquery.com/)
- [Chart.js](https://www.chartjs.org/)
- [OpenWeatherMap API](https://openweathermap.org/forecast5) (endpoint `data/2.5/forecast`)

## Estructura del proyecto

```
.
├── index.html     # Estructura de la página
├── style.css      # Estilos (incluye modo oscuro y animación de lluvia)
├── server.js      # Servidor local mínimo (sirve también el .env)
├── .env.example   # Plantilla de la API key (copiar a .env, ignorado por git)
├── .gitignore     # Excluye el .env del repositorio
└── js/
    └── script.js  # Lógica: API, favoritos, gráfico y tema
```

## Puesta en marcha

No requiere instalación de dependencias ni compilación, solo [Node.js](https://nodejs.org/) para el servidor local.

1. Clona el repositorio:
   ```bash
   git clone https://github.com/juanrodgarrido/OpenWeather.git
   cd OpenWeather
   ```
2. Consigue una API key gratuita en [openweathermap.org](https://home.openweathermap.org/api_keys).
3. Copia `.env.example` a `.env` y pon tu clave:
   ```
   API_KEY=TU_API_KEY
   ```
4. Arranca el servidor local incluido (necesita Node.js; el `.env` se lee con `fetch`, así que no funciona abriendo `index.html` directamente ni con servidores que ignoran archivos ocultos, como `live-server` o la extensión Live Preview de VS Code):
   ```bash
   node server.js
   # y visita http://localhost:8000
   ```

> **Nota de seguridad:** al ser una aplicación 100 % cliente, la API key queda visible para cualquiera que abra la página. No subas claves personales a repositorios públicos; usa una clave dedicada y revócala si se expone.

## Uso

1. Escribe el nombre de una ciudad y pulsa **Buscar** (o Enter).
2. Pulsa **Ver gráfico por horas** para alternar entre la temperatura actual y el gráfico.
3. Pulsa la estrella ☆ junto al nombre de la ciudad para guardarla en favoritos.
4. Abre el menú de favoritos (⭐ arriba a la derecha) y haz clic en una ciudad para consultarla de nuevo.
5. Usa el botón de la luna/sol para cambiar entre modo oscuro y claro.

## Créditos

Datos meteorológicos proporcionados por [OpenWeatherMap](https://openweathermap.org/).
