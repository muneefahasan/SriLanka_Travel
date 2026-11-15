import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  ShieldCheck, CheckCircle, XCircle, UserCheck, Calendar,
  MapPin, Award, Users, AlertCircle, Search, ChevronDown,
  ChevronUp, Loader2, RefreshCw, InboxIcon
} from 'lucide-react';

// ─── constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 5; // items per page for every paginated section

// ─── tiny helpers ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    accepted: 'bg-emerald-100 text-emerald-700',
    approved:  'bg-emerald-100 text-emerald-700',
    declined:  'bg-gray-200   text-gray-600',
    rejected:  'bg-red-100    text-red-600',
    pending:   'bg-amber-100  text-amber-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${map[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status ?? 'unknown'}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3 text-gray-400">
      <InboxIcon size={40} strokeWidth={1.5} />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}



// ─── Pagination controls ───────────────────────────────────────────────────────
function Pagination({ page, totalPages, onPrev, onNext }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-5 border-t border-gray-100">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
      >
        <ChevronUp size={14} className="-rotate-90" /> Previous
      </button>
      <span className="text-xs text-gray-500 font-medium">Page {page} / {totalPages}</span>
      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
      >
        Next <ChevronDown size={14} className="-rotate-90" />
      </button>
    </div>
  );
}

// ─── Search bar ───────────────────────────────────────────────────────────────
function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative mb-5">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ceylon-primary/30 focus:border-ceylon-primary transition-all"
      />
    </div>
  );
}

// ─── NOTE: wrapped by <ProtectedRoute allowedRoles={['admin']}> in App.jsx ───
export default function AdminDashboard() {
  // ── global states ──
  const [loading,  setLoading]  = useState(true);
  const [fetchErr, setFetchErr] = useState(null);

  // ── stats card ──
  const [stats, setStats] = useState({
    verifiedGuides: 0, totalPlaces: 0, activeBookings: 0, registeredUsers: 0,
  });

  // ── raw data ──
  const [pendingGuides,  setPendingGuides]  = useState([]);
  const [pendingPlaces,  setPendingPlaces]  = useState([]);
  const [bookings,       setBookings]       = useState([]);
  const [verifiedGuides, setVerifiedGuides] = useState([]);
  const [approvedPlaces, setApprovedPlaces] = useState([]);
  const [registeredUsers,setRegisteredUsers]= useState([]);
  const [allBookings,    setAllBookings]    = useState([]);

  // ── active card section ──
  const [activeSection, setActiveSection] = useState(null);

  // ── search states ──
  const [guideSearch,   setGuideSearch]   = useState('');
  const [placeSearch,   setPlaceSearch]   = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [userSearch,    setUserSearch]    = useState('');

  // ── pagination states ──
  const [guidePage,   setGuidePage]   = useState(1);
  const [placePage,   setPlacePage]   = useState(1);
  const [bookingPage, setBookingPage] = useState(1);
  const [userPage,    setUserPage]    = useState(1);

  // ── section-level loading/error ──
  const [sectionLoading, setSectionLoading] = useState({});
  const [sectionError,   setSectionError]   = useState({});

  // ─────────────────────────────────────────────────────────────────────────────
  const fetchAdminData = useCallback(async () => {
  setLoading(true);
  setFetchErr(null);

  try {
    // Fetch all dashboard data in parallel
    const [
      guidesResult,
      verifiedResult,
      pendingPlacesResult,
      approvedPlacesResult,
      usersResult,
      bookingsResult,
      verifiedCountResult,
      placesCountResult,
      bookingsCountResult,
      usersCountResult,
    ] = await Promise.all([
      supabase.from('profiles').select('*')
        .eq('role', 'guide').eq('is_verified', false),

      supabase.from('profiles').select('*')
        .eq('role', 'guide').eq('is_verified', true),

      supabase.from('destinations').select('*')
        .eq('status', 'pending'),

      supabase.from('destinations').select('*')
        .eq('status', 'approved'),

      supabase.from('profiles').select('*')
        .order('created_at', { ascending: false }),

      supabase.from('bookings').select('*')
        .order('id', { ascending: false }),

      supabase.from('profiles').select('*', { count: 'exact', head: true })
        .eq('role', 'guide').eq('is_verified', true),

      supabase.from('destinations').select('*', { count: 'exact', head: true })
        .eq('status', 'approved'),

      supabase.from('bookings').select('*', { count: 'exact', head: true }),

      supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ]);

    // Do not silently show empty lists when database queries fail
    const results = [
      guidesResult,
      verifiedResult,
      pendingPlacesResult,
      approvedPlacesResult,
      usersResult,
      bookingsResult,
      verifiedCountResult,
      placesCountResult,
      bookingsCountResult,
      usersCountResult,
    ];

    const failedResult = results.find(result => result.error);

    if (failedResult) {
      throw failedResult.error;
    }

    // Generate temporary signed URLs for private guide photos
    const guidesWithPhotos = await Promise.all(
      (guidesResult.data || []).map(async (guide) => {
        if (!guide.avatar_url) {
          return { ...guide, photoUrl: null };
        }

        const { data, error } = await supabase.storage
          .from('guide-photos')
          .createSignedUrl(guide.avatar_url, 300);

        return {
          ...guide,
          photoUrl: error ? null : data?.signedUrl || null,
        };
      })
    );

    setPendingGuides(guidesWithPhotos);
    setVerifiedGuides(verifiedResult.data || []);
    setPendingPlaces(pendingPlacesResult.data || []);
    setApprovedPlaces(approvedPlacesResult.data || []);
    setRegisteredUsers(usersResult.data || []);

    const safeBookings = bookingsResult.data || [];
    setAllBookings(safeBookings);
    setBookings(safeBookings);

    setStats({
      verifiedGuides: verifiedCountResult.count ?? 0,
      totalPlaces: placesCountResult.count ?? 0,
      activeBookings: bookingsCountResult.count ?? 0,
      registeredUsers: usersCountResult.count ?? 0,
    });

  } catch (err) {
    console.error('Admin dashboard error:', err);
    setFetchErr('Failed to load dashboard data. Please try again.');
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => { fetchAdminData(); }, [fetchAdminData]);

  // ─────────────────────────────────────────────────────────────────────────────
  // ACTION HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleApproveGuide = async (id) => {
  const key = `guide-${id}`;

  setSectionLoading(p => ({ ...p, [key]: true }));
  setSectionError(p => ({ ...p, [key]: null }));

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: true })
      .eq('id', id);

    if (error) throw error;

    setPendingGuides(prev => prev.filter(g => g.id !== id));
    setStats(p => ({ ...p, verifiedGuides: p.verifiedGuides + 1 }));

  } catch (err) {
    console.error('Approve guide error:', err);
    setSectionError(p => ({
      ...p,
      [key]: 'Could not approve guide. Please try again.',
    }));
  } finally {
    setSectionLoading(p => ({ ...p, [key]: false }));
  }
};

