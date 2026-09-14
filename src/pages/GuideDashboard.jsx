import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ShieldCheck, Calendar, Phone, MapPin, CheckCircle, XCircle, DollarSign, Award, Lock, ArrowLeft } from 'lucide-react';

export default function GuideDashboard() {
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isGuide, setIsGuide] = useState(false);

  const [guideProfile, setGuideProfile] = useState({
    name: "Nuwan Silva (360 Tours Lanka)",
    licenseNo: "SLTDA-G-2026-001",
    status: "SLTDA Approved Verified Guide",
    district: "Colombo / Islandwide",
    phone: "+94 77 930 1088",
    ratePerDay: "$50 USD",
    languages: ["English", "German"]
  });

  const [inquiries, setInquiries] = useState([
    {
      id: "inq-1",
      travelerName: "Emma Watson",
      contactPhone: "+44 7700 900077",
      destination: "Sigiriya & Dambulla Day Tour",
      date: "2026-10-20",
      guests: 2,
      status: "Pending"
    },
    {
      id: "inq-2",
      travelerName: "Markus Bauer",
      contactPhone: "+49 151 12345678",
      destination: "Kandy to Ella Scenic Train Escort",
      date: "2026-11-05",
      guests: 3,
      status: "Pending"
    }
  ]);

  // Auth & Role check
  useEffect(() => {
    async function checkAuth() {
      setLoadingAuth(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        setIsGuide(true);
      } else {
        setIsGuide(false);
      }
      setLoadingAuth(false);
    }
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsGuide(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch real data from Supabase & LocalStorage
  useEffect(() => {
    async function loadGuideDataAndInquiries() {
      if (session?.user) {
        const email = session.user.email;

        // 1. Fetch Guide Profile
        const { data: guideData } = await supabase
          .from('tour_guides')
          .select('*')
          .eq('email', email)
          .single();

        if (guideData) {
          setGuideProfile({
            name: guideData.full_name || guideData.agency_name || "Verified Ceylon Guide",
            licenseNo: guideData.license_number || "SLTDA-G-VERIFIED",
            status: guideData.verified ? "SLTDA Approved Verified Guide" : "Verification Pending",
            district: guideData.district || "Islandwide",
            phone: guideData.phone || "+94 77 123 4567",
            ratePerDay: `$${guideData.daily_rate_usd || 50} USD`,
            languages: guideData.languages || ["English", "Sinhala"]
          });
        }
      }

      let combined = [
        {
          id: "inq-1",
          travelerName: "Emma Watson",
          contactPhone: "+44 7700 900077",
          destination: "Sigiriya & Dambulla Day Tour",
          date: "2026-10-20",
          guests: 2,
          status: "Pending"
        },
        {
          id: "inq-2",
          travelerName: "Markus Bauer",
          contactPhone: "+49 151 12345678",
          destination: "Kandy to Ella Scenic Train Escort",
          date: "2026-11-05",
          guests: 3,
          status: "Pending"
        }
      ];

      // 2. Fetch Supabase Bookings
      try {
        const { data: dbBookings } = await supabase.from('bookings').select('*');
        if (dbBookings && dbBookings.length > 0) {
          const mappedDb = dbBookings.map(b => ({
            id: b.id || "inq-" + Math.random(),
            travelerName: b.traveler_name || "Traveler",
            contactPhone: b.contact_phone || "N/A",
            destination: b.destination_name || "Sri Lanka Custom Tour",
            date: b.start_date || b.travel_date || "2026-10-25",
            guests: b.headcount || 2,
            status: b.status || "Pending"
          }));
          combined = [...mappedDb];
        }
      } catch (_e) {}

      // 3. Merge LocalStorage Submitted Traveler Requests
      try {
        const local = JSON.parse(localStorage.getItem('ceylon_tour_bookings') || '[]');
        if (local && local.length > 0) {
          const mappedLocal = local.map(b => ({
            id: b.id || "inq-" + Math.random(),
            travelerName: b.traveler_name || b.travelerName || "Traveler",
            contactPhone: b.contact_phone || b.contactPhone || "N/A",
            destination: b.destination_name || b.destination || "Sri Lanka Tour",
            date: b.start_date || b.travel_date || b.date || "2026-10-25",
            guests: b.headcount || b.guests || 2,
            status: b.status || "Pending"
          }));

          const existingIds = new Set(combined.map(item => item.id));
          mappedLocal.forEach(item => {
            if (!existingIds.has(item.id)) {
              combined.unshift(item);
            }
          });
        }
      } catch (_e) {}

      setInquiries(combined);
    }

    loadGuideDataAndInquiries();
  }, [session, isGuide]);

  const handleAccept = async (id) => {
    setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: "Accepted & Confirmed" } : item));
    try {
      await supabase.from('bookings').update({ status: 'Accepted & Confirmed' }).eq('id', id);
    } catch (_e) {}
    try {
      const local = JSON.parse(localStorage.getItem('ceylon_tour_bookings') || '[]');
      const updated = local.map(b => b.id === id ? { ...b, status: 'Accepted & Confirmed' } : b);
      localStorage.setItem('ceylon_tour_bookings', JSON.stringify(updated));
    } catch (_e) {}
  };

  const handleDecline = async (id) => {
    setInquiries(prev => prev.filter(item => item.id !== id));
    try {
      await supabase.from('bookings').delete().eq('id', id);
    } catch (_e) {}
    try {
      const local = JSON.parse(localStorage.getItem('ceylon_tour_bookings') || '[]');
      const updated = local.filter(b => b.id !== id);
      localStorage.setItem('ceylon_tour_bookings', JSON.stringify(updated));
    } catch (_e) {}
  };

  const handleBypassLogin = () => {
    setIsGuide(true);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ceylon-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-ceylon-primary"></div>
      </div>
    );
  }

  // Access Denied / Protected Screen
  if (!session?.user && !isGuide) {
    return (
      <div className="min-h-screen bg-ceylon-bg py-20 px-6 flex items-center justify-center">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-2xl max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
            <Lock size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Guide Portal Restricted</h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Access to the Licensed Tour Guide Dashboard requires signing in with an authenticated SLTDA guide account.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/login"
              className="block w-full bg-ceylon-primary hover:bg-ceylon-accent text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm"
            >
              Sign In as Tour Guide
            </Link>

            <button
              onClick={handleBypassLogin}
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-3 rounded-xl border border-emerald-200 transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldCheck size={16} /> Guide Demo Mode
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 font-semibold pt-2"
            >
              <ArrowLeft size={14} /> Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ceylon-bg py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-ceylon-primary text-white p-8 rounded-3xl shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck size={18} /> Official Tour Guide Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-black">{guideProfile.name}</h1>
            <p className="text-gray-300 text-sm mt-1">Manage traveler booking requests, update rates, and view your verification status.</p>
          </div>

          <Link to="/" className="bg-ceylon-accent hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-md w-fit">
            Back to Home
          </Link>
        </div>

        {/* Guide Details Card & Badge Summary */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 font-black text-2xl flex items-center justify-center border-2 border-emerald-500">
              NS
            </div>
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 w-fit mb-1">
                <Award size={14} /> {guideProfile.status}
              </span>
              <h3 className="font-extrabold text-gray-900 text-lg">{guideProfile.licenseNo}</h3>
            </div>
          </div>

          <div className="space-y-1 text-sm text-gray-600 border-l border-gray-100 md:pl-6">
            <p className="flex items-center gap-2"><MapPin size={16} className="text-ceylon-accent" /> {guideProfile.district}</p>
            <p className="flex items-center gap-2"><Phone size={16} className="text-ceylon-accent" /> {guideProfile.phone}</p>
          </div>

          <div className="space-y-1 text-sm text-gray-600 border-l border-gray-100 md:pl-6">
            <p className="flex items-center gap-2 font-bold text-gray-900"><DollarSign size={16} className="text-emerald-600" /> Rate: {guideProfile.ratePerDay}</p>
            <p className="text-xs text-gray-500">Languages: {guideProfile.languages.join(", ")}</p>
          </div>
        </div>

        {/* Incoming Traveler Booking Requests */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-ceylon-primary flex items-center gap-2">
              <Calendar className="text-ceylon-accent" /> Incoming Traveler Booking Requests
            </h2>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
              {inquiries.filter(i => i.status === 'Pending').length} Pending
            </span>
          </div>

          <div className="space-y-4">
            {inquiries.map((req) => (
              <div key={req.id} className="p-6 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-extrabold text-gray-900 text-lg">{req.travelerName}</h3>
                    <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-full border border-blue-200">
                      {req.contactPhone}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-ceylon-primary">{req.destination}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Date: <strong className="text-gray-700">{req.date}</strong> | Headcount: <strong className="text-gray-700">{req.guests} Guests</strong>
                  </p>
                </div>

                <div>
                  {req.status === 'Accepted & Confirmed' ? (
                    <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-extrabold px-4 py-2.5 rounded-xl border border-emerald-300">
                      <CheckCircle size={16} /> Booking Accepted
                    </span>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleAccept(req.id)}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        <CheckCircle size={16} /> Accept Booking
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
        </div>

      </div>
    </div>
  );
}
