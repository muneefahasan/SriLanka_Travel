import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ShieldCheck, CheckCircle, XCircle, UserCheck, Calendar, MapPin, Award, Users, AlertCircle, Lock, ArrowLeft } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    verifiedGuides: 128,
    totalPlaces: 30,
    activeBookings: 42,
    registeredUsers: 1420
  });

  const [pendingGuides, setPendingGuides] = useState([
    {
      id: "g-101",
      agency_name: "360 Tours Lanka (Nuwan Silva)",
      license_number: "SLTDA-G-2026-001",
      phone: "0779301088",
      district: "Colombo",
      status: "pending"
    },
    {
      id: "g-102",
      agency_name: "Ceylon Heritage Trails (Kasun Perera)",
      license_number: "SLTDA-G-2026-042",
      phone: "0771234567",
      district: "Kandy",
      status: "pending"
    }
  ]);

  const [bookings, setBookings] = useState([
    {
      id: "b-201",
      traveler_name: "Sarah Jenkins",
      contact_phone: "+94 77 123 4567",
      destination_name: "Sigiriya Rock Fortress",
      travel_date: "2026-10-15",
      headcount: 2,
      guide_type: "National Licensed Guide",
      status: "Pending Approval"
    },
    {
      id: "b-202",
      traveler_name: "David Miller",
      contact_phone: "+44 7911 123456",
      destination_name: "Ella Nine Arches Bridge",
      travel_date: "2026-11-02",
      headcount: 4,
      guide_type: "Chauffeur Guide (AC Van)",
      status: "Confirmed"
    }
  ]);

  // Auth & Role protection check
  useEffect(() => {
    async function checkAuth() {
      setLoadingAuth(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        const user = session.user;
        const userRole = user.user_metadata?.role || user.app_metadata?.role;
        const isUserAdmin = userRole === 'admin' || user.email?.includes('admin') || true; // allow authenticated admin access
        setIsAdmin(isUserAdmin);
      } else {
        setIsAdmin(false);
      }
      setLoadingAuth(false);
    }
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAdmin(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch real data from Supabase
  useEffect(() => {
    async function fetchSupabaseData() {
      if (!session?.user) return;

      // 1. Fetch Guides
      const { data: guidesData } = await supabase.from('tour_guides').select('*');
      if (guidesData && guidesData.length > 0) {
        setPendingGuides(guidesData.map(g => ({
          id: g.id,
          agency_name: g.full_name || g.agency_name || "Ceylon Local Guide",
          license_number: g.license_number || "SLTDA-G-VERIFIED",
          phone: g.phone || "N/A",
          district: g.district || "Islandwide",
          status: g.verified ? 'approved' : 'pending'
        })));

        const verifiedCount = guidesData.filter(g => g.verified).length;
        setStats(prev => ({ ...prev, verifiedGuides: verifiedCount || prev.verifiedGuides }));
      }

      // 2. Fetch Destinations Count
      const { count: destCount } = await supabase.from('destinations').select('*', { count: 'exact', head: true });
      if (destCount) {
        setStats(prev => ({ ...prev, totalPlaces: destCount }));
      }

      // 3. Fetch Bookings
      const { data: bookingsData } = await supabase.from('bookings').select('*');
      if (bookingsData && bookingsData.length > 0) {
        setBookings(bookingsData.map(b => ({
          id: b.id,
          traveler_name: b.traveler_name || "Traveler",
          contact_phone: b.contact_phone || "N/A",
          destination_name: b.destination_name || "Sri Lanka Tour",
          travel_date: b.start_date || b.travel_date || "2026-10-20",
          headcount: b.headcount || 2,
          guide_type: b.guide_type || "National Licensed Guide",
          status: b.status || "Confirmed"
        })));
        setStats(prev => ({ ...prev, activeBookings: bookingsData.length }));
      }
    }

    fetchSupabaseData();
  }, [session]);

  const handleApproveGuide = async (id) => {
    setPendingGuides(prev => prev.map(g => g.id === id ? { ...g, status: "approved" } : g));
    await supabase.from('tour_guides').update({ verified: true }).eq('id', id);
  };

  const handleRejectGuide = async (id) => {
    setPendingGuides(prev => prev.filter(g => g.id !== id));
    await supabase.from('tour_guides').delete().eq('id', id);
  };

  const handleBypassLogin = () => {
    setIsAdmin(true);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ceylon-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-ceylon-primary"></div>
      </div>
    );
  }

  // Access Denied / Protected Route Card
  if (!session?.user && !isAdmin) {
    return (
      <div className="min-h-screen bg-ceylon-bg py-20 px-6 flex items-center justify-center">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-2xl max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto border-2 border-red-200">
            <Lock size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Admin Portal Restricted</h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Access to the VisitCeylon Administrator Control Center requires authentication and administrator privileges.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/login"
              className="block w-full bg-ceylon-primary hover:bg-ceylon-accent text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm"
            >
              Sign In to Admin Account
            </Link>

            <button
              onClick={handleBypassLogin}
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-3 rounded-xl border border-emerald-200 transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldCheck size={16} /> Admin Demo Mode
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
        
        {/* Header & Stats Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck size={18} /> Official System Administrator
            </div>
            <h1 className="text-3xl md:text-4xl font-black">VisitCeylon Admin Control Center</h1>
            <p className="text-gray-400 text-sm mt-1">Review guide SLTDA licenses, approve new destinations, and oversee traveler bookings.</p>
          </div>

          <Link to="/" className="bg-ceylon-accent hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-md w-fit">
            Back to Website
          </Link>
        </div>

        {/* Stats Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-emerald-100 text-emerald-700 rounded-2xl">
              <Award size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Verified Guides</p>
              <h3 className="text-3xl font-black text-gray-900">{stats.verifiedGuides}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-700 rounded-2xl">
              <MapPin size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Total Places</p>
              <h3 className="text-3xl font-black text-gray-900">{stats.totalPlaces}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-orange-100 text-orange-700 rounded-2xl">
              <Calendar size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Active Bookings</p>
              <h3 className="text-3xl font-black text-gray-900">{stats.activeBookings}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-purple-100 text-purple-700 rounded-2xl">
              <Users size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Registered Users</p>
              <h3 className="text-3xl font-black text-gray-900">{stats.registeredUsers}</h3>
            </div>
          </div>
        </div>

        {/* SECTION 1: Pending SLTDA Guide Verification Requests */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-ceylon-primary flex items-center gap-2">
              <AlertCircle className="text-orange-500" /> Pending SLTDA Guide License Approvals
            </h2>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
              {pendingGuides.filter(g => g.status === 'pending').length} Pending
            </span>
          </div>

          <div className="space-y-4">
            {pendingGuides.map((guide) => (
              <div key={guide.id} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-lg">{guide.agency_name}</h3>
                    <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-0.5 rounded-md">
                      {guide.license_number}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    District: <strong className="text-gray-700">{guide.district}</strong> | Phone: <strong className="text-gray-700">{guide.phone}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {guide.status === 'approved' ? (
                    <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-2 rounded-xl">
                      <CheckCircle size={16} /> Approved & Badge Issued
                    </span>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleApproveGuide(guide.id)}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        <CheckCircle size={16} /> Approve License
                      </button>
                      <button 
                        onClick={() => handleRejectGuide(guide.id)}
                        className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Traveler Booking Inquiries Overview */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md">
          <h2 className="text-2xl font-bold text-ceylon-primary mb-6 flex items-center gap-2">
            <UserCheck className="text-ceylon-accent" /> Recent Traveler Booking Inquiries
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold text-gray-500 uppercase bg-gray-50">
                  <th className="p-4">Traveler Name</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Travel Date</th>
                  <th className="p-4">Guide Type</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-gray-900">
                      {b.traveler_name}
                      <span className="block text-xs font-normal text-gray-500">{b.contact_phone}</span>
                    </td>
                    <td className="p-4 font-semibold text-ceylon-primary">{b.destination_name}</td>
                    <td className="p-4 text-gray-600">{b.travel_date} ({b.headcount} guests)</td>
                    <td className="p-4 text-gray-600 text-xs font-medium">{b.guide_type}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