const handleRejectGuide = async (id) => {
  const key = `guide-${id}`;

  setSectionLoading(p => ({ ...p, [key]: true }));
  setSectionError(p => ({ ...p, [key]: null }));

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'traveler', is_verified: false })
      .eq('id', id);

    if (error) throw error;

    setPendingGuides(prev => prev.filter(g => g.id !== id));

  } catch (err) {
    console.error('Reject guide error:', err);
    setSectionError(p => ({
      ...p,
      [key]: 'Could not reject guide. Please try again.',
    }));
  } finally {
    setSectionLoading(p => ({ ...p, [key]: false }));
  }
};

const handleApprovePlace = async (id) => {
  const key = `place-${id}`;

  setSectionLoading(p => ({ ...p, [key]: true }));
  setSectionError(p => ({ ...p, [key]: null }));

  try {
    const { error } = await supabase
      .from('destinations')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) throw error;

    setPendingPlaces(prev => prev.filter(p => p.id !== id));
    setStats(p => ({ ...p, totalPlaces: p.totalPlaces + 1 }));

  } catch (err) {
    console.error('Approve place error:', err);
    setSectionError(p => ({
      ...p,
      [key]: 'Could not approve place. Please try again.',
    }));
  } finally {
    setSectionLoading(p => ({ ...p, [key]: false }));
  }
};

