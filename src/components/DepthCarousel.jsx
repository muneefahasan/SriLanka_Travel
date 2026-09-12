import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, X, Sparkles, Shirt, Calendar, MapPin, Info } from 'lucide-react';

export default function DepthCarousel({
  items = [],
  depth = 220,
  spread = 90,
  tilt = 22,
  tiltDirection = "right",
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.2,
  blur = 6,
  autoplay = true,
  loop = true,
  className = ""
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!autoplay || items.length === 0 || isModalOpen) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [autoplay, items.length, isModalOpen]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleOpenDetails = (festival) => {
    setSelectedFestival(festival);
    setIsModalOpen(true);
  };

  if (items.length === 0) return null;

  return (
    <div className={`relative w-full overflow-hidden py-8 flex flex-col items-center ${className}`}>
      <div
        className="relative w-full max-w-4xl h-[440px] sm:h-[490px] flex items-center justify-center"
        style={{ perspective: `${perspective}px` }}
      >
        {items.map((item, index) => {
          let offset = index - activeIndex;

          if (loop) {
            const total = items.length;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;
          }

          const isActive = offset === 0;
          if (Math.abs(offset) > visibleCards / 2) return null;

          const tiltAngle = tiltDirection === "right" ? -tilt * offset : tilt * offset;
          const translateX = offset * spread;
          const translateZ = -Math.abs(offset) * depth;
          const opacity = Math.max(0.2, 1 - Math.abs(offset) * falloff);
          const blurAmount = Math.abs(offset) * blur;
          const zIndex = 10 - Math.abs(offset);

          return (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${tiltAngle}deg)`,
                opacity: opacity,
                filter: `blur(${blurAmount}px)`,
                zIndex: zIndex,
                transformStyle: 'preserve-3d',
              }}
              className={`absolute w-[290px] sm:w-[350px] h-[390px] sm:h-[440px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-out shadow-2xl border ${
                isActive 
                  ? 'border-emerald-400 ring-4 ring-emerald-500/30 shadow-emerald-950/80 scale-105' 
                  : 'border-slate-800 hover:opacity-90'
              }`}
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title || item.alt || 'Festival Image'}
                className="w-full h-full object-cover"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Category Tag */}
              {item.category && (
                <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-extrabold text-emerald-400 border border-slate-800">
                  {item.category}
                </div>
              )}

              {/* Details Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-6 z-10 text-left">
                <h3 className="text-2xl font-editorial font-extrabold text-white mb-1">
                  {item.title || item.alt}
                </h3>
                {item.date && (
                  <p className="text-xs text-emerald-400 font-bold mb-2 flex items-center gap-1">
                    <Calendar size={13} /> {item.date} • {item.location}
                  </p>
                )}
                <p className={`text-xs text-slate-300 line-clamp-2 mb-3 transition-all ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                  {item.description}
                </p>

                {isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetails(item);
                    }}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    View Festival Details & Dress Code <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-6 mt-6 z-20">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="bg-slate-900 border border-slate-800 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold">
          {activeIndex + 1} / {items.length} Festivals
        </div>

        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Modal Popup for Festival Details & Dress Code */}
      {isModalOpen && selectedFestival && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-950 p-2 rounded-full border border-slate-800 transition-all cursor-pointer z-10"
            >
              <X size={20} />
            </button>

            {/* Banner Image */}
            <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-6 border border-slate-800">
              <img src={selectedFestival.image} alt={selectedFestival.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                {selectedFestival.category}
              </span>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-editorial font-extrabold text-white">{selectedFestival.title}</h3>
                <p className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1">
                  <Calendar size={13} /> {selectedFestival.date} • <MapPin size={13} /> {selectedFestival.location}
                </p>
              </div>
            </div>

            {/* Content & History */}
            <div className="space-y-5 text-left">
              <div>
                <h4 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Info size={16} /> Cultural Significance & History
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800/80 font-medium">
                  {selectedFestival.description}
                </p>
              </div>

              {/* Dress Code Guidelines */}
              <div>
                <h4 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Shirt size={16} /> Recommended Dress Code & Etiquette
                </h4>
                <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl text-xs text-emerald-200 leading-relaxed font-bold space-y-1.5">
                  <p>👕 <strong>Attire:</strong> {selectedFestival.dressCode || "Modest clothing covering shoulders and knees. White or light colors preferred for temple grounds."}</p>
                  <p>👟 <strong>Footwear:</strong> Must be removed prior to entering temple inner courtyards.</p>
                  <p>📸 <strong>Photography:</strong> Do not pose with your back directly turned towards sacred statues.</p>
                </div>
              </div>

              {/* Key Highlights */}
              {selectedFestival.highlights && (
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Sparkles size={16} /> Key Festival Highlights
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFestival.highlights.map((h, i) => (
                      <span key={i} className="bg-slate-800 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700">
                        ✨ {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all cursor-pointer mt-4"
              >
                Close Details Window
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
