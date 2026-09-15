import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ChevronLeft, ChevronRight, ArrowRight, Search, Filter } from 'lucide-react';
import Reveal from './Reveal';
import SplitHeading from './SplitHeading';
import { DESTINATIONS_DATA } from '../data/destinationsData';

export default function LenticularCarousel() {
  const [destinations, setDestinations] = useState(DESTINATIONS_DATA);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Heritage", "Beach & Coastal", "Nature & Wildlife", "Mountain & Hill Country", "Cultural & Heritage", "Adventure"];

  // Fetch dynamically from Supabase database if available, merging fields smoothly by name & slug
 useEffect(() => {
  async function fetchDestinations() {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('status', 'approved');

      if (error) {
        console.error('Failed to load destinations:', error);
        return;
      }

      if (!data) return;

      setDestinations(prevList => {
        const result = [...prevList];

        data.forEach(dbItem => {
          const existingIndex = result.findIndex(
            item =>
              item.name?.trim().toLowerCase() ===
              dbItem.name?.trim().toLowerCase()
          );

          if (existingIndex !== -1) {
            // Existing destination → only update its DB image/details
            result[existingIndex] = {
              ...result[existingIndex],
              ...dbItem,
              image: dbItem.image_url || result[existingIndex].image,
              slug: result[existingIndex].slug || dbItem.id
            };
          } else {
            // New approved community destination → add it
            result.push({
              ...dbItem,
              image: dbItem.image_url,
              slug: String(dbItem.id)
            });
          }
        });

        return result;
      });
    } catch (error) {
      console.error('Destination loading error:', error);
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
        <SplitHeading as="h2" className="text-4xl md:text-5xl font-editorial font-extrabold text-white mb-3">
          Explore Iconic Sri Lankan Destinations
        </SplitHeading>
        <Reveal delay={150}>
          <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto font-medium">
            From ancient rock fortresses to crystal clear beaches, mountain tea estates, and wild elephant parks.
          </p>
        </Reveal>
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
                key={`${item.id || item.slug || item.name}-${index}`}
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
