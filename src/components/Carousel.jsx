import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Award, MapPin, Phone, Star, UserCheck } from 'lucide-react';

export default function Carousel({
  guides = [],
  baseWidth = 300,
  autoplay = true,
  autoplayDelay = 3000,
  pauseOnHover = true,
  loop = true,
  onBookGuide,
  className = ""
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!autoplay || isHovered || guides.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % guides.length);
    }, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, isHovered, guides.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % guides.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? guides.length - 1 : prev - 1));
  };

  if (guides.length === 0) return null;

  return (
    <div
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
      className={`relative w-full overflow-hidden py-8 flex flex-col items-center ${className}`}
    >
      <div className="relative w-full max-w-5xl h-[440px] flex items-center justify-center perspective-[1200px]">
        {guides.map((guide, index) => {
          let offset = index - activeIndex;

          if (loop) {
            const total = guides.length;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;
          }

          const isActive = offset === 0;
          if (Math.abs(offset) > 2) return null;

          let transformStyle = '';
          let opacity = 1;
          let zIndex = 10 - Math.abs(offset);

          if (offset === 0) {
            transformStyle = 'rotateY(0deg) scale(1.05) translateZ(40px)';
            opacity = 1;
          } else if (offset === 1) {
            transformStyle = 'translateX(220px) rotateY(-20deg) scale(0.88) translateZ(-30px)';
            opacity = 0.75;
          } else if (offset === -1) {
            transformStyle = 'translateX(-220px) rotateY(20deg) scale(0.88) translateZ(-30px)';
            opacity = 0.75;
          } else if (offset === 2) {
            transformStyle = 'translateX(380px) rotateY(-32deg) scale(0.72) translateZ(-100px)';
            opacity = 0.35;
          } else if (offset === -2) {
            transformStyle = 'translateX(-380px) rotateY(32deg) scale(0.72) translateZ(-100px)';
            opacity = 0.35;
          }

          return (
            <div
              key={guide.id || index}
              onClick={() => setActiveIndex(index)}
              style={{
                transform: transformStyle,
                opacity: opacity,
                zIndex: zIndex,
                transformStyle: 'preserve-3d',
                width: `${baseWidth}px`
              }}
              className={`absolute h-[400px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-out shadow-2xl border ${
                isActive
                  ? 'border-emerald-400 ring-4 ring-emerald-500/30 shadow-emerald-950/80'
                  : 'border-slate-800'
              }`}
            >
              {/* Profile Image */}
              <img
                src={guide.image || guide.profile_pic || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'}
                alt={guide.name}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

              {/* Badge */}
              <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-extrabold text-emerald-400 border border-slate-800 flex items-center gap-1">
                <Award size={13} /> {guide.license_status || guide.sltda_status || 'SLTDA Licensed'}
              </div>

              {/* Card Details */}
              <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col text-left">
                <h3 className="text-2xl font-editorial font-extrabold text-white mb-1">
                  {guide.name}
                </h3>
                <p className="text-xs text-emerald-400 font-bold mb-2 flex items-center gap-1">
                  <MapPin size={13} /> {guide.district || guide.location || 'Sri Lanka'} • ⭐ {guide.rating || 4.9}
                </p>

                <p className={`text-xs text-slate-300 line-clamp-2 mb-4 ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                  {guide.bio || guide.specialties || 'Expert licensed Sri Lanka tour guide with 8+ years experience.'}
                </p>

                {isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onBookGuide) onBookGuide(guide);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer w-full"
                  >
                    <UserCheck size={14} /> Book Guide ({guide.phone || 'Contact'})
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-6 mt-6 z-20">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="bg-slate-900 border border-slate-800 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold">
          {activeIndex + 1} / {guides.length} Licensed Guides
        </div>

        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
