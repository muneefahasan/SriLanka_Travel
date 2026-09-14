import { useRef, useEffect, useState } from 'react';

/**
 * Reveal
 * Fades + slides content up into view the first time it enters the viewport.
 * Zero extra dependencies — uses IntersectionObserver + CSS transitions.
 *
 * Usage:
 *   <Reveal><h2>My Heading</h2></Reveal>
 *   <Reveal delay={150} y={32}><p>...</p></Reveal>
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  y = 28,
  duration = 700,
  threshold = 0.15,
  once = true,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect users who prefer reduced motion
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
        opacity: visible ? 1 : 0,
      }}
      className={`transition-all ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
