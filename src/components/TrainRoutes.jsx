import { useState } from 'react';
import { Train, Bus, Clock, MapPin, Ticket, ShieldCheck, ChevronRight, Info, Compass } from 'lucide-react';

export default function TrainRoutes() {
  const [transportMode, setTransportMode] = useState('train'); // 'train' or 'bus'

  const trainJourneys = [
    {
      id: 'kandy-ella',
      title: 'Kandy to Ella & Badulla',
      tag: 'World\'s Most Scenic Train Journey',
      duration: '6 - 7 Hours',
      highlights: 'Tea plantations, St. Clair Waterfalls, Nine Arches Bridge, Pattipola (Highest station)',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
      schedule: [
        { train: 'Podi Menike (Express 1005)', depart: '05:55 AM (Kandy)', arrive: '12:40 PM (Ella)', classes: '1st & 2nd Class' },
        { train: 'Udarata Menike (Express 1015)', depart: '08:47 AM (Kandy)', arrive: '03:25 PM (Ella)', classes: '1st, 2nd, 3rd Class' },
        { train: 'Ella Odyssey (Special Tourist Train)', depart: '07:00 AM (Kandy)', arrive: '01:50 PM (Ella)', classes: 'Luxury 1st Class' }
      ]
    },
    {
      id: 'colombo-galle',
      title: 'Colombo to Galle & Matara',
      tag: 'Coastal Ocean Railway',
      duration: '2.5 - 3 Hours',
      highlights: 'Indian Ocean coastal views, beach waves, Galle Fort access',
      image: 'https://images.unsplash.com/photo-1574991485647-758ea065963b?auto=format&fit=crop&w=800&q=80',
      schedule: [
        { train: 'Ruhunu Kumari (Express 8058)', depart: '06:50 AM (Colombo)', arrive: '09:20 AM (Galle)', classes: '2nd & 3rd Class' },
        { train: 'Sagarika Express (8096)', depart: '04:30 PM (Colombo)', arrive: '07:10 PM (Galle)', classes: '2nd & 3rd Class' }
      ]
    }
  ];

  const busRoutes = [
    {
      routeNo: "EX 1-1 / EX 1-2",
      title: "Colombo ➔ Southern Expressway ➔ Galle / Matara",
      type: "Highway AC Express Luxury Bus",
      duration: "1.5 - 2 Hours",
      frequency: "Every 20 Minutes (Kadawatha / Makumbura Terminal)",
      fare: "Rs. 950 - 1,200 LKR",
      highlights: "Fastest route to Southern beaches (Galle Fort, Unawatuna, Mirissa) via highway."
    },
    {
      routeNo: "Route 01",
      title: "Colombo (Pettah) ➔ Kandy",
      type: "Intercity Luxury AC & CTB Buses",
      duration: "3.5 Hours",
      frequency: "Every 15 Minutes (Pettah Central Bus Stand)",
      fare: "Rs. 650 LKR",
      highlights: "Frequent buses climbing up Kadugannawa pass directly to Kandy town center."
    },
    {
      routeNo: "Route 99",
      title: "Colombo ➔ Ratnapura ➔ Badulla / Ella",
      type: "CTB Semi-Luxury & Express Bus",
      duration: "6.5 Hours",
      frequency: "Every 30 Minutes",
      fare: "Rs. 1,100 LKR",
      highlights: "Scenic mountain bus route passing tea plantations and waterfalls to Ella."
    },
    {
      routeNo: "Route 15 / EX 1-15",
      title: "Colombo ➔ Anuradhapura ➔ Jaffna",
      type: "Super Luxury Night AC Coach",
      duration: "6.5 - 7 Hours",
      frequency: "Daily Night Services (8:00 PM & 9:30 PM)",
      fare: "Rs. 2,200 LKR",
      highlights: "Comfortable overnight sleeper buses directly to Jaffna Nallur Kovil."
    }
  ];

  const [activeTab, setActiveTab] = useState('kandy-ella');
  const activeJourney = trainJourneys.find(j => j.id === activeTab);

  return (
    <div id="train-routes" className="w-full bg-slate-950 py-20 px-6 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block">
              Public Transport Hub
            </span>
            <h2 className="text-4xl font-black text-white mb-3 flex items-center gap-3">
              <Compass className="text-ceylon-accent" size={36} />
              Sri Lanka Transport: Trains & Express Buses
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              Choose between Sri Lanka Railways scenic trains or CTB Highway Express buses to navigate the island.
            </p>
          </div>

          {/* Transport Mode Switcher (Train vs CTB Bus) */}
          <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
            <button
              onClick={() => setTransportMode('train')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                transportMode === 'train' ? 'bg-ceylon-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Train size={18} /> Scenic Trains
            </button>
            <button
              onClick={() => setTransportMode('bus')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                transportMode === 'bus' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bus size={18} /> CTB & Express Buses
            </button>
          </div>
        </div>

        {/* TAB 1: TRAINS MODE */}
        {transportMode === 'train' && (
          <div>
            {/* Tab Selection */}
            <div className="flex flex-wrap gap-4 mb-8">
              {trainJourneys.map((route) => (
                <button
                  key={route.id}
                  onClick={() => setActiveTab(route.id)}
                  className={`px-6 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer ${
                    activeTab === route.id
                      ? 'bg-ceylon-accent text-white shadow-xl scale-102'
                      : 'bg-slate-900 text-gray-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  <Train size={18} />
                  {route.title}
                </button>
              ))}
            </div>

            {/* Active Train Detail Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left: Image & Info */}
              <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl">
                <div className="relative h-60">
                  <img src={activeJourney.image} alt={activeJourney.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-full uppercase tracking-wide">
                    {activeJourney.tag}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">{activeJourney.title}</h3>
                    <div className="flex items-center gap-2 text-orange-400 text-sm font-bold mb-4">
                      <Clock size={16} /> Duration: {activeJourney.duration}
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed mb-6">
                      <span className="font-bold text-white block mb-1">Highlights:</span>
                      {activeJourney.highlights}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/50 flex items-center gap-3">
                    <ShieldCheck size={24} className="text-emerald-400 flex-shrink-0" />
                    <div className="text-xs">
                      <p className="font-bold text-white">Ticket Reservation Tip</p>
                      <p className="text-gray-400">Book 1st/2nd class reserved seats 30 days prior!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Timetable & Classes */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
                  <h4 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
                    <span>Daily Express Train Schedule</span>
                    <span className="text-xs text-orange-400 font-semibold bg-orange-500/10 px-3 py-1 rounded-full">
                      SL Railways Timetable
                    </span>
                  </h4>

                  <div className="space-y-4">
                    {activeJourney.schedule.map((item, idx) => (
                      <div key={idx} className="bg-slate-800/60 border border-slate-700/40 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-600 transition-colors">
                        <div>
                          <span className="font-black text-lg text-white block">{item.train}</span>
                          <div className="flex items-center gap-3 text-xs text-gray-300 mt-2">
                            <span className="flex items-center gap-1"><MapPin size={12} className="text-emerald-400" /> {item.depart}</span>
                            <ChevronRight size={12} className="text-gray-500" />
                            <span className="flex items-center gap-1"><MapPin size={12} className="text-orange-400" /> {item.arrive}</span>
                          </div>
                        </div>

                        <span className="bg-slate-700 text-gray-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-600">
                          {item.classes}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: BUSES MODE (CTB & Highway Express) */}
        {transportMode === 'bus' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
              <h4 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
                <span>CTB & Highway Express Bus Routes</span>
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full">
                  Official Highway & Intercity Buses
                </span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {busRoutes.map((route, idx) => (
                  <div key={idx} className="bg-slate-800/70 border border-slate-700/50 p-6 rounded-3xl flex flex-col justify-between hover:border-orange-500/50 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-orange-500 text-white text-xs font-extrabold px-3 py-1 rounded-full">
                          {route.routeNo}
                        </span>
                        <span className="text-xs text-emerald-400 font-bold bg-emerald-900/40 px-2.5 py-1 rounded-full border border-emerald-700/50">
                          {route.fare}
                        </span>
                      </div>

                      <h5 className="text-lg font-bold text-white mb-2">{route.title}</h5>
                      <p className="text-xs text-gray-400 mb-3">{route.type}</p>
                      <p className="text-xs text-gray-300 leading-relaxed mb-4">{route.highlights}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={14} className="text-orange-400" /> {route.duration}</span>
                      <span className="font-semibold text-gray-300">{route.frequency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl flex items-start gap-4">
              <Info size={24} className="text-orange-400 flex-shrink-0 mt-1" />
              <div className="text-xs text-gray-300 leading-relaxed">
                <h6 className="font-bold text-white mb-1">Sri Lanka Public Transport Tip:</h6>
                <p>For Highway Express buses to Galle/Matara, head to <strong>Makumbura Multimodal Transport Center (MMTC)</strong> or Kadawatha. Highway buses are fully air-conditioned with reserved seats!</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}