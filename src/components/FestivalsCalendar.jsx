import { useState } from 'react';
import { Search } from 'lucide-react';
import DepthCarousel from './DepthCarousel';

export default function FestivalsCalendar() {
  const festivalsData = [
    {
      id: 1,
      title: "Kandy Esala Perahera",
      date: "August",
      month: "August",
      location: "Kandy Sacred City",
      category: "Buddhist Cultural Parade",
      image: "/festivals/esala.jpg",
      description: "Grandest cultural pageant featuring traditional Kandyan dancers, fire-breathers, whip-crackers, and decorated elephants carrying Sacred Tooth Relic.",
      dressCode: "Modest white or light-colored attire covering shoulders and knees. Footwear and headwear must be removed inside temple grounds.",
      highlights: ["Sacred Tooth Relic Procession", "Fire Dancers & Whip Crackers", "Royal Elephant Parade", "Kandyan Drum Symphony"]
    },
    {
      id: 2,
      title: "Vesak Full Moon Poya",
      date: "May",
      month: "May",
      location: "Islandwide (Colombo & Kandy)",
      category: "Religious Festival of Lights",
      image: "/festivals/vesak.jpg",
      description: "Celebrating Buddha's birth, enlightenment & passing. Streets illuminated with giant bamboo pandols, colorful bucket lanterns and free food stalls (Dansal).",
      dressCode: "White traditional garments (Sil Vethi) or modest light attire when visiting illuminated pandols & temples.",
      highlights: ["Giant Illuminated Pandols", "Free Food Stalls (Dansal)", "Bucket Lantern Displays", "Devotional Carols (Bhakthi Gee)"]
    },
    {
      id: 3,
      title: "Sinhala & Tamil New Year (Aluth Avurudda)",
      date: "April 13 - 14",
      month: "April",
      location: "Islandwide",
      category: "Traditional New Year",
      image: "/festivals/newyear.jpg",
      description: "Cultural harvest celebration with auspicious oil-anointing rituals, traditional sweetmeats (Kavum, Kokis, Kiribath) and traditional village games.",
      dressCode: "Vibrant traditional attire (Lama Sarong, Saree, Kurta). Red, yellow, or white auspicious color clothing as recommended by astrology.",
      highlights: ["Traditional Village Games", "Auspicious Hearth Lighting", "Sweetmeat Feast (Kavum & Kokis)", "Oil Anointing Ceremony"]
    },
    {
      id: 4,
      title: "Nallur Festival",
      date: "August - September",
      month: "August",
      location: "Jaffna Kovil",
      category: "Hindu Religious Festival",
      image: "festivals/nallur.png",
      description: "25-day vibrant chariot festival at historic Nallur Kandaswamy Kovil in Jaffna with traditional Nathaswaram drums and holy chariot processions.",
      dressCode: "Traditional Hindu Kovil dress code: Men must remove upper garments/shirts before entering; women wear Sarees or modest traditional dresses.",
      highlights: ["Ther (Giant Chariot) Pulling", "Holy Water Bath (Theertham)", "Nathaswaram Drum Recitals", "Holy Chariot Procession"]
    },
    {
      id: 5,
      title: "Deepavali (Festival of Lights)",
      date: "November",
      month: "November",
      location: "Jaffna, Upcountry & Colombo",
      category: "Hindu Cultural Festival",
      image: "/festivals/deepavali.png",
      description: "Festival celebrating light over darkness with oil lamps, vibrant Kolam/Rangoli floor art, oil baths, and traditional sweet exchanges.",
      dressCode: "Vibrant festive traditional Indian/Sri Lankan attire (Saree, Salwar, Kurta, Vesti).",
      highlights: ["Kolam Floor Art", "Clay Oil Lamp Lighting", "Traditional Sweet Exchanges", "Temple Oil Bath Rituals"]
    },
    {
      id: 6,
      title: "Eid al-Fitr Celebration",
      date: "April", // This will need to be adjusted annually based on the lunar calendar
      month: "April", // Example based on 2024 dates
      location: "Grand Mosque, Colombo 12",
      category: "Islamic Religious Festival",
      image: "/festivals/eid.png", 
      description: "Marking the end of Ramadan, the month of fasting, with community prayers, charity, and festive family gatherings.",
      dressCode: "Festive and modest. Men typically wear thobes or smart casual; women wear abayas, modest dresses, or traditional shalwar kameez.",
      highlights: ["Eid Prayers", "Morning Feast (Iftar)", "Giving Zakat al-Fitr", "Visiting Relatives"]
    }
    ,
    {
    id: 8,
      title: "Easter Vigil Mass",
      date: "March / April", // This will need to be adjusted annually
      month: "March", // Example based on 2024 dates
      location: "St. Lucia's Cathedral, Kotahena",
      category: "Christian Religious Service",
      image: "/festivals/easter.png", 
      description: "A solemn and joyous service celebrating the resurrection of Jesus Christ, beginning after sundown on Holy Saturday with the lighting of the Paschal candle.",
      dressCode: "Smart, respectable church attire. Shoulders should generally be covered.",
      highlights: ["Service of Light", "Blessing of the Baptismal Water", "First Holy Communion", "Halleluiah Chorus"]
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const monthsList = ['All', 'January', 'April', 'May', 'August', 'November'];
  const categories = ['All', 'Buddhist Cultural Parade', 'Religious Festival of Lights', 'Traditional New Year', 'Hindu Religious Festival'];

  const filteredFestivals = festivalsData.filter(f => {
    const matchesMonth = selectedMonth === 'All' || f.month === selectedMonth;
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMonth && matchesCategory && matchesSearch;
  });

  return (
    <div id="festivals" className="w-full bg-slate-950 py-20 px-6 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-4xl md:text-5xl font-editorial font-extrabold text-white mb-3">
            Sri Lanka Festivals & Cultural Events
          </h2>
          <p className="text-gray-400 text-base md:text-lg font-medium">
            Immerse yourself in Sri Lanka’s rich heritage with vibrant parades, light festivals, dress code guides, and traditional celebrations.
          </p>
        </div>

        {/* Search & Month / Category Filters */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search Kandy Perahera, Vesak, Nallur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            {/* Month-Wise Search Selector */}
            <div className="w-full sm:w-auto">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-full px-5 py-3 text-sm font-extrabold text-emerald-400 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="All"> Filter by Month: All</option>
                {monthsList.filter(m => m !== 'All').map(m => (
                  <option key={m} value={m}> {m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* DepthCarousel Component */}
        <DepthCarousel
          items={filteredFestivals}
          depth={220}
          spread={90}
          tilt={22}
          tiltDirection="right"
          perspective={1400}
          visibleCards={4}
          falloff={0.2}
          blur={6}
          autoplay
          loop
        />

      </div>
    </div>
  );
}