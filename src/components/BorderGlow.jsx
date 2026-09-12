import React, { useRef, useState, useEffect } from 'react';

export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8']
}) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Edge sensitivity calculation
    const distToEdge = Math.min(x, y, rect.width - x, rect.height - y);
    if (distToEdge <= edgeSensitivity || (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height)) {
      setOpacity(glowIntensity);
    } else {
      setOpacity(0);
    }
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const gradientColors = colors.join(', ');

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative p-[2px] transition-all duration-300 ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        backgroundColor: backgroundColor,
      }}
    >
      {/* Border Glow Gradient Background */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300"
        style={{
          opacity: opacity,
          borderRadius: `${borderRadius}px`,
          padding: '2px',
          background: `radial-gradient(${glowRadius * 8}px circle at ${mousePos.x}px ${mousePos.y}px, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%, transparent 80%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          boxShadow: `0 0 ${glowRadius}px rgba(${glowColor}, ${glowIntensity})`
        }}
      />

      {/* Inner Content */}
      <div
        className="relative w-full h-full"
        style={{
          borderRadius: `${borderRadius - 2}px`,
          backgroundColor: backgroundColor,
        }}
      >
        {children}
      </div>
    </div>
  );
}
