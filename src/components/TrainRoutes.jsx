import { useState } from 'react';
import { Train, Bus, Clock, MapPin, Ticket, ShieldCheck, ChevronRight, Info, Compass, Search } from 'lucide-react';
import SplitHeading from './SplitHeading';

export default function TrainRoutes() {
  const [transportMode, setTransportMode] = useState('train'); // 'train' or 'bus'
  const [searchRoute, setSearchRoute] = useState('');

  const trainJourneys = [
    {
      id: 'kandy-ella',
      title: 'Kandy to Ella & Badulla',
      tag: 'World\'s Most Scenic Train Journey',
      duration: '6 - 7 Hours',
      highlights: 'Tea plantations, St. Clair Waterfalls, Nine Arches Bridge, Pattipola (Highest station)',
      image: '/route/kandy_badulla.png',
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
      image: '/route/c_g.png',
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
  const activeJourney = trainJourneys.find(j => j.id === activeTab) || trainJourneys[0];

  const filteredBuses = busRoutes.filter(b => 
    b.title.toLowerCase().includes(searchRoute.toLowerCase()) || 
    b.highlights.toLowerCase().includes(searchRoute.toLowerCase())
  );

  return (
    <div id="transport" className="w-full bg-slate-950 py-20 px-6 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <SplitHeading as="h2" className="text-4xl md:text-5xl font-editorial font-extrabold text-white mb-3">
              Sri Lanka Transport
            </SplitHeading>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl font-medium">
              Choose between Sri Lanka Railways scenic trains or CTB Highway Express buses to navigate the island.
            </p>
          </div>

          {/* Transport Mode Switcher */}
          <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
            <button
              onClick={() => setTransportMode('train')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                transportMode === 'train'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Train size={18} /> Trains
            </button>
            <button
              onClick={() => setTransportMode('bus')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                transportMode === 'bus'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bus size={18} /> CTB Express Buses
            </button>
          </div>
        </div>

        {/* Train Mode Content */}
        {transportMode === 'train' ? (
          <div>
            {/* Train Route Tabs */}
            <div className="flex flex-wrap gap-3 mb-8">
              {trainJourneys.map(j => (
                <button
                  key={j.id}
                  onClick={() => setActiveTab(j.id)}
                  className={`px-5 py-3 rounded-2xl font-extrabold text-sm transition-all flex items-center gap-2 cursor-pointer border ${
                    activeTab === j.id
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950 scale-105'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <Train size={18} /> {j.title}
                </button>
              ))}
            </div>

            {/* Active Train Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
              
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden min-h-[300px] border border-slate-800">
                <img src={activeJourney.image} alt={activeJourney.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-emerald-500 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full mb-2 inline-block">
                    {activeJourney.tag}
                  </span>
                  <h3 className="text-2xl font-editorial font-extrabold text-white">{activeJourney.title}</h3>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  <h4 className="text-xl font-editorial font-extrabold text-white mb-2">Daily Train Timetable</h4>
                  <p className="text-slate-400 text-sm mb-6">{activeJourney.highlights}</p>

                  <div className="space-y-3">
                    {activeJourney.schedule.map((s, idx) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-extrabold text-emerald-400 text-sm">{s.train}</p>
                          <p className="text-xs text-slate-300 font-bold mt-0.5">{s.depart} ➔ {s.arrive}</p>
                        </div>
                        <span className="text-xs font-extrabold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 w-fit">
                          {s.classes}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                    <Clock size={14} className="text-emerald-400" /> Duration: {activeJourney.duration}
                  </span>
                  <button
  onClick={() => {
    alert('Ticket availability feature is coming soon.');
  }}
  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold transition"
>
  <Ticket size={14} />
  Check Ticket Availability
</button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* CTB Bus Mode Content */
          <div className="space-y-6">
            
            {/* Bus Search */}
            <div className="relative max-w-md mb-6">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search bus route e.g. Kandy, Galle, Jaffna..."
                value={searchRoute}
                onChange={(e) => setSearchRoute(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBuses.map((bus, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-emerald-500/20 text-emerald-400 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-500/30">
                        {bus.routeNo}
                      </span>
                      <span className="text-emerald-400 text-xs font-extrabold">{bus.fare}</span>
                    </div>

                    <h4 className="text-lg font-editorial font-extrabold text-white mb-2">{bus.title}</h4>
                    <p className="text-xs text-slate-400 font-bold mb-3">{bus.type}</p>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">{bus.highlights}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span className="flex items-center gap-1"><Clock size={14} className="text-emerald-400" /> {bus.duration}</span>
                    <span>{bus.frequency}</span>
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