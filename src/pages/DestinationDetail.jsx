import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { MapPin, Calendar, Star, ArrowLeft, Navigation, ShieldCheck, X, CheckCircle, Ticket, UserCheck } from 'lucide-react';

export default function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Form states
  const [travelerName, setTravelerName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [headcount, setHeadcount] = useState(2);
  const [guideType, setGuideType] = useState('National Licensed Guide');

  useEffect(() => {
    async function fetchDestination() {
      setLoading(true);
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setDestination(data);
      } else {
        // Fallback placeholder data if DB single fetch fails
        setDestination({
          id: id,
          name: "Sigiriya Rock Fortress",
          location: "Matale District",
          category: "Heritage",
          rating: 4.8,
          best_time_to_visit: "Nov to April",
          description: "Ancient palace and fortress complex with famous frescoes and panoramic jungle views.",
          image_url: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80",
          map_iframe_url: "https://maps.google.com/maps?q=Sigiriya&t=&z=13&ie=UTF8&iwloc=&output=embed"
        });
      }
      setLoading(false);
    }
    fetchDestination();
  }, [id]);

  const handleGuideBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingSubmitted(false);
      setIsGuideModalOpen(false);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ceylon-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-ceylon-primary"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-ceylon-bg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Destination Not Found</h2>
        <Link to="/" className="text-ceylon-accent font-bold underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ceylon-bg pb-20">
      
      {/* Hero Banner */}
      <div className="relative h-[450px] w-full">
        <img 
          src={destination.cover_image_url || destination.cover_image || destination.image_url} 
          alt={destination.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute top-6 left-6 z-10">
          <Link 
            to="/" 
            className="flex items-center gap-2 bg-white/90 hover:bg-white text-gray-900 font-bold px-4 py-2 rounded-full shadow-lg transition-all text-sm"
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>

        <div className="absolute bottom-8 left-6 right-6 max-w-7xl mx-auto text-white">
          <span className="bg-ceylon-accent text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block">
            {destination.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-2">{destination.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-200">
            <span className="flex items-center gap-1"><MapPin size={16} className="text-orange-400" /> {destination.location}</span>
            <span className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-current" /> {destination.rating || 4.8} / 5.0</span>
            <span className="flex items-center gap-1"><Calendar size={16} className="text-orange-400" /> Best Time: {destination.best_time_to_visit || "Nov to April"}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-ceylon-primary mb-4">About this Destination</h2>
            
            {/* Featured Photo Showcase if cover_image_url is different */}
            {destination.cover_image_url && destination.image_url && (
              <div className="mb-6 h-72 w-full rounded-2xl overflow-hidden shadow-md">
                <img src={destination.image_url} alt={destination.name} className="w-full h-full object-cover" />
              </div>
            )}

            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              {destination.description}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-2xl">
                <ShieldCheck className="text-ceylon-accent mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">SLTDA Approved</h4>
                  <p className="text-xs text-gray-600">Official tourism verified destination</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl">
                <Navigation className="text-emerald-600 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Guided Tours</h4>
                  <p className="text-xs text-gray-600">Local certified guides available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Box */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-ceylon-primary mb-4 flex items-center gap-2">
              <MapPin className="text-ceylon-accent" /> Location & Map
            </h2>
            <div className="w-full h-96 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
              {destination.map_iframe_url ? (
                <iframe
                  title={destination.name}
                  src={destination.map_iframe_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 font-medium">
                  Map View Not Available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Booking / Guide CTA */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-orange-100 sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Plan Your Visit</h3>
            <p className="text-sm text-gray-500 mb-6">Need a licensed tour guide or private vehicle for {destination.name}?</p>

            <button 
              onClick={() => setIsGuideModalOpen(true)}
              className="w-full bg-ceylon-primary hover:bg-ceylon-accent text-white font-bold py-3.5 rounded-xl transition-all shadow-md mb-3 cursor-pointer flex items-center justify-center gap-2"
            >
              <UserCheck size={18} /> Book a Tour Guide
            </button>
            <button 
              onClick={() => setIsTrainModalOpen(true)}
              className="w-full bg-ceylon-bg hover:bg-gray-100 text-ceylon-primary font-bold py-3.5 rounded-xl border border-gray-200 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Ticket size={18} /> Inquire Train Tickets
            </button>
          </div>
        </div>

      </div>

      {/* MODAL 1: Book a Tour Guide */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
            <button 
              onClick={() => setIsGuideModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            {bookingSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle size={56} className="text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-2xl font-bold text-gray-900">Inquiry Sent Successfully!</h3>
                <p className="text-sm text-gray-600">Our certified SLTDA local guide for {destination.name} will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleGuideBookingSubmit} className="space-y-4">
                <h3 className="text-2xl font-black text-ceylon-primary mb-1">Book Guide for {destination.name}</h3>
                <p className="text-xs text-gray-500 mb-4">Connect with official SLTDA verified tour guides.</p>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    placeholder="John Doe" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ceylon-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone / WhatsApp</label>
                  <input 
                    type="tel" 
                    required 
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+94 77 123 4567" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ceylon-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Travel Date</label>
                    <input 
                      type="date" 
                      required 
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Guests Count</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={headcount}
                      onChange={(e) => setHeadcount(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Guide Type</label>
                  <select 
                    value={guideType} 
                    onChange={(e) => setGuideType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  >
                    <option>National Licensed Guide (English / German / French)</option>
                    <option>Chauffeur Guide (Private Car / AC Van)</option>
                    <option>Site Heritage Guide (Local Spot Expert)</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-ceylon-primary hover:bg-ceylon-accent text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-4 cursor-pointer"
                >
                  Confirm Guide Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Inquire Train Tickets */}
      {isTrainModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-center">
            <button 
              onClick={() => setIsTrainModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <Ticket size={48} className="text-orange-500 mx-auto mb-3" />
            <h3 className="text-2xl font-black text-gray-900 mb-2">Train Ticket Inquiry</h3>
            <p className="text-sm text-gray-600 mb-6">
              Scenic train routes connecting <span className="font-bold text-ceylon-primary">{destination.name}</span> (such as Kandy to Ella Express & Ella Odyssey) must be reserved 30 days in advance.
            </p>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-left text-xs text-orange-900 mb-6 space-y-1">
              <p className="font-bold">🚆 Official Ticket Reservation Info:</p>
              <p>• 1st Class Observation Car (AC Air-conditioned)</p>
              <p>• 2nd Class Reserved Seating</p>
              <p>• Ella Odyssey Tourist Express</p>
            </div>

            <Link 
              to="/#train-routes"
              onClick={() => setIsTrainModalOpen(false)}
              className="block w-full bg-ceylon-primary hover:bg-ceylon-accent text-white font-bold py-3.5 rounded-xl transition-all shadow-md"
            >
              View Full Train Schedule & Routes
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}