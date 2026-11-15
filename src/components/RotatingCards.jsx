
import React, { useState, useEffect } from 'react';
import {
  Award,
  MapPin,
  UserCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function RotatingCards({
  guides = [],
  radius = 320,
  cardWidth = 300,
  cardHeight = 420,
  onBookGuide,
  className = ''
}) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startAngle, setStartAngle] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const total = guides.length;
  const angleStep = 360 / (total || 1);

  // Automatically rotate the guide cards.
  useEffect(() => {
    if (isDragging || total === 0) return;

    const interval = setInterval(() => {
      setRotationAngle((prev) => prev - angleStep);
    }, 3800);

    return () => clearInterval(interval);
  }, [isDragging, total, angleStep]);

  // Keep the active guide index synchronized with rotation.
  useEffect(() => {
    if (total === 0) return;

    const normalizedAngle = ((-rotationAngle % 360) + 360) % 360;
    const currentIndex = Math.round(normalizedAngle / angleStep) % total;

    setActiveIndex(currentIndex);
  }, [rotationAngle, total, angleStep]);

  // Start mouse or touch dragging.
  const handleMouseDown = (e) => {
    const pointerX =
      typeof e.clientX === 'number'
        ? e.clientX
        : e.touches?.[0]?.clientX ?? 0;

    setIsDragging(true);
    setStartX(pointerX);
    setStartAngle(rotationAngle);
  };

  // Rotate the carousel while dragging.
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const pointerX =
      typeof e.clientX === 'number'
        ? e.clientX
        : e.touches?.[0]?.clientX ?? 0;

    const deltaX = pointerX - startX;

    setRotationAngle(startAngle + deltaX * 0.4);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Navigate directly to a selected guide.
  const rotateTo = (index) => {
    setRotationAngle(-index * angleStep);
  };

  if (total === 0) return null;

  return (
    <div
      className={`relative w-full overflow-hidden py-12 flex flex-col items-center select-none ${className}`}
    >
      {/* 3D Circular Rotating Container */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onTouchCancel={handleMouseUp}
        className="relative w-full max-w-5xl h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: '1200px' }}
      >
        <div
          style={{
            transform: `rotateY(${rotationAngle}deg)`,
            transformStyle: 'preserve-3d',
            transition: isDragging
              ? 'none'
              : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {guides.map((guide, idx) => {
            const cardAngle = idx * angleStep;
            const isActive = idx === activeIndex;
            const guideImage = guide.image || guide.profile_pic || null;
            const guideName = guide.name || 'Licensed Guide';

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
                {/* Initials Placeholder - visible when no photo exists */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  <span className="w-28 h-28 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-5xl font-bold text-emerald-400">
                    {guideName.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Guide Photo */}
                {guideImage && (
                  <img
                    src={guideImage}
                    alt={`${guideName} profile`}
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="absolute inset-0 z-0 w-full h-full object-cover"
                  />
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

                {/* SLTDA Badge */}
                <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold text-emerald-400 border border-slate-800 flex items-center gap-1.5 shadow-lg">
                  <Award size={14} />
                  {guide.license_status || guide.sltda_status || 'SLTDA Licensed'}
                </div>

                {/* Guide Details */}
                <div className="absolute bottom-0 inset-x-0 p-6 z-10 text-left">
                  <h3 className="text-2xl font-editorial font-extrabold text-white mb-1">
                    {guideName}
                  </h3>

                  <p className="text-xs text-emerald-400 font-bold mb-2 flex items-center gap-1">
                    <MapPin size={13} />
                    {guide.district || guide.location || 'Sri Lanka'}
                  </p>

                  <p className="text-xs text-slate-300 line-clamp-2 mb-4 font-medium leading-relaxed">
                    {guide.bio ||
                      guide.specialties ||
                      'Expert licensed Sri Lanka tour guide.'}
                  </p>

                  {/* Book Guide */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      if (onBookGuide) {
                        onBookGuide(guide);
                      }
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-3 rounded-xl transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserCheck size={16} />
                    Book Guide
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
          type="button"
          aria-label="Previous guide"
          onClick={() =>
            rotateTo((activeIndex - 1 + total) % total)
          }
          className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="bg-slate-900 border border-slate-800 text-emerald-400 px-5 py-2 rounded-full text-xs font-extrabold tracking-wider">
          Guide {activeIndex + 1} of {total} (Drag 3D Orbit)
        </div>

        <button
          type="button"
          aria-label="Next guide"
          onClick={() =>
            rotateTo((activeIndex + 1) % total)
          }
          className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
