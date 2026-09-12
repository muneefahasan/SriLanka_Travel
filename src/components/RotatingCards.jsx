import React, { useState, useRef, useEffect } from 'react';
import { Award, MapPin, Star, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';

export default function RotatingCards({
  guides = [],
  radius = 320,
  cardWidth = 300,
  cardHeight = 420,
  onBookGuide,
  className = ""
}) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startAngle, setStartAngle] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const total = guides.length;
  const angleStep = 360 / (total || 1);

  // Auto rotation
  useEffect(() => {
    if (isDragging || total === 0) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => prev - angleStep);
    }, 3800);
    return () => clearInterval(interval);
  }, [isDragging, total, angleStep]);

  // Sync active index
  useEffect(() => {
    if (total === 0) return;
    const normalizedAngle = ((-rotationAngle % 360) + 360) % 360;
    const currentIdx = Math.round(normalizedAngle / angleStep) % total;
    setActiveIndex(currentIdx);
  }, [rotationAngle, total, angleStep]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || e.touches?.[0]?.clientX || 0);
    setStartAngle(rotationAngle);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || e.touches?.[0]?.clientX || 0;
    const deltaX = currentX - startX;
    setRotationAngle(startAngle + deltaX * 0.4);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const rotateTo = (index) => {
    setRotationAngle(-index * angleStep);
  };

  if (total === 0) return null;

  return (
    <div className={`relative w-full overflow-hidden py-12 flex flex-col items-center select-none ${className}`}>
      {/* 3D Circular Rotating Container */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className="relative w-full max-w-5xl h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: '1200px' }}
      >
        <div
          style={{
            transform: `rotateY(${rotationAngle}deg)`,
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {guides.map((guide, idx) => {
            const cardAngle = idx * angleStep;
            const isActive = idx === activeIndex;

            return (
              <div
                key={guide.id || idx}
                onClick={() => rotateTo(idx)}
                style={{
                  position: 'absolute',
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'visible'
                }}
                className={`rounded-3xl overflow-hidden shadow-2xl border transition-all duration-500 bg-slate-900 ${
                  isActive
                    ? 'border-emerald-400 ring-4 ring-emerald-500/30 shadow-emerald-950/80 scale-105 opacity-100'
                    : 'border-slate-800 opacity-60 hover:opacity-85'
                }`}
              >
                {/* Guide Image */}
                <img
                  src={guide.image || guide.profile_pic || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'}
                  alt={guide.name}
                  className="w-full h-full object-cover"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* SLTDA Badge */}
                <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold text-emerald-400 border border-slate-800 flex items-center gap-1.5 shadow-lg">
                  <Award size={14} /> {guide.license_status || guide.sltda_status || 'SLTDA Licensed'}
                </div>

                {/* Content Details */}
                <div className="absolute bottom-0 inset-x-0 p-6 z-10 text-left">
                  <h3 className="text-2xl font-editorial font-extrabold text-white mb-1">
                    {guide.name}
                  </h3>

                  <p className="text-xs text-emerald-400 font-bold mb-2 flex items-center gap-1">
                    <MapPin size={13} /> {guide.district || guide.location || 'Sri Lanka'} • ⭐ {guide.rating || 4.9}
                  </p>

                  <p className="text-xs text-slate-300 line-clamp-2 mb-4 font-medium leading-relaxed">
                    {guide.bio || guide.specialties || 'Expert licensed Sri Lanka tour guide with 8+ years experience.'}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onBookGuide) onBookGuide(guide);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-3 rounded-xl transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserCheck size={16} /> Book Guide ({guide.phone || 'Contact'})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Buttons & Counter */}
      <div className="flex items-center justify-center gap-6 mt-8 z-20">
        <button
          onClick={() => rotateTo((activeIndex - 1 + total) % total)}
          className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="bg-slate-900 border border-slate-800 text-emerald-400 px-5 py-2 rounded-full text-xs font-extrabold tracking-wider">
          Guide {activeIndex + 1} of {total} (Drag 3D Orbit)
        </div>

        <button
          onClick={() => rotateTo((activeIndex + 1) % total)}
          className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
