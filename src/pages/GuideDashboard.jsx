import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ShieldCheck, Calendar, Phone, MapPin, CheckCircle, XCircle, DollarSign, Award } from 'lucide-react';

export default function GuideDashboard() {
  const [guideProfile, setGuideProfile] = useState({
    name: "Nuwan Silva (360 Tours Lanka)",
    licenseNo: "SLTDA-G-2026-001",
    status: "SLTDA Approved Verified Guide",
    district: "Colombo / Islandwide",
    phone: "+94 77 930 1088",
    ratePerDay: "$50 USD",
    languages: ["English", "German"]
  });

  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      travelerName: "Emma Watson",
      contactPhone: "+44 7700 900077",
      destination: "Sigiriya & Dambulla Day Tour",
      date: "2026-10-20",
      guests: 2,
      status: "Pending"
    },
    {
      id: 2,
      travelerName: "Markus Bauer",
      contactPhone: "+49 151 12345678",
      destination: "Kandy to Ella Scenic Train Escort",
      date: "2026-11-05",
      guests: 3,
      status: "Pending"
    }
  ]);

  const handleAccept = (id) => {
    setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: "Accepted & Confirmed" } : item));
  };

  const handleDecline = (id) => {
    setInquiries(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-ceylon-bg py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-ceylon-primary text-white p-8 rounded-3xl shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck size={18} /> Official Tour Guide Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-black">{guideProfile.name}</h1>
            <p className="text-gray-300 text-sm mt-1">Manage traveler booking requests, update rates, and view your verification status.</p>
          </div>

          <Link to="/" className="bg-ceylon-accent hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-md w-fit">
            Back to Home
          </Link>
        </div>

        {/* Guide Details Card & Badge Summary */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 font-black text-2xl flex items-center justify-center border-2 border-emerald-500">
              NS
            </div>
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 w-fit mb-1">
                <Award size={14} /> {guideProfile.status}
              </span>
              <h3 className="font-extrabold text-gray-900 text-lg">{guideProfile.licenseNo}</h3>
            </div>
          </div>

          <div className="space-y-1 text-sm text-gray-600 border-l border-gray-100 md:pl-6">
            <p className="flex items-center gap-2"><MapPin size={16} className="text-ceylon-accent" /> {guideProfile.district}</p>
            <p className="flex items-center gap-2"><Phone size={16} className="text-ceylon-accent" /> {guideProfile.phone}</p>
          </div>

          <div className="space-y-1 text-sm text-gray-600 border-l border-gray-100 md:pl-6">
            <p className="flex items-center gap-2 font-bold text-gray-900"><DollarSign size={16} className="text-emerald-600" /> Rate: {guideProfile.ratePerDay}</p>
            <p className="text-xs text-gray-500">Languages: {guideProfile.languages.join(", ")}</p>
          </div>
        </div>

        {/* Incoming Traveler Booking Requests */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-ceylon-primary flex items-center gap-2">
              <Calendar className="text-ceylon-accent" /> Incoming Traveler Booking Requests
            </h2>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
              {inquiries.filter(i => i.status === 'Pending').length} Pending
            </span>
          </div>

          <div className="space-y-4">
            {inquiries.map((req) => (
              <div key={req.id} className="p-6 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-extrabold text-gray-900 text-lg">{req.travelerName}</h3>
                    <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-1 rounded-full border border-blue-200">
                      {req.contactPhone}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-ceylon-primary">{req.destination}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Date: <strong className="text-gray-700">{req.date}</strong> | Headcount: <strong className="text-gray-700">{req.guests} Guests</strong>
                  </p>
                </div>

                <div>
                  {req.status === 'Accepted & Confirmed' ? (
                    <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-extrabold px-4 py-2.5 rounded-xl border border-emerald-300">
                      <CheckCircle size={16} /> Booking Accepted
                    </span>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleAccept(req.id)}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        <CheckCircle size={16} /> Accept Booking
                      </button>
                      <button 
                        onClick={() => handleDecline(req.id)}
                        className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        <XCircle size={16} /> Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
