import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, UserCircle, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import GooeyNav from './GooeyNav';

export default function Navbar() {
  const [user, setUser] = useState(null);
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

  const navItems = [
    { label: "Destinations", href: "#destinations" },
    { label: "Trip Planner", href: "#trip-planner" },
    { label: "Weather", href: "#weather-widget" },
    { label: "Transport", href: "#transport" },
    { label: "Festivals", href: "#festivals" },
    { label: "Tools", href: "#tourist-tools" }
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
          <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-bold text-gray-700">
            <Globe size={15} className="text-ceylon-accent" />
            <select
              value={lang}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer font-bold text-gray-800"
            >
              <option value="en">🇬🇧 English</option>
              <option value="ta">🇱🇰 தமிழ்</option>
              <option value="si">🇱🇰 සිංහල</option>
              <option value="fr">🇫🇷 Français</option>
            </select>
          </div>

          {/* Dynamic Auth Button */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold bg-ceylon-bg px-3 py-2 rounded-xl text-ceylon-primary border border-gray-200 hidden xl:inline-block">
                {user.email}
              </span>
              <button 
                onClick={() => supabase.auth.signOut()}
                className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold transition-all border border-red-200 shadow-sm text-xs cursor-pointer"
              >
                <LogOut size={14} />
                <span>{t.logout}</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 bg-ceylon-primary hover:bg-ceylon-accent text-white px-4 py-2 rounded-full font-bold transition-all shadow-md text-xs">
              <UserCircle size={16} />
              <span>{t.loginJoin}</span>
            </Link>
          )}

        </div>
        
      </div>
    </nav>
  );
}