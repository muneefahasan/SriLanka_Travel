import React, { useRef, useState } from 'react';
import { Award, MapPin, Phone, Star, UserCheck } from 'lucide-react';

export default function ParallaxCards({ guides = [], onBookGuide }) {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {guides.map((guide, idx) => (
          <ParallaxCardItem
            key={guide.id || idx}
            guide={guide}
            onBookGuide={onBookGuide}
          />
        ))}
      </div>
    </div>
  );
}

function ParallaxCardItem({ guide, onBookGuide }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, translateZ: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTransform({ rotateX, rotateY, translateZ: 30 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform({ rotateX: 0, rotateY: 0, translateZ: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px'
      }}
      className="w-full h-[460px] cursor-pointer"
    >
      <div
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) translateZ(${transform.translateZ}px)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d'
        }}
        className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 group"
      >
        {/* Parallax Background Image */}
        <img
          src={guide.image || guide.profile_pic || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'}
          alt={guide.name}
          style={{
            transform: isHovered ? 'scale(1.1) translateZ(10px)' : 'scale(1) translateZ(0px)',
            transition: 'transform 0.5s ease-out'
          }}
          className="w-full h-full object-cover"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-10" />

        {/* Floating 3D Badge Tag */}
        <div
          style={{
            transform: isHovered ? 'translateZ(40px)' : 'translateZ(10px)',
            transition: 'transform 0.3s ease-out'
          }}
          className="absolute top-4 left-4 z-20 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold text-emerald-400 border border-slate-800 flex items-center gap-1.5 shadow-lg"
        >
          <Award size={14} /> {guide.license_status || guide.sltda_status || 'SLTDA Licensed'}
        </div>

        {/* Floating 3D Content Container */}
        <div
          style={{
            transform: isHovered ? 'translateZ(50px)' : 'translateZ(15px)',
            transition: 'transform 0.3s ease-out'
          }}
          className="absolute bottom-0 inset-x-0 p-6 z-20 text-left"
        >
          <h3 className="text-2xl font-editorial font-extrabold text-white mb-1 drop-shadow-md">
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
    </div>
  );
}
