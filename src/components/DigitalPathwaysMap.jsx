import React from 'react';
import { MapPin } from 'lucide-react';

export default function DigitalPathwaysMap({ daysPlan = [], activeDay = 1, onSelectDay }) {
  // Preset 3D Map node positions on terrain mesh (matching screenshot 4)
  const nodeCoords = [
    { top: '22%', left: '20%', label: 'D1 - Kandy' },
    { top: '35%', left: '42%', label: 'D2 - Sigiriya' },
    { top: '48%', left: '68%', label: 'D3 - Ella' },
    { top: '64%', left: '46%', label: 'D4 - Galle' },
    { top: '78%', left: '22%', label: 'D5 - Jaffna' },
    { top: '55%', left: '30%', label: 'D6 - Mirissa' },
    { top: '30%', left: '80%', label: 'D7 - Trincomalee' }
  ];

  return (
    <div className="relative w-full h-[420px] rounded-3xl overflow-hidden bg-[#041019] border border-cyan-500/30 shadow-2xl flex items-center justify-center">
      {/* 3D Wireframe Grid Mesh Background (Matching Screenshot 4) */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 229, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 229, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          transform: 'perspective(600px) rotateX(55deg) scale(1.4)',
          transformOrigin: 'bottom center'
        }}
      />

      {/* Ambient Mountain Glow Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#041019] via-cyan-950/20 to-transparent pointer-events-none" />

      {/* SVG Glowing Digital Pathway Line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 420" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pathwayGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <path
          d="M 200,92 C 320,120 380,140 420,147 C 550,180 620,200 680,200 C 600,240 500,260 460,268 C 350,300 250,320 220,327"
          fill="none"
          stroke="url(#pathwayGlow)"
          strokeWidth="4"
          className="drop-shadow-[0_0_12px_#00e5ff]"
        />

        <path
          d="M 200,92 C 320,120 380,140 420,147 C 550,180 620,200 680,200 C 600,240 500,260 460,268 C 350,300 250,320 220,327"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeDasharray="8 8"
          className="animate-pulse opacity-80"
        />
      </svg>

      {/* Title Overlay */}
      <div className="absolute top-4 left-6 z-20">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/40">
          SRI LANKA DIGITAL PATHWAYS
        </span>
      </div>

      {/* Map Pin Nodes Overlay (Matching Screenshot 4) */}
      {daysPlan.map((item, idx) => {
        const coord = nodeCoords[idx % nodeCoords.length];
        const isActive = activeDay === item.day;

        return (
          <div
            key={item.day}
            onClick={() => onSelectDay && onSelectDay(item.day)}
            style={{ top: coord.top, left: coord.left }}
            className={`absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
              isActive ? 'scale-115' : 'hover:scale-110 opacity-85'
            }`}
          >
            <div className="flex flex-col items-center">
              {/* Glowing Pin Pinpoint */}
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all shadow-xl ${
                isActive
                  ? 'bg-cyan-500 border-white text-slate-950 ring-4 ring-cyan-400/40 shadow-cyan-400/80'
                  : 'bg-slate-900/90 border-cyan-400 text-cyan-300 shadow-cyan-950'
              }`}>
                <MapPin size={20} className={isActive ? 'fill-slate-950 text-slate-950' : 'text-cyan-400'} />
                {isActive && (
                  <span className="absolute -inset-1 rounded-full border border-cyan-400 animate-ping opacity-75" />
                )}
              </div>

              {/* Pin Label Box (D1 - Kandy, D2 - Sigiriya...) */}
              <div className={`mt-1.5 px-3 py-1 rounded-lg border text-xs font-bold whitespace-nowrap backdrop-blur-md shadow-lg transition-all ${
                isActive
                  ? 'bg-cyan-950/95 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/30'
                  : 'bg-slate-900/85 border-cyan-800/60 text-slate-200'
              }`}>
                D{item.day} - {item.location.split(' ')[0]}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
