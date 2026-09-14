import Hero from '../components/Hero';
import LenticularCarousel from '../components/LenticularCarousel';
import TripPlanner from '../components/TripPlanner';
import WeatherWidget from '../components/WeatherWidget';
import TrainRoutes from '../components/TrainRoutes';
import FestivalsCalendar from '../components/FestivalsCalendar';
import TouristTools from '../components/TouristTools';
import TourGuides from '../components/TourGuides';
import Community from '../components/Community';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <LenticularCarousel />
      <TripPlanner />
      <WeatherWidget />
      <TrainRoutes />
      <FestivalsCalendar />
      <TouristTools />
      <TourGuides />
      <Community />
    </div>
  );
}
