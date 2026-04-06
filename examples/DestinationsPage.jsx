// Example data structure and usage
const sampleDestinations = [
  {
    id: 1,
    name: "Lalibela Rock-Hewn Churches",
    description: "Ancient monolithic churches carved from solid rock, dating back to the 12th century. A UNESCO World Heritage site and one of Ethiopia's most sacred destinations.",
    category: "Historical & Cultural",
    image: "/uploads/images/lalibela-church.jpg",
    video: "/videos/lalibela-tour.mp4",
    rating: 4.8,
    duration: "2-3 days",
    price: 299,
  },
  {
    id: 2,
    name: "Simien Mountains National Park",
    description: "Dramatic mountain landscapes with rare wildlife including the Gelada baboon and Walia ibex. Perfect for trekking and wildlife photography.",
    category: "Nature & Adventure",
    image: "/uploads/images/simien-mountains.jpg",
    video: "/videos/simien-trek.mp4",
    rating: 4.9,
    duration: "4-5 days",
    price: 449,
  },
  {
    id: 3,
    name: "Lake Tana & Blue Nile Falls",
    description: "Ethiopia's largest lake and the spectacular Blue Nile Falls. Explore ancient monasteries on the lake's islands and witness the smoking waterfall.",
    category: "Lakes & Water",
    image: "/uploads/images/lake-tana.jpg",
    rating: 4.6,
    duration: "2 days",
    price: 189,
  }
];

// How to use in your existing React app
import React from 'react';
import { DestinationsGrid } from './components/DestinationCard';

const DestinationsPage = () => {
  // Fetch your destinations from API or use static data
  const [destinations, setDestinations] = React.useState(sampleDestinations);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch destinations from your backend
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/places');
        const data = await response.json();
        
        // Transform your data to match the expected format
        const transformedData = data.map(place => ({
          id: place._id,
          name: place.name,
          description: place.description,
          category: place.category,
          image: place.image_url,
          video: place.video_url,
          rating: place.rating || 4.5,
          duration: place.duration || '2-3 days',
          price: place.price,
        }));
        
        setDestinations(transformedData);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Ethiopia 361°</h1>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Home</a>
              <a href="#" className="text-green-600 font-medium">Destinations</a>
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Gallery</a>
              <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-green-600 to-green-800 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Discover Ethiopia</h2>
          <p className="text-xl max-w-2xl mx-auto">Ancient wonders, breathtaking landscapes, and unforgettable adventures await</p>
        </div>
      </section>

      {/* Destinations Grid */}
      <main className="py-12">
        <DestinationsGrid destinations={destinations} />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 Ethiopia 361°. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DestinationsPage;
