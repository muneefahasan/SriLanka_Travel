import { useState } from 'react';
import { Compass, Calendar, Sparkles, Download } from 'lucide-react';

export default function TripPlanner() {
  const [days, setDays] = useState(5);
  const [style, setStyle] = useState('Heritage & Nature');
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const itineraries = {
    3: {
      title: "3-Day Express Golden Triangle",
      daysPlan: [
        { day: 1, title: "Arrival & Sigiriya Rock Climb", desc: "Arrive at BIA Airport, transfer to Habarana, climb Sigiriya Rock Fortress at sunset." },
        { day: 2, title: "Kandy Temple of Tooth & Cultural Show", desc: "Drive to Kandy, visit Royal Botanical Gardens, Temple of Sacred Tooth Relic, and traditional Kandyan dance." },
        { day: 3, title: "Colombo City Shopping & Departure", desc: "Morning Colombo city tour, shopping at Pettah Floating Market, transfer to BIA Airport." }
      ]
    },
    5: {
      title: "5-Day Highlights of Sri Lanka (Most Popular)",
      daysPlan: [
        { day: 1, title: "Sigiriya Fortress & Minneriya Elephant Safari", desc: "Climb Sigiriya Fortress early morning, afternoon wild elephant safari at Minneriya National Park." },
        { day: 2, title: "Dambulla Cave Temple to Kandy", desc: "Explore Dambulla Golden Rock Cave Temple, spice garden tour, evening Kandy Tooth Temple." },
        { day: 3, title: "Kandy to Ella Scenic Train Ride", desc: "Board the morning scenic express train from Kandy to Ella through tea plantations and waterfalls." },
        { day: 4, title: "Nine Arches Bridge & Little Adam's Peak", desc: "Hike Little Adam's Peak for sunrise, visit Nine Arches Bridge for train photos, evening chill at Ella town." },
        { day: 5, title: "Mirissa Beach & Galle Dutch Fort", desc: "Morning drive to Southern coast, explore 17th-century Galle Dutch Fort lighthouse before airport transfer." }
      ]
    },
    7: {
      title: "7-Day Ultimate Island Odyssey (Culture, Hills & Beach)",
      daysPlan: [
        { day: 1, title: "Negombo Lagoon & Sigiriya Transfer", desc: "Relax by Negombo beach lagoon, afternoon transfer to Sigiriya." },
        { day: 2, title: "Sigiriya Rock & Polonnaruwa Ancient City", desc: "Explore UNESCO Heritage Polonnaruwa ancient ruins by bicycle." },
        { day: 3, title: "Kandy Hill Capital", desc: "Visit Kandy Lake, Temple of Sacred Tooth, evening traditional cultural performance." },
        { day: 4, title: "Nuwara Eliya 'Little England'", desc: "Drive through tea estates, visit Mackwoods tea factory & Gregory Lake." },
        { day: 5, title: "Scenic Train to Ella & Nine Arches", desc: "Take the iconic train journey, hike Ella Rock or Little Adam's Peak." },
        { day: 6, title: "Yala National Park Safari", desc: "Morning game drive in Yala to spot Sri Lankan leopards and wild bears." },
        { day: 7, title: "Mirissa Beach & Departure", desc: "Relax on Mirissa coconut tree hill beach before highway drive to Colombo Airport." }
      ]
    }
  };

  const handleGenerate = () => {
    setGeneratedPlan(itineraries[days] || itineraries[5]);
  };

  return (
    <div id="trip-planner" className="w-full bg-slate-950 py-20 px-6 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block">
              AI Trip Builder
            </span>
            <h2 className="text-4xl font-black text-white mb-3 flex items-center gap-3">
              <Compass className="text-ceylon-accent" size={36} />
              Interactive Custom Itinerary Generator
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              Select your trip duration and travel style to generate a tailored day-by-day Sri Lanka itinerary.
            </p>
          </div>
        </div>

        {/* Builder Form Controls */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Days Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
              <Calendar size={16} className="text-orange-400" /> Trip Duration (Days)
            </label>
            <div className="flex gap-2">
              {[3, 5, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => setDays(num)}
                  className={`flex-1 py-3 rounded-2xl font-extrabold text-sm transition-all cursor-pointer ${
                    days === num
                      ? 'bg-ceylon-accent text-white shadow-lg shadow-orange-500/30'
                      : 'bg-slate-800 text-gray-400 border border-slate-700 hover:text-white'
                  }`}
                >
                  {num} Days
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-400" /> Travel Preference
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="Heritage & Nature">🏛️ Heritage, Nature & Tea Trails</option>
              <option value="Wildlife Safari">🐘 Wildlife Safaris & Jungle Trek</option>
              <option value="Beach & Surfing">🏄 Coastal Beaches & Surfing</option>
            </select>
          </div>

          {/* Generate Button */}
          <div className="md:pt-7">
            <button
              onClick={handleGenerate}
              className="w-full bg-ceylon-primary hover:bg-ceylon-accent text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <Sparkles size={18} /> Generate My Itinerary
            </button>
          </div>

        </div>

        {/* Generated Itinerary Display */}
        {generatedPlan && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
              <div>
                <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">Custom Plan Ready</span>
                <h3 className="text-3xl font-black text-white mt-1">{generatedPlan.title}</h3>
              </div>
              <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md cursor-pointer">
                <Download size={16} /> Save / Download Plan
              </button>
            </div>

            {/* Timeline Days */}
            <div className="space-y-6">
              {generatedPlan.daysPlan.map((item) => (
                <div key={item.day} className="flex gap-4 sm:gap-6 items-start bg-slate-800/50 p-6 rounded-2xl border border-slate-700/40">
                  <div className="bg-orange-500 text-white font-black text-lg w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                    D{item.day}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}