const handleRejectPlace = async (id) => {
  const key = `place-${id}`;

  setSectionLoading(p => ({ ...p, [key]: true }));
  setSectionError(p => ({ ...p, [key]: null }));

  try {
    const { error } = await supabase
      .from('destinations')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (error) throw error;

    setPendingPlaces(prev => prev.filter(p => p.id !== id));

  } catch (err) {
    console.error('Reject place error:', err);
    setSectionError(p => ({
      ...p,
      [key]: 'Could not reject place. Please try again.',
    }));
  } finally {
    setSectionLoading(p => ({ ...p, [key]: false }));
  }
};
  // ─────────────────────────────────────────────────────────────────────────────
  // FILTER HELPERS
  // ─────────────────────────────────────────────────────────────────────────────
  const filteredVerifiedGuides = verifiedGuides.filter(g =>
    [g.full_name, g.license_number, g.district, g.phone]
      .some(f => f?.toLowerCase().includes(guideSearch.toLowerCase()))
  );
  const filteredApprovedPlaces = approvedPlaces.filter(p =>
    [p.name, p.location, p.category]
      .some(f => f?.toLowerCase().includes(placeSearch.toLowerCase()))
  );
  const filteredAllBookings = allBookings.filter(b =>
    [b.traveler_name, b.destination_name, b.guide_name, b.status]
      .some(f => f?.toLowerCase().includes(bookingSearch.toLowerCase()))
  );
  const filteredUsers = registeredUsers.filter(u =>
    [u.full_name, u.role, u.district, u.phone]
      .some(f => f?.toLowerCase().includes(userSearch.toLowerCase()))
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // PAGINATION HELPERS
  // ─────────────────────────────────────────────────────────────────────────────
  const paginate = (arr, page) => arr.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = arr => Math.max(1, Math.ceil(arr.length / PAGE_SIZE));

  // Reset page whenever search changes
  useEffect(() => setGuidePage(1),   [guideSearch]);
  useEffect(() => setPlacePage(1),   [placeSearch]);
  useEffect(() => setBookingPage(1), [bookingSearch]);
  useEffect(() => setUserPage(1),    [userSearch]);

  // ─────────────────────────────────────────────────────────────────────────────
  // PENDING GUIDE SECTION — search + pagination  
  // ─────────────────────────────────────────────────────────────────────────────
  const [pendingGuideSearch, setPendingGuideSearch] = useState('');
  const [pendingGuidePage,   setPendingGuidePage]   = useState(1);
  useEffect(() => setPendingGuidePage(1), [pendingGuideSearch]);

  const filteredPendingGuides = pendingGuides.filter(g =>
    [g.full_name, g.license_number, g.district, g.phone]
      .some(f => f?.toLowerCase().includes(pendingGuideSearch.toLowerCase()))
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // PENDING PLACE SECTION — search + pagination
  // ─────────────────────────────────────────────────────────────────────────────
  const [pendingPlaceSearch, setPendingPlaceSearch] = useState('');
  const [pendingPlacePage,   setPendingPlacePage]   = useState(1);
  useEffect(() => setPendingPlacePage(1), [pendingPlaceSearch]);

  const filteredPendingPlaces = pendingPlaces.filter(p =>
    [p.name, p.location, p.category]
      .some(f => f?.toLowerCase().includes(pendingPlaceSearch.toLowerCase()))
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // RECENT BOOKINGS TABLE — search + filter + pagination
  // ─────────────────────────────────────────────────────────────────────────────
  const [bookingTableSearch, setBookingTableSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [bookingTablePage, setBookingTablePage] = useState(1);
  useEffect(() => setBookingTablePage(1), [bookingTableSearch, bookingStatusFilter]);

  const filteredBookingsTable = bookings.filter(b => {
    const matchesSearch = [b.traveler_name, b.destination_name, b.guide_name, b.status]
      .some(f => f?.toLowerCase().includes(bookingTableSearch.toLowerCase()));
    const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // GLOBAL LOADING / ERROR STATES
  // ─────────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-ceylon-bg">
        <Loader2 size={48} className="animate-spin text-ceylon-primary" />
        <p className="text-sm text-gray-500 font-medium">Loading admin dashboard…</p>
      </div>
    );
  }

  if (fetchErr) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-ceylon-bg px-6">
        <AlertCircle size={48} className="text-red-500" />
        <p className="text-base font-semibold text-gray-700 text-center">{fetchErr}</p>
        <button
          onClick={fetchAdminData}
          className="flex items-center gap-2 bg-ceylon-primary text-white font-bold px-5 py-3 rounded-2xl hover:opacity-90 transition-all"
        >
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-ceylon-bg py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck size={18} /> Official System Administrator
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black">XplorSL Admin Control Center</h1>
            <p className="text-gray-400 text-sm mt-1">Review guide SLTDA licenses, approve new destinations, and oversee traveler bookings.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={fetchAdminData}
              title="Refresh dashboard data"
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-all"
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <Link to="/" className="bg-ceylon-accent hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition-all shadow-md">
              Back to Website
            </Link>
          </div>
        </div>

        {/* ── Stat Cards ── */}
          {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              key: 'guides',
              label: 'Verified Guides',
              value: stats.verifiedGuides,
              icon: <Award size={28} />,
              border: 'border-emerald-400 ring-emerald-300',
              focus: 'focus:ring-emerald-400',
              iconStyle: 'bg-emerald-100 text-emerald-700',
              hover: 'hover:border-emerald-400',
            },
            {
              key: 'places',
              label: 'Total Approved Places',
              value: stats.totalPlaces,
              icon: <MapPin size={28} />,
              border: 'border-blue-400 ring-blue-300',
              focus: 'focus:ring-blue-400',
              iconStyle: 'bg-blue-100 text-blue-700',
              hover: 'hover:border-blue-400',
            },
            {
              key: 'bookings',
              label: 'Recent Bookings',
              value: stats.activeBookings,
              icon: <Calendar size={28} />,
              border: 'border-orange-400 ring-orange-300',
              focus: 'focus:ring-orange-400',
              iconStyle: 'bg-orange-100 text-orange-700',
              hover: 'hover:border-orange-400',
            },
            {
              key: 'users',
              label: 'Registered Users',
              value: stats.registeredUsers,
              icon: <Users size={28} />,
              border: 'border-purple-400 ring-purple-300',
              focus: 'focus:ring-purple-400',
              iconStyle: 'bg-purple-100 text-purple-700',
              hover: 'hover:border-purple-400',
            },
          ].map(({ key, label, value, icon, border, focus, iconStyle, hover }) => {
            const isActive = activeSection === key;

            return (
              <button
                key={key}
                onClick={() => setActiveSection(isActive ? null : key)}
                aria-pressed={isActive}
                className={`text-left bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-4 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${focus} ${
                  isActive ? `${border} ring-2` : `border-gray-200 ${hover}`
                }`}
              >
                <div className={`p-4 ${iconStyle} rounded-2xl flex-shrink-0`}>
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">{label}</p>
                  <h3 className="text-3xl font-black text-gray-900">{value}</h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Dynamic List (card click expands) ── */}
        {activeSection && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-md">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-ceylon-primary">
                {activeSection === 'guides'   && 'Verified Guides'}
                {activeSection === 'places'   && 'Approved Places'}
                {activeSection === 'bookings' && 'All Booking Enquiries'}
                {activeSection === 'users'    && 'Registered Users'}
              </h2>
              <button
                onClick={() => setActiveSection(null)}
                aria-label="Close section"
                className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors px-3 py-1 rounded-lg hover:bg-red-50"
              >
                Close ×
              </button>
            </div>

            {/* Guides section */}
            {activeSection === 'guides' && (
              <>
                <SearchBar value={guideSearch} onChange={setGuideSearch} placeholder="Search by name, license, district…" />
                <div className="space-y-3">
                  {filteredVerifiedGuides.length === 0
                    ? <EmptyState message={guideSearch ? 'No guides match your search.' : 'No verified guides found.'} />
                    : paginate(filteredVerifiedGuides, guidePage).map(guide => (
                        <div key={guide.id} className="p-4 bg-gray-50 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{guide.full_name || 'Name unavailable'}</p>
                            <p className="text-xs text-gray-500 mt-0.5">License: {guide.license_number || 'N/A'} · District: {guide.district || 'N/A'} · Phone: {guide.phone || 'N/A'}</p>
                          </div>
                          <StatusBadge status="approved" />
                        </div>
                    ))
                  }
                </div>
                <Pagination
                  page={guidePage} totalPages={totalPages(filteredVerifiedGuides)}
                  onPrev={() => setGuidePage(p => p - 1)} onNext={() => setGuidePage(p => p + 1)}
                />
              </>
            )}

            {/* Places section */}
            {activeSection === 'places' && (
              <>
                <SearchBar value={placeSearch} onChange={setPlaceSearch} placeholder="Search by name, location, category…" />
                <div className="space-y-3">
                  {filteredApprovedPlaces.length === 0
                    ? <EmptyState message={placeSearch ? 'No places match your search.' : 'No approved places found.'} />
                    : paginate(filteredApprovedPlaces, placePage).map(place => (
                        <div key={place.id} className="p-4 bg-gray-50 rounded-xl border">
                          <p className="font-bold text-gray-900">{place.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{place.location || 'N/A'} · {place.category || 'N/A'}</p>
                        </div>
                    ))
                  }
                </div>
                <Pagination
                  page={placePage} totalPages={totalPages(filteredApprovedPlaces)}
                  onPrev={() => setPlacePage(p => p - 1)} onNext={() => setPlacePage(p => p + 1)}
                />
              </>
            )}

            {/* Bookings section */}
            {activeSection === 'bookings' && (
              <>
                <SearchBar value={bookingSearch} onChange={setBookingSearch} placeholder="Search traveler, destination…" />
                <div className="space-y-3">
                  {filteredAllBookings.length === 0
                    ? <EmptyState message={bookingSearch ? 'No bookings match your search.' : 'No booking enquiries found.'} />
                    : paginate(filteredAllBookings, bookingPage).map(booking => (
                        <div key={booking.id} className="p-4 bg-gray-50 rounded-xl border">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <p className="font-bold text-gray-900">{booking.traveler_name || 'Traveler'}</p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {booking.destination_name || 'N/A'} · {booking.travel_date || 'N/A'} · Guide: {booking.guide_name || 'N/A'}
                              </p>
                              <p className="text-xs text-gray-400">Phone: {booking.contact_phone || 'N/A'} · Guests: {booking.headcount ?? 'N/A'}</p>
                            </div>
                            <StatusBadge status={booking.status} />
                          </div>
                        </div>
                    ))
                  }
                </div>
                <Pagination
                  page={bookingPage} totalPages={totalPages(filteredAllBookings)}
                  onPrev={() => setBookingPage(p => p - 1)} onNext={() => setBookingPage(p => p + 1)}
                />
              </>
            )}

            {/* Users section */}
            {activeSection === 'users' && (
              <>
                <SearchBar value={userSearch} onChange={setUserSearch} placeholder="Search by name, role, district…" />
                <div className="space-y-3">
                  {filteredUsers.length === 0
                    ? <EmptyState message={userSearch ? 'No users match your search.' : 'No registered users found.'} />
                    : paginate(filteredUsers, userPage).map(user => (
                        <div key={user.id} className="p-4 bg-gray-50 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{user.full_name || 'Name unavailable'}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Role: {user.role || 'N/A'} · District: {user.district || 'N/A'} · Phone: {user.phone || 'N/A'}</p>
                          </div>
                          <StatusBadge status={user.role} />
                        </div>
                    ))
                  }
                </div>
                <Pagination
                  page={userPage} totalPages={totalPages(filteredUsers)}
                  onPrev={() => setUserPage(p => p - 1)} onNext={() => setUserPage(p => p + 1)}
                />
              </>
            )}
          </div>
        )}

        {/* ── Pending Guide Verification ── */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-ceylon-primary flex items-center gap-2">
              <AlertCircle className="text-orange-500" /> Pending SLTDA Guide License Approvals
            </h2>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
              {pendingGuides.length} Pending
            </span>
          </div>

          <SearchBar value={pendingGuideSearch} onChange={setPendingGuideSearch} placeholder="Search by name, license, district…" />

          {filteredPendingGuides.length === 0 ? (
            <EmptyState message={pendingGuideSearch ? 'No pending guides match your search.' : 'No pending guide applications. All caught up!'} />
          ) : (
            <>
              <div className="space-y-4">
                {paginate(filteredPendingGuides, pendingGuidePage).map((guide) => (
                  <div key={guide.id} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Error banner for this guide row */}
                    {sectionError[`guide-${guide.id}`] && (
                      <p className="text-xs text-red-600 font-semibold col-span-full">
                        {sectionError[`guide-${guide.id}`]}
                      </p>
                    )}

                    <div className="flex items-center gap-4">
                      {guide.photoUrl ? (
                        <img src={guide.photoUrl} alt={`${guide.full_name} profile`}
                          className="w-20 h-20 rounded-2xl object-cover border border-gray-200 flex-shrink-0" />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <Users size={28} className="text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900 text-lg">{guide.full_name}</h3>
                          <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-0.5 rounded-md">
                            {guide.license_number}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          District: <strong className="text-gray-700">{guide.district}</strong>
                          {' | '}
                          Phone: <strong className="text-gray-700">{guide.phone}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleApproveGuide(guide.id)}
                        disabled={sectionLoading[`guide-${guide.id}`]}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        {sectionLoading[`guide-${guide.id}`]
                          ? <Loader2 size={14} className="animate-spin" />
                          : <CheckCircle size={16} />
                        }
                        Approve License
                      </button>
                      <button
                        onClick={() => handleRejectGuide(guide.id)}
                        disabled={sectionLoading[`guide-${guide.id}`]}
                        className="flex items-center gap-1 bg-red-100 hover:bg-red-200 disabled:opacity-60 text-red-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        {sectionLoading[`guide-${guide.id}`]
                          ? <Loader2 size={14} className="animate-spin" />
                          : <XCircle size={16} />
                        }
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination
                page={pendingGuidePage} totalPages={totalPages(filteredPendingGuides)}
                onPrev={() => setPendingGuidePage(p => p - 1)} onNext={() => setPendingGuidePage(p => p + 1)}
              />
            </>
          )}
        </div>

        {/* ── Pending Place Submissions ── */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-ceylon-primary flex items-center gap-2">
              <MapPin className="text-blue-500" /> Pending New Place Submissions
            </h2>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
              {pendingPlaces.length} Pending
            </span>
          </div>

          <SearchBar value={pendingPlaceSearch} onChange={setPendingPlaceSearch} placeholder="Search by name, location, category…" />

          {filteredPendingPlaces.length === 0 ? (
            <EmptyState message={pendingPlaceSearch ? 'No pending places match your search.' : 'No pending place submissions. All clear!'} />
          ) : (
            <>
              <div className="space-y-4">
                {paginate(filteredPendingPlaces, pendingPlacePage).map((place) => (
                  <div key={place.id} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {sectionError[`place-${place.id}`] && (
                      <p className="text-xs text-red-600 font-semibold">{sectionError[`place-${place.id}`]}</p>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{place.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{place.location} — {place.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleApprovePlace(place.id)}
                        disabled={sectionLoading[`place-${place.id}`]}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        {sectionLoading[`place-${place.id}`]
                          ? <Loader2 size={14} className="animate-spin" />
                          : <CheckCircle size={16} />
                        }
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectPlace(place.id)}
                        disabled={sectionLoading[`place-${place.id}`]}
                        className="flex items-center gap-1 bg-red-100 hover:bg-red-200 disabled:opacity-60 text-red-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        {sectionLoading[`place-${place.id}`]
                          ? <Loader2 size={14} className="animate-spin" />
                          : <XCircle size={16} />
                        }
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination
                page={pendingPlacePage} totalPages={totalPages(filteredPendingPlaces)}
                onPrev={() => setPendingPlacePage(p => p - 1)} onNext={() => setPendingPlacePage(p => p + 1)}
              />
            </>
          )}
        </div>

        {/* ── Recent Booking Enquiries ── */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold text-ceylon-primary mb-6 flex items-center gap-2">
            <UserCheck className="text-ceylon-accent" /> Recent Traveler Booking Inquiries
          </h2>

          {/* Search + Status filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={bookingTableSearch}
                onChange={e => setBookingTableSearch(e.target.value)}
                placeholder="Search traveler, destination, guide…"
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ceylon-primary/30 focus:border-ceylon-primary transition-all"
              />
            </div>
            <select
              value={bookingStatusFilter}
              onChange={e => setBookingStatusFilter(e.target.value)}
              className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ceylon-primary/30 focus:border-ceylon-primary bg-white transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          {filteredBookingsTable.length === 0 ? (
            <EmptyState message={
              bookingTableSearch || bookingStatusFilter !== 'all'
                ? 'No bookings match your search / filter.'
                : 'No booking enquiries yet.'
            } />
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs font-bold text-gray-500 uppercase bg-gray-50">
                      <th className="p-4">Traveler</th>
                      <th className="p-4">Destination</th>
                      <th className="p-4">Travel Date</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {paginate(filteredBookingsTable, bookingTablePage).map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="p-4 font-bold text-gray-900">
  {b.traveler_name || 'N/A'}
  <span className="block text-xs font-normal text-gray-500">
    {b.contact_phone || 'N/A'}
  </span>
</td>
<td className="p-4 font-semibold text-ceylon-primary">
  {b.destination_name || 'N/A'}
</td>
                        <td className="p-4 text-gray-600">{b.travel_date || '—'}</td>
                        <td className="p-4"><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={bookingTablePage} totalPages={totalPages(filteredBookingsTable)}
                onPrev={() => setBookingTablePage(p => p - 1)} onNext={() => setBookingTablePage(p => p + 1)}
              />
            </>
          )}
        </div>

      </div>
    </div>
  );
}
