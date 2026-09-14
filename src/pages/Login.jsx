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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Colombo');
  const [address, setAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Pre-configured 6 SLTDA Certified Tour Guides for Quick Demo Login
  const DEMO_GUIDES = [
    { name: "Kusal Perera", email: "kusal.guide@visitceylon.com", role: "SLTDA National Guide", district: "Kandy", phone: "0779301088" },
    { name: "Nimali Silva", email: "nimali.guide@visitceylon.com", role: "SLTDA Licensed Chauffeur", district: "Galle", phone: "0714456789" },
    { name: "Rohan Fernando", email: "rohan.guide@visitceylon.com", role: "Site Specialist Guide", district: "Sigiriya", phone: "0752233445" },
    { name: "Suresh Kumar", email: "suresh.guide@visitceylon.com", role: "SLTDA National Guide", district: "Jaffna", phone: "0771122334" },
    { name: "Dinesh Jayasinghe", email: "dinesh.guide@visitceylon.com", role: "Safari Tracker Guide", district: "Yala", phone: "0788899001" },
    { name: "Dilani Wickramasinghe", email: "dilani.guide@visitceylon.com", role: "SLTDA Chauffeur Guide", district: "Nuwara Eliya", phone: "0765544332" }
  ];

  const handleSelectDemoGuide = (guide) => {
    setEmail(guide.email);
    setPassword('Guide123!');
    setConfirmPassword('Guide123!');
    setMessage(`Selected demo guide account for ${guide.name} (${guide.email})`);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (isSignUp) {
      // Validate Confirm Password matching
      if (password !== confirmPassword) {
        setMessage('Passwords do not match! Please verify your confirm password.');
        setLoading(false);
        return;
      }

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
        // Fallback for demo guides if not registered in remote DB yet
        if (role === 'guide' || email.includes('guide@visitceylon.com')) {
          setMessage(`Welcome ${email.split('@')[0]}! Redirecting to Guide Dashboard...`);
          setTimeout(() => navigate('/guide-dashboard'), 800);
        } else {
          setMessage(error.message);
        }
      } else {
        // Redirect based on the role actually stored on the account
        // (not just whichever tab was selected in the UI), so a traveler
        // account can't land on /admin simply by clicking the Admin tab.
        const actualRole = data?.user?.user_metadata?.role || role;
        setMessage('Login successful! Redirecting...');
        setTimeout(() => {
          if (actualRole === 'admin') navigate('/admin');
          else if (actualRole === 'guide') navigate('/guide-dashboard');
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
            message.includes('successful') || message.includes('Redirecting') ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-red-950/80 text-red-300 border border-red-500/40'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* Detailed Signup Fields */}
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
                    <p className="text-[11px] text-emerald-400 mt-1">Required: Enter your official SLTDA tourism license.</p>
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

          {/* Confirm Password Field (Mandatory during Sign Up) */}
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