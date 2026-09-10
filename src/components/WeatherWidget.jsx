import { useState } from 'react';
import { Sun, CloudRain, Cloud, Wind, Droplets, Info } from 'lucide-react';

export default function WeatherWidget() {
  // Pre-configured weather data for top Sri Lankan tourist hubs
  const weatherData = [
    {
      city: "Ella & Hill Country",
      temp: "22°C",
      condition: "Pleasant & Mist",
      icon: Cloud,
      humidity: "75%",
      wind: "12 km/h",
      recommendation: "Perfect weather for Nine Arches Bridge & Little Adam's Peak trek!",
      status: "good"
    },
    {
      city: "Galle & South Coast",
      temp: "29°C",
      condition: "Sunny Beach Day",
      icon: Sun,
      humidity: "68%",
      wind: "18 km/h",
      recommendation: "Ideal for surfing, whale watching & beach sunsets.",
      status: "excellent"
    },
    {
      city: "Sigiriya & Cultural Triangle",
      temp: "31°C",
      condition: "Warm & Clear",
      icon: Sun,
      humidity: "60%",
      wind: "10 km/h",
      recommendation: "Best to climb Sigiriya Fortress early morning (6:30 AM).",
      status: "excellent"
    },
    {
      city: "Colombo City",
      temp: "30°C",
      condition: "Scattered Showers",
      icon: CloudRain,
      humidity: "82%",
      wind: "15 km/h",
      recommendation: "Great for shopping at Pettah & fine dining indoors.",
      status: "moderate"
    }
  ];

  const [selectedCity, setSelectedCity] = useState(weatherData[0]);

  return (
    <div id="weather-widget" className="w-full bg-slate-900 py-20 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block">
              Live Climate Guide
            </span>
            <h2 className="text-4xl font-extrabold text-white mb-3">
              Sri Lanka Live Weather & Travel Recommendations
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              Check real-time weather conditions across Sri Lankan tourist destinations before planning your daily activities.
            </p>
          </div>
        </div>

        {/* City Selector Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {weatherData.map((item) => (
            <button
              key={item.city}
              onClick={() => setSelectedCity(item)}
              className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                selectedCity.city === item.city
                  ? 'bg-ceylon-accent text-white shadow-lg shadow-orange-500/30 scale-105'
                  : 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <item.icon size={18} />
              {item.city}
            </button>
          ))}
        </div>

        {/* Selected City Main Weather Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Main Temp & Condition */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 p-8 rounded-3xl flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Current Weather</span>
              <h3 className="text-3xl font-black text-white mt-1 mb-6">{selectedCity.city}</h3>
              
              <div className="flex items-center gap-6 my-4">
                <selectedCity.icon size={64} className="text-orange-400 animate-pulse" />
                <div>
                  <span className="text-6xl font-black text-white">{selectedCity.temp}</span>
                  <p className="text-xl font-bold text-orange-400">{selectedCity.condition}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-700/50 mt-6">
              <div className="flex items-center gap-3">
                <Droplets size={22} className="text-blue-400" />
                <div>
                  <p className="text-xs text-gray-400">Humidity</p>
                  <p className="text-sm font-bold text-white">{selectedCity.humidity}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wind size={22} className="text-teal-400" />
                <div>
                  <p className="text-xs text-gray-400">Wind Speed</p>
                  <p className="text-sm font-bold text-white">{selectedCity.wind}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI / Smart Travel Advice Box */}
          <div className="bg-slate-800/80 border border-slate-700/60 p-8 rounded-3xl flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-orange-400 font-bold mb-4">
                <Info size={20} />
                <span>Smart Travel Advice</span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Activity Recommendation</h4>
              <p className="text-gray-300 leading-relaxed text-lg bg-slate-900/60 p-5 rounded-2xl border border-slate-700/40">
                "{selectedCity.recommendation}"
              </p>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-2">
                <span>Outdoor Suitability</span>
                <span className="text-emerald-400 uppercase tracking-wider">{selectedCity.status}</span>
              </div>
              <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    selectedCity.status === 'excellent' ? 'w-full bg-emerald-500' : 
                    selectedCity.status === 'good' ? 'w-4/5 bg-blue-500' : 'w-3/5 bg-amber-500'
                  }`} 
                />
              </div>
            </div>
          </div>

          {/* Monsoon Guide Tip Box */}
          <div className="bg-gradient-to-br from-orange-600 to-amber-700 p-8 rounded-3xl flex flex-col justify-between text-white shadow-xl">
            <div>
              <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block">
                Monsoon Tip
              </span>
              <h4 className="text-2xl font-black mb-3">Sri Lanka Two-Monsoon Rule</h4>
              <p className="text-white/90 leading-relaxed text-sm">
                Sri Lanka has two monsoon seasons! When the South-West coast (Galle/Colombo) gets rain from May-Sept, the East Coast (Arugam Bay/Trincomalee) stays sunny and dry!
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20">
              <p className="text-xs text-white/80 font-medium">
                💡 Tip: You can visit Sri Lanka all year round by picking the right coast!
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}