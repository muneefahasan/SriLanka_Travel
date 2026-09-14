import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Globe, UserCircle, LogOut, CalendarCheck, CheckCircle2, Clock, XCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import GooeyNav from './GooeyNav';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const { lang, changeLanguage, t } = useLanguage();

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load the logged-in traveler's bookings from Supabase
  useEffect(() => {
    async function loadMyBookings() {
      if (!user) {
        setMyBookings([]);
        return;
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          traveler_id,
          traveler_name,
          contact_phone,
          destination_name,
          guide_name,
          travel_date,
          headcount,
          guide_type,
          status,
          guide_id
        `)
        .eq('traveler_id', user.id)
        .order('id', { ascending: false });

      if (error) {
        console.error('Failed to load bookings:', error);
        setMyBookings([]);
        return;
      }

      setMyBookings(data || []);
    }

    loadMyBookings();
  }, [user, isBookingsOpen]);

  const navItems = [
    { label: t.nav?.destinations || "Destinations", href: "#destinations" },
    { label: t.nav?.planner || "Trip Planner", href: "#trip-planner" },
    { label: t.nav?.weather || "Weather", href: "#weather-widget" },
    { label: t.nav?.transport || "Transport", href: "#transport" },
    { label: t.nav?.festivals || "Festivals", href: "#festivals" },
    { label: t.nav?.tools || "Tools", href: "#tourist-tools" }
  ];

  return (
    <nav className="w-full bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800 shadow-xl px-6 py-3 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 bg-emerald-600 text-white flex items-center justify-center rounded-xl font-black text-lg shadow-md">
            SL
          </div>
          <span className="font-editorial font-extrabold text-2xl tracking-tight text-white">
            Visit<span className="text-emerald-400">Ceylon</span>
          </span>
        </Link>

        {/* Gooey Navigation Bar */}
        <div className="hidden lg:block">
          <GooeyNav items={navItems} />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          
          {/* Multi-Language Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-full px-3 py-1.5 text-xs font-bold text-slate-200">
            <Globe size={15} className="text-emerald-400" />
            <select
              value={lang}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer font-bold text-white"
            >
              <option value="en" className="bg-slate-900 text-white">🇬🇧 English</option>
              <option value="ta" className="bg-slate-900 text-white">🇱🇰 தமிழ்</option>
              <option value="si" className="bg-slate-900 text-white">🇱🇰 සිංහල</option>
              <option value="fr" className="bg-slate-900 text-white">🇫🇷 Français</option>
            </select>
          </div>

          {/* Dynamic Auth & Traveler Profile Menu */}
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsBookingsOpen(true)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 px-3.5 py-1.5 rounded-full font-bold transition-all text-xs cursor-pointer shadow-sm group"
                title="View My Bookings & Live Status"
              >
                <UserCircle size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="max-w-[120px] truncate text-slate-200">{user.email?.split('@')[0]}</span>
                <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                  My Bookings ({myBookings.length})
                </span>
              </button>

              <button 
                onClick={() => supabase.auth.signOut()}
                className="flex items-center gap-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 px-4 py-1.5 rounded-full font-bold transition-all border border-red-800 shadow-sm text-xs cursor-pointer"
              >
                <LogOut size={14} />
                <span>{t.logout}</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-full font-bold transition-all shadow-md text-xs">
              <UserCircle size={16} />
              <span>{t.loginJoin}</span>
            </Link>
          )}

        </div>
        
      </div>

      {/* TRAVELER MY BOOKINGS LIVE STATUS MODAL (React Portal) */}
      {isBookingsOpen && createPortal(
        <div 
          onClick={(e) => e.target === e.currentTarget && setIsBookingsOpen(false)}
          className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative text-white max-h-[85vh] overflow-y-auto custom-scrollbar my-auto">
            
            <button
              onClick={() => setIsBookingsOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-950 p-2 rounded-full border border-slate-800 transition-all cursor-pointer z-10"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                <CalendarCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-editorial font-extrabold text-white">My Guide Booking Requests</h3>
                <p className="text-xs text-slate-400 font-medium">Track live acceptance status from certified SLTDA guides</p>
              </div>
            </div>

            {myBookings.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <slot />
                <Clock size={44} className="text-slate-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-300">No Booking Requests Sent Yet</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Explore destinations or our Tour Guides section and click "Book a Tour Guide" to request a certified guide.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map((b, idx) => {
                  const isAccepted = b.status === 'accepted';
                  const isDeclined = b.status === 'declined';
                  
                  return (
                    <div 
                      key={b.id || idx} 
                      className={`p-5 rounded-2xl border transition-all ${
                        isAccepted 
                          ? 'bg-emerald-950/40 border-emerald-500/40' 
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="font-bold text-white text-base">{b.destination_name || b.destination || "Custom Sri Lanka Tour"}</h4>
                          <p className="text-xs text-slate-400">Date: <span className="text-slate-200 font-semibold">{b.travel_date}</span> • Guests: <span className="text-slate-200 font-semibold">{b.headcount || b.guests || 2}</span></p>
                        </div>

                        {isAccepted ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
                            <CheckCircle2 size={13} /> Accepted & Confirmed
                          </span>
                        ) : isDeclined ? (
                          <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
                            <XCircle size={13} /> Booking Declined
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-3 py-1 rounded-full">
                            <Clock size={13} /> Pending Guide Approval
                          </span>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-1">
                        <div>
                          Guide Type:{' '}
                          <strong className="text-emerald-400">
                            {b.guide_type || 'SLTDA Licensed Guide'}
                          </strong>
                        </div>

                        {b.guide_name && (
                          <div>
                            Guide:{' '}
                            <strong className="text-slate-200">
                              {b.guide_name}
                            </strong>
                          </div>
                        )}

                        <div className="text-slate-400">
                          {b.contact_phone}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => setIsBookingsOpen(exports => exports)}
              onClick={() => setIsBookingsOpen(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all cursor-pointer mt-6"
            >
              Close Status Window
            </button>

          </div>
        </div>,
        document.body
      )}

    </nav>
  );
}