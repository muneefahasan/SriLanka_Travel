import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, X, CheckCircle, UserCheck } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import RotatingCards from './RotatingCards';
import SplitHeading from './SplitHeading';

export default function TourGuides() {
  const initial6Guides = [
    { id: 1, name: "Kusal Perera", district: "Kandy & Tea Country", license_status: "SLTDA National Guide", rating: 4.9, phone: "0779301088", bio: "Fluent in English, French & German. 10 years guiding tea country hikes & temple tours.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" },
    { id: 2, name: "Nimali Silva", district: "Galle & South Coast", license_status: "SLTDA Licensed Chauffeur", rating: 5.0, phone: "0714456789", bio: "Private AC van tour guide specializing in whale watching, Galle fort history & beach resorts.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80" },
    { id: 3, name: "Rohan Fernando", district: "Sigiriya & Cultural Triangle", license_status: "Site Specialist Guide", rating: 4.8, phone: "0752233445", bio: "Archaeology graduate guide for Sigiriya Rock Fortress, Polonnaruwa & Dambulla caves.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80" },
    { id: 4, name: "Suresh Kumar", district: "Jaffna & Northern Peninsula", license_status: "SLTDA National Guide", rating: 4.9, phone: "0771122334", bio: "Fluent in Tamil & English. Specialist in Nallur Kovil, Jaffna islands & northern cuisine.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80" },
    { id: 5, name: "Dinesh Jayasinghe", district: "Yala & Wildlife Safaris", license_status: "Wildlife Safari Tracker", rating: 4.9, phone: "0788899001", bio: "Certified wildlife tracker with 12 years jeep safari experience in Yala & Udawalawe.", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" },
    { id: 6, name: "Dilani Wickramasinghe", district: "Nuwara Eliya & Ella", license_status: "SLTDA Chauffeur Guide", rating: 4.9, phone: "0765544332", bio: "Specialized in luxury hill-country train tours, tea plantation walks & waterfall hikes.", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80" }
  ];

  const fallbackPhotos = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
  ];

  const [guides, setGuides] = useState(initial6Guides);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form input states
  const [travelerName, setTravelerName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [travelDate, setTravelDate] = useState('');

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  useEffect(() => {
    async function fetchGuides() {
      const { data, error } = await supabase.from('valid_guides').select('*');
      if (!error && data && data.length > 0) {
        const fetched = data.map((g, idx) => ({
          id: g.id || idx + 1,
          name: g.name || g.full_name || initial6Guides[idx % 6].name,
          district: g.district || g.location || initial6Guides[idx % 6].district,
          license_status: g.sltda_status || g.license_status || initial6Guides[idx % 6].license_status,
          rating: g.rating || initial6Guides[idx % 6].rating,
          phone: g.phone || initial6Guides[idx % 6].phone,
          bio: g.bio || g.specialties || initial6Guides[idx % 6].bio,
          image: g.image_url || g.image || g.profile_pic || fallbackPhotos[idx % fallbackPhotos.length]
        }));

        if (fetched.length < 6) {
          const filled = [...fetched];
          for (let i = fetched.length; i < 6; i++) {
            filled.push(initial6Guides[i]);
          }
          setGuides(filled);
        } else {
          setGuides(fetched.slice(0, 6));
        }
      }
    }
    fetchGuides();
  }, []);

  const handleOpenBooking = (guide) => {
    setSelectedGuide(guide);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const newBooking = {
      id: "inq-" + Date.now(),
      traveler_name: travelerName || "Traveler",
      contact_phone: contactPhone || "N/A",
      destination_name: selectedGuide?.district ? `${selectedGuide.district} Tour` : "Guided Tour",
      start_date: travelDate || new Date().toISOString().split('T')[0],
      headcount: 2,
      guide_name: selectedGuide?.name || "Licensed Guide",
      guide_type: selectedGuide?.license_status || "SLTDA National Guide",
      status: 'Pending'
    };

    // 1. Insert into Supabase
    try {
      await supabase.from('bookings').insert([newBooking]);
    } catch (_err) {}

    // 2. Insert into LocalStorage
    try {
      const existing = JSON.parse(localStorage.getItem('ceylon_tour_bookings') || '[]');
      localStorage.setItem('ceylon_tour_bookings', JSON.stringify([newBooking, ...existing]));
    } catch (_err) {}

    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
      setTravelerName('');
      setContactPhone('');
      setTravelDate('');
    }, 2200);
  };

  return (
    <div id="tour-guides" className="w-full bg-slate-950 py-20 px-6 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <SplitHeading as="h2" className="text-4xl md:text-5xl font-editorial font-extrabold text-white mb-3">
            Find a Local SLTDA Tour Guide
          </SplitHeading>
          <p className="text-gray-400 text-base md:text-lg font-medium">
            Connect directly with 6 official SLTDA certified tour guides and chauffeurs for your island journey.
          </p>
        </div>

        {/* 3D Rotating Cards Carousel */}
        <RotatingCards
          guides={guides}
          radius={320}
          cardWidth={300}
          cardHeight={420}
          onBookGuide={handleOpenBooking}
        />

        {/* REACT PORTAL BOOKING MODAL (Renders into document.body outside 3D perspective) */}
        {isModalOpen && selectedGuide && createPortal(
          <div 
            onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
            className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative text-white max-h-[85vh] overflow-y-auto custom-scrollbar my-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-950 p-2 rounded-full border border-slate-800 transition-all cursor-pointer z-10"
              >
                <X size={20} />
              </button>

              {submitted ? (
                <div className="py-10 text-center space-y-4">
                  <CheckCircle size={52} className="text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="text-2xl font-bold text-white">Booking Inquiry Sent!</h3>
                  <p className="text-slate-300 text-sm">
                    {selectedGuide.name} will contact you shortly on your provided phone number.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                    <img src={selectedGuide.image} alt={selectedGuide.name} className="w-14 h-14 rounded-2xl object-cover border border-emerald-500" />
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedGuide.name}</h3>
                      <p className="text-xs text-emerald-400 font-bold">{selectedGuide.district} • {selectedGuide.phone}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Your Name</label>
                    <input 
                      type="text" 
                      required 
                      value={travelerName}
                      onChange={(e) => setTravelerName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone / WhatsApp</label>
                    <input 
                      type="tel" 
                      required 
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+94 77 123 4567" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Travel Date</label>
                    <input 
                      type="date" 
                      required 
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" 
                    />
                  </div>

                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-4">
                    <UserCheck size={18} /> Confirm Guide Booking Request
                  </button>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}

      </div>
    </div>
  );
}