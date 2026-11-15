
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  ShieldCheck,
  Calendar,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  DollarSign,
  Award,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

// This component must be wrapped by:
// <ProtectedRoute allowedRoles={['guide']} />

export default function GuideDashboard() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [guideProfile, setGuideProfile] = useState(null);
  const [guidePhotoUrl, setGuidePhotoUrl] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [updatingBookingIds, setUpdatingBookingIds] = useState([]);
  const [retryCount, setRetryCount] = useState(0);

  // Prevent duplicate booking updates.
  const updatingIdsRef = useRef(new Set());

  // Load guide profile, photo and booking requests.
  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setLoadError('');
      setGuidePhotoUrl(null);

      try {
        const {
          data: { session },
          error: sessionError
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session?.user) {
          throw new Error(
            'Your session has expired. Please log in again to access your dashboard.'
          );
        }

        const userId = session.user.id;

        // Fetch the guide's own profile.
        const profileRequest = supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        // Fetch bookings assigned to this guide only.
        const bookingsRequest = supabase
          .from('bookings')
          .select('*')
          .eq('guide_id', userId)
          .order('created_at', { ascending: false });

        const [
          { data: profile, error: profileError },
          { data: bookings, error: bookingsError }
        ] = await Promise.all([
          profileRequest,
          bookingsRequest
        ]);

        if (profileError) {
          throw new Error(
            `Could not load your guide profile: ${profileError.message}`
          );
        }

        if (bookingsError) {
          throw new Error(
            `Could not load booking requests: ${bookingsError.message}`
          );
        }

        if (!isMounted) return;

        setGuideProfile(profile);
        setInquiries(bookings || []);

        // Generate a temporary signed URL for the private guide photo.
        // Photo loading failure should not stop the dashboard.
        if (profile?.avatar_url) {
          try {
            const { data: photoData, error: photoError } =
              await supabase.storage
                .from('guide-photos')
                .createSignedUrl(profile.avatar_url, 3600);

            if (photoError) {
              console.error(
                'Guide photo loading error:',
                photoError.message
              );
            } else if (isMounted && photoData?.signedUrl) {
              setGuidePhotoUrl(photoData.signedUrl);
            }
          } catch (photoError) {
            console.error(
              'Guide photo error:',
              photoError
            );
          }
        }

      } catch (error) {
        if (!isMounted) return;

        console.error(
          'Guide dashboard loading error:',
          error
        );

        setLoadError(
          error?.message ||
          'Unable to load your dashboard. Please try again.'
        );

      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  // Handle booking acceptance and rejection.
  const handleBookingStatus = async (id, newStatus) => {
    if (!['accepted', 'declined'].includes(newStatus)) return;

    if (updatingIdsRef.current.has(id)) return;

    const booking = inquiries.find(
      item => item.id === id
    );

    if (!booking || booking.status !== 'pending') return;

    // Prevent repeated clicks immediately.
    updatingIdsRef.current.add(id);

    setUpdatingBookingIds(prev => [...prev, id]);

    // Optimistic UI update.
    setInquiries(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: newStatus }
          : item
      )
    );

    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('Please log in again.');
      }

      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('guide_id', user.id)
        .eq('status', 'pending')
        .select('id')
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error(
          'This booking was already updated or is no longer available. Please refresh your dashboard.'
        );
      }

    } catch (error) {
      console.error(
        'Booking status update error:',
        error
      );

      // Restore original status if update fails.
      setInquiries(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, status: booking.status }
            : item
        )
      );

      alert(
        `Could not ${newStatus} this booking: ${
          error?.message ||
          'An unexpected error occurred.'
        }`
      );

    } finally {
      updatingIdsRef.current.delete(id);

      setUpdatingBookingIds(prev =>
        prev.filter(itemId => itemId !== id)
      );
    }
  };

  const handleAccept = (id) => {
    handleBookingStatus(id, 'accepted');
  };

  const handleDecline = (id) => {
    handleBookingStatus(id, 'declined');
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Loading screen.
  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-ceylon-bg gap-4"
        role="status"
        aria-live="polite"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-ceylon-primary"></div>

        <p className="text-sm text-gray-600 font-medium">
          Loading your guide dashboard...
        </p>
      </div>
    );
  }

  // Error screen.
  if (loadError) {
    return (
      <div className="min-h-screen bg-ceylon-bg flex items-center justify-center px-4 py-10">
        <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200 text-center">
          <AlertCircle
            size={42}
            className="text-red-500 mx-auto mb-4"
          />

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Unable to Load Dashboard
          </h2>

          <p className="text-sm text-gray-600 mb-6 break-words">
            {loadError}
          </p>

          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center justify-center gap-2 bg-ceylon-primary hover:opacity-90 text-white font-bold px-5 py-3 rounded-xl transition-all"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const pendingCount = inquiries.filter(
    item => item.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-ceylon-bg py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10">

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-ceylon-primary text-white p-5 sm:p-8 rounded-3xl shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck size={18} />
              Official Tour Guide Portal
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black break-words">
              {guideProfile?.full_name || 'Guide'}
            </h1>

            <p className="text-gray-300 text-sm mt-1">
              Manage traveler booking requests and view your verification status.
            </p>
          </div>
        </div>

        {/* Guide Profile */}
        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-gray-200 shadow-md grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="flex items-center gap-4 min-w-0">

            {guidePhotoUrl ? (
              <img
                src={guidePhotoUrl}
                alt={`${guideProfile?.full_name || 'Guide'} profile`}
                onError={() => setGuidePhotoUrl(null)}
                className="w-16 h-16 shrink-0 rounded-full object-cover border-2 border-emerald-500"
              />
            ) : (
              <div className="w-16 h-16 shrink-0 rounded-full bg-emerald-100 text-emerald-700 font-black text-2xl flex items-center justify-center border-2 border-emerald-500">
                {(guideProfile?.full_name || 'G')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 mb-2">
                <Award size={14} />
                SLTDA Verified Guide
              </span>

              <h3 className="font-extrabold text-gray-900 text-lg break-words">
                {guideProfile?.license_number || 'License not available'}
              </h3>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600 lg:border-l lg:border-gray-100 lg:pl-6">
            <p className="flex items-start gap-2 break-words">
              <MapPin
                size={16}
                className="text-ceylon-accent shrink-0 mt-0.5"
              />
              {guideProfile?.district || 'District not available'}
            </p>

            <p className="flex items-start gap-2 break-words">
              <Phone
                size={16}
                className="text-ceylon-accent shrink-0 mt-0.5"
              />
              {guideProfile?.phone || 'Phone not available'}
            </p>
          </div>

          <div className="space-y-1 text-sm text-gray-600 lg:border-l lg:border-gray-100 lg:pl-6">
            <p className="flex items-center gap-2 font-bold text-gray-900">
              <DollarSign
                size={16}
                className="text-emerald-600 shrink-0"
              />
              Contact via requests below
            </p>
          </div>
        </div>

        {/* Booking Requests */}
        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-gray-200 shadow-md">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-ceylon-primary flex items-center gap-2">
              <Calendar className="text-ceylon-accent shrink-0" />
              Incoming Traveler Booking Requests
            </h2>

            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-2 rounded-full w-fit shrink-0">
              {pendingCount} Pending
            </span>
          </div>

          {inquiries.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-10">
              No booking requests yet.
            </p>
          ) : (
            <div className="space-y-4">
              {inquiries.map(req => (
                <div
                  key={req.id}
                  className="p-4 sm:p-6 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Traveler Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="font-extrabold text-gray-900 text-lg break-words">
                        {req.traveler_name || 'Traveler'}
                      </h3>

                      <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-full border border-blue-200 break-all">
                        {req.contact_phone || 'No contact number'}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-ceylon-primary break-words">
                      {req.destination_name || 'Destination not specified'}
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      Date:{' '}
                      <strong className="text-gray-700">
                        {req.travel_date || 'Not specified'}
                      </strong>

                      {' | '}

                      Headcount:{' '}
                      <strong className="text-gray-700">
                        {req.headcount ?? 'N/A'} Guests
                      </strong>
                    </p>
                  </div>

                  {/* Booking Status / Actions */}
                  <div className="shrink-0">
                    {req.status === 'accepted' ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-extrabold px-4 py-2.5 rounded-xl border border-emerald-300">
                        <CheckCircle size={16} />
                        Accepted
                      </span>

                    ) : req.status === 'declined' ? (
                      <span className="inline-flex items-center gap-1.5 bg-gray-200 text-gray-600 text-xs font-extrabold px-4 py-2.5 rounded-xl">
                        <XCircle size={16} />
                        Declined
                      </span>

                    ) : req.status === 'pending' ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          disabled={updatingBookingIds.includes(req.id)}
                          onClick={() => handleAccept(req.id)}
                          className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
                        >
                          <CheckCircle size={16} />
                          Accept
                        </button>

                        <button
                          type="button"
                          disabled={updatingBookingIds.includes(req.id)}
                          onClick={() => handleDecline(req.id)}
                          className="inline-flex items-center justify-center gap-1.5 bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
                        >
                          <XCircle size={16} />
                          Decline
                        </button>
                      </div>

                    ) : (
                      <span className="inline-flex items-center bg-gray-100 text-gray-600 text-xs font-bold px-4 py-2.5 rounded-xl">
                        {req.status || 'Unknown status'}
                      </span>
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
