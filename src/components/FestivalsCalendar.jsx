import { useState } from 'react';
import { Calendar, MapPin, Sparkles, Tag, Search, Filter, X, Clock, ShieldCheck } from 'lucide-react';

export default function FestivalsCalendar() {
  const festivalsData = [
    {
      id: 1,
      title: "Duruthu Poya & Kelaniya Perahera",
      location: "Kelaniya Raja Maha Vihara, Colombo",
      dates: "January 14, 2026",
      category: "Cultural & Religious",
      month: "January",
      image: "https://images.unsplash.com/photo-1544256662-756ef26e5fc5?auto=format&fit=crop&w=600&q=80",
      description: "Commemorating Buddha's first visit to Sri Lanka with a magnificent night perahera featuring traditional dancers and whip-crackers.",
      highlight: "Night Cultural Procession",
      timing: "8:00 PM - 11:30 PM",
      dressCode: "White / Modest temple attire covering shoulders & knees",
      tips: "Arrive 2 hours early to secure front-row seating along the procession route."
    },
    {
      id: 2,
      title: "Navam Full Moon Perahera",
      location: "Gangaramaya Temple, Colombo",
      dates: "February 12 - February 13, 2026",
      category: "Cultural & Religious",
      month: "February",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
      description: "Colombo's biggest cultural festival with hundreds of caparisoned elephants, traditional masked dancers, and torchbearers.",
      highlight: "Gangaramaya Elephant Parade",
      timing: "7:00 PM - 10:30 PM",
      dressCode: "Modest casual / traditional white",
      tips: "Book tickets for reserved viewing stands around Beira Lake."
    },
    {
      id: 3,
      title: "Adam's Peak (Sri Pada) Pilgrimage",
      location: "Ratnapura / Hatton",
      dates: "December to May Peak (March Focus)",
      category: "Sports & Nature",
      month: "March",
      image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80",
      description: "Night trek up the sacred mountain peak to witness the breathtaking shadow of the mountain at sunrise.",
      highlight: "Sacred Sunrise Mountain Trek",
      timing: "Start night climb at 1:30 AM",
      dressCode: "Warm layers, jacket & comfortable hiking shoes",
      tips: "Carry warm clothes as the peak summit gets very cold before dawn."
    },
    {
      id: 4,
      title: "Sinhala & Tamil New Year (Aluth Avurudda)",
      location: "Islandwide (All Sri Lanka)",
      dates: "April 13 - April 14, 2026",
      category: "National Celebration",
      month: "April",
      image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80",
      description: "National harvest festival marked by traditional games, boiling of auspicious milk, fireworks, and homemade sweetmeats.",
      highlight: "Traditional Games & Feast",
      timing: "All Day Event",
      dressCode: "Festive traditional wear",
      tips: "Enjoy traditional sweets like Kavum, Kokis and participate in village games."
    },
    {
      id: 5,
      title: "Vesak Full Moon Poya",
      location: "Colombo & Islandwide",
      dates: "May 23 - May 25, 2026",
      category: "Cultural & Religious",
      month: "May",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      description: "Festival of lights celebrating Buddha's birth and enlightenment with massive illuminated pandols and free food stalls (Dansalas).",
      highlight: "Massive Light Pandols & Free Dansalas",
      timing: "6:00 PM - Midnight",
      dressCode: "White respectful clothing",
      tips: "Walk through Bauddhaloka Mawatha in Colombo to see grand illuminated lanterns."
    },
    {
      id: 6,
      title: "Kandy Esala Perahera",
      location: "Kandy (Temple of Sacred Tooth)",
      dates: "August 12 - August 22, 2026",
      category: "Cultural & Religious",
      month: "August",
      image: "https://images.unsplash.com/photo-1544256662-756ef26e5fc5?auto=format&fit=crop&w=600&q=80",
      description: "Sri Lanka's grandest historic festival featuring majestic dressed elephants, fire-dancers, Kandyan drummers, and whip-crackers.",
      highlight: "Sacred Tooth Relic Procession",
      timing: "7:00 PM - 11:00 PM",
      dressCode: "White or modest temple attire",
      tips: "Pre-book seats along Kandy main street or temple entrance balcony."
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  const monthsList = [
    "All", "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const filteredFestivals = festivalsData.filter(event => {
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const matchesMonth = selectedMonth === "All" || event.month === selectedMonth;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesMonth && matchesSearch;
  });

  return (
    <div id="festivals-calendar" className="w-full bg-ceylon-bg py-20 px-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="bg-orange-100 text-ceylon-accent text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block">
              Cultural Calendar
            </span>
            <h2 className="text-4xl font-black text-ceylon-primary mb-3 flex items-center gap-3">
              <Sparkles className="text-ceylon-accent" size={32} />
              Sri Lanka Festivals & Cultural Events
            </h2>
            <p className="text-ceylon-muted text-lg max-w-2xl">
              Explore Sri Lanka's year-round 12-month cultural calendar, religious peraheras, and beach festivals.
            </p>
          </div>
        </div>

        {/* Dropdown Filters & Search Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 mb-10 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search festival or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-ceylon-bg border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-ceylon-accent font-medium"
            />
          </div>

          {/* Category Dropdown Menu */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-ceylon-bg border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:border-ceylon-accent cursor-pointer appearance-none"
            >
              <option value="All">🎭 All Event Categories</option>
              <option value="Cultural & Religious">🛕 Cultural & Religious</option>
              <option value="National Celebration">🎉 National Celebration</option>
              <option value="Sports & Nature">🐘 Sports & Nature</option>
            </select>
            <Filter size={16} className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
          </div>

          {/* 12-Month Dropdown Menu */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-ceylon-bg border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:border-ceylon-accent cursor-pointer appearance-none"
            >
              <option value="All">📅 Filter by Any Month (All 12 Months)</option>
              {monthsList.filter(m => m !== "All").map(m => (
                <option key={m} value={m}>{m} 2026</option>
              ))}
            </select>
            <Calendar size={16} className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
          </div>

        </div>

        {/* Festival Cards Grid */}
        {filteredFestivals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 text-gray-500 font-bold">
            No festivals found matching your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFestivals.map((event) => (
              <div key={event.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
                
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-ceylon-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                      {event.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-ceylon-primary mb-3">{event.title}</h3>
                    
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-ceylon-accent font-semibold">
                        <Calendar size={16} />
                        {event.dates}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin size={16} className="text-gray-400" />
                        {event.location}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {event.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-ceylon-primary bg-orange-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <Tag size={12} className="text-ceylon-accent" /> {event.highlight}
                  </span>
                  <button 
                    onClick={() => setActiveModalEvent(event)}
                    className="bg-ceylon-primary hover:bg-ceylon-accent text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    View Details
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* MODAL: Interactive Festival Details */}
        {activeModalEvent && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl relative overflow-hidden">
              <button 
                onClick={() => setActiveModalEvent(null)}
                className="absolute top-6 right-6 z-10 text-white bg-black/50 p-2 rounded-full hover:bg-black/80 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="relative h-60 -mx-8 -mt-8 mb-6">
                <img src={activeModalEvent.image} alt={activeModalEvent.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-6 text-white">
                  <span className="bg-ceylon-accent text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full mb-2 inline-block">
                    {activeModalEvent.category}
                  </span>
                  <h3 className="text-3xl font-black">{activeModalEvent.title}</h3>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                <p className="leading-relaxed text-base">{activeModalEvent.description}</p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-orange-50 rounded-xl">
                    <span className="text-xs text-orange-600 font-bold block">Event Timing</span>
                    <span className="font-bold text-gray-900 flex items-center gap-1"><Clock size={14} /> {activeModalEvent.timing}</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <span className="text-xs text-emerald-600 font-bold block">Location Venue</span>
                    <span className="font-bold text-gray-900 flex items-center gap-1"><MapPin size={14} /> {activeModalEvent.location}</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-gray-900">
                    <ShieldCheck size={18} className="text-ceylon-accent" /> Visitor Guidelines & Dress Code:
                  </div>
                  <p className="text-xs text-gray-600">👗 <strong>Dress Code:</strong> {activeModalEvent.dressCode}</p>
                  <p className="text-xs text-gray-600">💡 <strong>Travel Tip:</strong> {activeModalEvent.tips}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}