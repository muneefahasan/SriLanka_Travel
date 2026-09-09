import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#081C15] text-white/80 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-ceylon-light text-white flex items-center justify-center rounded-lg font-bold text-xl">
                SL
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                Visit<span className="text-ceylon-light">Ceylon</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Your ultimate guide to exploring the Pearl of the Indian Ocean. Discover hidden gems, book local guides, and plan your perfect Sri Lankan adventure.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-ceylon-light transition-colors">Top Destinations</a></li>
              <li><a href="#" className="hover:text-ceylon-light transition-colors">Train Schedules</a></li>
              <li><a href="#" className="hover:text-ceylon-light transition-colors">Find a Tour Guide</a></li>
              <li><a href="#" className="hover:text-ceylon-light transition-colors">Traveler Community</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-ceylon-light" />
                <span>Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-ceylon-light" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-ceylon-light" />
                <span>hello@visitceylon.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media (Fixed SVGs instead of Lucide imports) */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-ceylon-light hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-ceylon-light hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="bg-white/10 p-3 rounded-full hover:bg-ceylon-light hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/50">
          <p>© 2026 VisitCeylon. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}