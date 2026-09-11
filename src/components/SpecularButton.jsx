import React from 'react';

export default function SpecularButton({ children, onClick, className = "", icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-extrabold text-lg text-white overflow-hidden group cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-100 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)',
        boxShadow: '0 10px 30px -5px rgba(16, 185, 129, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.8), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Specular Highlight Glare Effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/40 via-white/10 to-transparent opacity-80 pointer-events-none rounded-full" />

      {/* Shimmer Light Reflection Sweep on Hover */}
      <span className="absolute -inset-full top-0 block w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-out pointer-events-none" />

      {/* Outer Metallic Specular Rim */}
      <span className="absolute inset-0 rounded-full border border-white/40 group-hover:border-white/80 transition-colors pointer-events-none" />

      {/* Button Content */}
      <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] flex items-center gap-3">
        {children}
        {Icon && <Icon size={22} className="group-hover:translate-x-2 transition-transform duration-300" />}
      </span>
    </button>
  );
}
