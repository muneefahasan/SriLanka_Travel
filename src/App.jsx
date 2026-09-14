import { BrowserRouter, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import DestinationDetail from './pages/DestinationDetail';
import AdminDashboard from './pages/AdminDashboard';
import GuideDashboard from './pages/GuideDashboard';
import AiFloatingChat from './components/AiFloatingChat';
import AnimatedRoutes from './components/PageTransition';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-ceylon-bg flex flex-col relative">
        <Navbar />

        {/* Main Content Area — route changes animate via AnimatedRoutes */}
        <div className="flex-grow">
          <AnimatedRoutes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/destination/:id" element={<DestinationDetail />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/guide-dashboard" element={<GuideDashboard />} />
          </AnimatedRoutes>
        </div>

        {/* Global Floating Bottom-Right Plan with AI Chat Agent Widget */}
        <AiFloatingChat />

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
