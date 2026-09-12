import React, { useState } from 'react';

export default function GooeyNav({
  items = [
    { label: "Destinations", href: "#destinations" },
    { label: "Trip Planner", href: "#trip-planner" },
    { label: "Weather", href: "#weather-widget" },
    { label: "Transport", href: "#transport" },
    { label: "Festivals", href: "#festivals" },
    { label: "Tools", href: "#tools" }
  ],
  initialActiveIndex = 0,
  className = ""
}) {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const handleClick = (e, href, idx) => {
    setActiveIndex(idx);
    if (href.startsWith('#')) {
      e.preventDefault();
      const elem = document.querySelector(href);
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`relative flex items-center bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full border border-slate-800 shadow-xl ${className}`}>
      {/* SVG Gooey Filter Definition */}
      <svg className="hidden">
        <defs>
          <filter id="gooey-nav-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="gooey"
            />
            <feBlend in="SourceGraphic" in2="gooey" />
          </filter>
        </defs>
      </svg>

      <ul className="flex items-center gap-1 relative z-10">
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <li key={idx} className="relative">
              <a
                href={item.href}
                onClick={(e) => handleClick(e, item.href, idx)}
                className={`relative z-10 px-4 py-2 text-xs md:text-sm font-extrabold transition-all duration-300 rounded-full inline-block cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </a>

              {/* Gooey Active Pill Highlight */}
              {isActive && (
                <span
                  className="absolute inset-0 bg-emerald-600 rounded-full shadow-lg shadow-emerald-950 transition-all duration-500 -z-0"
                  style={{
                    filter: 'url(#gooey-nav-filter)'
                  }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
