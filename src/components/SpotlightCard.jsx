import React, { useRef, useState } from 'react';

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(0, 229, 255, 0.2)",
  borderColor = "rgba(16, 185, 129, 0.4)"
}) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 transition-all duration-300 ${className}`}
      style={{
        borderColor: opacity > 0 ? borderColor : undefined
      }}
    >
      {/* Spotlight Canvas Layer */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
