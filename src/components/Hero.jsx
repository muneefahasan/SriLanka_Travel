import { MapPin, ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  const scrollToPlanner = () => {
    const section = document.getElementById('trip-planner');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-73px)] bg-ceylon-bg overflow-hidden flex items-center py-16">
      
      {/* 3D Sri Lanka Map Background Image Blend (Image 2 Overlay) */}
      <div 
        className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none filter blur-[1px]"
        style={{ backgroundImage: `url('/srilanka-island-map.jpg')` }}
      />

      {/* Dark Slate Green Ambient Gradient (Inspired by Image 1 luxury design) */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-ceylon-slate/20 via-ceylon-card/40 to-transparent opacity-80 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between w-full relative z-10 gap-12">
        
        {/* Left Editorial Content */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 bg-ceylon-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
            <Sparkles size={14} className="text-emerald-400" /> Pearl of the Indian Ocean
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-editorial font-extrabold text-ceylon-primary tracking-tight leading-[1.05]">
            Explore<br />
            <span className="italic font-normal text-ceylon-accent">Sri Lanka</span>
          </h1>

          <p className="text-lg md:text-xl text-ceylon-slate/85 max-w-lg font-medium leading-relaxed">
            Are you ready to explore the Pearl of the Indian Ocean? Our interactive map will help you plan the perfect trip. Discover the best sights, activities, and routes with just a few clicks.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button 
              onClick={scrollToPlanner}
              className="flex items-center gap-3 bg-ceylon-slate hover:bg-ceylon-primary text-white px-8 py-4 rounded-full font-extrabold transition-all shadow-xl text-lg group cursor-pointer"
            >
              PLAN MY TRIP
              <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Content: 3D Sri Lanka Island Map Graphic Showcase */}
        <div className="w-full lg:w-1/2 h-[520px] relative flex justify-center items-center">
           
           {/* Visual Glow Aura */}
           <div className="absolute inset-0 bg-ceylon-light/20 rounded-full blur-3xl animate-pulse"></div>
           
           {/* 3D Illustrated Sri Lanka Map Image (Uploaded Image 2) */}
           <div className="relative w-[92%] h-[92%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform lg:rotate-2 hover:rotate-0 transition-all duration-700 ease-in-out group">
             <img 
                src="/srilanka-island-map.jpg" 
                alt="Sri Lanka 3D Map Showcase" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-ceylon-slate/40 via-transparent to-transparent pointer-events-none" />
           </div>
           
           {/* Interactive Pin 1 - Sigiriya */}
           <div className="absolute top-[35%] left-[45%] group cursor-pointer z-20">
              <div className="bg-white p-2.5 rounded-full shadow-2xl animate-bounce border-2 border-ceylon-accent">
                <MapPin size={22} className="text-ceylon-accent" />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-ceylon-slate text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
                 🏰 Sigiriya Ancient Rock
              </div>
           </div>

           {/* Interactive Pin 2 - Ella */}
           <div className="absolute top-[62%] right-[32%] group cursor-pointer z-20">
              <div className="bg-white p-2.5 rounded-full shadow-2xl animate-bounce border-2 border-ceylon-accent" style={{ animationDelay: '0.4s' }}>
                <MapPin size={22} className="text-ceylon-accent" />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-ceylon-slate text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
                 🚆 Nine Arches & Ella
              </div>
           </div>

           {/* Interactive Pin 3 - Galle Fort */}
           <div className="absolute bottom-[18%] left-[28%] group cursor-pointer z-20">
              <div className="bg-white p-2.5 rounded-full shadow-2xl animate-bounce border-2 border-ceylon-accent" style={{ animationDelay: '0.2s' }}>
                <MapPin size={22} className="text-ceylon-accent" />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-ceylon-slate text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
                 🌊 Galle Dutch Fort
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}