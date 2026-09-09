import { useState } from 'react';
import { Calendar, MapPin, Sparkles, Tag, Search, Filter } from 'lucide-react';

export default function FestivalsCalendar() {
  // Full 12-Month Sri Lanka Festivals Dataset
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
      highlight: "Night Cultural Procession"
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
      highlight: "Gangaramaya Elephant Parade"
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
      highlight: "Sacred Sunrise Mountain Trek"
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
      highlight: "Traditional Games & Feast"
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
      highlight: "Massive Light Pandols & Free Dansalas"
    },
    {
      id: 6,
      title: "Poson Poya Festival",
      location: "Mihintale & Anuradhapura",
      dates: "June 21 - June 22, 2026",
      category: "Cultural & Religious",
      month: "June",
      image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=600&q=80",
      description: "Celebrating the arrival of Buddhism in Sri Lanka with white-clad pilgrims, paper lanterns, and illuminated Mihintale rock hill.",
      highlight: "Mihintale Rock Illuminations"
    },
    {
      id: 7,
      title: "Arugam Bay Surf & Music Fest",
      location: "Arugam Bay (East Coast)",
      dates: "July 15 - July 18, 2026",
      category: "Sports & Beach",
      month: "July",
      image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80",
      description: "International surfing competition accompanied by live acoustic beach sessions, seafood barbecues, and sunset parties.",
      highlight: "World Class Surfing & Beach Parties"
    },
    {
      id: 8,
      title: "Kandy Esala Perahera",
      location: "Kandy (Temple of Sacred Tooth)",
      dates: "August 12 - August 22, 2026",
      category: "Cultural & Religious",
      month: "August",
      image: "https://images.unsplash.com/photo-1544256662-756ef26e5fc5?auto=format&fit=crop&w=600&q=80",
      description: "Sri Lanka's grandest historic festival featuring majestic dressed elephants, fire-dancers, Kandyan drummers, and whip-crackers.",
      highlight: "Sacred Tooth Relic Procession"
    },
    {
      id: 9,
      title: "Nallur Kandaswamy Kovil Festival",
      location: "Jaffna",
      dates: "August 05 - September 01, 2026",
      category: "Cultural & Religious",
      month: "September",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
      description: "25-day vibrant Hindu festival in Jaffna filled with colorful chariot processions, traditional Nadaswaram music, and holy rituals.",
      highlight: "Ther Chariot Procession"
    },
    {
      id: 10,
      title: "Deepavali (Festival of Lights)",
      location: "Islandwide (Tamil Heritage Areas)",
      dates: "October 20, 2026",
      category: "National Celebration",
      month: "October",
      image: "https://images.unsplash.com/photo-1574991485647-758ea065963b?auto=format&fit=crop&w=600&q=80",
      description: "Hindu festival celebrating the victory of light over darkness with oil lamps (Diyas), colorful Rangoli art, and traditional sweets.",
      highlight: "Oil Lamp Illumination & Rangoli"
    },
    {
      id: 11,
      title: "Minneriya Elephant Gathering",
      location: "Minneriya National Park",
      dates: "November Season Peak",
      category: "Sports & Nature",
      month: "November",
      image: "https://images.unsplash.com/photo-1544256662-756ef26e5fc5?auto=format&fit=crop&w=600&q=80",
      description: "World famous natural wildlife phenomenon where over 300 Asian wild elephants gather around Minneriya tank reservoir.",
      highlight: "Greatest Wild Elephant Gathering"
    },
    {
      id: 12,
      title: "Galle Fort Literary & Music Fest",
      location: "Galle Dutch Fort",
      dates: "December 28 - January 02, 2026",
      category: "Sports & Beach",
      month: "December",
      image: "https://images.unsplash.com/photo-1574991485647-758ea065963b?auto=format&fit=crop&w=600&q=80",
      description: "International arts, music, and literary gathering set inside the 17th century historic Galle Dutch Fort.",
      highlight: "Heritage Fort Arts & Music"
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const monthsList = [
    "All", "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Multi-filter logic (Search + Category + All 12 Months)
  const filteredFestivals = festivalsData.filter(event => {
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const matchesMonth = selectedMonth === "All" || event.month === selectedMonth;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesMonth && matchesSearch;
  });

  return (
    <div className="w-full bg-ceylon-bg py-20 px-6 border-t border-gray-200">
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
              <option value="Sports & Beach">🏄 Sports & Beach</option>
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
            No festivals found matching your search criteria. Try resetting your dropdown filters!
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
                    <div className="absolute bottom-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {event.month}
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
                  <button className="text-ceylon-accent font-bold text-sm hover:underline cursor-pointer">
                    View Details
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}