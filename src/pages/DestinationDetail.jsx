import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { MapPin, Calendar, Star, ArrowLeft, Navigation, ShieldCheck } from 'lucide-react';

export default function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

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
      }
      setLoading(false);
    }
    fetchDestination();
  }, [id]);

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
          src={destination.image_url} 
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
            <span className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-current" /> {destination.rating} / 5.0</span>
            <span className="flex items-center gap-1"><Calendar size={16} className="text-orange-400" /> Best Time: {destination.best_time_to_visit}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-ceylon-primary mb-4">About this Destination</h2>
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

            <button className="w-full bg-ceylon-primary hover:bg-ceylon-accent text-white font-bold py-3.5 rounded-xl transition-all shadow-md mb-3">
              Book a Tour Guide
            </button>
            <button className="w-full bg-ceylon-bg hover:bg-gray-100 text-ceylon-primary font-bold py-3.5 rounded-xl border border-gray-200 transition-all">
              Inquire Train Tickets
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}