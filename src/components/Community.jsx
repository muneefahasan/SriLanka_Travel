import { Camera, MapPin, Send, ImageIcon, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import SpotlightCard from './SpotlightCard';

export default function Community() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="w-full bg-slate-950 py-24 px-6 border-t border-slate-800 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Left Side - Text & Stats */}
        <div>
          <span className="bg-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 inline-block border border-emerald-500/30">
            Traveler Community
          </span>
          <h2 className="text-4xl md:text-5xl font-editorial font-extrabold text-white mb-6 leading-tight">
            Found a Hidden Gem <br />in Sri Lanka?
          </h2>
          <p className="text-lg text-slate-300 mb-8 font-medium leading-relaxed">
            Did you discover a secret waterfall, an untouched beach, or a cozy local cafe? Share it with the VisitCeylon community! Once verified by our local guides, your spot will be featured on our interactive map.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.2)">
              <h4 className="font-editorial font-extrabold text-emerald-400 text-3xl mb-1">500+</h4>
              <p className="text-xs text-slate-300 font-bold">Secret Spots Uploaded</p>
            </SpotlightCard>

            <SpotlightCard spotlightColor="rgba(0, 229, 255, 0.2)">
              <h4 className="font-editorial font-extrabold text-emerald-400 text-3xl mb-1">10k+</h4>
              <p className="text-xs text-slate-300 font-bold">Active Travelers</p>
            </SpotlightCard>
          </div>
        </div>

        {/* Right Side - Upload Form with SpotlightCard */}
        <SpotlightCard className="p-8 md:p-10 shadow-2xl" spotlightColor="rgba(0, 229, 255, 0.2)">
          <h3 className="text-2xl font-editorial font-extrabold text-white mb-6">Submit a New Place</h3>
          
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle size={48} className="text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-2xl font-bold text-white">Place Submitted for Review!</h4>
              <p className="text-slate-300 text-sm">Thank you for contributing to the VisitCeylon community.</p>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Name of the Place</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Secret Beach, Mirissa" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Nearest City</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Matara" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Category</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm font-bold">
                    <option>Beach</option>
                    <option>Waterfall</option>
                    <option>Viewpoint</option>
                    <option>Food & Cafe</option>
                    <option>Temple/Heritage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Upload Photos</label>
                <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 transition-colors cursor-pointer bg-slate-950">
                  <ImageIcon size={32} className="mb-2 text-emerald-400" />
                  <p className="font-bold text-xs">Click to upload or drag & drop</p>
                  <p className="text-[11px] text-slate-500 mt-1">SVG, PNG, JPG (Max 5MB)</p>
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg mt-4">
                <Send size={18} />
                Submit Spot for Verification
              </button>
              
            </form>
          )}

        </SpotlightCard>

      </div>
    </div>
  );
}