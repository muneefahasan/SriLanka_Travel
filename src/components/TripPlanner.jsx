import { useState } from 'react';
import { Compass, Calendar, Sparkles, Download, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function TripPlanner() {
  const [days, setDays] = useState(5);
  const [style, setStyle] = useState('Heritage & Nature');
  const [activeDay, setActiveDay] = useState(1);

  const itineraries = {
    3: {
      title: "3-Day Express Golden Triangle",
      daysPlan: [
        { day: 1, title: "Arrival & Sigiriya Rock Climb", location: "Sigiriya Citadel", desc: "Arrive at BIA Airport, transfer to Habarana, climb Sigiriya Rock Fortress at sunset." },
        { day: 2, title: "Kandy Temple of Tooth & Cultural Show", location: "Kandy Sacred City", desc: "Drive to Kandy, visit Royal Botanical Gardens, Temple of Sacred Tooth Relic, and traditional Kandyan dance." },
        { day: 3, title: "Colombo City Shopping & Departure", location: "Colombo Capital", desc: "Morning Colombo city tour, shopping at Pettah Floating Market, transfer to BIA Airport." }
      ]
    },
    5: {
      title: "5-Day Highlights of Sri Lanka",
      daysPlan: [
        { day: 1, title: "Sigiriya Fortress & Elephant Safari", location: "Sigiriya & Minneriya", desc: "Climb Sigiriya Fortress early morning, afternoon wild elephant safari at Minneriya National Park." },
        { day: 2, title: "Dambulla Cave Temple to Kandy", location: "Dambulla & Kandy", desc: "Explore Dambulla Golden Rock Cave Temple, spice garden tour, evening Kandy Tooth Temple." },
        { day: 3, title: "Kandy to Ella Scenic Train Ride", location: "Tea Country Express", desc: "Board the morning scenic express train from Kandy to Ella through tea plantations and waterfalls." },
        { day: 4, title: "Nine Arches Bridge & Little Adam's Peak", location: "Ella Mountain Valley", desc: "Hike Little Adam's Peak for sunrise, visit Nine Arches Bridge for train photos, evening chill at Ella town." },
        { day: 5, title: "Mirissa Beach & Galle Dutch Fort", location: "Galle Fort & Ocean", desc: "Morning drive to Southern coast, explore 17th-century Galle Dutch Fort lighthouse before airport transfer." }
      ]
    },
    7: {
      title: "7-Day Ultimate Island Odyssey",
      daysPlan: [
        { day: 1, title: "Negombo Lagoon & Sigiriya Transfer", location: "Negombo & Cultural Triangle", desc: "Relax by Negombo beach lagoon, afternoon transfer to Sigiriya." },
        { day: 2, title: "Sigiriya Rock & Polonnaruwa Ancient City", location: "Polonnaruwa Ruins", desc: "Explore UNESCO Heritage Polonnaruwa ancient ruins by bicycle." },
        { day: 3, title: "Kandy Hill Capital", location: "Kandy Sacred Lake", desc: "Visit Kandy Lake, Temple of Sacred Tooth, evening traditional cultural performance." },
        { day: 4, title: "Nuwara Eliya 'Little England'", location: "Tea Country Highlands", desc: "Drive through tea estates, visit Mackwoods tea factory & Gregory Lake." },
        { day: 5, title: "Scenic Train to Ella & Nine Arches", location: "Nine Arches Viaduct", desc: "Take the iconic train journey, hike Ella Rock or Little Adam's Peak." },
        { day: 6, title: "Yala National Park Safari", location: "Yala Wilderness", desc: "Morning game drive in Yala to spot Sri Lankan leopards and wild bears." },
        { day: 7, title: "Mirissa Beach & Departure", location: "Southern Coast", desc: "Relax on Mirissa coconut tree hill beach before highway drive to Colombo Airport." }
      ]
    }
  };

  const currentPlan = itineraries[days];

  return (
    <div id="trip-planner" className="w-full bg-slate-950 py-20 px-6 text-white border-t border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-3 inline-block border border-emerald-500/30">
              AI Trip Builder & Curved Graph Timeline
            </span>
            <h2 className="text-4xl md:text-5xl font-editorial font-extrabold text-white mb-3 flex items-center gap-3">
              <Compass className="text-emerald-400" size={38} />
              Interactive Custom Itinerary Generator
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl font-medium">
              Select your trip duration and travel style to generate a tailored day-by-day Sri Lanka itinerary.
            </p>
          </div>
        </div>

        {/* Builder Form Controls */}
        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Days Selection */}
          <div>
            <label className="block text-xs font-extrabold text-emerald-400 uppercase mb-3 flex items-center gap-2 tracking-wider">
              <Calendar size={16} className="text-emerald-400" /> Trip Duration (Days)
            </label>
            <div className="flex gap-2">
              {[3, 5, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setDays(num);
                    setActiveDay(1);
                  }}
                  className={`flex-1 py-3 rounded-2xl font-extrabold text-sm transition-all cursor-pointer ${
                    days === num
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950 scale-105 border border-emerald-400'
                      : 'bg-slate-800 text-gray-400 border border-slate-700 hover:text-white hover:bg-slate-750'
                  }`}
                >
                  {num} Days
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style Selection */}
          <div>
            <label className="block text-xs font-extrabold text-emerald-400 uppercase mb-3 flex items-center gap-2 tracking-wider">
              <Sparkles size={16} className="text-emerald-400" /> Travel Preference
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm font-extrabold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="Heritage & Nature">🏛️ Heritage, Nature & Tea Trails</option>
              <option value="Wildlife Safari">🐘 Wildlife Safaris & Jungle Trek</option>
              <option value="Beach & Surfing">🏄 Coastal Beaches & Surfing</option>
            </select>
          </div>

          {/* Action Button */}
          <div className="md:pt-7">
            <button
              onClick={() => setActiveDay(1)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 text-base cursor-pointer border border-emerald-400/40"
            >
              <Sparkles size={18} /> Update Itinerary
            </button>
          </div>

        </div>

        {/* Curved Timeline Line Graph Showcase (React Bits Pro Style) */}
        <div className="bg-slate-900/90 border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-10 border-b border-slate-800 gap-4">
            <div>
              <span className="text-xs text-emerald-400 font-extrabold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Custom Plan Ready
              </span>
              <h3 className="text-3xl md:text-4xl font-editorial font-extrabold text-white mt-2">{currentPlan.title}</h3>
            </div>
            <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-lg cursor-pointer">
              <Download size={16} /> Save / Download Plan
            </button>
          </div>

          {/* Main Layout: Left Side Interactive Curved Path Line, Right Side Active Day Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            
            {/* Left Col: Interactive Curved Node Path (Graph Timeline) */}
            <div className="lg:col-span-6 relative py-4 flex flex-col justify-center min-h-[380px]">
              
              {/* Background Animated SVG Curve Path */}
              <svg className="absolute left-[30px] top-0 bottom-0 h-full w-[120px] pointer-events-none" viewBox="0 0 100 400" preserveAspectRatio="none">
                <path
                  d="M 25,20 C 85,100 5,200 65,300 C 95,350 25,380 25,400"
                  fill="none"
                  stroke="rgba(16, 185, 129, 0.3)"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                />
                <path
                  d="M 25,20 C 85,100 5,200 65,300 C 95,350 25,380 25,400"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                />
              </svg>

              {/* Vertical Stack of Nodes along the Curve */}
              <div className="space-y-6 relative z-10">
                {currentPlan.daysPlan.map((item) => {
                  const isActive = activeDay === item.day;
                  return (
                    <div
                      key={item.day}
                      onClick={() => setActiveDay(item.day)}
                      className={`flex items-center gap-5 cursor-pointer group transition-all duration-300 ${
                        isActive ? 'translate-x-3' : 'hover:translate-x-1'
                      }`}
                    >
                      {/* Node Dot Button on the Curve Line */}
                      <div className={`relative flex items-center justify-center w-14 h-14 rounded-2xl font-black text-sm transition-all duration-300 shadow-xl ${
                        isActive 
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/30 scale-110 shadow-emerald-500/50' 
                          : 'bg-slate-800 text-slate-400 border border-slate-700 group-hover:border-emerald-500 group-hover:text-white'
                      }`}>
                        D{item.day}
                        {isActive && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
                        )}
                      </div>

                      {/* Node Pill Tag */}
                      <div className={`px-5 py-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 ${
                        isActive
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-lg font-extrabold'
                          : 'bg-slate-800/80 border-slate-700/60 text-slate-300 group-hover:border-slate-600 font-bold'
                      }`}>
                        <MapPin size={16} className={isActive ? 'text-emerald-400' : 'text-slate-500'} />
                        <div>
                          <p className="text-xs uppercase tracking-wider font-extrabold text-slate-400">Day {item.day}</p>
                          <p className="text-sm text-white font-bold">{item.location}</p>
                        </div>
                        {isActive && <CheckCircle2 size={16} className="text-emerald-400 ml-auto" />}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right Col: Expanded Details Card for Selected Node */}
            <div className="lg:col-span-6 bg-slate-950 border border-slate-800 p-8 rounded-3xl shadow-2xl relative">
              {(() => {
                const activeItem = currentPlan.daysPlan.find(d => d.day === activeDay) || currentPlan.daysPlan[0];
                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="bg-emerald-500/20 text-emerald-400 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-500/30">
                        Day {activeItem.day} Itinerary Node
                      </span>
                      <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
                        <MapPin size={14} className="text-emerald-400" /> {activeItem.location}
                      </span>
                    </div>

                    <h4 className="text-2xl md:text-3xl font-editorial font-extrabold text-white leading-tight">
                      {activeItem.title}
                    </h4>

                    <p className="text-gray-300 text-base leading-relaxed font-medium bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
                      {activeItem.desc}
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400">
                        <Sparkles size={16} /> SLTDA Verified Route
                      </div>

                      {activeDay < currentPlan.daysPlan.length && (
                        <button 
                          onClick={() => setActiveDay(prev => prev + 1)}
                          className="inline-flex items-center gap-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Next Day <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}