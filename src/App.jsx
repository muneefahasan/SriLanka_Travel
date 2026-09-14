import { BrowserRouter, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import DestinationDetail from './pages/DestinationDetail';
import AdminDashboard from './pages/AdminDashboard';
import GuideDashboard from './pages/GuideDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AiFloatingChat from './components/AiFloatingChat';
import AnimatedRoutes from './components/PageTransition';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-ceylon-bg flex flex-col relative">

        <Navbar />

        <div className="flex-grow">
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
        </div>

        <AiFloatingChat />

        <Footer />

      </div>
    </BrowserRouter>
  );
}