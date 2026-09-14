import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Navigation } from 'lucide-react';

const LOCATION_COORDINATES = {
  Kandy: [7.2906, 80.6337],
  Sigiriya: [7.9570, 80.7603],
  Ella: [6.8667, 81.0466],
  Galle: [6.0535, 80.2210],
  Jaffna: [9.6615, 80.0255],
  Mirissa: [5.9483, 80.4716],
  Trincomalee: [8.5874, 81.2152],
  Colombo: [6.9271, 79.8612],
  'Nuwara Eliya': [6.9497, 80.7891],
  Yala: [6.3725, 81.5185],
  Anuradhapura: [8.3114, 80.4037],
  Dambulla: [7.8742, 80.6511],
  Polonnaruwa: [7.9403, 81.0188],
  'Arugam Bay': [6.8417, 81.8358],
  Bentota: [6.4239, 80.0004],
  Hikkaduwa: [6.1394, 80.1063],
  Negombo: [7.2008, 79.8737]
};

export default function DigitalPathwaysMap({ daysPlan = [], activeDay = 1, onSelectDay }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map if not initialized yet
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [7.8731, 80.7718],
        zoom: 7.5,
        zoomControl: false,
        attributionControl: false
      });

      // Dark theme tile layer (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      // Add custom zoom controls to bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers and polyline
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
    }

    if (!daysPlan || daysPlan.length === 0) return;

    // Map locations to lat-lng coordinates
    const routeCoords = [];

    daysPlan.forEach((item) => {
      const mainCity = item.location ? item.location.split(' ')[0] : 'Kandy';
      const coords = LOCATION_COORDINATES[mainCity] || LOCATION_COORDINATES[item.location] || [7.2906, 80.6337];
      routeCoords.push({ ...item, latLng: coords });
    });

    // Draw Polyline route line
    const points = routeCoords.map((c) => c.latLng);
    if (points.length > 1) {
      polylineRef.current = L.polyline(points, {
        color: '#10b981',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);
    }

    // Create custom pin icons and add markers
    routeCoords.forEach((item) => {
      const isActive = activeDay === item.day;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="
              width: ${isActive ? '34px' : '28px'};
              height: ${isActive ? '34px' : '28px'};
              background-color: ${isActive ? '#ef4444' : '#10b981'};
              border: 3px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 0 15px ${isActive ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.7)'};
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s ease;
            ">
              <span style="color: white; font-weight: 900; font-size: 11px;">D${item.day}</span>
            </div>
            <div style="
              margin-top: 4px;
              padding: 2px 8px;
              background-color: rgba(15, 23, 42, 0.95);
              border: 1px solid ${isActive ? '#ef4444' : '#10b981'};
              border-radius: 6px;
              color: #ffffff;
              font-size: 10px;
              font-weight: 700;
              white-space: nowrap;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
            ">
              ${item.location}
            </div>
          </div>
        `,
        iconSize: [60, 60],
        iconAnchor: [30, 20]
      });

      const marker = L.marker(item.latLng, { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        if (onSelectDay) onSelectDay(item.day);
      });

      markersRef.current.push(marker);

      if (isActive) {
        map.panTo(item.latLng, { animate: true, duration: 1 });
      }
    });
  }, [daysPlan, activeDay, onSelectDay]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 200);
    }
  }, [daysPlan, activeDay]);

  return (
    <div className="relative w-full h-[450px] md:h-[520px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Header Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-2">
        <Navigation size={18} className="text-emerald-400 animate-pulse" />
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
            INTERACTIVE MAP ROUTE
          </span>
          <h4 className="text-xs font-bold text-white">Sri Lanka Route Pathways</h4>
        </div>
      </div>

      {/* Footer Info Legend */}
      <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-4 bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 text-[11px] text-gray-300">
        <span className="flex items-center gap-1.5 font-semibold">
          <span className="w-3 h-3 bg-red-500 rounded-full border border-white inline-block shadow-sm"></span> Active Stop
        </span>
        <span className="flex items-center gap-1.5 font-semibold">
          <span className="w-3 h-3 bg-emerald-500 rounded-full border border-white inline-block shadow-sm"></span> Route Stop
        </span>
      </div>
    </div>
  );
}
