import { useState } from 'react';
import { Train, Clock, MapPin, Ticket, ShieldCheck, ChevronRight, Info } from 'lucide-react';

export default function TrainRoutes() {
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

  const [activeTab, setActiveTab] = useState('kandy-ella');
  const activeJourney = trainJourneys.find(j => j.id === activeTab);

  return (
    <div className="w-full bg-slate-950 py-20 px-6 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block">
              Rail Travel Guide
            </span>
            <h2 className="text-4xl font-black text-white mb-3 flex items-center gap-3">
              <Train className="text-ceylon-accent" size={36} />
              Sri Lanka Iconic Scenic Train Routes
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              Explore time tables, scenic stops, and ticket class guides for Sri Lanka’s world-famous train journeys.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-4 mb-10">
          {trainJourneys.map((route) => (
            <button
              key={route.id}
              onClick={() => setActiveTab(route.id)}
              className={`px-6 py-4 rounded-2xl font-bold text-base transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === route.id
                  ? 'bg-ceylon-accent text-white shadow-xl shadow-orange-500/20 scale-102'
                  : 'bg-slate-900 text-gray-400 border border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Train size={20} />
              {route.title}
            </button>
          ))}
        </div>

        {/* Active Journey Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Image & Route Info */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="relative h-64">
              <img 
                src={activeJourney.image} 
                alt={activeJourney.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-full uppercase tracking-wide">
                {activeJourney.tag}
              </span>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black text-white mb-3">{activeJourney.title}</h3>
                <div className="flex items-center gap-2 text-orange-400 text-sm font-bold mb-4">
                  <Clock size={18} />
                  Duration: {activeJourney.duration}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  <span className="font-bold text-white block mb-1">Highlights:</span>
                  {activeJourney.highlights}
                </p>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/50 flex items-center gap-3">
                <ShieldCheck size={28} className="text-emerald-400 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-white">Ticket Recommendation</p>
                  <p className="text-gray-400">Book 1st/2nd class reserved seats at least 30 days prior!</p>
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
                  Official SL Railways Timetable
                </span>
              </h4>

              <div className="space-y-4">
                {activeJourney.schedule.map((item, idx) => (
                  <div key={idx} className="bg-slate-800/60 border border-slate-700/40 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-600 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-lg text-white">{item.train}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-300 mt-2">
                        <span className="flex items-center gap-1"><MapPin size={14} className="text-emerald-400" /> {item.depart}</span>
                        <ChevronRight size={14} className="text-gray-500" />
                        <span className="flex items-center gap-1"><MapPin size={14} className="text-orange-400" /> {item.arrive}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="bg-slate-700 text-gray-200 text-xs font-semibold px-3 py-1.5 rounded-xl">
                        {item.classes}
                      </span>
                      <button className="bg-ceylon-accent hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer">
                        <Ticket size={14} /> Reserve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Notice Box */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl flex items-start gap-4">
              <Info size={24} className="text-orange-400 flex-shrink-0 mt-1" />
              <div className="text-sm">
                <h5 className="font-bold text-white mb-1">Ella Odyssey Special Tourist Train</h5>
                <p className="text-gray-400 leading-relaxed">
                  The <span className="text-orange-400 font-semibold">Ella Odyssey</span> train stops at key scenic locations (Demodara Loop, Nine Arches Bridge, St. Clair Waterfall) for 10 minutes each for tourists to take photos!
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}