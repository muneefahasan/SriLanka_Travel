import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ShieldCheck, CheckCircle, XCircle, UserCheck, Calendar, MapPin, Award, Users, AlertCircle } from 'lucide-react';

// NOTE: This assumes it's wrapped by <ProtectedRoute allowedRoles={['admin']}>
// in App.jsx. No role check, no "|| true", no demo bypass button belongs here —
// that was the bug. Real enforcement lives in ProtectedRoute + Supabase RLS.
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ verifiedGuides: 0, totalPlaces: 0, activeBookings: 0, registeredUsers: 0 });
  const [pendingGuides, setPendingGuides] = useState([]);
  const [pendingPlaces, setPendingPlaces] = useState([]);
  const [bookings, setBookings] = useState([]);

  async function fetchAdminData() {
    setLoading(true);

    // Guides pending verification live in `profiles`, not a separate `tour_guides` table.
    const { data: guides } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'guide')
      .eq('is_verified', false);
    setPendingGuides(guides || []);

    const { count: verifiedCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'guide')
      .eq('is_verified', true);

    // Places submitted by travelers, awaiting approval
    const { data: places } = await supabase
      .from('destinations')
      .select('*')
      .eq('status', 'pending');
    setPendingPlaces(places || []);

    const { count: destCount } = await supabase
      .from('destinations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    setBookings(bookingsData || []);

    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    setStats({
      verifiedGuides: verifiedCount || 0,
      totalPlaces: destCount || 0,
      activeBookings: bookingsData?.length || 0,
      registeredUsers: userCount || 0,
    });

    setLoading(false);
  }

  useEffect(() => { fetchAdminData(); }, []);

  const handleApproveGuide = async (id) => {
    setPendingGuides(prev => prev.filter(g => g.id !== id));
    const { error } = await supabase.from('profiles').update({ is_verified: true }).eq('id', id);
    if (error) {
      alert('Could not approve guide: ' + error.message);
      fetchAdminData(); // resync on failure
    }
  };

  const handleRejectGuide = async (id) => {
    setPendingGuides(prev => prev.filter(g => g.id !== id));
    // We don't delete the auth user here — just leave them unverified/rejected.
    // Add a `rejected` boolean column if you want to distinguish "still pending" vs "rejected".
    const { error } = await supabase.from('profiles').update({ role: 'traveler' }).eq('id', id);
    if (error) {
      alert('Could not reject guide: ' + error.message);
      fetchAdminData();
    }
  };

  const handleApprovePlace = async (id) => {
    setPendingPlaces(prev => prev.filter(p => p.id !== id));
    const { error } = await supabase.from('destinations').update({ status: 'approved' }).eq('id', id);
    if (error) {
      alert('Could not approve place: ' + error.message);
      fetchAdminData();
    } else {
      setStats(prev => ({ ...prev, totalPlaces: prev.totalPlaces + 1 }));
    }
  };

  const handleRejectPlace = async (id) => {
    setPendingPlaces(prev => prev.filter(p => p.id !== id));
    const { error } = await supabase.from('destinations').update({ status: 'rejected' }).eq('id', id);
    if (error) {
      alert('Could not reject place: ' + error.message);
      fetchAdminData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ceylon-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-ceylon-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ceylon-bg py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-emerald-100 text-emerald-700 rounded-2xl"><Award size={28} /></div>
            <div><p className="text-xs font-bold text-gray-500 uppercase">Verified Guides</p><h3 className="text-3xl font-black text-gray-900">{stats.verifiedGuides}</h3></div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-700 rounded-2xl"><MapPin size={28} /></div>
            <div><p className="text-xs font-bold text-gray-500 uppercase">Total Approved Places</p><h3 className="text-3xl font-black text-gray-900">{stats.totalPlaces}</h3></div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-orange-100 text-orange-700 rounded-2xl"><Calendar size={28} /></div>
            <div><p className="text-xs font-bold text-gray-500 uppercase">Recent Bookings</p><h3 className="text-3xl font-black text-gray-900">{stats.activeBookings}</h3></div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-purple-100 text-purple-700 rounded-2xl"><Users size={28} /></div>
            <div><p className="text-xs font-bold text-gray-500 uppercase">Registered Users</p><h3 className="text-3xl font-black text-gray-900">{stats.registeredUsers}</h3></div>
          </div>
        </div>

        {/* Pending guide verification */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-ceylon-primary flex items-center gap-2">
              <AlertCircle className="text-orange-500" /> Pending SLTDA Guide License Approvals
            </h2>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">{pendingGuides.length} Pending</span>
          </div>

          {pendingGuides.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No pending guide applications.</p>
          ) : (
            <div className="space-y-4">
              {pendingGuides.map((guide) => (
                <div key={guide.id} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-lg">{guide.full_name}</h3>
                      <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-0.5 rounded-md">{guide.license_number}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      District: <strong className="text-gray-700">{guide.district}</strong> | Phone: <strong className="text-gray-700">{guide.phone}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleApproveGuide(guide.id)} className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer">
                      <CheckCircle size={16} /> Approve License
                    </button>
                    <button onClick={() => handleRejectGuide(guide.id)} className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer">
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending place approval */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-ceylon-primary flex items-center gap-2">
              <MapPin className="text-blue-500" /> Pending New Place Submissions
            </h2>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">{pendingPlaces.length} Pending</span>
          </div>

          {pendingPlaces.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No pending place submissions.</p>
          ) : (
            <div className="space-y-4">
              {pendingPlaces.map((place) => (
                <div key={place.id} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{place.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{place.location} — {place.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleApprovePlace(place.id)} className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer">
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button onClick={() => handleRejectPlace(place.id)} className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer">
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent bookings overview */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md">
          <h2 className="text-2xl font-bold text-ceylon-primary mb-6 flex items-center gap-2">
            <UserCheck className="text-ceylon-accent" /> Recent Traveler Booking Inquiries
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold text-gray-500 uppercase bg-gray-50">
                  <th className="p-4">Traveler</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Travel Date</th>
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
                    <td className="p-4 text-gray-600">{b.travel_date}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        b.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : b.status === 'declined' ? 'bg-gray-200 text-gray-600' : 'bg-amber-100 text-amber-700'
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
