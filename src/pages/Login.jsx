import { useState } from 'react';
import { User, Map, ArrowRight, Lock, Mail, Award, Phone, MapPin, Building, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import BorderGlow from '../components/BorderGlow';

export default function Login() {
  // NOTE: Admin removed from public signup/login tabs on purpose.
  // Admin accounts must be created directly in Supabase (or a separate
  // internal-only process) — never through a public form. See fix notes.
  const [role, setRole] = useState('traveler'); // 'traveler' or 'guide' only
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Colombo');
  const [address, setAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (isSignUp) {
      if (password !== confirmPassword) {
        setMessage('Passwords do not match! Please verify your confirm password.');
        setLoading(false);
        return;
      }

      // Signup only sends role/profile info as metadata. The actual `profiles`
      // row (with the REAL, trusted role) is created server-side by a DB
      // trigger — see supabase_schema_fixes.sql. Even if someone tampers
      // with this request, they cannot grant themselves guide/admin access;
      // guides always start unverified until an admin approves them.
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role, // trigger ignores anything except 'guide' -> forces 'traveler' otherwise
            full_name: fullName,
            phone: phone,
            district: district,
            address: address,
            license_number: licenseNumber,
          }
        }
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          role === 'guide'
            ? 'Registration successful! Your SLTDA license is now pending admin verification — you will get dashboard access once approved.'
            : 'Registration successful! You can now login.'
        );
        setIsSignUp(false);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        // No bypass here — a failed login is a failed login, for every role.
        setMessage(error.message);
      } else {
        // Look up the REAL role from the profiles table (set by the DB
        // trigger on signup), never trust the tab the user clicked.
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile) {
          setMessage('Could not load your account profile. Please contact support.');
          setLoading(false);
          return;
        }

        setMessage('Login successful! Redirecting...');
        setTimeout(() => {
          if (profile.role === 'admin') navigate('/admin');
          else if (profile.role === 'guide') navigate('/guide-dashboard');
          else navigate('/');
        }, 800);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 py-12 text-white">

      <div className="text-center mb-6">
        <h1 className="text-4xl font-editorial font-extrabold text-white mb-2">Welcome to VisitCeylon</h1>
        <p className="text-slate-400 font-medium">
          {isSignUp ? 'Create your official account' : 'Login to your account'} as a <span className="font-bold text-emerald-400 uppercase">{role}</span>
        </p>
      </div>

      {/* Role Selector Tabs — Traveler / Guide ONLY. Admin is not a public signup option. */}
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
            onClick={() => { setRole('traveler'); setIsSignUp(false); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'traveler' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map size={14} /> Traveler
          </button>
          <button
            type="button"
            onClick={() => { setRole('guide'); setIsSignUp(false); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'guide' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User size={14} /> Tour Guide
          </button>
        </div>
      </BorderGlow>
      <p className="text-[11px] text-slate-500 -mt-4 mb-6 flex items-center gap-1">
        <ShieldCheck size={12} /> Admin accounts are issued internally and can't be created here.
      </p>

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

        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
            message.includes('successful') || message.includes('Redirecting') ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-red-950/80 text-red-300 border border-red-500/40'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">

          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {role === 'guide' ? 'Guide / Agency Name' : 'Full Name'}
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={role === 'guide' ? "e.g., 360 Tours Lanka" : "e.g., John Smith"}
                    className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
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
                  <label className="block text-xs font-bold text-slate-300 mb-1">District / Region</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 font-medium"
                    >
                      <option className="bg-slate-900 text-white">Colombo</option>
                      <option className="bg-slate-900 text-white">Gampaha</option>
                      <option className="bg-slate-900 text-white">Kandy</option>
                      <option className="bg-slate-900 text-white">Galle</option>
                      <option className="bg-slate-900 text-white">Matara</option>
                      <option className="bg-slate-900 text-white">Badulla / Ella</option>
                      <option className="bg-slate-900 text-white">Jaffna</option>
                    </select>
                  </div>
                </div>
              </div>

              {role === 'guide' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Office / Local Address</label>
                    <div className="relative">
                      <Building size={16} className="absolute left-3 top-3 text-slate-400" />
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
                    <label className="block text-xs font-bold text-emerald-400 mb-1">SLTDA Guide License Number</label>
                    <div className="relative">
                      <Award size={18} className="absolute left-3.5 top-3 text-emerald-400" />
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

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-3 text-slate-400" />
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

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-3 text-slate-400" />
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? 'Processing...' : (isSignUp ? `Register as ${role}` : `Login as ${role}`)}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-emerald-400 font-bold hover:underline ml-1 cursor-pointer"
          >
            {isSignUp ? 'Login here' : 'Sign Up'}
          </button>
        </div>

        </div>
      </BorderGlow>

      <Link to="/" className="mt-6 text-slate-400 hover:text-emerald-400 font-medium text-sm underline">
        Back to Home Page
      </Link>
    </div>
  );
}
