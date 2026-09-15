import { MapPin, Send, CheckCircle, Trash2, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import SpotlightCard from './SpotlightCard';
import Reveal from './Reveal';
import { supabase } from '../lib/supabaseClient';

export default function Community() {
  const [submitted, setSubmitted] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [nearestCity, setNearestCity] = useState('');
  const [category, setCategory] = useState('Beach');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Make sure traveler is logged in
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('Please login as a traveler before submitting a new place.');
        return;
      }

      if (!selectedImage) {
        alert('Please upload a photo of the place.');
        return;
      }

      // 2. Validate image
      if (!selectedImage.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      if (selectedImage.size > 5 * 1024 * 1024) {
        alert('Photo must be less than 5MB.');
        return;
      }

      setSubmitted(false);

      // 3. Create unique file name
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // 4. Upload photo to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('destination-images')
        .upload(fileName, selectedImage);

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        alert('Photo upload failed: ' + uploadError.message);
        return;
      }

      // 5. Get public image URL
      const {
        data: { publicUrl }
      } = supabase.storage
        .from('destination-images')
        .getPublicUrl(fileName);

      // 6. Save destination in database
      const { error: insertError } = await supabase
        .from('destinations')
        .insert([
          {
            name: placeName.trim(),
            location: nearestCity.trim(),
            category: category,
            description: `A place recommended by a VisitCeylon traveler.`,
            image_url: publicUrl,
            status: 'pending',
            submitted_by: user.id
          }
        ]);

      if (insertError) {
        console.error('Destination insert error:', insertError);

        // Remove uploaded image if database insert fails
        await supabase.storage
          .from('destination-images')
          .remove([fileName]);

        alert('Could not submit the place: ' + insertError.message);
        return;
      }

      // 7. Success
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setPlaceName('');
        setNearestCity('');
        setCategory('Beach');
        setSelectedImage(null);
        setImagePreview(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);

    } catch (error) {
      console.error('Unexpected submission error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="w-full bg-slate-950 py-24 px-6 border-t border-slate-800 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Left Side - Text & Stats */}
        <Reveal y={20}>
          <span className="bg-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 inline-block border border-emerald-500/30">
            Traveler Community
          </span>
          <h2 className="text-4xl md:text-5xl font-editorial font-extrabold text-white mb-6 leading-tight">
            Found a Hidden Gem <br />in Sri Lanka?
          </h2>
          <p className="text-lg text-slate-300 mb-8 font-medium leading-relaxed">
            Did you discover a secret waterfall, an untouched beach, or a cozy local cafe? Share it with the VisitCeylon community! Once verified by our local guides, your spot will be featured on our interactive map.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.2)">
              <h4 className="font-editorial font-extrabold text-emerald-400 text-3xl mb-1">500+</h4>
              <p className="text-xs text-slate-300 font-bold">Secret Spots Uploaded</p>
            </SpotlightCard>

            <SpotlightCard spotlightColor="rgba(0, 229, 255, 0.2)">
              <h4 className="font-editorial font-extrabold text-emerald-400 text-3xl mb-1">10k+</h4>
              <p className="text-xs text-slate-300 font-bold">Active Travelers</p>
            </SpotlightCard>
          </div>
        </Reveal>

        {/* Right Side - Upload Form with SpotlightCard */}
        <Reveal delay={150} y={20}>
          <SpotlightCard className="p-8 md:p-10 shadow-2xl" spotlightColor="rgba(0, 229, 255, 0.2)">
            <h3 className="text-2xl font-editorial font-extrabold text-white mb-6">Submit a New Place</h3>
            
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle size={48} className="text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-2xl font-bold text-white">Place Submitted for Review!</h4>
                <p className="text-slate-300 text-sm">Thank you for contributing to the VisitCeylon community.</p>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Name of the Place</label>
                  <input 
                    type="text" 
                    required
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                    placeholder="e.g., Secret Beach, Mirissa" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Nearest City</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        value={nearestCity}
                        onChange={(e) => setNearestCity(e.target.value)}
                        placeholder="e.g., Matara" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm font-bold"
                    >
                      <option className="bg-slate-900 text-white">Beach</option>
                      <option className="bg-slate-900 text-white">Waterfall</option>
                      <option className="bg-slate-900 text-white">Viewpoint</option>
                      <option className="bg-slate-900 text-white">Food & Cafe</option>
                      <option className="bg-slate-900 text-white">Temple/Heritage</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Upload Photos</label>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  
                  {imagePreview ? (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-slate-950 h-44 group shadow-lg">
                      <img src={imagePreview} alt="Upload Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          type="button" 
                          onClick={handleRemoveImage}
                          className="bg-red-600 hover:bg-red-500 text-white p-2.5 rounded-full shadow-lg transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                        >
                          <Trash2 size={16} /> Remove Photo
                        </button>
                      </div>
                      <span className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow">
                        ✓ {selectedImage?.name || "Photo Loaded"}
                      </span>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-800 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer bg-slate-950/80 group"
                    >
                      <Upload size={32} className="mb-2 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <p className="font-bold text-xs">Click to upload photo from your device</p>
                      <p className="text-[11px] text-slate-500 mt-1">SVG, PNG, JPG (Max 5MB)</p>
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg mt-4">
                  <Send size={18} />
                  Submit Spot for Verification
                </button>
                
              </form>
            )}

          </SpotlightCard>
        </Reveal>

      </div>
    </div>
  );
}