import { useEffect, useState } from 'react';
import { useLocation, Routes } from 'react-router-dom';

/**
 * AnimatedRoutes
 * Renders <Routes> with a fade + slide-up transition on every route change.
 * The outgoing page finishes its exit animation (using a "frozen" location)
 * before the new page mounts, avoiding the flash-swap you'd get from just
 * wrapping <Routes> in CSS.
 *
 * No extra dependency: pure CSS transitions driven by React state.
 */
export default function AnimatedRoutes({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState('in'); // 'in' | 'out'

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setStage('out');
    }
  }, [location, displayLocation]);

  const handleTransitionEnd = () => {
    if (stage === 'out') {
      setDisplayLocation(location);
      setStage('in');
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  return (
    <>
      {/* Thin progress sweep across the top while a route is transitioning */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-emerald-500 via-emerald-300 to-emerald-500 z-[1000] transition-all ease-out pointer-events-none"
        style={{
          width: stage === 'out' ? '100%' : '0%',
          opacity: stage === 'out' ? 1 : 0,
          transitionDuration: stage === 'out' ? '260ms' : '0ms',
        }}
      />
      <div
        onTransitionEnd={handleTransitionEnd}
        className="transition-all"
        style={{
          transitionDuration: '300ms',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: stage === 'out' ? 0 : 1,
          transform: stage === 'out' ? 'translateY(16px) scale(0.985)' : 'translateY(0) scale(1)',
          filter: stage === 'out' ? 'blur(4px)' : 'blur(0px)'
        }}
      >
        <Routes location={displayLocation}>
          {children}
        </Routes>
      </div>
    </>
  );
}
