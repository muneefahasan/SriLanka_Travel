
import { useEffect, useState } from 'react';
import {
  Sun, Cloud, CloudSun, CloudRain, CloudDrizzle,
  CloudFog, CloudLightning, Wind, Droplets,
  Info, RefreshCw, MapPin, ThermometerSun
} from 'lucide-react';
import SplitHeading from './SplitHeading';

const destinations = [
  { city: 'Colombo City', lat: 6.9271, lon: 79.8612, tip: 'Explore museums, shopping areas and indoor attractions.' },
  { city: 'Kandy Sacred Capital', lat: 7.2906, lon: 80.6337, tip: 'Explore the Temple of the Tooth and Kandy Lake.' },
  { city: 'Galle & South Coast', lat: 6.0535, lon: 80.2210, tip: 'Explore Galle Fort and the beautiful southern coastline.' },
  { city: 'Jaffna Peninsula', lat: 9.6615, lon: 80.0255, tip: 'Discover Jaffna Fort, Nallur Kovil and local culture.' },
  { city: 'Trincomalee Coast', lat: 8.5874, lon: 81.2152, tip: 'Explore the coastline and Pigeon Island area.' },
  { city: 'Nuwara Eliya Highlands', lat: 6.9497, lon: 80.7891, tip: 'Visit tea plantations and Gregory Lake. Bring warm clothing.' },
  { city: 'Ella & Hill Country', lat: 6.8667, lon: 81.0466, tip: 'Explore Nine Arches Bridge and Little Adam’s Peak.' },
  { city: 'Sigiriya & Citadel', lat: 7.9570, lon: 80.7603, tip: 'Plan your Sigiriya visit during cooler morning hours.' },
  { city: 'Anuradhapura', lat: 8.3114, lon: 80.4037, tip: 'Explore the ancient city and its historic Buddhist sites.' },
  { city: 'Polonnaruwa', lat: 7.9403, lon: 81.0188, tip: 'Discover the ancient ruins and archaeological sites.' },
  { city: 'Dambulla', lat: 7.8567, lon: 80.6492, tip: 'Visit the Dambulla Cave Temple and nearby attractions.' },
  { city: 'Bentota Lagoon', lat: 6.4210, lon: 79.9950, tip: 'Explore the lagoon and nearby coastal attractions.' },
  { city: 'Mirissa Palm Beach', lat: 5.9483, lon: 80.4716, tip: 'Enjoy the coastline and Coconut Tree Hill.' },
  { city: 'Unawatuna', lat: 6.0100, lon: 80.2490, tip: 'Explore Unawatuna Beach and the surrounding area.' },
  { city: 'Arugam Bay', lat: 6.8400, lon: 81.8360, tip: 'Explore the bay and its well-known surfing areas.' },
  { city: 'Hikkaduwa', lat: 6.1395, lon: 80.1000, tip: 'Discover the beach and marine conservation areas.' },
  { city: 'Yala National Park', lat: 6.3728, lon: 81.5185, tip: 'Check park conditions before planning a wildlife visit.' },
  { city: 'Horton Plains', lat: 6.8020, lon: 80.8000, tip: 'Check weather conditions before visiting the highland trails.' },
  { city: 'Kitulgala', lat: 6.9890, lon: 80.4140, tip: 'Check local weather and river conditions before outdoor activities.' },
  { city: 'Negombo', lat: 7.2083, lon: 79.8358, tip: 'Explore the lagoon, fishing village and coastal attractions.' },
  { city: 'Kalpitiya', lat: 8.2330, lon: 79.7660, tip: 'Check coastal weather before planning water activities.' },
  { city: 'Pasikuda', lat: 7.9230, lon: 81.5660, tip: 'Enjoy the eastern coastline and beach surroundings.' },
  { city: 'Adam’s Peak', lat: 6.8096, lon: 80.4994, tip: 'Check mountain weather before planning your visit.' },
  { city: 'Mannar', lat: 8.9810, lon: 79.9044, tip: 'Explore Mannar Fort and the surrounding coastal landscape.' },
  { city: 'Ratnapura', lat: 6.6828, lon: 80.3992, tip: 'Explore the gem city and nearby nature attractions.' }
];

function getWeatherInfo(code) {
  if (code === 0) return { label: 'Clear Sky', icon: Sun };
  if (code === 1) return { label: 'Mainly Clear', icon: Sun };
  if (code === 2) return { label: 'Partly Cloudy', icon: CloudSun };
  if (code === 3) return { label: 'Overcast', icon: Cloud };
  if ([45, 48].includes(code)) return { label: 'Foggy', icon: CloudFog };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Drizzle', icon: CloudDrizzle };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { label: 'Rain', icon: CloudRain };
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { label: 'Snow', icon: Cloud };
  }
  if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', icon: CloudLightning };
  return { label: 'Unknown', icon: Cloud };
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-LK', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Colombo'
  }).format(new Date(`${date}T12:00:00`));
}

