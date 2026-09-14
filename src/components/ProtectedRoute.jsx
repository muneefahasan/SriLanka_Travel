import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Lock, ArrowLeft } from 'lucide-react';

/**
 * Wrap any dashboard route with this. It checks the REAL role
 * stored in the `profiles` table (set server-side on signup),
 * never the role a button happened to be selected on the login page.
 *
 * Usage in App.jsx:
 *   <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
 *   <Route path="/guide-dashboard" element={<ProtectedRoute allowedRoles={['guide']}><GuideDashboard /></ProtectedRoute>} />
 *   <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['traveler']}><TravelerDashboard /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSession(session);

      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, is_verified, full_name')
          .eq('id', session.user.id)
          .single();
        if (isMounted) setProfile(profileData);
      }
      if (isMounted) setLoading(false);
    }
    load();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ceylon-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-ceylon-primary"></div>
      </div>
    );
  }

  // Not logged in at all -> send to login
  if (!session?.user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role -> block, don't redirect silently (so they understand why)
  if (!profile || !allowedRoles.includes(profile.role)) {
    return (
      <div className="min-h-screen bg-ceylon-bg py-20 px-6 flex items-center justify-center">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-2xl max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto border-2 border-red-200">
            <Lock size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Access Restricted</h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              This page is only available to {allowedRoles.join(' / ')} accounts. Your account role is
              {' '}<strong>{profile?.role || 'unknown'}</strong>.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 font-semibold"
          >
            <ArrowLeft size={14} /> Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Guide accounts specifically must also be verified by admin before using the dashboard
  if (profile.role === 'guide' && !profile.is_verified) {
    return (
      <div className="min-h-screen bg-ceylon-bg py-20 px-6 flex items-center justify-center">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-2xl max-w-md w-full text-center space-y-4">
          <h2 className="text-2xl font-black text-gray-900">Verification Pending</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your SLTDA license is under review by our admin team. You'll get access to the Guide
            Dashboard once your account is approved.
          </p>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 font-semibold">
            <ArrowLeft size={14} /> Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
