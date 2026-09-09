import { Train, MapPin, CloudSun, Banknote, Clock, ArrowRight, Calendar } from 'lucide-react';

export default function TravelEssentials() {
  return (
    <div className="w-full bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-ceylon-primary mb-4">Essential Travel Info</h2>
          <p className="text-ceylon-muted text-lg">Plan your journey with live train schedules, weather updates, and currency rates.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Railway Timetable Widget (Takes up 2 columns) */}
          <div className="lg:col-span-2 bg-ceylon-primary rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute -bottom-24 -right-24 opacity-10">
              <Train size={300} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <Train size={32} className="text-ceylon-light" />
                <h3 className="text-3xl font-bold">Railway Timetable</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ceylon-card">From</label>
                  <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                    <MapPin size={20} className="text-ceylon-light mr-3" />
                    <input type="text" placeholder="e.g. Colombo Fort" className="bg-transparent border-none text-white placeholder-white/50 w-full focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ceylon-card">To</label>
                  <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                    <MapPin size={20} className="text-ceylon-light mr-3" />
                    <input type="text" placeholder="e.g. Ella" className="bg-transparent border-none text-white placeholder-white/50 w-full focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ceylon-card">Date</label>
                  <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3">
                    <Calendar size={20} className="text-ceylon-light mr-3" />
                    <input type="text" placeholder="Select Date" className="bg-transparent border-none text-white placeholder-white/50 w-full focus:outline-none" />
                  </div>
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-ceylon-light hover:bg-white text-ceylon-primary font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    Search Trains
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sri Lanka At a Glance Widget (Takes up 1 column) */}
          <div className="bg-ceylon-bg rounded-3xl p-8 border border-ceylon-card shadow-sm flex flex-col justify-between">
            <h3 className="text-2xl font-bold text-ceylon-primary mb-6">At a Glance</h3>
            
            <div className="space-y-6">
              {/* Weather */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
                <div className="bg-blue-50 p-3 rounded-full text-blue-500">
                  <CloudSun size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Weather (Colombo)</p>
                  <p className="text-lg font-bold text-ceylon-primary">31°C / 88°F</p>
                </div>
              </div>

              {/* Currency */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
                <div className="bg-green-50 p-3 rounded-full text-green-600">
                  <Banknote size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Currency (LKR)</p>
                  <p className="text-lg font-bold text-ceylon-primary">1 USD ≈ 300 LKR</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm">
                <div className="bg-orange-50 p-3 rounded-full text-orange-500">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Local Time</p>
                  <p className="text-lg font-bold text-ceylon-primary">GMT +5:30</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}