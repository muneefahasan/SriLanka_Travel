import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { MapPin, Calendar, Star, ArrowLeft, Navigation, ShieldCheck, X, CheckCircle, Ticket, UserCheck, Play } from 'lucide-react';
import { DESTINATIONS_DATA } from '../data/destinationsData';

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

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (isGuideModalOpen || isTrainModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isGuideModalOpen, isTrainModalOpen]);

  useEffect(() => {
    async function fetchDestination() {
      setLoading(true);

      // 1. Match local data first by slug, ID, or name
      const targetSlug = String(id).toLowerCase();
      const localMatch = DESTINATIONS_DATA.find(
        d => d.slug.toLowerCase() === targetSlug ||
             String(d.id) === targetSlug ||
             d.name.toLowerCase().includes(targetSlug.replace(/-/g, ' '))
      ) || DESTINATIONS_DATA[0];

      // 2. Safely check Supabase database matching slug or name (preventing ID collisions)
      try {
        const { data, error } = await supabase
          .from('destinations')
          .select('*')
          .or(`slug.eq.${targetSlug},name.ilike.%${localMatch.name.split(' ')[0]}%`)
          .maybeSingle();

        if (!error && data && data.name && data.name.toLowerCase().includes(localMatch.name.split(' ')[0].toLowerCase())) {
          setDestination({
            ...localMatch,
            ...data,
            name: localMatch.name // Preserve exact local title
          });
        } else {
          setDestination(localMatch);
        }
      } catch (_err) {
        setDestination(localMatch);
      }

      setLoading(false);
    }

    fetchDestination();
  }, [id]);

  const handleGuideBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingSubmitted(true);

    const newBooking = {
      id: "inq-" + Date.now(),
      traveler_name: travelerName || "Traveler",
      contact_phone: contactPhone || "N/A",
      destination_name: destination?.name || "Sri Lanka Destination",
      start_date: travelDate || new Date().toISOString().split('T')[0],
      headcount: parseInt(headcount) || 2,
      guide_type: guideType,
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

  // Check if destination has a video file/URL (MP4 / WebM / YouTube embed)
  const videoMedia = destination.video_url || destination.video || destination.video_path;

  return (
    <div className="min-h-screen bg-ceylon-bg pb-20">
      
      {/* 1. MELA BIG FRAME (Hero Banner Video / Image Header): Line 122 */}
      {/* SOURCE CODE FOR MEDIA: Change destination.video_url or upload .mp4 video files to /public/videos/ */}
      <div className="relative h-[540px] md:h-[640px] w-full bg-slate-950 overflow-hidden shadow-2xl">
        {videoMedia ? (
          <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
            {/* Ambient Blurred Video Background (Fills side space without cropping main video) */}
            <video 
              src={videoMedia}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-45 pointer-events-none scale-110"
            />
            {/* Main Foreground Video: 100% Full Uncropped Frame */}
            <video 
              src={videoMedia}
              controls
              autoPlay
              loop
              muted
              playsInline
              poster={destination.cover_image_url || destination.cover_image || destination.image_url || destination.image}
              className="relative z-10 max-h-full max-w-full object-contain shadow-2xl"
            />
          </div>
        ) : (
          <img 
            src={destination.cover_image_url || destination.cover_image || destination.image_url || destination.image} 
            alt={destination.name} 
            className="w-full h-full object-cover object-center"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none z-10" />
        
        <div className="absolute top-6 left-6 z-20">
          <Link 
            to="/" 
            className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-900 text-white font-bold px-5 py-2.5 rounded-full shadow-xl transition-all text-sm border border-slate-700 backdrop-blur-md"
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>

        {videoMedia && (
          <div className="absolute top-6 right-6 z-20 bg-emerald-600/90 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 border border-emerald-400 backdrop-blur-md">
            <Play size={14} className="fill-current animate-pulse" /> Live Uncropped HD Video
          </div>
        )}

        <div className="absolute bottom-8 left-6 right-6 max-w-7xl mx-auto text-white z-20">
          <span className="bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 inline-block shadow-md">
            {destination.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-editorial font-extrabold mb-3 drop-shadow-md">{destination.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-200">
            <span className="flex items-center gap-1.5 bg-slate-900/70 px-3 py-1 rounded-lg border border-slate-800"><MapPin size={16} className="text-emerald-400" /> {destination.location}</span>
            <span className="flex items-center gap-1.5 bg-slate-900/70 px-3 py-1 rounded-lg border border-slate-800"><Star size={16} className="text-yellow-400 fill-current" /> {destination.rating || 4.8} / 5.0</span>
            <span className="flex items-center gap-1.5 bg-slate-900/70 px-3 py-1 rounded-lg border border-slate-800"><Calendar size={16} className="text-emerald-400" /> Best Time: {destination.best_time_to_visit || "Nov to April"}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-ceylon-primary mb-4">About this Destination</h2>
            
            {/* 2. ABOUT THIS DESTINATION MEDIA FRAME (Image / Showcase Video): Line 182 */}
            {videoMedia ? (
              <div className="mb-6 rounded-2xl overflow-hidden shadow-lg border border-slate-800 bg-slate-950 aspect-video w-full relative flex items-center justify-center">
                <video 
                  src={videoMedia}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-40 pointer-events-none scale-110"
                />
                <video 
                  src={videoMedia} 
                  controls 
                  className="relative z-10 max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="mb-6 h-80 md:h-[420px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <img src={destination.image_url || destination.image} alt={destination.name} className="w-full h-full object-cover" />
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

      {/* MODAL 1: Book a Tour Guide (Portal to document.body) */}
      {isGuideModalOpen && createPortal(
        <div 
          onClick={(e) => e.target === e.currentTarget && setIsGuideModalOpen(false)}
          className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative text-white max-h-[85vh] overflow-y-auto custom-scrollbar my-auto">
            <button 
              onClick={() => setIsGuideModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-950 p-2 rounded-full border border-slate-800 transition-all cursor-pointer z-10"
            >
              <X size={20} />
            </button>

            {bookingSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle size={56} className="text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-2xl font-bold text-white">Inquiry Sent Successfully!</h3>
                <p className="text-sm text-slate-300">Our certified SLTDA local guide for {destination.name} will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleGuideBookingSubmit} className="space-y-4">
                <h3 className="text-2xl font-editorial font-extrabold text-white mb-1">Book Guide for {destination.name}</h3>
                <p className="text-xs text-emerald-400 font-bold mb-4">Connect with official SLTDA verified tour guides.</p>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    placeholder="John Doe" 
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Travel Date</label>
                    <input 
                      type="date" 
                      required 
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Guests Count</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={headcount}
                      onChange={(e) => setHeadcount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Preferred Guide Type</label>
                  <select 
                    value={guideType} 
                    onChange={(e) => setGuideType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option>National Licensed Guide (English / German / French)</option>
                    <option>Chauffeur Guide (Private Car / AC Van)</option>
                    <option>Site Heritage Guide (Local Spot Expert)</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg mt-4 cursor-pointer"
                >
                  Confirm Guide Inquiry
                </button>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2: Inquire Train Tickets (Portal to document.body) */}
      {isTrainModalOpen && createPortal(
        <div 
          onClick={(e) => e.target === e.currentTarget && setIsTrainModalOpen(false)}
          className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative text-center text-white max-h-[85vh] overflow-y-auto custom-scrollbar my-auto">
            <button 
              onClick={() => setIsTrainModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-950 p-2 rounded-full border border-slate-800 transition-all cursor-pointer z-10"
            >
              <X size={20} />
            </button>

            <Ticket size={48} className="text-emerald-400 mx-auto mb-3" />
            <h3 className="text-2xl font-editorial font-extrabold text-white mb-2">Train Ticket Inquiry</h3>
            <p className="text-sm text-slate-300 mb-6">
              Scenic train routes connecting <span className="font-bold text-emerald-400">{destination.name}</span> (such as Kandy to Ella Express & Ella Odyssey) must be reserved 30 days in advance.
            </p>

            <div className="p-4 bg-emerald-950/60 border border-emerald-500/30 rounded-2xl text-left text-xs text-emerald-300 mb-6 space-y-1">
              <p className="font-bold text-emerald-400">🚆 Official Ticket Reservation Info:</p>
              <p>• 1st Class Observation Car (AC Air-conditioned)</p>
              <p>• 2nd Class Reserved Seating</p>
              <p>• Ella Odyssey Tourist Express</p>
            </div>

            <Link 
              to="/#train-routes"
              onClick={() => setIsTrainModalOpen(false)}
              className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg"
            >
              View Full Train Schedule & Routes
            </Link>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}