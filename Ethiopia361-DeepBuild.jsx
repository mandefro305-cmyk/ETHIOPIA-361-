import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Calendar, 
  Camera, 
  Compass, 
  ChevronRight, 
  Star, 
  Menu, 
  X, 
  Globe, 
  Coffee, 
  Sun,
  ArrowRight,
  Play,
  Leaf,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Award,
  Zap,
  ChevronDown,
  Search,
  Filter,
  Heart,
  Share2,
  MessageCircle,
  Clock,
  Users,
  DollarSign,
  Cloud,
  Thermometer,
  Wind,
  Eye,
  Navigation,
  Bookmark,
  Send,
  Mic,
  Globe2,
  Languages,
  CalendarDays,
  CreditCard,
  Plane,
  Hotel,
  Car,
  Map,
  Phone,
  Mail,
  Check,
  AlertCircle,
  TrendingUp,
  Sunrise,
  Sunset,
  Umbrella,
  CameraOff,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCw,
  Pause,
  PlayCircle,
  Mountain,
  Trees,
  Sparkles,
  List,
  Grid3X3
} from 'lucide-react';

const Ethiopia361 = () => {
  // State Management
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [activeInsight, setActiveInsight] = useState(null);
  const [travelStyle, setTravelStyle] = useState('');
  const [duration, setDuration] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  // Refs for Intersection Observer
  const headerRef = useRef(null);
  const sectionsRef = useRef([]);

  // Hero slides data
  const heroSlides = [
    {
      title: "Lalibela",
      subtitle: "Where Faith Carved the Earth",
      description: "Witness the 12th-century rock-hewn churches, a testament to human devotion and architectural genius.",
      image: "https://picsum.photos/seed/lalibela-church/1920/1080"
    },
    {
      title: "Simien Mountains", 
      subtitle: "The Roof of Africa",
      description: "Trek through UNESCO World Heritage peaks, home to the elusive Gelada baboon and Walia ibex.",
      image: "https://picsum.photos/seed/simien-mountains/1920/1080"
    },
    {
      title: "Danakil Depression",
      subtitle: "The Hottest Place on Earth",
      description: "Explore otherworldly landscapes of sulfur springs and salt flats that defy imagination.",
      image: "https://picsum.photos/seed/danakil-depression/1920/1080"
    }
  ];

  // Cultural insights data
  const culturalInsights = [
    {
      id: 'coffee',
      icon: Coffee,
      title: "Coffee Ceremony",
      shortDescription: "The heart of Ethiopian hospitality",
      fullDescription: "Experience the timeless ritual where coffee beans are roasted, ground, and brewed three times, symbolizing friendship, respect, and blessing. This hour-long ceremony is the cornerstone of Ethiopian social life.",
      color: "emerald-600"
    },
    {
      id: 'sun',
      icon: Sun,
      title: "13 Months of Sunshine",
      shortDescription: "Ancient calendar wisdom",
      fullDescription: "Ethiopia follows the Ge'ez calendar with 13 months, 12 of 30 days each and a 13th month of 5 or 6 days. This unique timekeeping reflects Ethiopia's position as the land of the sun and preserves ancient astronomical knowledge.",
      color: "amber-600"
    },
    {
      id: 'globe',
      icon: Globe,
      title: "Cradle of Humanity",
      shortDescription: "Where humanity began",
      fullDescription: "Ethiopia is home to Lucy, the 3.2 million-year-old hominid fossil that revolutionized our understanding of human evolution. The country's archaeological sites continue to reveal secrets of our shared origins.",
      color: "sky-600"
    }
  ];

  // Premium destinations data
  const destinations = [
    {
      id: 1,
      name: "Lalibela Rock Churches",
      category: "Historical",
      rating: 4.9,
      duration: "3-4 days",
      bestTime: "Oct - Mar",
      price: "$1,299",
      image: "https://picsum.photos/seed/lalibela/400/500",
      summary: "Medieval wonder carved from single rock formations",
      itinerary: {
        day1: "Arrival in Lalibela, evening church visit",
        day2: "Full day exploring the 11 rock-hewn churches",
        day3: "Asheton Maryam monastery & departure"
      },
      highlights: ["Bet Giyorgis", "Church of St. George", "Cross-shaped churches"]
    },
    {
      id: 2,
      name: "Simien Mountains Trek",
      category: "Adventure",
      rating: 4.8,
      duration: "5-7 days",
      bestTime: "Sep - Nov",
      price: "$1,899",
      image: "https://picsum.photos/seed/simien/400/500",
      summary: "Epic trekking through Africa's most dramatic peaks",
      itinerary: {
        day1: "Debark to Sankaber camp",
        day2: "Trek to Geech via Jinbar waterfall",
        day3: "Climb Imet Gogo and Chenek camp",
        day4: "Summit Ras Dashen and begin descent"
      },
      highlights: ["Ras Dashen (4,550m)", "Gelada baboons", "Walia ibex spotting"]
    },
    {
      id: 3,
      name: "Lake Tana & Blue Nile",
      category: "Cultural",
      rating: 4.7,
      duration: "4-5 days",
      bestTime: "Oct - Jan",
      price: "$999",
      image: "https://picsum.photos/seed/laketana/400/500",
      summary: "Sacred islands and the mighty Blue Nile Falls",
      itinerary: {
        day1: "Bahir Dar arrival, lake sunset cruise",
        day2: "Lake Tana island monasteries tour",
        day3: "Blue Nile Falls & Portuguese bridge",
        day4: "Market visit & departure"
      },
      highlights: ["Tis Isat Falls", "Ura Kidane Mehret", "Lake Zege monasteries"]
    },
    {
      id: 4,
      name: "Danakil Depression",
      category: "Adventure",
      rating: 4.6,
      duration: "3-4 days",
      bestTime: "Nov - Feb",
      price: "$1,599",
      image: "https://picsum.photos/seed/danakil/400/500",
      summary: "Otherworldly landscapes of salt and sulfur",
      itinerary: {
        day1: "Drive to Hamed Ela, sunset at Lake Afrera",
        day2: "Dallol sulfur springs & salt flats",
        day3: "Erta Ale volcano overnight trek",
        day4: "Return to Mekele"
      },
      highlights: ["Erta Ale lava lake", "Dallol colorful pools", "Salt caravans"]
    },
    {
      id: 5,
      name: "Axum & Tigray",
      category: "Historical",
      rating: 4.8,
      duration: "4-5 days",
      bestTime: "Oct - Mar",
      price: "$1,199",
      image: "https://picsum.photos/seed/axum/400/500",
      summary: "Ancient capital and rock churches of Tigray",
      itinerary: {
        day1: "Fly to Axum, stelae field visit",
        day2: "Church of Our Lady Mary of Zion & tombs",
        day3: "Drive to Hawzen via Yeha temple",
        day4: "Tigray rock churches & return to Axum"
      },
      highlights: ["Queen of Sheba's Palace", "Obelisks of Axum", "Abuna Yemata Guh"]
    },
    {
      id: 6,
      name: "Omo Valley Tribes",
      category: "Cultural",
      rating: 4.5,
      duration: "6-8 days",
      bestTime: "Jun - Sep",
      price: "$2,299",
      image: "https://picsum.photos/seed/omovalley/400/500",
      summary: "Living traditions of Ethiopia's tribal communities",
      itinerary: {
        day1: "Fly to Jinka, Ari village visit",
        day2: "Mursi tribe & Mago National Park",
        day3: "Karo tribe & Omo River crossing",
        day4: "Hamer people & bull jumping ceremony",
        day5: "Konso cultural landscape & return"
      },
      highlights: ["Mursi lip plates", "Hamer bull jumping", "Karo body painting"]
    }
  ];

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Magnetic hover effect for buttons
  const handleMagneticHover = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const resetMagneticHover = (e) => {
    e.currentTarget.style.transform = '';
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Immersive Header */}
      <header 
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-emerald-100' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">361°</span>
              </div>
              <span className="font-serif text-2xl font-bold text-stone-950">Ethiopia 361°</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-stone-700 hover:text-emerald-600 transition-colors">Home</a>
              <a href="#destinations" className="text-stone-700 hover:text-emerald-600 transition-colors">Destinations</a>
              <a href="#insights" className="text-stone-700 hover:text-emerald-600 transition-colors">Cultural Insights</a>
              <a href="#planner" className="text-stone-700 hover:text-emerald-600 transition-colors">Trip Planner</a>
              <button 
                className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-colors"
                onMouseMove={handleMagneticHover}
                onMouseLeave={resetMagneticHover}
              >
                Start Journey
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-emerald-100">
            <div className="flex flex-col p-6 space-y-4">
              <a href="#home" className="text-stone-700 hover:text-emerald-600 transition-colors">Home</a>
              <a href="#destinations" className="text-stone-700 hover:text-emerald-600 transition-colors">Destinations</a>
              <a href="#insights" className="text-stone-700 hover:text-emerald-600 transition-colors">Cultural Insights</a>
              <a href="#planner" className="text-stone-700 hover:text-emerald-600 transition-colors">Trip Planner</a>
              <button className="bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition-colors w-full">
                Start Journey
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Immersive Hero Section */}
      <section id="home" className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentHeroSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
            </div>
          ))}
        </div>

        <div className="relative h-full flex items-center justify-center px-6">
          <div className="text-center text-white max-w-4xl">
            <div className="overflow-hidden">
              <h1 className="font-serif text-6xl md:text-8xl font-bold mb-6 transform transition-all duration-1000 translate-y-0">
                {heroSlides[currentHeroSlide].title}
              </h1>
            </div>
            <div className="overflow-hidden">
              <h2 className="text-2xl md:text-3xl mb-4 text-emerald-400 transform transition-all duration-1000 delay-200 translate-y-0">
                {heroSlides[currentHeroSlide].subtitle}
              </h2>
            </div>
            <div className="overflow-hidden">
              <p className="text-lg md:text-xl mb-8 text-stone-200 max-w-2xl mx-auto transform transition-all duration-1000 delay-300 translate-y-0">
                {heroSlides[currentHeroSlide].description}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-1000 delay-500 translate-y-0">
              <button 
                className="bg-emerald-600 text-white px-8 py-4 rounded-full hover:bg-emerald-700 transition-all hover:scale-105 flex items-center justify-center space-x-2 min-h-[48px]"
                onMouseMove={handleMagneticHover}
                onMouseLeave={resetMagneticHover}
              >
                <span>Explore Destinations</span>
                <ArrowRight size={20} />
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full hover:bg-white/30 transition-all hover:scale-105 border border-white/30 min-h-[48px]">
                Watch Video Journey
              </button>
            </div>
          </div>
        </div>

        {/* Hero Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentHeroSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 361st Degree Explorer - Cultural Insights */}
      <section id="insights" ref={el => sectionsRef.current[0] = el} className="py-20 bg-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-stone-950 mb-4">
              The 361st Degree
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Beyond the ordinary lies Ethiopia's extraordinary cultural wisdom—traditions that have shaped civilizations for millennia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {culturalInsights.map((insight) => {
              const Icon = insight.icon;
              return (
                <div
                  key={insight.id}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setActiveInsight(insight.id)}
                  onMouseLeave={() => setActiveInsight(null)}
                >
                  <div className="bg-white rounded-[3rem] p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-stone-200">
                    <div className={`w-16 h-16 bg-${insight.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-stone-950 mb-3">
                      {insight.title}
                    </h3>
                    <p className="text-stone-600 mb-4">
                      {insight.shortDescription}
                    </p>
                    
                    {/* Expanded Content */}
                    <div className={`overflow-hidden transition-all duration-500 ${
                      activeInsight === insight.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="pt-4 border-t border-stone-200">
                        <p className="text-stone-700 text-sm leading-relaxed">
                          {insight.fullDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-emerald-600 font-medium">
                      <span>Discover More</span>
                      <ChevronRight size={20} className={`ml-2 transition-transform ${
                        activeInsight === insight.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Destinations Grid */}
      <section id="destinations" ref={el => sectionsRef.current[1] = el} className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="font-serif text-5xl md:text-6xl font-bold text-stone-950 mb-4">
                Premium Journeys
              </h2>
              <p className="text-xl text-stone-600 max-w-2xl">
                Curated experiences that blend ancient wonders with modern luxury
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-6 md:mt-0">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
                }`}
              >
                <Grid3X3 size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
                }`}
              >
                <List size={20} />
              </button>
              <button className="p-3 bg-stone-200 text-stone-600 rounded-lg hover:bg-stone-300 transition-colors">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <div className={`grid gap-8 ${
            viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-1'
          }`}>
            {destinations.map((destination) => (
              <div
                key={destination.id}
                className="group bg-white rounded-[3rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                onClick={() => setSelectedDestination(destination)}
              >
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute top-6 left-6">
                    <span className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {destination.category}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-serif text-2xl font-bold text-white mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-stone-200 text-sm">
                      {destination.summary}
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < Math.floor(destination.rating) ? 'text-yellow-400 fill-current' : 'text-stone-300'} 
                        />
                      ))}
                      <span className="ml-2 text-stone-600 font-medium">{destination.rating}</span>
                    </div>
                    <span className="font-serif text-2xl font-bold text-emerald-600">
                      {destination.price}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-stone-600 mb-6">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{destination.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{destination.bestTime}</span>
                    </div>
                  </div>

                  <button className="w-full bg-emerald-600 text-white py-3 rounded-full hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 min-h-[48px]">
                    <span>View Details</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destination Detail Slide-over Panel */}
      {selectedDestination && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedDestination(null)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto">
            <div className="relative h-96">
              <img 
                src={selectedDestination.image} 
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              <button 
                onClick={() => setSelectedDestination(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="font-serif text-3xl font-bold text-white mb-2">
                  {selectedDestination.name}
                </h3>
                <p className="text-stone-200">
                  {selectedDestination.summary}
                </p>
              </div>
            </div>

            <div className="p-8">
              {/* At a Glance */}
              <div className="mb-8">
                <h4 className="font-serif text-2xl font-bold text-stone-950 mb-4">At a Glance</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Clock size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-600">Duration</p>
                      <p className="font-medium">{selectedDestination.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Calendar size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-600">Best Time</p>
                      <p className="font-medium">{selectedDestination.bestTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Itinerary */}
              <div className="mb-8">
                <h4 className="font-serif text-2xl font-bold text-stone-950 mb-4">Mini Itinerary</h4>
                <div className="space-y-4">
                  {Object.entries(selectedDestination.itinerary).map(([day, activity]) => (
                    <div key={day} className="flex space-x-4">
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {day.replace('day', '')}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-stone-950 capitalize">{day.replace('day', 'Day')}</p>
                        <p className="text-stone-600">{activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-8">
                <h4 className="font-serif text-2xl font-bold text-stone-950 mb-4">Highlights</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDestination.highlights.map((highlight, index) => (
                    <span key={index} className="bg-stone-100 text-stone-700 px-4 py-2 rounded-full text-sm">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button className="flex-1 bg-emerald-600 text-white py-3 rounded-full hover:bg-emerald-700 transition-colors min-h-[48px]">
                  Book This Journey
                </button>
                <button className="p-3 bg-stone-200 text-stone-600 rounded-full hover:bg-stone-300 transition-colors">
                  <Heart size={20} />
                </button>
                <button className="p-3 bg-stone-200 text-stone-600 rounded-full hover:bg-stone-300 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trip Planner Booking Engine */}
      <section id="planner" ref={el => sectionsRef.current[2] = el} className="py-20 bg-stone-950">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4">
              Design Your Journey
            </h2>
            <p className="text-xl text-stone-300">
              Let us craft your perfect Ethiopian adventure based on your travel style
            </p>
          </div>

          <div className="bg-stone-900 rounded-[3rem] p-8 md:p-12 border border-stone-800">
            <form className="space-y-8">
              <div>
                <label className="block text-white font-medium mb-3">Travel Style</label>
                <div className="grid md:grid-cols-3 gap-4">
                  {['History', 'Adventure', 'Culture'].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setTravelStyle(style)}
                      className={`p-4 rounded-2xl border-2 transition-all min-h-[48px] ${
                        travelStyle === style
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-600'
                      }`}
                    >
                      <Mountain size={24} className="mx-auto mb-2" />
                      <span className="font-medium">{style}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-3">Duration</label>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-4 bg-stone-800 border border-stone-700 rounded-2xl text-white focus:border-emerald-600 focus:outline-none min-h-[48px]"
                  >
                    <option value="">Select duration</option>
                    <option value="3-5 days">3-5 days</option>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="3+ weeks">3+ weeks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-3">Group Size</label>
                  <select 
                    value={groupSize}
                    onChange={(e) => setGroupSize(e.target.value)}
                    className="w-full p-4 bg-stone-800 border border-stone-700 rounded-2xl text-white focus:border-emerald-600 focus:outline-none min-h-[48px]"
                  >
                    <option value="">Select group size</option>
                    <option value="solo">Solo traveler</option>
                    <option value="couple">Couple</option>
                    <option value="small">Small group (3-6)</option>
                    <option value="large">Large group (7+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-3">Special Interests (Optional)</label>
                <div className="flex flex-wrap gap-3">
                  {['Photography', 'Wildlife', 'Architecture', 'Food & Cuisine', 'Festivals', 'Trekking'].map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      className="px-4 py-2 bg-stone-800 border border-stone-700 rounded-full text-stone-300 hover:border-emerald-600 hover:text-emerald-400 transition-colors"
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 text-white py-4 rounded-full hover:bg-emerald-700 transition-all hover:scale-[1.02] font-medium text-lg min-h-[48px]"
                onMouseMove={handleMagneticHover}
                onMouseLeave={resetMagneticHover}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles size={24} />
                  <span>Generate Custom Itinerary</span>
                </div>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 border-t border-stone-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">361°</span>
              </div>
              <span className="font-serif text-xl font-bold text-white">Ethiopia 361°</span>
            </div>
            <p className="text-stone-400">
              The Land of Origins • Where Humanity Began
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Ethiopia361;
