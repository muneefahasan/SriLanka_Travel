import { useState } from 'react';
import { Search, MessageSquare, Star, MapPin, Award, X, CheckCircle, ShieldCheck } from 'lucide-react';

export default function TourGuides() {
  const guides = [
    {
      id: 1,
      name: "Nuwan Silva",
      licenseNo: "SLTDA-G-2026-001",
      type: "National Guide",
      languages: ["English", "German"],
      rating: 4.9,
      reviews: 124,
      location: "Colombo / Islandwide",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 2,
      name: "Kasun Perera",
      licenseNo: "SLTDA-G-2026-042",
      type: "Chauffeur Guide",
      languages: ["English", "Russian"],
      rating: 4.8,
      reviews: 89,
      location: "Kandy & Hill Country",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 3,
      name: "Anjali Fernando",
      licenseNo: "SLTDA-G-2026-088",
      type: "Site Guide",
      languages: ["English", "French", "Tamil"],
      rating: 5.0,
      reviews: 210,
      location: "Galle Fort",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
  ];

  const [selectedGuide, setSelectedGuide] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  
  // Form input states
  const [travelerName, setTravelerName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [travelDate, setTravelDate] = useState('');

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedGuide(null);
    }, 2500);
  };

  return (
    <div className="w-full bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-ceylon-primary mb-4">Find a Local Tour Guide</h2>
          <p className="text-ceylon-muted text-lg">Connect with certified local guides to make your Sri Lankan journey unforgettable.</p>
        </div>

        {/* Guide Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow group flex flex-col justify-between">
              <div>
                <div className="flex gap-4 items-start mb-6">
                  <img src={guide.image} alt={guide.name} className="w-20 h-20 rounded-full object-cover border-2 border-ceylon-light" />
                  <div>
                    <h3 className="text-xl font-bold text-ceylon-primary">{guide.name}</h3>
                    <div className="flex items-center gap-1 text-ceylon-accent text-xs font-semibold mt-0.5">
                      <ShieldCheck size={14} /> {guide.licenseNo}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                      <Star size={16} className="fill-current" />
                      <span className="font-bold text-gray-700">{guide.rating}</span>
                      <span className="text-gray-400">({guide.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} className="text-ceylon-light" />
                    {guide.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-semibold">Languages:</span> {guide.languages.join(", ")}
                  </div>
                </div>
              </div>

              {/* Chat / Message Button (Pre-fills Guide details automatically!) */}
              <button 
                onClick={() => setSelectedGuide(guide)}
                className="w-full flex items-center justify-center gap-2 bg-ceylon-primary hover:bg-ceylon-accent text-white py-3 rounded-xl font-semibold transition-colors cursor-pointer shadow-md"
              >
                <MessageSquare size={18} />
                Book {guide.name.split(' ')[0]}
              </button>
            </div>
          ))}
        </div>

        {/* MODAL: Auto-filled Guide Booking Form */}
        {selectedGuide && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button 
                onClick={() => setSelectedGuide(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>

              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle size={56} className="text-emerald-500 mx-auto animate-bounce" />
                  <h3 className="text-2xl font-bold text-gray-900">Inquiry Sent!</h3>
                  <p className="text-sm text-gray-600">Guide <span className="font-bold">{selectedGuide.name}</span> has received your inquiry and will contact you on WhatsApp/Phone.</p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {/* Pre-filled Guide Info Box */}
                  <div className="flex items-center gap-3 bg-orange-50/80 border border-orange-200 p-4 rounded-2xl mb-4">
                    <img src={selectedGuide.image} alt={selectedGuide.name} className="w-12 h-12 rounded-full object-cover border" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{selectedGuide.name}</h4>
                      <p className="text-xs text-orange-700 font-semibold">{selectedGuide.type} ({selectedGuide.licenseNo})</p>
                      <p className="text-[11px] text-gray-500">{selectedGuide.location}</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">Book Tour with {selectedGuide.name}</h3>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={travelerName}
                      onChange={(e) => setTravelerName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ceylon-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp / Contact Phone</label>
                    <input 
                      type="tel" 
                      required 
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+94 77 123 4567" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ceylon-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Travel Date</label>
                    <input 
                      type="date" 
                      required 
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-ceylon-primary hover:bg-ceylon-accent text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-2 cursor-pointer"
                  >
                    Send Booking Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}