
import { useState } from 'react';
import {
  User,
  Map,
  ArrowRight,
  Lock,
  Mail,
  Award,
  Phone,
  MapPin,
  Building,
  ShieldCheck,
} from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import BorderGlow from '../components/BorderGlow';

export default function Login() {
  // Admin is not available in public registration
  const [role, setRole] = useState('traveler');
  const [isSignUp, setIsSignUp] = useState(false);

  // Registration fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Colombo');
  const [address, setAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  // Guide photo upload fields
  const [photoUser, setPhotoUser] = useState(null);
  const [guidePhoto, setGuidePhoto] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  // ==========================================
  // GUIDE PHOTO UPLOAD
  // ==========================================

 
  const handleGuidePhotoUpload = async (e) => {
    e.preventDefault();

    if (!guidePhoto || !photoUser) {
      setMessage('Please select your profile photo.');
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(guidePhoto.type)) {
      setMessage('Please upload JPG, PNG or WEBP image only.');
      return;
    }

    if (guidePhoto.size > 5 * 1024 * 1024) {
      setMessage('Image size must be less than 5 MB.');
      return;
    }

    setLoading(true);
    setMessage('');

    let filePath = null;
    let uploadCompleted = false;

    try {
      // Verify the currently authenticated user.
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user || user.id !== photoUser.id) {
        throw new Error(
          'Your session is invalid. Please log in again.'
        );
      }

      const extension = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
      }[guidePhoto.type];

      // Store the photo inside the guide's own UUID folder.
      filePath = `${user.id}/profile.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from('guide-photos')
        .upload(filePath, guidePhoto, {
          upsert: true,
          contentType: guidePhoto.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      uploadCompleted = true;

      // Update only the authenticated guide's profile.
      const { data: updatedProfile, error: profileError } =
        await supabase
          .from('profiles')
          .update({
            avatar_url: filePath,
          })
          .eq('id', user.id)
          .select('id')
          .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      // Make sure the expected profile row was updated.
      if (!updatedProfile || updatedProfile.id !== user.id) {
        throw new Error(
          'Profile update could not be confirmed. Please try again.'
        );
      }

      setMessage('Profile photo uploaded successfully!');

      setGuidePhoto(null);
      setPhotoUser(null);

      // ProtectedRoute still controls dashboard access.
      navigate('/guide-dashboard');

    } catch (error) {
      // Clean up the uploaded file if profile update failed.
      if (uploadCompleted && filePath) {
        const { error: cleanupError } = await supabase.storage
          .from('guide-photos')
          .remove([filePath]);

        if (cleanupError) {
          console.error(
            'Photo cleanup error:',
            cleanupError.message
          );
        }
      }

      console.error('Guide photo upload error:', error);

      setMessage(
        error.message || 'Photo upload failed. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // LOGIN AND SIGNUP
  // ==========================================

  const handleAuth = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      // ========================================
      // SIGNUP
      // ========================================

      if (isSignUp) {
        if (password !== confirmPassword) {
          setMessage(
            'Passwords do not match! Please verify your confirm password.'
          );
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,

          options: {
            data: {
              role: role,
              full_name: fullName,
              phone: phone,
              district: district,
              address: address,
              license_number: licenseNumber,
            },
          },
        });

        if (error) {
          throw error;
        }

        if (role === 'guide') {
          setMessage(
            'Registration successful! Please verify your email and login to upload your mandatory profile photo. Your guide account will remain pending until admin approval.'
          );
        } else {
          setMessage(
            'Registration successful! Please verify your email if requested, then login.'
          );
        }

        setIsSignUp(false);
      }

      // ========================================
      // LOGIN
      // ========================================

      else {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) {
          throw error;
        }

        // Get actual role and profile photo path
        const { data: profile, error: profileError } =
          await supabase
            .from('profiles')
            .select('role, avatar_url')
            .eq('id', data.user.id)
            .single();

        if (profileError || !profile) {
          setMessage(
            'Could not load your account profile. Please contact support.'
          );
          return;
        }

        // Admin login
        if (profile.role === 'admin') {
          setMessage('Login successful! Redirecting...');

          setTimeout(() => {
            navigate('/admin');
          }, 800);
        }

        // Guide login
        else if (profile.role === 'guide') {

          // Mandatory photo check
          if (!profile.avatar_url) {
            setPhotoUser(data.user);

            setMessage(
              'Please upload your mandatory guide profile photo.'
            );

            return;
          }

          setMessage('Login successful! Redirecting...');

          setTimeout(() => {
            navigate('/guide-dashboard');
          }, 800);
        }

        // Traveler login
        else {
          setMessage('Login successful! Redirecting...');

          setTimeout(() => {
            navigate('/');
          }, 800);
        }
      }
    } catch (error) {
      setMessage(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 py-12 text-white">

      {/* PAGE HEADER */}

      <div className="text-center mb-6">
        <h1 className="text-4xl font-editorial font-extrabold text-white mb-2">
          Welcome to <span className="text-emerald-400">XplorSL</span>
        </h1>

        <p className="text-slate-400 font-medium">
          {photoUser
            ? 'Complete your guide registration'
            : isSignUp
              ? 'Create your official account'
              : 'Login to your account'
          }

          {!photoUser && (
            <>
              {' '}as a{' '}
              <span className="font-bold text-emerald-400 uppercase">
                {role}
              </span>
            </>
          )}
        </p>
      </div>

      {/* ROLE SELECTOR */}

      {!photoUser && (
        <>
          <BorderGlow
            edgeSensitivity={30}
            glowColor="16 185 129"
            backgroundColor="#090d16"
            borderRadius={20}
            glowRadius={30}
            glowIntensity={1.0}
            colors={['#10b981', '#34d399', '#059669']}
            className="mb-6 max-w-sm w-full"
          >
            <div className="flex p-1.5 rounded-2xl w-full">

              <button
                type="button"
                onClick={() => {
                  setRole('traveler');
                  setIsSignUp(false);
                  setMessage('');
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'traveler'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Map size={14} />
                Traveler
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('guide');
                  setIsSignUp(false);
                  setMessage('');
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'guide'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User size={14} />
                Tour Guide
              </button>

            </div>
          </BorderGlow>

          <p className="text-[11px] text-slate-500 -mt-4 mb-6 flex items-center gap-1">
            <ShieldCheck size={12} />
            Admin accounts are issued internally and can't be created here.
          </p>
        </>
      )}

      {/* MAIN CARD */}

      <BorderGlow
        edgeSensitivity={30}
        glowColor="16 185 129"
        backgroundColor="#0f172a"
        borderRadius={28}
        glowRadius={40}
        glowIntensity={1.0}
        colors={['#c084fc', '#f472b6', '#38bdf8']}
        className="max-w-lg w-full"
      >
        <div className="p-8 rounded-3xl w-full">

          {/* MESSAGE */}

          {message && (
            <div
              className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                message.includes('successful') ||
                message.includes('Redirecting')
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  : 'bg-red-950/80 text-red-300 border border-red-500/40'
              }`}
            >
              {message}
            </div>
          )}

          {/* ==================================
              GUIDE PHOTO UPLOAD FORM
          ================================== */}

          {photoUser && (
            <form
              onSubmit={handleGuidePhotoUpload}
              className="space-y-5"
            >

              <div className="text-center">

                <ShieldCheck
                  size={40}
                  className="mx-auto text-emerald-400 mb-3"
                />

                <h2 className="text-xl font-bold text-white">
                  Upload Your Guide Photo
                </h2>

                <p className="text-sm text-slate-400 mt-2">
                  Please upload your profile photo to complete your guide registration.
                </p>

              </div>

              <div>

                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Profile Photo (Required)
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  onChange={(e) => {
                    setGuidePhoto(
                      e.target.files?.[0] || null
                    );
                  }}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-sm"
                />

                <p className="text-xs text-slate-400 mt-2">
                  Accepted formats: JPG, PNG, WEBP.
                  Maximum size: 5 MB.
                </p>

              </div>

              {guidePhoto && (
                <p className="text-sm text-emerald-400">
                  Selected: {guidePhoto.name}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !guidePhoto}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl disabled:opacity-50"
              >
                {loading
                  ? 'Uploading Photo...'
                  : 'Upload Photo'
                }
              </button>

              <p className="text-xs text-center text-slate-400">
                Your profile will remain pending until admin approval.
              </p>

            </form>
          )}

          {/* ==================================
              NORMAL LOGIN / SIGNUP FORM
          ================================== */}

          {!photoUser && (
            <form
              onSubmit={handleAuth}
              className="space-y-4"
            >

              {/* REGISTRATION FIELDS */}

              {isSignUp && (
                <>
                  <div>

                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {role === 'guide'
                        ? 'Guide / Agency Name'
                        : 'Full Name'
                      }
                    </label>

                    <div className="relative">

                      <User
                        size={18}
                        className="absolute left-3.5 top-3 text-slate-400"
                      />

                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={
                          role === 'guide'
                            ? 'e.g., 360 Tours Lanka'
                            : 'e.g., John Smith'
                        }
                        className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />

                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <div>

                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Contact Phone
                      </label>

                      <div className="relative">

                        <Phone
                          size={16}
                          className="absolute left-3 top-3 text-slate-400"
                        />

                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0779301088"
                          className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />

                      </div>
                    </div>

                    <div>

                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        District / Region
                      </label>

                      <div className="relative">

                        <MapPin
                          size={16}
                          className="absolute left-3 top-3 text-slate-400"
                        />

                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-medium"
                        >
                                                    {[
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
                          ].map((name) => (
                            <option
                              key={name}
                              value={name}
                              className="bg-slate-900 text-white"
                            >
                              {name}
                            </option>
                          ))}
                        </select>

                      </div>
                    </div>

                  </div>

                  {/* GUIDE ONLY FIELDS */}

                  {role === 'guide' && (
                    <>

                      <div>

                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Office / Local Address
                        </label>

                        <div className="relative">

                          <Building
                            size={16}
                            className="absolute left-3 top-3 text-slate-400"
                          />

                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="367/4, Atgala, Kochchikade"
                            className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          />

                        </div>
                      </div>

                      <div>

                        <label className="block text-xs font-bold text-emerald-400 mb-1">
                          SLTDA Guide License Number
                        </label>

                        <div className="relative">

                          <Award
                            size={18}
                            className="absolute left-3.5 top-3 text-emerald-400"
                          />

                          <input
                            type="text"
                            required
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            placeholder="e.g., TA/2026/0067"
                            className="w-full bg-slate-900 border border-emerald-500/60 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-400 text-sm font-semibold"
                          />

                        </div>

                        <p className="text-[11px] text-emerald-400 mt-1">
                          Your license will be reviewed by an admin before your dashboard is activated.
                        </p>

                      </div>

                    </>
                  )}

                </>
              )}

              {/* EMAIL */}

              <div>

                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-3.5 top-3 text-slate-400"
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 text-sm"
                  />

                </div>
              </div>

              {/* PASSWORD */}

              <div>

                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-3.5 top-3 text-slate-400"
                  />

                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 text-sm"
                  />

                </div>
              </div>

              {/* CONFIRM PASSWORD */}

              {isSignUp && (
                <div>

                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Confirm Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="absolute left-3.5 top-3 text-slate-400"
                    />

                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 text-sm"
                    />

                  </div>
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50 mt-2 cursor-pointer"
              >
                {loading
                  ? 'Processing...'
                  : isSignUp
                    ? `Register as ${role}`
                    : `Login as ${role}`
                }

                <ArrowRight size={18} />
              </button>

            </form>
          )}

          {/* SIGNUP / LOGIN SWITCH */}

          {!photoUser && (
            <div className="mt-6 text-center text-sm text-slate-400">

              {isSignUp
                ? 'Already have an account?'
                : "Don't have an account?"
              }

              {' '}

              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setMessage('');
                }}
                className="text-emerald-400 font-bold hover:underline ml-1 cursor-pointer"
              >
                {isSignUp ? 'Login here' : 'Sign Up'}
              </button>

            </div>
          )}

        </div>
      </BorderGlow>

      {/* BACK TO HOME */}

      <Link
        to="/"
        className="mt-6 text-slate-400 hover:text-emerald-400 font-medium text-sm underline"
      >
        Back to Home Page
      </Link>

    </div>
  );
}
