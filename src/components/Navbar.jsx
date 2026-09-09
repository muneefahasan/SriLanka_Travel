import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Search, UserCircle, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import AiModal from './AiModal';

export default function Navbar() {
  const [isAiOpen, setIsAiOpen] = useState(false);
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

  return (
    <>
      <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-ceylon-card shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-ceylon-primary text-white flex items-center justify-center rounded-lg font-bold text-xl">
              SL
            </div>
            <span className="font-bold text-2xl tracking-tight text-ceylon-primary">
              Visit<span className="text-ceylon-light">Ceylon</span>
            </span>
          </Link>

          {/* AI Assistant Search Bar */}
          <div 
            className="hidden md:flex flex-1 max-w-md mx-8 relative cursor-pointer"
            onClick={() => setIsAiOpen(true)}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              readOnly
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-full bg-ceylon-bg text-sm placeholder-gray-500 cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none"
              placeholder={t.searchPlaceholder}
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            
            {/* Multi-Language Dropdown */}
            <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-bold text-gray-700">
              <Globe size={16} className="text-ceylon-accent" />
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
                <span className="text-xs font-semibold bg-ceylon-bg px-3 py-2 rounded-xl text-ceylon-primary border border-gray-200 hidden lg:inline-block">
                  {user.email}
                </span>
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-full font-medium transition-all border border-red-200 shadow-sm text-sm cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>{t.logout}</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 bg-ceylon-primary hover:bg-ceylon-accent text-white px-5 py-2 rounded-full font-medium transition-all shadow-md text-sm">
                <UserCircle size={18} />
                <span>{t.loginJoin}</span>
              </Link>
            )}

          </div>
          
        </div>
      </nav>

      {/* Render the AI Modal */}
      <AiModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </>
  );
}