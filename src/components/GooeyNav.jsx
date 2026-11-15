import React, { useState, useEffect } from 'react';

export default function GooeyNav({
  items = [
    { label: "Destinations",  href: "#destinations"   },
    { label: "Trip Planner",  href: "#trip-planner"   },
    { label: "Weather",       href: "#weather-widget" },
    { label: "Transport",     href: "#transport"      },
    { label: "Festivals",     href: "#festivals"      },
    { label: "Tourist Tools", href: "#tourist-tools"  }
  ],
  className = ""
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  /* ── Scroll-based active highlight via IntersectionObserver ── */
  useEffect(() => {
    const sectionIds = items.map(i => i.href.replace('#', ''));

    const observers = [];
    const visible = new Map(); // id → intersectionRatio

    const pick = () => {
      let best = null;
      let bestRatio = -1;
      visible.forEach((ratio, id) => {
        if (ratio > bestRatio) { bestRatio = ratio; best = id; }
      });
      if (best !== null) {
        const idx = sectionIds.indexOf(best);
        if (idx !== -1) setActiveIndex(idx);
      }
    };

    sectionIds.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
          pick();
        },
        { threshold: [0, 0.1, 0.25, 0.5], rootMargin: '-60px 0px -30% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [items]);

  /* ── Click handler: manual override + smooth scroll ── */
  const handleClick = (e, href, idx) => {
    setActiveIndex(idx);
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`relative flex items-center bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-lg ${className}`}>
      {/* SVG Gooey Filter */}
      <svg className="hidden">
        <defs>
          <filter id="gooey-nav-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
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

      <ul className="flex items-center gap-0.5 relative z-10">
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <li key={idx} className="relative">
              <a
                href={item.href}
                onClick={(e) => handleClick(e, item.href, idx)}
                className={`relative z-10 px-3.5 py-1.5 text-xs font-bold transition-all duration-300 rounded-lg inline-block cursor-pointer select-none ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </a>

              {/* Active Pill */}
              {isActive && (
                <span
                  className="absolute inset-0 bg-emerald-600 rounded-lg shadow-md shadow-emerald-950/50 transition-all duration-400 -z-0"
                  style={{ filter: 'url(#gooey-nav-filter)' }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
