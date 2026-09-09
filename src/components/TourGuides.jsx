import { Search, MessageSquare, Star, MapPin, Award } from 'lucide-react';

export default function TourGuides() {
  // Sample Guide Data
  const guides = [
    {
      id: 1,
      name: "Nuwan Silva",
      type: "National Guide",
      languages: ["English", "German"],
      rating: 4.9,
      reviews: 124,
      location: "Colombo / Islandwide",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 2,
      name: "Kasun Perera",
      type: "Chauffeur Guide",
      languages: ["English", "Russian"],
      rating: 4.8,
      reviews: 89,
      location: "Kandy & Hill Country",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 3,
      name: "Anjali Fernando",
      type: "Site Guide",
      languages: ["English", "French", "Tamil"],
      rating: 5.0,
      reviews: 210,
      location: "Galle Fort",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
  ];

  return (
    <div className="w-full bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-ceylon-primary mb-4">Find a Local Tour Guide</h2>
          <p className="text-ceylon-muted text-lg">Connect with certified local guides to make your Sri Lankan journey unforgettable.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-ceylon-bg p-6 rounded-2xl flex flex-col md:flex-row gap-4 mb-12 shadow-sm border border-ceylon-card">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or location..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-ceylon-light"
            />
          </div>
          <select className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-ceylon-light bg-white">
            <option>All Guide Types</option>
            <option>National Guide</option>
            <option>Chauffeur Guide</option>
            <option>Site Guide</option>
          </select>
          <select className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-ceylon-light bg-white">
            <option>Any Language</option>
            <option>English</option>
            <option>German</option>
            <option>French</option>
            <option>Tamil</option>
          </select>
        </div>

        {/* Guide Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="flex gap-4 items-start mb-6">
                <img src={guide.image} alt={guide.name} className="w-20 h-20 rounded-full object-cover border-2 border-ceylon-light" />
                <div>
                  <h3 className="text-xl font-bold text-ceylon-primary">{guide.name}</h3>
                  <div className="flex items-center gap-1 text-ceylon-accent text-sm font-medium mt-1">
                    <Award size={16} />
                    {guide.type}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                    <Star size={16} className="fill-current" />
                    <span className="font-bold text-gray-700">{guide.rating}</span>
                    <span className="text-gray-400">({guide.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="text-ceylon-light" />
                  {guide.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-semibold">Languages:</span> {guide.languages.join(", ")}
                </div>
              </div>

              {/* Chat / Message Button */}
              <button className="w-full flex items-center justify-center gap-2 bg-ceylon-bg hover:bg-ceylon-light hover:text-white text-ceylon-primary py-3 rounded-xl font-semibold transition-colors">
                <MessageSquare size={18} />
                Message Guide
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}