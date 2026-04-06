import React, { useState } from 'react';

const DestinationCard = ({ destination }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ease-out hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:translateY-[-10px] hover:scale-[1.03] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Overlay */}
      <div className="relative h-64 overflow-hidden">
        {/* Destination Image */}
        <img 
          src={destination.image || `https://picsum.photos/seed/${destination.name}/400/300.jpg`}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 ease-out"></div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded-full shadow-lg">
            {destination.category}
          </span>
        </div>
        
        {/* Action Buttons - Show on Hover */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out transform translate-y-2 group-hover:translate-y-0">
            {/* View Details Button */}
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-xl transition-all duration-200 ease-out transform hover:scale-105 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Details
            </button>
            
            {/* Watch Video Button */}
            {destination.video && (
              <button className="px-6 py-3 bg-white/90 hover:bg-white text-gray-900 font-semibold rounded-lg shadow-xl transition-all duration-200 ease-out transform hover:scale-105 flex items-center gap-2 backdrop-blur-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Video
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-200">
          {destination.name}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {destination.description}
        </p>
        
        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(destination.rating || 4.5) ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-xs font-medium">{destination.rating || 4.5}</span>
          </div>
          
          {/* Duration */}
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">{destination.duration || '2-3 days'}</span>
          </div>
        </div>
        
        {/* Price */}
        {destination.price && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">From</span>
              <span className="text-2xl font-bold text-green-600">${destination.price}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Example Usage Component
const DestinationsGrid = ({ destinations }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6 max-w-7xl mx-auto">
      {destinations.map((destination) => (
        <DestinationCard 
          key={destination.id} 
          destination={destination}
        />
      ))}
    </div>
  );
};

export default DestinationCard;
export { DestinationsGrid };
