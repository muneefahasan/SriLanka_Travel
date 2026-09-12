import MagicBento from './MagicBento';

export default function TouristTools() {
  const touristToolsData = [
    {
      color: '#0b1120',
      title: '💱 Currency Exchange (LKR)',
      description: 'Official exchange rate breakdown for Sri Lankan Rupee (LKR). Available at BIA Airport 24/7 & Commercial Bank counters.',
      label: 'Finance',
      chips: ['1 USD = 305 LKR', '1 EUR = 332 LKR', '1 GBP = 395 LKR', '1 INR = 3.65 LKR']
    },
    {
      color: '#0b1120',
      title: '🚨 Emergency Hotlines',
      description: 'Instant 24/7 emergency dispatch services for foreign tourists across Sri Lanka.',
      label: 'Safety',
      chips: ['Police: 1912', 'Ambulance: 1990', 'Fire: 110', 'SLTDA: +94 11 242 6800']
    },
    {
      color: '#0b1120',
      title: '📶 SIM & 4G eSIM Guide',
      description: 'Tourist SIM packs with 50GB high-speed 4G data + local calls activated instantly at BIA airport arrival hall.',
      label: 'Connectivity',
      chips: ['Dialog $12 50GB', 'Mobitel 4G eSIM', 'AirHub Instant QR']
    },
    {
      color: '#0b1120',
      title: '🙏 Cultural Temple Rules',
      description: 'Important sacred guidelines for visiting ancient temples like Kandy Tooth Temple and Sigiriya.',
      label: 'Culture',
      chips: ['Cover Shoulders & Knees', 'Remove Shoes & Hats', 'No Selfie Back to Buddha']
    },
    {
      color: '#0b1120',
      title: '⛅ Monsoon & Sea Radar',
      description: 'Seasonal climate guide for planning beach activities and high-altitude mountain treks safely.',
      label: 'Weather',
      chips: ['SW Monsoon (May-Sep)', 'NE Monsoon (Oct-Jan)', 'Sea Safety Flags']
    },
    {
      color: '#0b1120',
      title: '🚌 Transit Fare Rates',
      description: 'Official meter rates and ticket prices for Tuk-Tuks, Express Highway buses, and Scenic trains.',
      label: 'Transit',
      chips: ['Tuk-Tuk: ~100 LKR base', 'Highway Bus: ~1,000 LKR', 'Train: 600-2,500 LKR']
    }
  ];

  return (
    <div id="tourist-tools" className="w-full bg-slate-950 py-20 px-6 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header without icon */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-editorial font-extrabold text-white mb-3">
            Tourist Tools & Travel Utilities
          </h2>
          <p className="text-gray-400 text-base md:text-lg font-medium">
            Interactive travel tools, emergency hotlines, exchange rates, and cultural guidelines for Sri Lanka.
          </p>
        </div>

        {/* MagicBento Grid */}
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

      </div>
    </div>
  );
}