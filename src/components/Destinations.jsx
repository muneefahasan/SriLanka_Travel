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
  image_url: "/sigiriya.png", 
  description: "Ancient rock fortress famous for its history, paintings, and beautiful gardens." 
},

    { id: 2, name: "Ella", category: "Mountain & Hill Country", image_url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80", description: "Scenic hill town surrounded by mountains, tea plantations, and waterfalls." },
    { id: 3, name: "Kandy", category: "Cultural & Heritage", image_url: "https://images.unsplash.com/photo-1544256662-756ef26e5fc5?auto=format&fit=crop&w=600&q=80", description: "Cultural city famous for the Temple of the Sacred Tooth Relic." },
    { id: 4, name: "Galle Fort", category: "Heritage & Beach", image_url: "https://images.unsplash.com/photo-1574991485647-758ea065963b?auto=format&fit=crop&w=600&q=80", description: "Historic colonial fort with old buildings, streets, shops, and ocean views." },
    { id: 5, name: "Nuwara Eliya", category: "Mountain & Hill Country", image_url: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80", description: "Cool hill-country town famous for tea estates and beautiful landscapes." },
    { id: 6, name: "Yala National Park", category: "Nature & Wildlife", image_url: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=600&q=80", description: "Popular wildlife park known for elephants, leopards, and many bird species." },
    { id: 7, name: "Mirissa", category: "Beach & Coastal", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80", description: "Beautiful beach destination famous for sunsets and whale-watching." },
    { id: 8, name: "Dambulla Cave Temple", category: "Cultural & Heritage", image_url: "https://images.unsplash.com/photo-1602643163983-ed0b structure-1?auto=format&fit=crop&w=600&q=80", description: "Ancient Buddhist temple complex featuring statues and colorful cave paintings." },
    { id: 9, name: "Anuradhapura", category: "Cultural & Heritage", image_url: "https://images.unsplash.com/photo-1625736332302-3bef83780361?auto=format&fit=crop&w=600&q=80", description: "Ancient city famous for historic Buddhist stupas, temples, and ruins." },
    { id: 10, name: "Polonnaruwa", category: "Cultural & Heritage", image_url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80", description: "Historic royal city with ancient temples, statues, and archaeological ruins." },
    { id: 11, name: "Arugam Bay", category: "Beach & Coastal", image_url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80", description: "World-famous surfing destination with beautiful beaches and a relaxed atmosphere." },
    { id: 12, name: "Hikkaduwa", category: "Beach & Coastal", image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80", description: "Coastal town popular for beaches, snorkeling, coral reefs, and marine life." },
    { id: 13, name: "Trincomalee", category: "Beach & Coastal", image_url: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=600&q=80", description: "Coastal city known for beautiful beaches, clear waters, and historic temples." },
    { id: 14, name: "Jaffna", category: "Cultural & Heritage", image_url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80", description: "Northern city rich in Tamil culture, history, temples, and traditional cuisine." },
    { id: 15, name: "Adam's Peak", category: "Mountain & Adventure", image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80", description: "Sacred mountain famous for pilgrimage, hiking, and spectacular sunrise views." },
    { id: 16, name: "Bentota", category: "Beach & Coastal", image_url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80", description: "Popular beach destination offering water sports, riverside scenery, and resorts." },
    { id: 17, name: "Negombo", category: "Beach & Coastal", image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", description: "Coastal city known for its beach, fishing industry, seafood, and canals." },
    { id: 18, name: "Horton Plains", category: "Nature & Adventure", image_url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80", description: "Scenic national park famous for hiking, grasslands, forests, and World's End." },
    { id: 19, name: "Udawalawe National Park", category: "Nature & Wildlife", image_url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80", description: "Wildlife destination particularly famous for its large elephant population." },
    { id: 20, name: "Pinnawala Elephant Orphanage", category: "Nature & Wildlife", image_url: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef9?auto=format&fit=crop&w=600&q=80", description: "Popular attraction where visitors can observe elephants and their daily activities." },
    { id: 21, name: "Unawatuna", category: "Beach & Coastal", image_url: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=80", description: "Beautiful beach destination known for swimming, snorkeling, and coral reefs." },
    { id: 22, name: "Kithulgala", category: "Adventure", image_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80", description: "Adventure destination famous for white-water rafting, forests, and outdoor activities." },
    { id: 23, name: "Knuckles Mountain Range", category: "Mountain & Nature", image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80", description: "Mountain region known for hiking trails, forests, waterfalls, and stunning scenery." },
    { id: 24, name: "Kalpitiya", category: "Beach & Coastal", image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", description: "Coastal destination popular for beaches, dolphin watching, and water sports." },
    { id: 25, name: "Pasikuda", category: "Beach & Coastal", image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", description: "Famous for its calm, shallow, turquoise-colored waters and beautiful beach." },
    { id: 26, name: "Ravana Falls", category: "Mountain & Nature", image_url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80", description: "Spectacular waterfall near Ella surrounded by scenic mountain landscapes." },
    { id: 27, name: "Nallur Kandaswamy Kovil", category: "Cultural & Heritage", image_url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80", description: "Famous Hindu temple in Jaffna with beautiful architecture and cultural importance." },
    { id: 28, name: "Dutch Hospital Colombo", category: "Heritage & City", image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80", description: "Historic colonial building in Colombo now known for restaurants and shopping." },
    { id: 29, name: "Haputale", category: "Mountain & Hill Country", image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", description: "Peaceful hill-country town offering beautiful mountain and tea-estate views." },
    { id: 30, name: "Delft Island", category: "Island & Heritage", image_url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80", description: "Unique island in the north known for its wild landscapes, coral walls, and historic sites." }
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