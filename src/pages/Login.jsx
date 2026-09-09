import { useState } from 'react';
import { User, Map, ArrowRight, Lock, Mail, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [role, setRole] = useState('traveler'); // 'traveler' or 'guide'
  const [isSignUp, setIsSignUp] = useState(false); // false = Login, true = Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState(''); // New State for License
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (isSignUp) {
      // If role is guide, verify license number first!
      if (role === 'guide') {
        const { data: guideData, error: guideError } = await supabase
          .from('valid_guides')
          .select('*')
          .eq('license_number', licenseNumber)
          .single();

        if (guideError || !guideData) {
          setMessage('Invalid SLTDA Guide License Number! Only registered Sri Lankan guides can sign up.');
          setLoading(false);
          return;
        }
      }

      // Sign Up Logic in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: role, license: licenseNumber }
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
          navigate('/');
        }, 1000);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-ceylon-bg flex flex-col items-center justify-center p-6">
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-ceylon-primary mb-2">Welcome to VisitCeylon</h1>
        <p className="text-gray-600">
          {isSignUp ? 'Create your account' : 'Login to your account'} as a <span className="font-bold text-ceylon-accent uppercase">{role}</span>
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 mb-8 max-w-xs w-full">
        <button
          type="button"
          onClick={() => { setRole('traveler'); setIsSignUp(false); }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            role === 'traveler' ? 'bg-ceylon-primary text-white shadow-md' : 'text-gray-500 hover:text-ceylon-primary'
          }`}
        >
          <Map size={16} /> Traveler
        </button>
        <button
          type="button"
          onClick={() => { setRole('guide'); setIsSignUp(false); }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            role === 'guide' ? 'bg-ceylon-accent text-white shadow-md' : 'text-gray-500 hover:text-ceylon-accent'
          }`}
        >
          <User size={16} /> Guide
        </button>
      </div>

      {/* Auth Form Container */}
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
        
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
            message.includes('successful') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          
          {/* Guide License Input (Only shows during Guide Sign Up) */}
          {isSignUp && role === 'guide' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SLTDA Guide License Number</label>
              <div className="relative">
                <Award size={18} className="absolute left-3.5 top-3.5 text-orange-500" />
                <input 
                  type="text" 
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="e.g., SLTDA-G-2026-001" 
                  className="w-full bg-orange-50/50 border border-orange-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-ceylon-accent text-sm font-semibold text-orange-900"
                />
              </div>
              <p className="text-xs text-orange-600 mt-1">Required: Enter your official Sri Lanka tourism license.</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com" 
                className="w-full bg-ceylon-bg border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-ceylon-light text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-ceylon-bg border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-ceylon-light text-sm"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-ceylon-primary hover:bg-ceylon-accent text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isSignUp ? `Register as ${role}` : `Login as ${role}`)} 
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Toggle between Login and Signup */}
        <div className="mt-6 text-center text-sm text-gray-500">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-ceylon-primary font-bold hover:underline ml-1"
          >
            {isSignUp ? 'Login here' : 'Sign Up'}
          </button>
        </div>

      </div>

      <Link to="/" className="mt-8 text-ceylon-muted hover:text-ceylon-primary font-medium text-sm underline">
        Back to Home Page
      </Link>
    </div>
  );
}