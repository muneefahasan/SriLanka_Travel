import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ChevronLeft, ChevronRight, ArrowRight, Search, Filter } from 'lucide-react';

export default function LenticularCarousel() {
  const initialDestinations = [
    { id: 1, name: "Sigiriya Rock Fortress", category: "Heritage", image: "/sigiriya.png", description: "5th-century ancient palace complex perched atop a 200m giant rock with famous water gardens and frescoes." },
    { id: 2, name: "Ella Nine Arches Bridge", category: "Mountain & Hill Country", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80", description: "Iconic colonial viaduct bridge nestled in misty green tea mountain valleys." },
    { id: 3, name: "Kandy Tooth Relic Temple", category: "Cultural & Heritage", image: "https://images.unsplash.com/photo-1544256662-756ef26e5fc5?auto=format&fit=crop&w=800&q=80", description: "Sacred Buddhist temple housing Lord Buddha's tooth relic amidst scenic Kandy Lake." },
    { id: 4, name: "Galle Dutch Fort", category: "Heritage & Beach", image: "https://images.unsplash.com/photo-1574991485647-758ea065963b?auto=format&fit=crop&w=800&q=80", description: "17th-century UNESCO fort featuring ocean ramparts, cobblestone streets, and lighthouse." },
    { id: 5, name: "Nuwara Eliya", category: "Mountain & Hill Country", image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80", description: "Cool hill-country town famous for tea estates and beautiful landscapes." },
    { id: 6, name: "Yala National Park", category: "Nature & Wildlife", image: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80", description: "World's highest density of wild leopards, elephants, sloth bears, and exotic birds." },
    { id: 7, name: "Mirissa", category: "Beach & Coastal", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80", description: "Golden palm beach famous for blue whale watching cruises and turquoise sunset views." },
    { id: 8, name: "Dambulla Cave Temple", category: "Cultural & Heritage", image: "https://images.unsplash.com/photo-1602643163983-ed0bstructure-1?auto=format&fit=crop&w=800&q=80", description: "Ancient Buddhist temple complex featuring statues and colorful cave paintings." },
    { id: 9, name: "Anuradhapura", category: "Cultural & Heritage", image: "https://images.unsplash.com/photo-1625736332302-3bef83780361?auto=format&fit=crop&w=800&q=80", description: "Ancient city famous for historic Buddhist stupas, temples, and ruins." },
    { id: 10, name: "Polonnaruwa", category: "Cultural & Heritage", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80", description: "Historic royal city with ancient temples, statues, and archaeological ruins." },
    { id: 11, name: "Arugam Bay", category: "Beach & Coastal", image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80", description: "World-famous surfing destination with beautiful beaches and a relaxed atmosphere." },
    { id: 12, name: "Hikkaduwa", category: "Beach & Coastal", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", description: "Coastal town popular for beaches, snorkeling, coral reefs, and marine life." },
    { id: 13, name: "Trincomalee", category: "Beach & Coastal", image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80", description: "Coastal city known for beautiful beaches, clear waters, and historic temples." },
    { id: 14, name: "Jaffna", category: "Cultural & Heritage", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80", description: "Northern city rich in Tamil culture, history, temples, and traditional cuisine." },
    { id: 15, name: "Adam's Peak", category: "Mountain & Adventure", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80", description: "Sacred mountain famous for pilgrimage, hiking, and spectacular sunrise views." },
    { id: 16, name: "Bentota", category: "Beach & Coastal", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80", description: "Popular beach destination offering water sports, riverside scenery, and resorts." },
    { id: 17, name: "Negombo", category: "Beach & Coastal", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", description: "Coastal city known for its beach, fishing industry, seafood, and canals." },
    { id: 18, name: "Horton Plains", category: "Nature & Adventure", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80", description: "Scenic national park famous for hiking, grasslands, forests, and World's End." },
    { id: 19, name: "Udawalawe National Park", category: "Nature & Wildlife", image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80", description: "Wildlife destination particularly famous for its large elephant population." },
    { id: 20, name: "Pinnawala Elephant Orphanage", category: "Nature & Wildlife", image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef9?auto=format&fit=crop&w=800&q=80", description: "Popular attraction where visitors can observe elephants and their daily activities." },
    { id: 21, name: "Unawatuna", category: "Beach & Coastal", image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80", description: "Beautiful beach destination known for swimming, snorkeling, and coral reefs." },
    { id: 22, name: "Kithulgala", category: "Adventure", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80", description: "Adventure destination famous for white-water rafting, forests, and outdoor activities." },
    { id: 23, name: "Knuckles Mountain Range", category: "Mountain & Nature", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80", description: "Mountain region known for hiking trails, forests, waterfalls, and stunning scenery." },
    { id: 24, name: "Kalpitiya", category: "Beach & Coastal", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", description: "Coastal destination popular for beaches, dolphin watching, and water sports." },
    { id: 25, name: "Pasikuda", category: "Beach & Coastal", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", description: "Famous for its calm, shallow, turquoise-colored waters and beautiful beach." },
    { id: 26, name: "Ravana Falls", category: "Mountain & Nature", image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80", description: "Spectacular waterfall near Ella surrounded by scenic mountain landscapes." },
    { id: 27, name: "Nallur Kandaswamy Kovil", category: "Cultural & Heritage", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80", description: "Famous Hindu temple in Jaffna with beautiful architecture and cultural importance." },
    { id: 28, name: "Dutch Hospital Colombo", category: "Heritage & City", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", description: "Historic colonial building in Colombo now known for restaurants and shopping." },
    { id: 29, name: "Haputale", category: "Mountain & Hill Country", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", description: "Peaceful hill-country town offering beautiful mountain and tea-estate views." },
    { id: 30, name: "Delft Island", category: "Island & Heritage", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80", description: "Unique island in the north known for its wild landscapes, coral walls, and historic sites." }
  ];

  const [destinations, setDestinations] = useState(initialDestinations);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Heritage", "Beach & Coastal", "Nature & Wildlife", "Mountain & Hill Country", "Cultural & Heritage", "Adventure"];

  // Fetch dynamically from Supabase database so all places load automatically!
  useEffect(() => {
    async function fetchDestinations() {
      const { data, error } = await supabase.from('destinations').select('*');
      if (!error && data && data.length > 0) {
        setDestinations(data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category || 'Sri Lanka Destination',
          image: item.image_url || item.image || 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
          description: item.description || ''
        })));
      }
    }
    fetchDestinations();
  }, []);

  // Filtered list based on search and category
  const filtered = destinations.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory || (selectedCategory === "Heritage" && item.category.includes("Heritage"));
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleNext = () => {
    if (filtered.length === 0) return;
    setActiveIndex((prev) => (prev >= filtered.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    if (filtered.length === 0) return;
    setActiveIndex((prev) => (prev <= 0 ? filtered.length - 1 : prev - 1));
  };

  return (
    <div id="destinations" className="w-full bg-slate-950 py-20 px-4 overflow-hidden border-t border-slate-800 text-white relative">
      <div className="max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-editorial font-extrabold text-white mb-3">
          Explore 30 Iconic Sri Lankan Destinations
        </h2>
        <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto font-medium">
          From ancient rock fortresses to crystal clear beaches, mountain tea estates, and wild elephant parks.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="max-w-5xl mx-auto mb-10 space-y-4">
        {/* Search Bar */}
        <div className="relative w-full max-w-xl mx-auto">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search Sigiriya, Ella, Galle, Yala, Mirissa..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setActiveIndex(0);
            }}
            className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm shadow-inner transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveIndex(0);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lenticular Showcase Container */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 font-medium">
          No destinations found matching "{searchTerm}". Try another search!
        </div>
      ) : (
        <div className="relative w-full max-w-5xl mx-auto h-[460px] flex items-center justify-center perspective-[1200px]">
          {filtered.map((item, index) => {
            // Calculate circular index difference for smooth infinite scroll across filtered items
            const total = filtered.length;
            let offset = index - activeIndex;

            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isActive = offset === 0;

            // Hide cards beyond 2 steps away
            if (Math.abs(offset) > 2) return null;

            // Transform & Depth calculations
            let transformStyle = '';
            let zIndex = 10 - Math.abs(offset);
            let opacity = 1;

            if (offset === 0) {
              transformStyle = 'rotateY(0deg) scale(1.05) translateZ(50px)';
              opacity = 1;
            } else if (offset === 1) {
              transformStyle = 'translateX(180px) rotateY(-22deg) scale(0.88) translateZ(-40px)';
              opacity = 0.7;
            } else if (offset === -1) {
              transformStyle = 'translateX(-180px) rotateY(22deg) scale(0.88) translateZ(-40px)';
              opacity = 0.7;
            } else if (offset === 2) {
              transformStyle = 'translateX(340px) rotateY(-35deg) scale(0.72) translateZ(-120px)';
              opacity = 0.35;
            } else if (offset === -2) {
              transformStyle = 'translateX(-340px) rotateY(35deg) scale(0.72) translateZ(-120px)';
              opacity = 0.35;
            }

            return (
              <div
                key={item.id || index}
                onClick={() => setActiveIndex(index)}
                style={{
                  transform: transformStyle,
                  zIndex: zIndex,
                  opacity: opacity,
                  transformStyle: 'preserve-3d',
                }}
                className={`group absolute w-[280px] sm:w-[320px] h-[400px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-out shadow-2xl border ${
                  isActive 
                    ? 'border-emerald-400/80 ring-4 ring-emerald-500/20 shadow-emerald-950/80' 
                    : 'border-slate-700/60 hover:opacity-90'
                }`}
              >
                {/* Background Image with Hover Zoom Effect */}
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Card Badge Tag */}
                <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-extrabold text-emerald-400 border border-slate-800">
                  {item.category}
                </div>

                {/* Card Details */}
                <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col justify-end text-left">
                  <h3 className="text-2xl font-editorial font-extrabold text-white mb-2 leading-tight">
                    {item.name}
                  </h3>
                  <p className={`text-xs text-gray-300 line-clamp-2 leading-relaxed transition-all duration-300 ${
                    isActive ? 'opacity-100 mb-4' : 'opacity-0 h-0 overflow-hidden'
                  }`}>
                    {item.description}
                  </p>

                  {isActive && (
                    <Link 
                      to={`/destination/${item.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md w-fit cursor-pointer"
                    >
                      Explore Place <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation Controls & Counter */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={handlePrev}
            aria-label="Previous Destination"
            className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500 hover:bg-slate-800 text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Counter Badge */}
          <div className="bg-slate-900 border border-slate-800 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
            {activeIndex + 1} / {filtered.length} Places
          </div>

          <button
            onClick={handleNext}
            aria-label="Next Destination"
            className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500 hover:bg-slate-800 text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}

    </div>
  );
}
