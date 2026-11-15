import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserCircle, LogOut, CalendarCheck, CheckCircle2, Clock,
 XCircle, X, Menu, LayoutDashboard, ShieldCheck, ChevronDown, RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import GooeyNav from './GooeyNav';

export default function Navbar() {
  const navigate = useNavigate();

  /* ── Auth & role state ── */
  const [user, setUser]       = useState(null);
  const [role, setRole]       = useState(null);   // 'traveler' | 'guide' | 'admin'
  const [fullName, setFullName] = useState('');

  /* ── UI state ── */
  const [isBookingsOpen,   setIsBookingsOpen]   = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen,   setIsUserMenuOpen]   = useState(false);

  /* ── Bookings state ── */
  const [myBookings,      setMyBookings]      = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError,   setBookingsError]   = useState('');
  const [bookingsRefreshKey, setBookingsRefreshKey] = useState(0);

  const userMenuRef = useRef(null);

  /* ════════════════════════════════════════════
     Auth listener + profile fetch
  ════════════════════════════════════════════ */
  useEffect(() => {
    let mounted = true;

    async function loadProfile(uid) {
      if (!uid) { if (mounted) { setRole(null); setFullName(''); } return; }
      const { data } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', uid)
        .single();
      if (mounted && data) {
        setRole(data.role || 'traveler');
        setFullName(data.full_name || '');
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      loadProfile(session?.user?.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!mounted) return;
      const u = session?.user ?? null;
      setUser(u);
      loadProfile(u?.id);
      if (!u) {
        setMyBookings([]);
        setBookingsError('');
        setIsBookingsOpen(false);
        setIsUserMenuOpen(false);
      }
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  /* ════════════════════════════════════════════
     Load bookings (traveler only)
  ════════════════════════════════════════════ */
  useEffect(() => {
    if (role !== 'traveler') return;

    async function loadMyBookings() {
      if (!user) {
        setMyBookings([]); setBookingsError(''); setBookingsLoading(false); return;
      }
      setBookingsLoading(true); setBookingsError('');
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`id, traveler_id, traveler_name, contact_phone,
                   destination_name, guide_name, travel_date,
                   headcount, guide_type, status, guide_id`)
          .eq('traveler_id', user.id)
          .order('id', { ascending: false });
       
if (error) throw error;

const bookingsWithGuides = await Promise.all(
  (data || []).map(async (booking) => {
    if (!booking.guide_id) {
      return { ...booking, guideDetails: null };
    }

    const { data: guideData, error: guideError } =
      await supabase.rpc('get_my_booking_guide', {
        p_booking_id: booking.id,
      });

    if (guideError) {
      console.warn(
        `Could not load guide for booking ${booking.id}:`,
        guideError
      );

      return { ...booking, guideDetails: null };
    }

    
const guide = guideData?.[0] || null;
let photoUrl = null;

if (guide?.avatar_url) {
  const { data: photoData, error: photoError } =
    await supabase.storage
      .from('guide-photos')
      .createSignedUrl(guide.avatar_url, 300);

  if (!photoError) {
    photoUrl = photoData?.signedUrl || null;
  }
}

return {
  ...booking,
  guideDetails: guide
    ? { ...guide, photoUrl }
    : null,
};

  })
);

setMyBookings(bookingsWithGuides);

      } catch (err) {
        console.error('Error loading bookings:', err);
        setBookingsError('Unable to load your bookings. Please try again.');
      } finally {
        setBookingsLoading(false);
      }
    }

    loadMyBookings();
  }, [user, role, isBookingsOpen, bookingsRefreshKey]);

  /* ════════════════════════════════════════════
     Logout
  ════════════════════════════════════════════ */
  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout failed:', error.message);
    return;
  }

  setIsUserMenuOpen(false);
  setIsMobileMenuOpen(false);
  setUser(null);
  setRole(null);
  setFullName('');
  setMyBookings([]);
  setBookingsError('');
  navigate('/');
};

  /* ════════════════════════════════════════════
     Close user dropdown on outside click
  ════════════════════════════════════════════ */
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
    // Close My Bookings modal with Escape key
  useEffect(() => {
    if (!isBookingsOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsBookingsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isBookingsOpen]);

  /* ════════════════════════════════════════════
     Mobile nav scroll
  ════════════════════════════════════════════ */
  const handleMobileNavClick = (href) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /* ════════════════════════════════════════════
     Nav items
  ════════════════════════════════════════════ */
 const navItems = [
  { label: 'Destinations',  href: '#destinations' },
  { label: 'Trip Planner',  href: '#trip-planner' },
  { label: 'Weather',       href: '#weather-widget' },
  { label: 'Transport',     href: '#transport' },
  { label: 'Festivals',     href: '#festivals' },
  { label: 'Tourist Tools', href: '#tourist-tools' },
  { label: 'Guides',        href: '#tour-guides' },
];
  /* ── Role helpers ── */
  const displayName = fullName || user?.email?.split('@')[0] || '';
  const isAdmin    = role === 'admin';
  const isGuide    = role === 'guide';
  const isTraveler = role === 'traveler';

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <nav className="w-full bg-slate-950/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800/60 shadow-lg px-5 py-2.5 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        
        {/* ── XplorSL image logo ── */}
<Link
  to="/"
  aria-label="XplorSL home"
  className="flex items-center shrink-0 min-w-0"
>
  <img
    src="/xplorsl-logo.png"
    alt="XplorSL"
    className="h-10 sm:h-11 w-auto max-w-[150px] sm:max-w-[190px] object-contain"
    fetchPriority="high"
  />
</Link>
        {/* ── Desktop GooeyNav (home only links) ── */}
        <div className="hidden lg:flex flex-1 justify-center">
          <GooeyNav items={navItems} />
        </div>

        {/* ── Right side ── */}
        <div className="flex items-center gap-2 shrink-0">

          {user ? (
            <>
              {/* ── Desktop user dropdown ── */}
              <div className="hidden lg:block relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(v => !v)}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-all group"
                >
                  {/* Role badge colour */}
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    isAdmin ? 'bg-red-400' : isGuide ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  <span className="max-w-[110px] truncate text-slate-200">{displayName}</span>
                  {/* Traveler: booking count badge */}
                  {isTraveler && (
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">
                      {myBookings.length}
                    </span>
                  )}
                  {/* Role pill */}
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide ${
                    isAdmin
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : isGuide
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {role}
                  </span>
                  <ChevronDown size={12} className={`text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown panel */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-800">
                      <p className="text-xs font-black text-white truncate">{displayName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    {/* Traveler: My Bookings */}
                    {isTraveler && (
                      <button
                        onClick={() => { setIsUserMenuOpen(false); setIsBookingsOpen(true); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-emerald-400 transition-all cursor-pointer"
                      >
                        <CalendarCheck size={14} className="text-emerald-400" />
                        My Bookings
                        <span className="ml-auto bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">
                          {myBookings.length}
                        </span>
                      </button>
                    )}

                    {/* Guide: Dashboard */}
                    {isGuide && (
                      <Link
                        to="/guide-dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-amber-400 transition-all"
                      >
                        <LayoutDashboard size={14} className="text-amber-400" />
                        Guide Dashboard
                      </Link>
                    )}

                    {/* Admin: Admin Panel */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-red-400 transition-all"
                      >
                        <ShieldCheck size={14} className="text-red-400" />
                        Admin Panel
                      </Link>
                    )}

                    {/* Logout */}
                    <div className="border-t border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-950/60 transition-all cursor-pointer"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Not logged in */
            <Link
              to="/login"
             className="hidden lg:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg font-bold transition-all shadow-md text-xs"
            >
              <UserCircle size={15} />
              <span>Login / Join</span>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(v => !v)}
            className="lg:hidden flex items-center justify-center w-8 h-8 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          Mobile Dropdown
      ══════════════════════════════════════════ */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 pb-3 border-t border-slate-800 pt-3 space-y-0.5">

          {/* Nav links */}
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleMobileNavClick(item.href)}
              className="w-full text-left px-3 py-2 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-all cursor-pointer"
            >
              {item.label}
            </button>
          ))}

          {/* Auth section */}
          <div className="pt-2 mt-1 border-t border-slate-800 space-y-1.5">
            {user ? (
              <>
                {/* User info row */}
                <div className="flex items-center gap-2 px-3 py-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    isAdmin ? 'bg-red-400' : isGuide ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  <span className="text-xs font-bold text-slate-200 truncate flex-1">{displayName}</span>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                    isAdmin
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : isGuide
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>{role}</span>
                </div>

                {/* Traveler: bookings */}
                {isTraveler && (
                  <button
                    onClick={() => { setIsBookingsOpen(true); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-2 bg-slate-900 border border-slate-700 text-emerald-400 px-3 py-2.5 rounded-lg font-bold text-xs cursor-pointer"
                  >
                    <CalendarCheck size={14} />
                    My Bookings
                    <span className="ml-auto bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">
                      {myBookings.length}
                    </span>
                  </button>
                )}

                {/* Guide: dashboard */}
                {isGuide && (
                  <Link
                    to="/guide-dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 bg-slate-900 border border-slate-700 text-amber-400 px-3 py-2.5 rounded-lg font-bold text-xs"
                  >
                    <LayoutDashboard size={14} />
                    Guide Dashboard
                  </Link>
                )}

                {/* Admin: panel */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 bg-slate-900 border border-slate-700 text-red-400 px-3 py-2.5 rounded-lg font-bold text-xs"
                  >
                    <ShieldCheck size={14} />
                    Admin Panel
                  </Link>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 bg-red-950/80 hover:bg-red-900 text-red-300 px-3 py-2.5 rounded-lg font-bold border border-red-800 text-xs cursor-pointer"
                >
                  <LogOut size={13} />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2.5 rounded-lg font-bold transition-all text-xs"
              >
                <UserCircle size={15} />
                Login / Join
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          My Bookings Modal (Traveler only)
      ══════════════════════════════════════════ */}
      {isBookingsOpen && createPortal(
        <div
          onClick={(e) => e.target === e.currentTarget && setIsBookingsOpen(false)}
          className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
        >
         <div
  role="dialog"
  aria-modal="true"
  aria-labelledby="my-bookings-title"
className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 max-w-lg w-full shadow-2xl relative text-white max-h-[85vh] overflow-y-auto custom-scrollbar"
>
            <button

  type="button"
  aria-label="Close My Bookings"
  onClick={() => setIsBookingsOpen(false)}
  className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-950 p-1.5 rounded-lg border border-slate-800 transition-all cursor-pointer"
>
  <X size={18} />
</button>

<div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
  <div className="flex items-center gap-3 min-w-0">
    <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
      <CalendarCheck size={22} />
    </div>

    <div className="min-w-0">
      <h3
  id="my-bookings-title"
  className="text-lg font-editorial font-extrabold text-white"
>
        My Guide Booking Requests
      </h3>
      <p className="text-xs text-slate-400">
        Track live acceptance status from certified SLTDA guides
      </p>
    </div>
  </div>

  <button
    type="button"
    onClick={() => setBookingsRefreshKey((key) => key + 1)}
    disabled={bookingsLoading}
    className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-semibold"
  >
    <RefreshCw size={14} className={bookingsLoading ? 'animate-spin' : ''} />
    Refresh
  </button>
</div>

            {/* States */}
            {bookingsLoading ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Loading your bookings...</p>
              </div>
            ) : bookingsError ? (
              <div className="text-center py-12 space-y-3">
                <XCircle size={40} className="text-red-500 mx-auto" />
                <p className="text-sm font-bold text-red-400">{bookingsError}</p>
              </div>
            ) : myBookings.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Clock size={40} className="text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-300">No Booking Requests Sent Yet</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Explore destinations and click &quot;Book a Tour Guide&quot; to request a certified guide.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myBookings.map((b, idx) => {
                  const isAccepted = b.status === 'accepted';
                  const isDeclined = b.status === 'declined';
                  const guide = b.guideDetails;
                  const guideLanguages = guide?.languages?.join(', ');
                  return (
                    <div
                      key={b.id || idx}
                      className={`p-4 rounded-xl border transition-all ${
                        isAccepted ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-slate-500 font-medium mb-1">
  Booking ID: #{b.id}
</p>
                         <h4 className="font-bold text-white text-sm break-words">{b.destination_name || 'Custom Sri Lanka Tour'}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Date: <span className="text-slate-200 font-semibold">{b.travel_date}</span>
                            {' '}• Guests: <span className="text-slate-200 font-semibold">{b.headcount ?? 'N/A'}</span>
                          </p>
                        </div>
                        {isAccepted ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg shadow-md shrink-0">
                            <CheckCircle2 size={11} /> Accepted
                          </span>
                        ) : isDeclined ? (
                          <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg shadow-md shrink-0">
                            <XCircle size={11} /> Declined
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-lg shrink-0">
                            <Clock size={11} /> Pending
                          </span>
                        )}
                      </div>
                      
<div className="pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-3">
  <div>
    Guide Type: <strong className="text-emerald-400">{b.guide_type || 'SLTDA Licensed Guide'}</strong>
  </div>

  {guide ? (
    <div className="flex items-start gap-3">
      {guide.photoUrl ? (
        <img
          src={guide.photoUrl}
          alt={guide.full_name || 'Tour guide'}
          className="w-12 h-12 rounded-full object-cover border border-slate-700"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
        <UserCircle size={20} />
        </div>
      )}

      <div className="min-w-0 space-y-1">
      <p className="font-bold text-white text-sm break-words">
          {guide.full_name || 'Assigned Guide'}
        </p>
        {guide.district && <p className="text-slate-400 break-words">District: {guide.district}</p>}
        {guideLanguages && <p className="text-slate-400 break-words">Languages: {guideLanguages}</p>}
        {guide.license_number && (
          <p className="text-slate-400 break-words">SLTDA License: {guide.license_number}</p>
        )}
        {guide.rating != null && (
          <p className="text-amber-400">★ {guide.rating}</p>
        )}
      </div>
    </div>
  ) : (
    <p className="text-slate-400">
      {b.guide_id ? 'Guide details currently unavailable.' : 'Waiting for guide assignment.'}
    </p>
  )}

  {b.contact_phone && (
    <div className="text-slate-400">Contact: {b.contact_phone}</div>
  )}
</div>

                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => setIsBookingsOpen(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl shadow-lg transition-all cursor-pointer mt-5"
            >
              Close
            </button>
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
}
