import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Hero from '../components/Hero';
import LenticularCarousel from '../components/LenticularCarousel';
import TripPlanner from '../components/TripPlanner';
import WeatherWidget from '../components/WeatherWidget';
import TrainRoutes from '../components/TrainRoutes';
import FestivalsCalendar from '../components/FestivalsCalendar';
import TouristTools from '../components/TouristTools';
import TravelEssentials from '../components/TravelEssentials';
import TourGuides from '../components/TourGuides';
import Community from '../components/Community';

export default function Home() {
  
  // Connection Check Test
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from('_not_a_table_').select('*');
      console.log("Supabase Connection Test:", error ? "Connected Successfully!" : data);
    }
    testConnection();
  }, []);

  return (
    <div className="flex flex-col">
      <Hero />
      <LenticularCarousel />
      <TripPlanner />
      <WeatherWidget />
      <TrainRoutes />
      <FestivalsCalendar />
      <TouristTools />
      <TravelEssentials />
      <TourGuides />
      <Community />
    </div>
  );
}