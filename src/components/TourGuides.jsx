
import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  CheckCircle,
  UserCheck,
  Search,
  RefreshCw,
  AlertCircle,
  MapPin,
  Users,
  Languages
} from 'lucide-react';

import { supabase } from '../lib/supabaseClient';
import RotatingCards from './RotatingCards';
import SplitHeading from './SplitHeading';



const isValidUUID = (id) =>
  typeof id === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export default function TourGuides() {
  // Guide data
  const [guides, setGuides] = useState([]);
  const [loadingGuides, setLoadingGuides] = useState(true);
  const [guideError, setGuideError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  // Search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  // Booking modal
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Booking form
  const [travelerName, setTravelerName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [headcount, setHeadcount] = useState(1);

  // Authentication state
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(!!data?.session?.user);
    };

    checkSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsLoggedIn(!!session?.user);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch only verified guides
  useEffect(() => {
    let isMounted = true;

    const fetchGuides = async () => {
      setLoadingGuides(true);
      setGuideError('');

      try {
        const { data, error } = await supabase.rpc(
          'get_public_verified_guides_with_photos'
        );

        if (error) throw error;

        if (!isMounted) return;

        const approvedGuides = await Promise.all(
          (data || []).map(async (guide) => {
            let photoUrl = null;

            if (guide.avatar_url) {
              try {
                const {
                  data: photoData,
                  error: photoError
                } = await supabase.storage
                  .from('guide-photos')
                  .createSignedUrl(guide.avatar_url, 3600);

                if (photoError) {
                  console.error(
                    'Guide photo loading error:',
                    photoError.message
                  );
                } else {
                  photoUrl = photoData?.signedUrl || null;
                }
              } catch (photoError) {
                console.error('Guide photo error:', photoError);
              }
            }

            return {
              id: guide.id,
              name: guide.full_name || 'Licensed Guide',
              district: guide.district || 'Sri Lanka',
              license_status: 'SLTDA Verified Guide',
              license_number: guide.license_number || '',
              rating: guide.rating || null,
              rate_per_day: guide.rate_per_day ?? null,
              phone: '',
              languages: Array.isArray(guide.languages)
                ? guide.languages
                : [],
              bio:
                Array.isArray(guide.languages) &&
                guide.languages.length > 0
                  ? `Verified SLTDA guide. Languages: ${guide.languages.join(', ')}.`
                  : 'Verified SLTDA tour guide.',
              image: photoUrl || guide.image_url || null
            };
          })
        );

        // Remove duplicate guide records using their IDs.
        const uniqueGuides = Array.from(
          new Map(
            approvedGuides.map((guide) => [guide.id, guide])
          ).values()
        );

        if (!isMounted) return;

        setGuides(uniqueGuides);
      } catch (error) {
        console.error('Error loading verified guides:', error);

        if (isMounted) {
          setGuideError(
            'Unable to load verified guides. Please try again.'
          );
        }
      } finally {
        if (isMounted) {
          setLoadingGuides(false);
        }
      }
    };



    fetchGuides();

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  // Modal body scroll handling
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen]);

  // Close modal with Escape key
  useEffect(() => {
    if (!isModalOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !isSubmitting) {
        setIsModalOpen(false);
        setSelectedGuide(null);
        setSubmitted(false);
        setFormError('');
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen, isSubmitting]);
  // Unique districts
    // All 25 official districts of Sri Lanka
  const districts = [
    'Ampara',
    'Anuradhapura',
    'Badulla',
    'Batticaloa',
    'Colombo',
    'Galle',
    'Gampaha',
    'Hambantota',
    'Jaffna',
    'Kalutara',
    'Kandy',
    'Kegalle',
    'Kilinochchi',
    'Kurunegala',
    'Mannar',
    'Matale',
    'Matara',
    'Monaragala',
    'Mullaitivu',
    'Nuwara Eliya',
    'Polonnaruwa',
    'Puttalam',
    'Ratnapura',
    'Trincomalee',
    'Vavuniya',
  ];
  
  // Featured guides are independent of search and district filters.
  // The first six guides returned by the verified-guides RPC are featured.
  const featuredGuides = useMemo(
    () => guides.slice(0, 6),
    [guides]
  );

  // Search and filter all verified guides
  const filteredGuides = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return guides.filter((guide) => {
      const matchesDistrict =
        selectedDistrict === 'all' ||
        guide.district === selectedDistrict;

      const searchableText = [
        guide.name,
        guide.district,
        guide.license_number,
        guide.license_status,
        ...(guide.languages || [])
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search);

      return matchesDistrict && matchesSearch;
    });
  }, [guides, searchTerm, selectedDistrict]);

  // Close and reset booking modal
  const handleCloseBooking = () => {
    if (isSubmitting) return;

    setIsModalOpen(false);
    setSelectedGuide(null);
    setSubmitted(false);
    setFormError('');
    setTravelerName('');
    setContactPhone('');
    setTravelDate('');
    setHeadcount(1);
  };

  // Open booking modal
  const handleOpenBooking = (guide) => {
    if (!guide || !isValidUUID(guide.id)) {
      setFormError(
        'Booking is available only for registered and verified guides.'
      );
      return;
    }

    setSelectedGuide(guide);
    setSubmitted(false);
    setFormError(isLoggedIn ? '' : 'not-logged-in');

    setTravelerName('');
    setContactPhone('');
    setTravelDate('');
    setHeadcount(1);

    setIsModalOpen(true);
  };

  // Submit booking request
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setFormError('');

    if (!selectedGuide || !isValidUUID(selectedGuide.id)) {
      setFormError('Please select a valid registered guide.');
      return;
    }

    if (!travelerName.trim()) {
      setFormError('Please enter your name.');
      return;
    }

    if (!contactPhone.trim()) {
      setFormError('Please enter your contact number.');
      return;
    }

    if (!travelDate || travelDate < getTodayDate()) {
      setFormError('Please select a valid travel date.');
      return;
    }

    const guestCount = Number(headcount);

    if (
      !Number.isInteger(guestCount) ||
      guestCount < 1 ||
      guestCount > 20
    ) {
      setFormError('Number of guests must be between 1 and 20.');
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setIsLoggedIn(false);
        setFormError('not-logged-in');
        return;
      }

      // Keep the existing bookings table schema
      const newBooking = {
        traveler_id: user.id,
        guide_id: selectedGuide.id,
        traveler_name: travelerName.trim(),
        contact_phone: contactPhone.trim(),
        destination_name: `${selectedGuide.district} Tour`,
        guide_name: selectedGuide.name,
        travel_date: travelDate,
        headcount: guestCount,
        guide_type: selectedGuide.license_status,
        status: 'pending'
      };

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([newBooking]);

      if (bookingError) {
        console.error('Booking submission failed:', bookingError);

        setFormError(
          'Booking could not be submitted. Please check your details and try again.'
        );
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Unexpected booking error:', error);

      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared guide card used for every filtered result
  const renderGuideCard = (guide) => (
    <article
      key={guide.id}
      className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/20"
    >
           <div className="relative h-64 overflow-hidden bg-slate-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-24 h-24 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-4xl font-bold text-emerald-400">
            {guide.name?.charAt(0)?.toUpperCase() || 'G'}
          </span>
        </div>

        {guide.image && (
          <img
            src={guide.image}
            alt={`${guide.name} profile`}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
            className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-sm border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <CheckCircle size={13} />
          SLTDA Verified
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2">
          {guide.name}
        </h3>

        <p className="flex items-center gap-2 text-sm text-emerald-400 mb-3">
          <MapPin size={15} />
          {guide.district}
        </p>

        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          {guide.bio}
        </p>

        {guide.languages?.length > 0 && (
          <div className="flex items-start gap-2 text-xs text-slate-300 mb-5">
            <Languages size={15} className="text-emerald-400 shrink-0 mt-0.5" />

            <span>
              {guide.languages.join(', ')}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => handleOpenBooking(guide)}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <UserCheck size={17} />
          Book This Guide
        </button>
      </div>
    </article>
  );

  return (
    <section
      id="tour-guides"
      className="w-full bg-slate-950 py-20 px-4 sm:px-6 text-white border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section heading */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <SplitHeading
            as="h2"
            className="text-4xl md:text-5xl font-editorial font-extrabold text-white mb-3"
          >
            Find a Local SLTDA Tour Guide
          </SplitHeading>

          <p className="text-gray-400 text-base md:text-lg font-medium">
            Connect with verified SLTDA tour guides and chauffeurs for your island journey.
          </p>
        </div>

        {/* Loading state */}
        {loadingGuides && (
          <div
            className="flex flex-col items-center justify-center py-16 text-slate-400"
            role="status"
            aria-live="polite"
          >
            <RefreshCw
              size={32}
              className="animate-spin text-emerald-400 mb-4"
            />

            <p className="text-sm">
              Loading verified tour guides...
            </p>
          </div>
        )}

        {/* Fetch error */}
        {!loadingGuides && guideError && (
          <div className="max-w-xl mx-auto py-12 text-center">
            <AlertCircle
              size={40}
              className="text-amber-400 mx-auto mb-4"
            />

            <h3 className="text-lg font-bold text-white mb-2">
              Unable to load guides
            </h3>

            <p className="text-sm text-slate-400 mb-5">
              {guideError}
            </p>

            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl transition-colors"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* No verified guides */}
        {!loadingGuides && !guideError && guides.length === 0 && (
          <div className="py-16 text-center">
            <Users
              size={42}
              className="text-slate-500 mx-auto mb-4"
            />

            <h3 className="text-xl font-bold text-white mb-2">
              No verified guides available
            </h3>

            <p className="text-sm text-slate-400">
              Verified tour guides will appear here when they become available.
            </p>
          </div>
        )}

        {!loadingGuides && !guideError && guides.length > 0 && (
          <>
            {/* Featured 3D carousel */}
            <div className="mb-16">
              <div className="text-center mb-3">
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Featured Tour Guides
                </h3>

                <p className="text-sm text-slate-400 mt-2">
                  Explore a selection of verified local guides.
                </p>
              </div>

              <RotatingCards
                guides={featuredGuides}
                radius={320}
                cardWidth={300}
                cardHeight={420}
                onBookGuide={handleOpenBooking}
              />
            </div>

            {/* All guides heading */}
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Explore All Verified Guides
              </h3>

              <p className="text-sm text-slate-400 mt-2">
                Search and find a guide based on your preferred district or language.
              </p>
            </div>

            {/* Search and district filter */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search guide, district or language..."
                    aria-label="Search tour guides"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <select
                    value={selectedDistrict}
                    onChange={(event) => setSelectedDistrict(event.target.value)}
                    aria-label="Filter guides by district"
                    className="w-full appearance-none bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">All districts</option>

                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs text-slate-400">
                <span>
                  {filteredGuides.length} of {guides.length} verified guides found
                </span>

                {(searchTerm || selectedDistrict !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedDistrict('all');
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* All matching guide cards */}
            {filteredGuides.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuides.map(renderGuideCard)}
              </div>
            ) : (
              <div className="py-16 text-center">
                <Search
                  size={40}
                  className="text-slate-500 mx-auto mb-4"
                />

                <h3 className="text-lg font-bold text-white mb-2">
                  No matching guides found
                </h3>

                <p className="text-sm text-slate-400 mb-5">
                  Try another name, language or district.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDistrict('all');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}

        {/* Booking modal */}
        {isModalOpen &&
          selectedGuide &&
          createPortal(
            <div
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  handleCloseBooking();
                }
              }}
              className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="guide-booking-title"
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative text-white max-h-[85vh] overflow-y-auto custom-scrollbar my-auto"
              >

                {/* Close button */}
                <button
                  type="button"
                  onClick={handleCloseBooking}
                  disabled={isSubmitting}
                  aria-label="Close booking form"
                  className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-950 p-2 rounded-full border border-slate-800 transition-all cursor-pointer z-10 disabled:opacity-50"
                >
                  <X size={20} />
                </button>

                {/* Booking success */}
                {submitted ? (
                  <div className="py-10 text-center space-y-4">
                    <CheckCircle
                      size={52}
                      className="text-emerald-400 mx-auto"
                    />

                    <h3
                      id="guide-booking-title"
                      className="text-2xl font-bold text-white"
                    >
                      Booking Inquiry Sent!
                    </h3>

                    <p className="text-slate-300 text-sm">
                      Your booking request has been saved successfully.
                      {' '}{selectedGuide.name} will review your request.
                    </p>

                    <button
                      type="button"
                      onClick={handleCloseBooking}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Selected guide */}
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-800 pr-8">
                      <div className="relative w-16 h-16 shrink-0 rounded-full bg-emerald-500/10 flex items-center justify-center overflow-hidden">
                        <span className="text-xl font-bold text-emerald-400">
                          {selectedGuide.name?.charAt(0)?.toUpperCase() || 'G'}
                        </span>

                        {selectedGuide.image && (
                          <img
                            src={selectedGuide.image}
                            alt={`${selectedGuide.name} profile`}
                            onError={(event) => {
                              event.currentTarget.style.display = 'none';
                            }}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div>
                        <h3
                          id="guide-booking-title"
                          className="text-xl font-bold text-white"
                        >
                          {selectedGuide.name}
                        </h3>

                        <p className="text-xs text-emerald-400 font-bold">
                          {selectedGuide.district}
                        </p>
                      </div>
                    </div>

                    {/* Login required */}
                    {formError === 'not-logged-in' ? (
                      <div className="py-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
                          <UserCheck
                            size={32}
                            className="text-amber-400"
                          />
                        </div>

                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">
                            Login Required
                          </h4>

                          <p className="text-sm text-slate-400">
                            You need to be logged in to book a tour guide.
                          </p>
                        </div>

                        <a
                          href="/login"
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
                        >
                          <UserCheck size={16} />
                          Login / Sign Up
                        </a>
                      </div>
                    ) : (
                      <>

                        {/* Traveler name */}
                        <div>
                          <label
                            htmlFor="traveler-name"
                            className="block text-xs font-bold text-slate-300 mb-1"
                          >
                            Your Name
                          </label>

                          <input
                            id="traveler-name"
                            type="text"
                            required
                            maxLength={100}
                            value={travelerName}
                            onChange={(event) => setTravelerName(event.target.value)}
                            placeholder="Enter your name"
                            autoComplete="name"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        {/* Contact number */}
                        <div>
                          <label
                            htmlFor="contact-phone"
                            className="block text-xs font-bold text-slate-300 mb-1"
                          >
                            Contact Phone / WhatsApp
                          </label>

                          <input
                            id="contact-phone"
                            type="tel"
                            required
                            maxLength={20}
                            value={contactPhone}
                            onChange={(event) => setContactPhone(event.target.value)}
                            placeholder="+94 77 123 4567"
                            autoComplete="tel"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        {/* Date and guest count */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                          <div>
                            <label
                              htmlFor="travel-date"
                              className="block text-xs font-bold text-slate-300 mb-1"
                            >
                              Travel Date
                            </label>

                            <input
                              id="travel-date"
                              type="date"
                              required
                              min={getTodayDate()}
                              value={travelDate}
                              onChange={(event) => setTravelDate(event.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="headcount"
                              className="block text-xs font-bold text-slate-300 mb-1"
                            >
                              Number of Guests
                            </label>

                            <input
                              id="headcount"
                              type="number"
                              min="1"
                              max="20"
                              step="1"
                              required
                              value={headcount}
                              onChange={(event) => {
                                setHeadcount(
                                  event.target.value === ''
                                    ? ''
                                    : Number(event.target.value)
                                );
                              }}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                        </div>

                        {/* Form error */}
                        {formError && formError !== 'not-logged-in' && (
                          <p
                            role="alert"
                            className="text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-xl p-3"
                          >
                            {formError}
                          </p>
                        )}

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                        >
                          <UserCheck size={18} />

                          {isSubmitting
                            ? 'Submitting...'
                            : 'Confirm Guide Booking Request'}
                        </button>

                      </>
                    )}

                  </form>
                )}

              </div>
            </div>,
            document.body
          )}

      </div>
    </section>
  );
}




