import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowRight, MapPin, Search, Filter } from 'lucide-react';

export default function Destinations() {
  // 30 Iconic Sri Lankan Destinations with Unique High-Definition Images
  const allDestinationsList = [
    { 
  id: 1, 
  name: "Sigiriya", 
  category: "Heritage", 
  image_url: "/destinations/sigiriya.png", 
  description: "Ancient rock fortress famous for its history, paintings, and beautiful gardens." 
},

    { id: 2, name: "Ella", category: "Mountain & Hill Country", image_url: "/destinations/ella.jpg", description: "Scenic hill town surrounded by mountains, tea plantations, and waterfalls." },
    { id: 3, name: "Kandy", category: "Cultural & Heritage", image_url: "/destinations/kandy.jpg", description: "Cultural city famous for the Temple of the Sacred Tooth Relic." },
    { id: 4, name: "Galle Fort", category: "Heritage & Beach", image_url: "/destinations/gallefort.jpg", description: "Historic colonial fort with old buildings, streets, shops, and ocean views." },
    { id: 5, name: "Nuwara Eliya", category: "Mountain & Hill Country", image_url: "/destinations/NuweraEliya.jpg", description: "Cool hill-country town famous for tea estates and beautiful landscapes." },
    { id: 6, name: "Yala National Park", category: "Nature & Wildlife", image_url: "/destinations/yala.jpg", description: "Popular wildlife park known for elephants, leopards, and many bird species." },
    { id: 7, name: "Mirissa", category: "Beach & Coastal", image_url: "/destinations/mirissa.jpg", description: "Beautiful beach destination famous for sunsets and whale-watching." },
    { id: 8, name: "Dambulla Cave Temple", category: "Cultural & Heritage", image_url: "/destinations/dambulla_cave_temple.jpg", description: "Ancient Buddhist temple complex featuring statues and colorful cave paintings." },
    { id: 9, name: "Anuradhapura", category: "Cultural & Heritage", image_url: "/destinations/anurathapura.jpg", description: "Ancient city famous for historic Buddhist stupas, temples, and ruins." },
    { id: 10, name: "Polonnaruwa", category: "Cultural & Heritage", image_url: "/destinations/polannaruva.jpg", description: "Historic royal city with ancient temples, statues, and archaeological ruins." },
    { id: 11, name: "Arugam Bay", category: "Beach & Coastal", image_url: "/destinations/Arugambay.jpg", description: "World-famous surfing destination with beautiful beaches and a relaxed atmosphere." },
    { id: 12, name: "Hikkaduwa", category: "Beach & Coastal", image_url: "/destinations/Hikkaduwa.jpg", description: "Coastal town popular for beaches, snorkeling, coral reefs, and marine life." },
    { id: 13, name: "Trincomalee", category: "Beach & Coastal", image_url: "/destinations/trinco.jpg", description: "Coastal city known for beautiful beaches, clear waters, and historic temples." },
    { id: 14, name: "Jaffna", category: "Cultural & Heritage", image_url: "/destinations/jaffna.jpg", description: "Northern city rich in Tamil culture, history, temples, and traditional cuisine." },
    { id: 15, name: "Adam's Peak", category: "Mountain & Adventure", image_url: "/destinations/AdamsPeek.jpg", description: "Sacred mountain famous for pilgrimage, hiking, and spectacular sunrise views." },
    { id: 16, name: "Bentota", category: "Beach & Coastal", image_url: "/destinations/bentota.jpg", description: "Popular beach destination offering water sports, riverside scenery, and resorts." },
    { id: 17, name: "Negombo", category: "Beach & Coastal", image_url: "/destinations/negobo.jpg", description: "Coastal city known for its beach, fishing industry, seafood, and canals." },
    { id: 18, name: "Horton Plains", category: "Nature & Adventure", image_url: "/destinations/hortoinplaints.jpg", description: "Scenic national park famous for hiking, grasslands, forests, and World's End." },
    { id: 19, name: "Udawalawe National Park", category: "Nature & Wildlife", image: "/destinations/udawalawe.jpg", description: "Wildlife destination particularly famous for its large elephant population." },
    { id: 20, name: "Pinnawala Elephant Orphanage", category: "Nature & Wildlife", image: "/destinations/pinnawala.jpg", description: "Popular attraction where visitors can observe elephants and their daily activities." },
    { id: 21, name: "Unawatuna", category: "Beach & Coastal", image: "/destinations/unawatuna.jpg", description: "Beautiful beach destination known for swimming, snorkeling, and coral reefs." },
    { id: 22, name: "Kithulgala", category: "Adventure", image: "/destinations/kithulgala.jpg", description: "Adventure destination famous for white-water rafting, forests, and outdoor activities." },
    { id: 23, name: "Knuckles Mountain Range", category: "Mountain & Nature", image: "/destinations/Knuckles Mountain Range.jpg", description: "Mountain region known for hiking trails, forests, waterfalls, and stunning scenery." },
    { id: 24, name: "Kalpitiya", category: "Beach & Coastal", image: "/destinations/Kalpitiya.jpg", description: "Coastal destination popular for beaches, dolphin watching, and water sports." },
    { id: 25, name: "Pasikuda", category: "Beach & Coastal", image: "/destinations/Pasikuda.jpg", description: "Famous for its calm, shallow, turquoise-colored waters and beautiful beach." },
    { id: 26, name: "Ravana Falls", category: "Mountain & Nature", image: "/destinations/Ravana Falls.jpg", description: "Spectacular waterfall near Ella surrounded by scenic mountain landscapes." },
    { id: 27, name: "Nallur Kandaswamy Kovil", category: "Cultural & Heritage", image: "/destinations/Nallur Kandaswamy Kovil.jpg", description: "Famous Hindu temple in Jaffna with beautiful architecture and cultural importance." },
    { id: 28, name: "Dutch Hospital Colombo", category: "Heritage & City", image: "/destinations/DutchHospital.jpg", description: "Historic colonial building in Colombo now known for restaurants and shopping." },
    { id: 29, name: "Haputale", category: "Mountain & Hill Country", image: "/destinations/Haputale.jpg", description: "Peaceful hill-country town offering beautiful mountain and tea-estate views." },
    { id: 30, name: "Delft Island", category: "Island & Heritage", image: "/destinations/Delft Island.jpg", description: "Unique island in the north known for its wild landscapes, coral walls, and historic sites." }
  ];
  const [destinations, setDestinations] = useState(allDestinationsList);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function getDestinations() {
      const { data, error } = await supabase.from('destinations').select('*');
      if (!error && data && data.length > 0) {
        setDestinations(data);
      }
      setLoading(false);
    }
    getDestinations();
  }, []);

  const categories = ["All", "Heritage", "Beach & Coastal", "Nature & Wildlife", "Mountain & Hill Country", "Cultural & Heritage", "Adventure"];

  const filtered = destinations.filter(place => {
    const matchesCategory = selectedCategory === "All" || place.category === selectedCategory;
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          place.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="destinations" className="w-full bg-ceylon-bg py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="bg-orange-100 text-ceylon-accent text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block">
              Top 30 Must-Visit Places
            </span>
            <h2 className="text-4xl font-black text-ceylon-primary mb-3">
              Explore 30 Iconic Sri Lankan Destinations
            </h2>
            <p className="text-ceylon-muted text-lg max-w-2xl">
              From ancient rock fortresses to crystal clear beaches, mountain tea estates, and wild elephant parks.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search Sigiriya, Ella, Galle, Yala..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-ceylon-bg border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-ceylon-accent font-medium"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-ceylon-bg border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:border-ceylon-accent cursor-pointer appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === "All" ? "📍 All 30 Destinations" : cat}</option>
              ))}
            </select>
            <Filter size={16} className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
          </div>

        </div>

        {/* Destinations Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-gray-500 font-bold border border-gray-200">
            No destinations found matching "{searchTerm}". Try clearing your search!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((place) => (
              <div key={place.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-ceylon-light/30 flex flex-col justify-between">
                
                <div>
                  {/* Image */}
                  <div className="relative h-60 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-bold text-ceylon-primary tracking-wide shadow-sm">
                      {place.category}
                    </div>
                    <img 
                      src={place.image_url} 
                      alt={place.name} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-xs text-ceylon-accent font-bold mb-2">
                      <MapPin size={14} /> Sri Lanka Destination
                    </div>
                    <h3 className="text-2xl font-bold text-ceylon-primary mb-2">{place.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {place.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <Link 
                    to={`/destination/${place.id}`}
                    className="flex items-center gap-2 text-ceylon-accent font-bold text-sm group-hover:text-ceylon-primary transition-colors"
                  >
                    Explore {place.name} Details 
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}