import { BrowserRouter, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AiFloatingChat from './components/AiFloatingChat';
import AnimatedRoutes from './components/PageTransition';

// Load pages only when the user visits their routes
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const GuideDashboard = lazy(() => import('./pages/GuideDashboard'));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div
          className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"
          role="status"
          aria-label="Loading page"
        />
        <p className="mt-3 text-sm font-medium text-slate-600">
          Loading page...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-ceylon-bg flex flex-col relative">

        <Navbar />

        <div className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <AnimatedRoutes>

              <Route path="/" element={<Home />} />

              <Route path="/login" element={<Login />} />

              <Route
                path="/destination/:id"
                element={<DestinationDetail />}
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/guide-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['guide']}>
                    <GuideDashboard />
                  </ProtectedRoute>
                }
              />

            </AnimatedRoutes>
          </Suspense>
        </div>

        <AiFloatingChat />

        <Footer />

      </div>
    </BrowserRouter>
  );
}
