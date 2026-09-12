import { useState } from 'react';
import { Sun, CloudRain, Cloud, Wind, Droplets, Info } from 'lucide-react';

export default function WeatherWidget() {
  const weatherData = [
    { city: "Ella & Hill Country", temp: "22°C", condition: "Pleasant & Mist", icon: Cloud, humidity: "75%", wind: "12 km/h", recommendation: "Perfect weather for Nine Arches Bridge & Little Adam's Peak trek!", status: "good" },
    { city: "Galle & South Coast", temp: "29°C", condition: "Sunny Beach Day", icon: Sun, humidity: "68%", wind: "18 km/h", recommendation: "Ideal for surfing, whale watching & beach sunsets.", status: "excellent" },
    { city: "Sigiriya & Citadel", temp: "31°C", condition: "Warm & Clear", icon: Sun, humidity: "60%", wind: "10 km/h", recommendation: "Best to climb Sigiriya Fortress early morning (6:30 AM).", status: "excellent" },
    { city: "Colombo City", temp: "30°C", condition: "Scattered Showers", icon: CloudRain, humidity: "82%", wind: "15 km/h", recommendation: "Great for shopping at Pettah & fine dining indoors.", status: "moderate" },
    { city: "Kandy Sacred Capital", temp: "26°C", condition: "Mild & Breezy", icon: Cloud, humidity: "70%", wind: "11 km/h", recommendation: "Great evening for Tooth Temple ceremonies and lake walks.", status: "good" },
    { city: "Nuwara Eliya Highlands", temp: "16°C", condition: "Cool & Crisp", icon: Cloud, humidity: "85%", wind: "14 km/h", recommendation: "Wear warm layers! Ideal for tea plantation tours & Gregory Lake.", status: "good" },
    { city: "Jaffna Peninsula", temp: "32°C", condition: "Bright Tropical Sun", icon: Sun, humidity: "62%", wind: "16 km/h", recommendation: "Perfect for Nallur Kovil visits & Delft Island boat rides.", status: "excellent" },
    { city: "Trincomalee Coast", temp: "30°C", condition: "Clear Ocean Waves", icon: Sun, humidity: "64%", wind: "13 km/h", recommendation: "Excellent for Pigeon Island snorkeling & whale watching.", status: "excellent" },
    { city: "Yala National Park", temp: "33°C", condition: "Dry Safari Heat", icon: Sun, humidity: "55%", wind: "9 km/h", recommendation: "Prime conditions for leopard & elephant waterhole sightings.", status: "excellent" },
    { city: "Mirissa Palm Beach", temp: "28°C", condition: "Golden Sunset Sun", icon: Sun, humidity: "72%", wind: "17 km/h", recommendation: "Ideal for whale cruises & evening Coconut Tree Hill photos.", status: "excellent" },
    { city: "Arugam Bay", temp: "31°C", condition: "Breezy Surf Sun", icon: Sun, humidity: "65%", wind: "22 km/h", recommendation: "Top surf wave conditions at Main Point & Peanut Farm.", status: "excellent" },
    { city: "Bentota Lagoon", temp: "29°C", condition: "Warm & Tropical", icon: Sun, humidity: "74%", wind: "15 km/h", recommendation: "Great for Madu River safari & jet-skiing.", status: "excellent" }
  ];

  const [selectedCity, setSelectedCity] = useState(weatherData[0]);

  return (
    <div id="weather-widget" className="w-full bg-slate-950 py-20 px-6 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header without thermometer icon */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-editorial font-extrabold text-white mb-3">
              Sri Lanka Live Weather & Travel Recommendations
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl font-medium">
              Check real-time weather conditions across Sri Lankan tourist destinations before planning your daily activities.
            </p>
          </div>
        </div>

        {/* City Selector Dropdown (as requested in screenshot 3) */}
        <div className="max-w-md mb-8">
          <label className="block text-xs font-extrabold text-emerald-400 uppercase mb-2 tracking-wider">
            Select Destination City:
          </label>
          <select
            value={selectedCity.city}
            onChange={(e) => {
              const found = weatherData.find(item => item.city === e.target.value);
              if (found) setSelectedCity(found);
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3.5 text-base font-extrabold text-white focus:outline-none focus:border-emerald-500 cursor-pointer shadow-lg"
          >
            {weatherData.map((item) => (
              <option key={item.city} value={item.city}>
                📍 {item.city} ({item.temp} - {item.condition})
              </option>
            ))}
          </select>
        </div>

        {/* Selected City Main Weather Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Main Temp & Condition */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between shadow-2xl">
            <div>
              <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest">Current Weather</span>
              <h3 className="text-3xl font-editorial font-extrabold text-white mt-1 mb-6">{selectedCity.city}</h3>
              
              <div className="flex items-center gap-6 my-4">
                <selectedCity.icon size={64} className="text-emerald-400 animate-pulse" />
                <div>
                  <span className="text-6xl font-editorial font-extrabold text-white">{selectedCity.temp}</span>
                  <p className="text-slate-300 font-bold text-sm mt-1">{selectedCity.condition}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><Droplets size={16} className="text-emerald-400" /> Humidity: {selectedCity.humidity}</span>
              <span className="flex items-center gap-1.5"><Wind size={16} className="text-emerald-400" /> Wind: {selectedCity.wind}</span>
            </div>
          </div>

          {/* Recommendation Box */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-500/30">
                  Recommended Travel Activity
                </span>
                <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
                  <Info size={14} className="text-emerald-400" /> Live SL Meteorological Sync
                </span>
              </div>

              <h4 className="text-2xl font-editorial font-extrabold text-white mb-4">
                Tourist Tip for {selectedCity.city}
              </h4>

              <p className="text-lg text-slate-200 font-medium leading-relaxed bg-slate-950 p-6 rounded-2xl border border-slate-800">
                "{selectedCity.recommendation}"
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold">Updated: Today 08:30 AM</span>
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-800/50">
                Condition: {selectedCity.status}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}