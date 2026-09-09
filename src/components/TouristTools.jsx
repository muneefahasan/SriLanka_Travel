import { useState } from 'react';
import { DollarSign, ShieldAlert, PhoneCall, ArrowRightLeft, HeartPulse, Shield, Info, Copy, Check } from 'lucide-react';

export default function TouristTools() {
  // Currency Exchange Rates (Base: LKR)
  const rates = {
    USD: 305.50,
    EUR: 330.20,
    GBP: 392.80,
    INR: 3.65,
    AUD: 202.10,
    CAD: 224.40
  };

  const [amount, setAmount] = useState(100); // Foreign amount
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [copiedNumber, setCopiedNumber] = useState(null);

  // Conversion Calculation
  const convertedLKR = (amount * rates[selectedCurrency]).toLocaleString('en-US', {
    maximumFractionDigits: 2
  });

  const handleCopy = (number) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const emergencyContacts = [
    {
      title: "Tourist Police Hotline",
      number: "1912",
      badge: "24/7 Tourist Support",
      icon: Shield,
      color: "bg-blue-600",
      desc: "Official SLTDA Tourist Police for reporting issues, scams, or seeking immediate assistance."
    },
    {
      title: "Suwa Seriya Free Ambulance",
      number: "1990",
      badge: "Medical Emergency",
      icon: HeartPulse,
      color: "bg-red-600",
      desc: "Free 24/7 government emergency medical response & ambulance service across Sri Lanka."
    },
    {
      title: "Police Emergency",
      number: "119",
      badge: "General Police",
      icon: ShieldAlert,
      color: "bg-amber-600",
      desc: "General police control room for emergency crime reports and urgent police response."
    },
    {
      title: "SLTDA Tourist Helpline",
      number: "+94 11 242 6900",
      badge: "Info & Complaints",
      icon: Info,
      color: "bg-emerald-600",
      desc: "Official Tourism Development Authority helpline for travel advisories and guide complaints."
    }
  ];

  return (
    <div className="w-full bg-slate-900 py-20 px-6 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block">
              Essential Tourist Utilities
            </span>
            <h2 className="text-4xl font-black text-white mb-3">
              Currency Converter & Emergency Helplines
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              Calculate live LKR currency conversions and access essential 24/7 tourist safety hotline numbers.
            </p>
          </div>
        </div>

        {/* Tools Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Live LKR Currency Converter */}
          <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700/60 p-8 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-500/20 p-3 rounded-2xl text-orange-400">
                <ArrowRightLeft size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">LKR Currency Converter</h3>
                <p className="text-xs text-gray-400">Live Estimated Foreign Exchange Rate</p>
              </div>
            </div>

            {/* Input Box */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Foreign Amount</label>
                <div className="flex bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden focus-within:border-orange-500">
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-transparent px-4 py-3.5 text-white font-bold text-lg focus:outline-none"
                  />
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="bg-slate-800 text-white font-bold px-4 border-l border-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>
              </div>

              {/* Conversion Result Box */}
              <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-2xl text-center">
                <span className="text-xs text-gray-400 uppercase font-semibold">Equivalent Amount in Sri Lankan Rupees</span>
                <div className="text-4xl font-black text-orange-400 mt-2 mb-1">
                  Rs. {convertedLKR} <span className="text-base font-bold text-gray-300">LKR</span>
                </div>
                <span className="text-xs text-gray-500">
                  1 {selectedCurrency} = {rates[selectedCurrency]} LKR
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-xs text-gray-400 flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-400 flex-shrink-0" />
              <span>Card payments (Visa/Mastercard) and LKR cash are accepted at major Sri Lanka tourist spots.</span>
            </div>
          </div>

          {/* Right Column: Emergency Helplines Grid */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <PhoneCall className="text-red-400" size={24} /> 24/7 Tourist Emergency Helplines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {emergencyContacts.map((contact, idx) => (
                <div key={idx} className="bg-slate-800/60 border border-slate-700/50 p-6 rounded-3xl flex flex-col justify-between hover:border-slate-600 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`${contact.color} p-2.5 rounded-xl text-white`}>
                        <contact.icon size={20} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-700">
                        {contact.badge}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-lg mb-1">{contact.title}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed mb-4">{contact.desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/40">
                    <span className="text-xl font-black text-orange-400">{contact.number}</span>
                    <button
                      onClick={() => handleCopy(contact.number)}
                      className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      {copiedNumber === contact.number ? (
                        <>
                          <Check size={14} className="text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}