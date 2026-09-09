import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import DestinationDetail from './pages/DestinationDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-ceylon-bg flex flex-col">
        <Navbar />
        
        {/* Main Content Area */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/destination/:id" element={<DestinationDetail />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;