export default function WeatherWidget() {
  const [selectedCity, setSelectedCity] = useState(destinations[0]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      setLoading(true);
      setError('');
      setWeather(null);

      try {
        const params = new URLSearchParams({
          latitude: selectedCity.lat,
          longitude: selectedCity.lon,
          current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'weather_code',
            'wind_speed_10m',
            'precipitation'
          ].join(','),
          daily: [
            'weather_code',
            'temperature_2m_max',
            'temperature_2m_min',
            'precipitation_probability_max',
            'wind_speed_10m_max'
          ].join(','),
          timezone: 'Asia/Colombo',
          forecast_days: '7',
          temperature_unit: 'celsius',
          wind_speed_unit: 'kmh'
        });

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Weather service returned error (${response.status}).`);
        }

        const data = await response.json();

        if (!data.current || !data.daily) {
          throw new Error('Weather data is currently unavailable.');
        }

        setWeather(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Weather API error:', err);
          setError(err.message || 'Unable to load weather information.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchWeather();

    return () => controller.abort();
  }, [selectedCity, retryCount]);

  const current = weather?.current;
  const currentInfo = current ? getWeatherInfo(current.weather_code) : null;
  const CurrentIcon = currentInfo?.icon || Cloud;

  return (
    <section
      id="weather-widget"
      className="w-full bg-slate-950 py-20 px-6 text-white border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <SplitHeading
            as="h2"
            className="text-4xl md:text-5xl font-editorial font-extrabold text-white mb-3"
          >
            Sri Lanka Live Weather & 7-Day Forecast
          </SplitHeading>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl">
            Check current weather conditions and the next seven days of
            forecasts across Sri Lankan tourist destinations.
          </p>
        </div>

        <div className="max-w-md mb-8">
          <label
            htmlFor="weather-city"
            className="block text-xs font-extrabold text-emerald-400 uppercase mb-2 tracking-wider"
          >
            Select Destination ({destinations.length} locations)
          </label>

          <select
            id="weather-city"
            value={selectedCity.city}
            onChange={(e) => {
              const found = destinations.find(
                (item) => item.city === e.target.value
              );
              if (found) setSelectedCity(found);
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3.5 text-base font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {destinations.map((item) => (
              <option key={item.city} value={item.city}>
                📍 {item.city}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
            <RefreshCw className="animate-spin text-emerald-400 mx-auto mb-4" size={32} />
            <p className="text-slate-300 font-semibold">
              Loading weather for {selectedCity.city}...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-slate-900 border border-red-800 rounded-3xl p-8 text-center">
            <CloudRain size={40} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Weather unavailable</h3>
            <p className="text-slate-400 mb-5">{error}</p>
            <button
              onClick={() => setRetryCount((count) => count + 1)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl"
            >
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        )}

        {!loading && !error && weather && current && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between shadow-2xl">
                <div>
                  <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest">
                    Current Weather
                  </span>

                  <h3 className="text-2xl md:text-3xl font-extrabold mt-2 mb-6">
                    {selectedCity.city}
                  </h3>

                  <div className="flex items-center gap-5 my-4">
                    <CurrentIcon size={60} className="text-emerald-400" />
                    <div>
                      <span className="text-5xl md:text-6xl font-extrabold">
                        {Math.round(current.temperature_2m)}°C
                      </span>
                      <p className="text-slate-300 font-bold text-sm mt-1">
                        {currentInfo.label}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 text-sm text-slate-400">
                    Feels like {Math.round(current.apparent_temperature)}°C
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Droplets size={18} className="text-emerald-400" />
                    <span>{current.relative_humidity_2m}% humidity</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Wind size={18} className="text-emerald-400" />
                    <span>{current.wind_speed_10m} km/h</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CloudRain size={18} className="text-emerald-400" />
                    <span>{current.precipitation} mm rain</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <ThermometerSun size={18} className="text-emerald-400" />
                    <span>Feels {Math.round(current.apparent_temperature)}°C</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <h3 className="text-2xl font-extrabold">
                    7-Day Weather Forecast
                  </h3>
                  <span className="text-xs text-emerald-400 font-bold">
                    <MapPin size={13} className="inline mr-1" />
                    {selectedCity.city}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {weather.daily.time.map((date, index) => {
                    const info = getWeatherInfo(weather.daily.weather_code[index]);
                    const ForecastIcon = info.icon;

                    return (
                      <div
                        key={date}
                        className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center"
                      >
                        <p className="text-xs text-slate-400 font-bold mb-3">
                          {index === 0 ? 'Today' : formatDate(date)}
                        </p>

                        <ForecastIcon
                          size={32}
                          className="text-emerald-400 mx-auto mb-2"
                        />

                        <p className="text-xs text-slate-300 mb-3">
                          {info.label}
                        </p>

                        <div className="flex justify-center gap-2 text-sm font-bold">
                          <span>{Math.round(weather.daily.temperature_2m_max[index])}°</span>
                          <span className="text-slate-500">
                            {Math.round(weather.daily.temperature_2m_min[index])}°
                          </span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-2">
                          <p>
                            <Droplets size={13} className="inline mr-1 text-sky-400" />
                            {weather.daily.precipitation_probability_max[index] ?? '—'}% rain
                          </p>
                          <p>
                            <Wind size={13} className="inline mr-1 text-emerald-400" />
                            {Math.round(weather.daily.wind_speed_10m_max[index])} km/h
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 bg-slate-900 border border-slate-800 p-7 md:p-8 rounded-3xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-extrabold px-3 py-2 rounded-full border border-emerald-500/30">
                  Travel Recommendation
                </span>
                <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
                  <Info size={14} className="text-emerald-400" />
                  Based on destination
                </span>
              </div>

              <h4 className="text-2xl font-extrabold mb-3">
                Tourist Tip for {selectedCity.city}
              </h4>

              <p className="text-slate-200 leading-relaxed bg-slate-950 p-5 rounded-2xl border border-slate-800">
                {selectedCity.tip}
              </p>

              <p className="text-xs text-slate-500 mt-5">
                Weather data: Open-Meteo · Local timezone: Sri Lanka (Asia/Colombo)
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
