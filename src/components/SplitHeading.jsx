import { useRef, useEffect, useState } from 'react';

/**
 * SplitHeading
 * Splits heading text into words and reveals them one-by-one on scroll,
 * like an editorial magazine headline animating in. No extra dependencies.
 *
 * Usage:
 *   <SplitHeading as="h2" className="text-4xl font-editorial ...">
 *     Explore Iconic Sri Lankan Destinations
 *   </SplitHeading>
 */
export default function SplitHeading({
  children,
  as: Tag = 'h2',
  className = '',
  staggerMs = 45,
  startDelayMs = 0,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fallback: if children isn't a plain string (e.g. contains JSX), just render as-is with a simple fade
  if (!text) {
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              transitionProperty: 'transform, opacity',
              transitionDuration: '650ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${startDelayMs + i * staggerMs}ms`,
              transform: visible ? 'translateY(0%)' : 'translateY(110%)',
              opacity: visible ? 1 : 0,
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </Tag>
  );
}
