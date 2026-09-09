import { Camera, MapPin, Send, ImageIcon } from 'lucide-react';

export default function Community() {
  return (
    <div className="w-full bg-ceylon-card/30 py-24 px-6 border-t border-ceylon-card">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Left Side - Text & Motivation */}
        <div>
          <div className="inline-block bg-ceylon-light/20 text-ceylon-primary font-bold px-4 py-1.5 rounded-full text-sm mb-6">
            Traveler Community
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-ceylon-primary mb-6 leading-tight">
            Found a Hidden Gem <br />in Sri Lanka?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Did you discover a secret waterfall, an untouched beach, or a cozy local cafe? Share it with the VisitCeylon community! Once verified by our local guides, your spot will be featured on our map.
          </p>
          
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-1">
              <h4 className="font-bold text-ceylon-primary text-2xl mb-1">500+</h4>
              <p className="text-sm text-gray-500">Places Discovered</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-1">
              <h4 className="font-bold text-ceylon-primary text-2xl mb-1">10k+</h4>
              <p className="text-sm text-gray-500">Active Travelers</p>
            </div>
          </div>
        </div>

        {/* Right Side - Upload Form */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 relative">
          
          <h3 className="text-2xl font-bold text-ceylon-primary mb-6">Submit a New Place</h3>
          
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Place Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name of the Place</label>
              <input 
                type="text" 
                placeholder="e.g., Secret Beach, Mirissa" 
                className="w-full bg-ceylon-bg border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-ceylon-light"
              />
            </div>

            {/* Location & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nearest City</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="e.g., Matara" 
                    className="w-full bg-ceylon-bg border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-ceylon-light"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select className="w-full bg-ceylon-bg border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-ceylon-light text-gray-600">
                  <option>Beach</option>
                  <option>Waterfall</option>
                  <option>Viewpoint</option>
                  <option>Food & Cafe</option>
                  <option>Temple/Heritage</option>
                </select>
              </div>
            </div>

            {/* Photo Upload Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Photos</label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-ceylon-bg hover:border-ceylon-light transition-colors cursor-pointer">
                <ImageIcon size={32} className="mb-3 text-ceylon-light" />
                <p className="font-medium text-sm">Click to upload or drag & drop</p>
                <p className="text-xs mt-1">SVG, PNG, JPG (Max 5MB)</p>
              </div>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-ceylon-primary hover:bg-ceylon-accent text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4">
              <Send size={18} />
              Submit for Review
            </button>
            
          </form>

        </div>

      </div>
    </div>
  );
}