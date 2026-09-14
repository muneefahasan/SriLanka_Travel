import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Copy, Phone, DollarSign, Wifi, ShieldAlert, Sun, Bus, Sparkles, CheckCircle2 } from 'lucide-react';
import MagicBento from './MagicBento';
import SplitHeading from './SplitHeading';

export default function TouristTools() {
  const [activeModal, setActiveModal] = useState(null); // null | 'currency' | 'emergency' | 'sim' | 'temple' | 'weather' | 'transit'
  const [copiedText, setCopiedText] = useState('');

  // Lock body scrolling when any tool modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModal]);

  // Currency Converter State
  const [currencyAmount, setCurrencyAmount] = useState(100);
  const [currencyType, setCurrencyType] = useState('USD');
  const rates = { USD: 305, EUR: 332, GBP: 395, AUD: 202, INR: 3.65 };

  // Transit Estimator State
  const [transitKm, setTransitKm] = useState(10);
  const [transitMode, setTransitMode] = useState('tuktuk'); // tuktuk | bus | train

  // Temple Checklist State
  const [templeChecklist, setTempleChecklist] = useState({
    shoulders: true,
    knees: true,
    footwear: true,
    buddhaBack: true
  });

  // Weather Region State
  const [weatherSeason, setWeatherSeason] = useState('sw'); // sw | ne

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2500);
  };

  const handleCardClick = (card, index) => {
    const modalKeys = ['currency', 'emergency', 'sim', 'temple', 'weather', 'transit'];
    setActiveModal(modalKeys[index] || 'currency');
  };

  const touristToolsData = [
    {
      color: '#0b1120',
      title: '💱 Currency Exchange (LKR)',
      description: 'Official exchange rate breakdown & live LKR converter calculator for foreign tourists.',
      label: 'Finance',
      chips: ['1 USD = 305 LKR', '1 EUR = 332 LKR', '1 GBP = 395 LKR', '1 INR = 3.65 LKR'],
      onCardClick: handleCardClick
    },
    {
      color: '#0b1120',
      title: '🚨 Emergency Hotlines',
      description: 'Instant 24/7 emergency dispatch & 1-click call/copy hotlines for foreign tourists.',
      label: 'Safety',
      chips: ['Police: 1912', 'Ambulance: 1990', 'Fire: 110', 'SLTDA: +94 11 242 6800'],
      onCardClick: handleCardClick
    },
    {
      color: '#0b1120',
      title: '📶 SIM & 4G eSIM Guide',
      description: 'Interactive tourist SIM package comparison with instant airport activation guide.',
      label: 'Connectivity',
      chips: ['Dialog $12 50GB', 'Mobitel 4G eSIM', 'AirHub Instant QR'],
      onCardClick: handleCardClick
    },
    {
      color: '#0b1120',
      title: '🙏 Cultural Temple Rules',
      description: 'Interactive temple dress code & sacred etiquette checklist for ancient landmarks.',
      label: 'Culture',
      chips: ['Cover Shoulders & Knees', 'Remove Shoes & Hats', 'No Selfie Back to Buddha'],
      onCardClick: handleCardClick
    },
    {
      color: '#0b1120',
      title: '⛅ Monsoon & Sea Radar',
      description: 'Interactive seasonal weather radar showing safe beach zones vs high wave regions.',
      label: 'Weather',
      chips: ['SW Monsoon (May-Sep)', 'NE Monsoon (Oct-Jan)', 'Sea Safety Flags'],
      onCardClick: handleCardClick
    },
    {
      color: '#0b1120',
      title: '🚌 Transit Fare Rates',
      description: 'Interactive route fare estimator for Tuk-Tuks, Express Buses, and Scenic Trains.',
      label: 'Transit',
      chips: ['Tuk-Tuk: ~100 LKR base', 'Highway Bus: ~1,000 LKR', 'Train: 600-2,500 LKR'],
      onCardClick: handleCardClick
    }
  ];

  return (
    <div id="tourist-tools" className="w-full bg-slate-950 py-20 px-6 text-white border-t border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <SplitHeading as="h2" className="text-4xl md:text-5xl font-editorial font-extrabold text-white mb-3">
            Tourist Tools & Travel Utilities
          </SplitHeading>
          <p className="text-gray-400 text-base md:text-lg font-medium">
            Interactive travel tools, emergency hotlines, live exchange rate calculator, and temple etiquette guides.
          </p>
        </div>

        {/* MagicBento Grid with Hover Zoom & Click Handlers */}
        <MagicBento 
          cards={touristToolsData}
          textAutoHide={false}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={350}
          particleCount={14}
          glowColor="16, 185, 129"
        />

        {/* Toast Notification */}
        {copiedText && (
          <div className="fixed bottom-8 right-8 z-50 bg-emerald-600 text-white font-extrabold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm border border-emerald-400 animate-bounce">
            <CheckCircle2 size={18} /> Copied {copiedText} to clipboard!
          </div>
        )}

        {/* INTERACTIVE TOOL MODAL DIALOGS (Portal to document.body) */}
        {activeModal && createPortal(
          <div 
            onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}
            className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl relative text-white max-h-[85vh] overflow-y-auto custom-scrollbar my-auto">
              
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-950 p-2 rounded-full border border-slate-800 transition-all cursor-pointer z-10"
              >
                <X size={20} />
              </button>

              {/* 1. CURRENCY EXCHANGE CALCULATOR TOOL */}
              {activeModal === 'currency' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                      <DollarSign size={22} />
                    </div>
                    <div>
                      <h3 className="text-xl font-editorial font-extrabold text-white">Live LKR Currency Calculator</h3>
                      <p className="text-xs text-emerald-400 font-bold">Official Bank & BIA Airport Counter Exchange Rates</p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Enter Foreign Amount</label>
                      <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5">
                        <input
                          type="number"
                          min="1"
                          value={currencyAmount}
                          onChange={(e) => setCurrencyAmount(Number(e.target.value) || 0)}
                          className="w-full bg-transparent text-white font-extrabold text-xl focus:outline-none"
                        />
                        <select
                          value={currencyType}
                          onChange={(e) => setCurrencyType(e.target.value)}
                          className="bg-slate-800 text-emerald-400 font-extrabold text-sm px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="AUD">AUD ($)</option>
                          <option value="INR">INR (₹)</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-xl text-center space-y-1">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Equivalent Sri Lankan Rupee</span>
                      <div className="text-3xl font-editorial font-extrabold text-white">
                        {(currencyAmount * (rates[currencyType] || 305)).toLocaleString()} <span className="text-emerald-400 text-lg">LKR</span>
                      </div>
                      <p className="text-[11px] text-slate-400">1 {currencyType} = {rates[currencyType]} LKR</p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p>💡 <strong>Pro Tip:</strong> Currency exchange counters are open 24/7 at Bandaranaike International Airport (BIA) arrival hall.</p>
                  </div>
                </div>
              )}

              {/* 2. EMERGENCY HOTLINES TOOL */}
              {activeModal === 'emergency' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold">
                      <ShieldAlert size={22} />
                    </div>
                    <div>
                      <h3 className="text-xl font-editorial font-extrabold text-white">24/7 Tourist Emergency Hotlines</h3>
                      <p className="text-xs text-red-400 font-bold">Toll-Free & Direct Tourist Dispatch Lines</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: 'Tourist Police Helpline', num: '1912', desc: 'Direct assistance for foreign travelers' },
                      { name: 'Suwa Seriya Ambulance', num: '1990', desc: 'Free emergency medical service islandwide' },
                      { name: 'Fire & Rescue Service', num: '110', desc: 'Metropolitan fire rescue dispatch' },
                      { name: 'Sri Lanka Tourism Development', num: '+94 11 242 6800', desc: 'Official SLTDA tourist info desk' }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-extrabold text-white">{item.name}</h4>
                          <span className="text-lg font-editorial font-extrabold text-emerald-400">{item.num}</span>
                          <p className="text-[11px] text-slate-400">{item.desc}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(item.num, item.name)}
                            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer"
                            title="Copy number"
                          >
                            <Copy size={16} />
                          </button>
                          <a
                            href={`tel:${item.num.replace(/\s+/g, '')}`}
                            className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center"
                            title="Call Now"
                          >
                            <Phone size={16} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. SIM & eSIM GUIDE TOOL */}
              {activeModal === 'sim' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                      <Wifi size={22} />
                    </div>
                    <div>
                      <h3 className="text-xl font-editorial font-extrabold text-white">Tourist SIM & 4G/5G eSIM Guide</h3>
                      <p className="text-xs text-emerald-400 font-bold">BIA Airport Arrival Counter Instant Setup</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { provider: 'Dialog Tourist Plan', price: '$12 USD', data: '50GB High Speed Data', calls: '100 Mins Local + $5 Int\'l Calls', type: 'Physical SIM / eSIM' },
                      { provider: 'Mobitel Freedom Pass', price: '$20 USD', data: '100GB Ultra 4G/5G Data', calls: 'Unlimited Local Calls', type: 'Instant eSIM' },
                      { provider: 'AirHub Regional QR', price: '$15 USD', data: '30GB Global Roaming Data', calls: 'Data Only eSIM', type: 'Digital QR Code' }
                    ].map((pack, i) => (
                      <div key={i} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-extrabold text-white">{pack.provider}</h4>
                          <span className="bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full">{pack.price}</span>
                        </div>
                        <p className="text-xs font-bold text-emerald-400">⚡ {pack.data}</p>
                        <p className="text-[11px] text-slate-300">📞 {pack.calls}</p>
                        <span className="inline-block text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">{pack.type}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
                    📌 <strong>Activation Requirements:</strong> Passport copy required at BIA airport counter. Activation takes under 3 minutes.
                  </div>
                </div>
              )}

              {/* 4. TEMPLE RULES CHECKLIST TOOL */}
              {activeModal === 'temple' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <h3 className="text-xl font-editorial font-extrabold text-white">Temple Cultural Etiquette Checklist</h3>
                      <p className="text-xs text-amber-400 font-bold">Check off items before visiting Kandy & Sigiriya</p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    {[
                      { key: 'shoulders', label: 'Cover Shoulders (No Sleeveless Tops)' },
                      { key: 'knees', label: 'Cover Knees (Long Sarong, Pants or Skirt)' },
                      { key: 'footwear', label: 'Remove Shoes & Hats Before Entering Shrine' },
                      { key: 'buddhaBack', label: 'Never Turn Your Back Directly to Buddha Statues for Photos' }
                    ].map((rule) => (
                      <label key={rule.key} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-emerald-500 transition-all">
                        <input
                          type="checkbox"
                          checked={templeChecklist[rule.key]}
                          onChange={(e) => setTempleChecklist(prev => ({ ...prev, [rule.key]: e.target.checked }))}
                          className="w-5 h-5 accent-emerald-500 cursor-pointer"
                        />
                        <span className={`text-xs font-bold ${templeChecklist[rule.key] ? 'text-emerald-300 line-through' : 'text-slate-200'}`}>
                          {rule.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-xl text-center">
                    <span className="text-xs font-extrabold text-emerald-400">
                      {Object.values(templeChecklist).filter(Boolean).length === 4
                        ? '✅ Perfect! You are 100% ready for sacred temple entry.'
                        : `⚠️ ${4 - Object.values(templeChecklist).filter(Boolean).length} items pending for temple readiness.`}
                    </span>
                  </div>
                </div>
              )}

              {/* 5. MONSOON & WEATHER RADAR TOOL */}
              {activeModal === 'weather' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                      <Sun size={22} />
                    </div>
                    <div>
                      <h3 className="text-xl font-editorial font-extrabold text-white">Monsoon & Sea Safety Radar</h3>
                      <p className="text-xs text-blue-400 font-bold">Seasonal Beach & High-Altitude Trek Planner</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                    <button
                      onClick={() => setWeatherSeason('sw')}
                      className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        weatherSeason === 'sw' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      South-West Monsoon (May-Sep)
                    </button>
                    <button
                      onClick={() => setWeatherSeason('ne')}
                      className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        weatherSeason === 'ne' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      North-East Monsoon (Oct-Jan)
                    </button>
                  </div>

                  {weatherSeason === 'sw' ? (
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <h4 className="text-sm font-extrabold text-emerald-400">☀️ Best Sunny Coast: East & North</h4>
                      <p className="text-xs text-slate-300">Trincomalee, Arugam Bay, Pasikudah have calm turquoise waters and sunny weather.</p>
                      <h4 className="text-sm font-extrabold text-amber-400">🌧️ Rough Sea Alert: South & West</h4>
                      <p className="text-xs text-slate-400">Galle, Bentota, Hikkaduwa have higher ocean waves and rainfall.</p>
                    </div>
                  ) : (
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <h4 className="text-sm font-extrabold text-emerald-400">☀️ Best Sunny Coast: South & West</h4>
                      <p className="text-xs text-slate-300">Galle, Mirissa, Unawatuna, Bentota have golden calm seas and clear blue skies.</p>
                      <h4 className="text-sm font-extrabold text-amber-400">🌧️ Rough Sea Alert: East & Central Hills</h4>
                      <p className="text-xs text-slate-400">Trincomalee and Knuckles mountain range experience monsoonal rain showers.</p>
                    </div>
                  )}
                </div>
              )}

              {/* 6. TRANSIT FARE ESTIMATOR TOOL */}
              {activeModal === 'transit' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                      <Bus size={22} />
                    </div>
                    <div>
                      <h3 className="text-xl font-editorial font-extrabold text-white">Transit Fare Rate Estimator</h3>
                      <p className="text-xs text-emerald-400 font-bold">Metered Tuk-Tuks, Highway Express Buses & Trains</p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Select Transit Mode</label>
                      <select
                        value={transitMode}
                        onChange={(e) => setTransitMode(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white font-extrabold text-sm px-4 py-2.5 rounded-xl focus:outline-none cursor-pointer"
                      >
                        <option value="tuktuk">🛺 Metered Tuk-Tuk (Base 100 LKR + 90 LKR/km)</option>
                        <option value="bus">🚌 AC Highway Express Bus (~15 LKR/km)</option>
                        <option value="train">🚆 Scenic Train 2nd Class (~10 LKR/km)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Travel Distance (Kilometers)</label>
                      <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2">
                        <input
                          type="number"
                          min="1"
                          max="500"
                          value={transitKm}
                          onChange={(e) => setTransitKm(Number(e.target.value) || 0)}
                          className="w-full bg-transparent text-white font-extrabold text-lg focus:outline-none"
                        />
                        <span className="text-xs font-bold text-emerald-400">KM</span>
                      </div>
                    </div>

                    <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-xl text-center space-y-1">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Estimated Ticket / Ride Fare</span>
                      <div className="text-3xl font-editorial font-extrabold text-white">
                        {(() => {
                          let fare = 0;
                          if (transitMode === 'tuktuk') fare = 100 + (transitKm * 90);
                          if (transitMode === 'bus') fare = Math.max(200, transitKm * 15);
                          if (transitMode === 'train') fare = Math.max(150, transitKm * 10);
                          return fare.toLocaleString();
                        })()} <span className="text-emerald-400 text-lg">LKR</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        (~{(() => {
                          let fare = 0;
                          if (transitMode === 'tuktuk') fare = 100 + (transitKm * 90);
                          if (transitMode === 'bus') fare = Math.max(200, transitKm * 15);
                          if (transitMode === 'train') fare = Math.max(150, transitKm * 10);
                          return (fare / 305).toFixed(2);
                        })()} USD)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all cursor-pointer mt-4"
              >
                Close Tool Window
              </button>

            </div>
          </div>,
          document.body
        )}

      </div>
    </div>
  );
}