import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ShieldCheck, Calendar, Phone, MapPin, CheckCircle, XCircle, DollarSign, Award } from 'lucide-react';

// NOTE: This component assumes it's wrapped by <ProtectedRoute allowedRoles={['guide']}>
// in App.jsx, so by the time this renders we know: the user is logged in,
// their role is 'guide', and they are is_verified = true. No auth checks
// or demo-bypass buttons belong in here anymore.
export default function GuideDashboard() {
  const [loading, setLoading] = useState(true);
  const [guideProfile, setGuideProfile] = useState(null);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const userId = session.user.id;

      // Profile comes from `profiles` — the real table, set server-side on signup.
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      setGuideProfile(profile);

      // Bookings scoped to THIS guide only. RLS also enforces this server-side,
      // but filtering here too keeps the query fast and intentional.
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('guide_id', userId)
        .order('created_at', { ascending: false });

      setInquiries(bookings || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleAccept = async (id) => {
    setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: 'accepted' } : item));
    const { error } = await supabase.from('bookings').update({ status: 'accepted' }).eq('id', id);
    if (error) {
      // Roll back optimistic update if the write actually failed
      setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: 'pending' } : item));
      alert('Could not accept this booking: ' + error.message);
    }
  };

  const handleDecline = async (id) => {
    const prevState = inquiries;
    setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: 'declined' } : item));
    const { error } = await supabase.from('bookings').update({ status: 'declined' }).eq('id', id);
    if (error) {
      setInquiries(prevState);
      alert('Could not decline this booking: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ceylon-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-ceylon-primary"></div>
      </div>
    );
  }

  const pendingCount = inquiries.filter(i => i.status === 'pending').length;

  return (
    <div className="min-h-screen bg-ceylon-bg py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-ceylon-primary text-white p-8 rounded-3xl shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck size={18} /> Official Tour Guide Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-black">{guideProfile?.full_name || 'Guide'}</h1>
            <p className="text-gray-300 text-sm mt-1">Manage traveler booking requests and view your verification status.</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 font-black text-2xl flex items-center justify-center border-2 border-emerald-500">
              {(guideProfile?.full_name || 'G').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 w-fit mb-1">
                <Award size={14} /> SLTDA Verified Guide
              </span>
              <h3 className="font-extrabold text-gray-900 text-lg">{guideProfile?.license_number}</h3>
            </div>
          </div>

          <div className="space-y-1 text-sm text-gray-600 border-l border-gray-100 md:pl-6">
            <p className="flex items-center gap-2"><MapPin size={16} className="text-ceylon-accent" /> {guideProfile?.district}</p>
            <p className="flex items-center gap-2"><Phone size={16} className="text-ceylon-accent" /> {guideProfile?.phone}</p>
          </div>

          <div className="space-y-1 text-sm text-gray-600 border-l border-gray-100 md:pl-6">
            <p className="flex items-center gap-2 font-bold text-gray-900"><DollarSign size={16} className="text-emerald-600" /> Contact via requests below</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-ceylon-primary flex items-center gap-2">
              <Calendar className="text-ceylon-accent" /> Incoming Traveler Booking Requests
            </h2>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
              {pendingCount} Pending
            </span>
          </div>

          {inquiries.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-10">No booking requests yet.</p>
          ) : (
            <div className="space-y-4">
              {inquiries.map((req) => (
                <div key={req.id} className="p-6 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-extrabold text-gray-900 text-lg">{req.traveler_name}</h3>
                      <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-full border border-blue-200">
                        {req.contact_phone}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-ceylon-primary">{req.destination_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Date: <strong className="text-gray-700">{req.travel_date}</strong> | Headcount: <strong className="text-gray-700">{req.headcount} Guests</strong>
                    </p>
                  </div>

                  <div>
                    {req.status === 'accepted' ? (
                      <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-extrabold px-4 py-2.5 rounded-xl border border-emerald-300">
                        <CheckCircle size={16} /> Accepted
                      </span>
                    ) : req.status === 'declined' ? (
                      <span className="flex items-center gap-1.5 bg-gray-200 text-gray-600 text-xs font-extrabold px-4 py-2.5 rounded-xl">
                        <XCircle size={16} /> Declined
                      </span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleAccept(req.id)}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                          <CheckCircle size={16} /> Accept
                        </button>
                        <button
                          onClick={() => handleDecline(req.id)}
                          className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                        >
                          <XCircle size={16} /> Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
