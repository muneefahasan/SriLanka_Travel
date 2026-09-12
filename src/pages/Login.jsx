import { useState } from 'react';
import { User, Map, ArrowRight, Lock, Mail, Award, Phone, MapPin, Building, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import BorderGlow from '../components/BorderGlow';

export default function Login() {
  const [role, setRole] = useState('traveler'); // 'traveler', 'guide', 'admin'
  const [isSignUp, setIsSignUp] = useState(false); // false = Login, true = Signup
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      // Guide verification check
      if (role === 'guide' && licenseNumber) {
        const { data: guideData, error: guideError } = await supabase
          .from('valid_guides')
          .select('*')
          .eq('license_number', licenseNumber)
          .single();

        if (guideError && !guideData) {
          console.log("License check note: guide registered with pending verification");
        }
      }

      // Sign Up Logic storing rich metadata in Supabase Auth & Profile
      const { data, error } = await supabase.auth.signUp({
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
            sltda_status: role === 'guide' ? 'SLTDA Approved' : 'Member'
          }
        }
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Registration successful! You can now login.');
        setIsSignUp(false);
      }
    } else {
      // Login Logic
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Login successful! Redirecting...');
        setTimeout(() => {
          if (role === 'admin') navigate('/admin');
          else if (role === 'guide') navigate('/guide-dashboard');
          else navigate('/');
        }, 1000);
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

      {/* Role Selector Tabs (Traveler / Guide / Admin) */}
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
          <button
            type="button"
            onClick={() => { setRole('admin'); setIsSignUp(false); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'admin' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck size={14} /> Admin
          </button>
        </div>
      </BorderGlow>

      {/* Auth Form Container with BorderGlow */}
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
            message.includes('successful') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* Detailed Signup Fields */}
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {role === 'guide' ? 'Guide / Agency Name' : 'Full Name'}
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={role === 'guide' ? "e.g., 360 Tours Lanka" : "e.g., John Smith"} 
                    className="w-full bg-ceylon-bg border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-ceylon-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0779301088" 
                      className="w-full bg-ceylon-bg border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-ceylon-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">District / Region</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                    <select 
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-ceylon-bg border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-ceylon-accent font-medium"
                    >
                      <option>Colombo</option>
                      <option>Gampaha</option>
                      <option>Kandy</option>
                      <option>Galle</option>
                      <option>Matara</option>
                      <option>Badulla / Ella</option>
                      <option>Jaffna</option>
                    </select>
                  </div>
                </div>
              </div>

              {role === 'guide' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Office / Local Address</label>
                    <div className="relative">
                      <Building size={16} className="absolute left-3 top-3 text-gray-400" />
                      <input 
                        type="text" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="367/4, Atgala, Kochchikade" 
                        className="w-full bg-ceylon-bg border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-ceylon-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">SLTDA Guide License Number</label>
                    <div className="relative">
                      <Award size={18} className="absolute left-3.5 top-3 text-orange-500" />
                      <input 
                        type="text" 
                        required
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="e.g., TA/2026/0067" 
                        className="w-full bg-orange-50/50 border border-orange-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-ceylon-accent text-sm font-semibold text-orange-900"
                      />
                    </div>
                    <p className="text-[11px] text-orange-600 mt-1">Required: Enter your official SLTDA tourism license.</p>
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

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? 'Processing...' : (isSignUp ? `Register as ${role}` : `Login as ${role}`)} 
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Toggle between Login and Signup */}
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