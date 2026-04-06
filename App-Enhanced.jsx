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
  PlayCircle
} from 'lucide-react';

const App = () => {
  // Enhanced State Management
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: '🌍 Welcome to Ethiopia 361°! I\'m your AI travel assistant. How can I help you plan your perfect journey?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [mapCenter, setMapCenter] = useState([9.1450, 40.4897]); // Ethiopia center
  const [showReviews, setShowReviews] = useState(null);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [showWeather, setShowWeather] = useState(false);
  const [isVirtualTourFullscreen, setIsVirtualTourFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Refs
  const virtualTourRef = useRef(null);
  const chatEndRef = useRef(null);

  // Enhanced hero slides with virtual tour support
  const heroSlides = [
    {
      url: "https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&q=100&w=1920",
      location: "AWASH",
      title: "Discover the Land of Origins",
      subtitle: "Experience the 361st degree of travel. Where ancient history meets the pulse of modern Ethiopia.",
      virtualTour: "awash-national-park"
    }
  ];

  // Enhanced destinations with comprehensive data
  const featuredDestinations = [
    {
      id: 1,
      name: "Lalibela Rock-Hewn Churches",
      name_am: "ላሊበላ ድንጋይ ቤተ ክርስትያናት",
      desc: "Lalibela is famous for its rock-hewn churches carved into stone during the 12th century. A testament to faith and architectural genius.",
      desc_am: "ላሊበላ በ12ኛው ክፍለ ዘመን በአንድ ድንጋይ ውስጥ በሚተከሉ ቤተ ክርስትያናት ተብሎ ይታወቃል። እምነትና የህንጻስና ብልሀት ምስክር ነው።",
      image: "https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&q=80&w=800",
      badge: "Historical",
      rating: 4.9,
      price: 1200,
      price_etb: 67200,
      coordinates: [12.0265, 39.0431],
      weather: { temp: 18, condition: "Partly Cloudy", humidity: 65, wind: 12 },
      bestTime: "October to March",
      duration: "3-4 days",
      difficulty: "Easy",
      gallery: [
        "https://picsum.photos/seed/lalibela1/800/600",
        "https://picsum.photos/seed/lalibela2/800/600",
        "https://picsum.photos/seed/lalibela3/800/600"
      ],
      virtualTour: "lalibela-churches",
      reviews: [
        { name: "Sarah M.", rating: 5, comment: "Absolutely breathtaking! The churches are beyond words.", date: "2024-01-15" },
        { name: "John D.", rating: 5, comment: "A spiritual journey that changed my perspective.", date: "2024-02-20" }
      ],
      activities: ["Church Tours", "Photography", "Cultural Experience", "Mountain Views"]
    },
    {
      id: 2,
      name: "Simien Mountains",
      name_am: "ሴሚን ተራሮች",
      desc: "Breathtaking views and unique wildlife. Home to the endemic Gelada baboon and the majestic Walia Ibex.",
      desc_am: "የሚያምር መልክያዎች እና የተለየ እንስሳት። የግለሰብ ግለሰብ ጌላዳ ባቦን እና አስተሳፋዊ ዋሊያ አይብክስ ቦታ።",
      image: "https://images.unsplash.com/photo-1523805081446-ed9a7bb8ff35?auto=format&fit=crop&q=80&w=800",
      badge: "Nature",
      rating: 5.0,
      price: 850,
      price_etb: 47600,
      coordinates: [13.1589, 38.3753],
      weather: { temp: 15, condition: "Clear", humidity: 45, wind: 18 },
      bestTime: "September to November",
      duration: "5-7 days",
      difficulty: "Challenging",
      gallery: [
        "https://picsum.photos/seed/simien1/800/600",
        "https://picsum.photos/seed/simien2/800/600",
        "https://picsum.photos/seed/simien3/800/600"
      ],
      virtualTour: "simien-mountains",
      reviews: [
        { name: "Mike T.", rating: 5, comment: "Trekking paradise! The scenery is unmatched.", date: "2024-01-10" },
        { name: "Emma L.", rating: 5, comment: "Saw the Gelada baboons up close - incredible!", date: "2024-03-05" }
      ],
      activities: ["Trekking", "Wildlife Viewing", "Camping", "Photography"]
    },
    {
      id: 3,
      name: "Dallol Depression",
      name_am: "ዳሎል ውልበሳ",
      desc: "One of the hottest and most surreal places on earth. A landscape of sulfur springs and neon-colored mineral formations.",
      desc_am: "በአለማው በጣም ቀዝቃዛ እና አስገራጭ ቦታዎች አንዱ። የማርች ንፅልፎች እና የኔዖን ቀለማት ያሉት መልክያ።",
      image: "https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&q=80&w=800",
      badge: "Adventure",
      rating: 4.8,
      price: 1500,
      price_etb: 84000,
      coordinates: [14.2417, 40.3019],
      weather: { temp: 35, condition: "Hot & Dry", humidity: 25, wind: 8 },
      bestTime: "November to February",
      duration: "3-4 days",
      difficulty: "Extreme",
      gallery: [
        "https://picsum.photos/seed/dallol1/800/600",
        "https://picsum.photos/seed/dallol2/800/600",
        "https://picsum.photos/seed/dallol3/800/600"
      ],
      virtualTour: "dallol-depression",
      reviews: [
        { name: "Alex R.", rating: 5, comment: "Like visiting another planet! Absolutely unique.", date: "2024-02-15" },
        { name: "Lisa K.", rating: 4, comment: "Challenging but worth every moment. Bring lots of water!", date: "2024-03-20" }
      ],
      activities: ["Extreme Adventure", "Photography", "Geological Tour", "Salt Caravan Viewing"]
    }
  ];

  // Exchange rates (simplified - in real app, would fetch from API)
  const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    ETB: 56
  };

  // Weather data for destinations
  const getWeatherIcon = (condition) => {
    const icons = {
      "Clear": <Sun size={24} className="text-yellow-400" />,
      "Partly Cloudy": <Cloud size={24} className="text-gray-400" />,
      "Hot & Dry": <Thermometer size={24} className="text-red-400" />
    };
    return icons[condition] || <Cloud size={24} className="text-gray-400" />;
  };

  // Currency conversion
  const convertPrice = (price) => {
    const converted = price * exchangeRates[selectedCurrency];
    const symbols = { USD: '$', EUR: '€', GBP: '£', ETB: 'Br' };
    return `${symbols[selectedCurrency]}${converted.toFixed(0)}`;
  };

  // Toggle wishlist
  const toggleWishlist = (destinationId) => {
    setWishlist(prev => 
      prev.includes(destinationId) 
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId]
    );
  };

  // Send chat message
  const sendMessage = () => {
    if (chatInput.trim()) {
      const userMessage = { type: 'user', text: chatInput };
      setChatMessages(prev => [...prev, userMessage]);
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = { 
          type: 'bot', 
          text: `I'd be happy to help you with "${chatInput}"! Based on your interests, I recommend checking out our cultural heritage tours or adventure packages. Would you like more specific information?` 
        };
        setChatMessages(prev => [...prev, aiResponse]);
      }, 1000);
      
      setChatInput('');
    }
  };

  // Enhanced scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Filter destinations based on search and filters
  const filteredDestinations = featuredDestinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || dest.badge === activeCategory;
    const matchesPrice = dest.price >= priceRange[0] && dest.price <= priceRange[1];
    const matchesDuration = selectedDuration === 'all' || dest.duration.includes(selectedDuration);
    
    return matchesSearch && matchesCategory && matchesPrice && matchesDuration;
  });

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-[#1A1C1E] selection:bg-[#007a64] selection:text-white overflow-x-hidden">
      
      {/* Enhanced Dynamic Glass Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-700 ${isScrolled ? 'bg-white/90 backdrop-blur-2xl py-4 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border-b border-stone-100' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 transform group-hover:rotate-12 ${isScrolled ? 'bg-[#007a64] text-white shadow-lg shadow-emerald-900/20' : 'bg-white/10 text-white backdrop-blur-xl border border-white/20'}`}>
                <Globe size={20} />
            </div>
            <div className="flex flex-col">
              <span className={`font-black text-xl tracking-tighter leading-none transition-colors ${isScrolled ? 'text-stone-900' : 'text-white'}`}>
                ETHIOPIA <span className="text-[#007a64]">361°</span>
              </span>
              <span className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${isScrolled ? 'text-stone-400' : 'text-white/60'}`}>
                {currentLanguage === 'en' ? 'Land of Origins' : 'የምንጣፍ ሀገር'}
              </span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em]">
            {['Destinations', 'Experiences', 'Heritage', 'Journal'].map((item) => (
              <a key={item} href="#" className={`${isScrolled ? 'text-stone-600' : 'text-white/90'} hover:text-[#007a64] transition-all flex items-center gap-1 group`}>
                {item}
                <ChevronDown size={12} className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-y-0.5" />
              </a>
            ))}
            <div className="h-6 w-px bg-stone-200/20 mx-2" />
            
            {/* Language & Currency Selector */}
            <select 
              value={currentLanguage} 
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className={`text-[10px] font-black uppercase tracking-widest bg-transparent outline-none cursor-pointer ${isScrolled ? 'text-stone-600' : 'text-white/90'}`}
            >
              <option value="en">EN</option>
              <option value="am">አማ</option>
            </select>
            
            <select 
              value={selectedCurrency} 
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className={`text-[10px] font-black uppercase tracking-widest bg-transparent outline-none cursor-pointer ${isScrolled ? 'text-stone-600' : 'text-white/90'}`}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="ETB">ETB</option>
            </select>
            
            <button className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all active:scale-95 flex items-center gap-2 ${isScrolled ? 'bg-[#007a64] text-white shadow-xl shadow-emerald-900/20' : 'bg-white text-stone-900 shadow-2xl'}`}>
              <Star size={14} fill="currentColor" /> MEMBER PORTAL
            </button>
          </div>

          <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
            <div className={`p-2 rounded-lg ${isScrolled ? 'text-stone-900' : 'text-white bg-white/10 backdrop-blur-md'}`}>
              <Menu size={24} />
            </div>
          </button>
        </div>
      </nav>

      {/* Enhanced Cinematic Hero */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#FDFCFB] z-10" />
          <img 
            src={heroSlides[0].url} 
            className="w-full h-full object-cover scale-105 animate-[slow-zoom_40s_linear_infinite]"
            alt="Ethiopia Landscape"
          />
        </div>

        <div className="relative z-20 text-center px-6 max-w-6xl text-white">
          <div className="relative mb-8">
             <h1 className="text-[140px] md:text-[280px] font-black absolute -top-32 md:-top-56 left-1/2 -translate-x-1/2 w-full select-none tracking-[0.15em] pointer-events-none opacity-20" style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>
               {heroSlides[0].location}
             </h1>
             <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in">
                <div className="h-px w-12 bg-emerald-400" />
                <span className="text-emerald-400 font-black tracking-[0.5em] uppercase text-[10px]">Premium Exploration</span>
                <div className="h-px w-12 bg-emerald-400" />
             </div>
             <h2 className="text-6xl md:text-[110px] font-serif font-bold relative z-10 drop-shadow-2xl leading-[0.85] tracking-tight">
               {currentLanguage === 'en' ? 'Land' : 'ሀገር'} <br/> {currentLanguage === 'en' ? 'of Origins' : 'እናምንጣፍ'}
             </h2>
          </div>
          <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed text-white/80 drop-shadow-md">
            {currentLanguage === 'en' ? heroSlides[0].subtitle : "በኢትዮጵያ ውስጥ ያለውን 361ኛው ደረጃ ተልሞ። የሮማዊው ታሪክ ከዘመነዊው ኢትዮጵያ ጋር ይገናኛል።"}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button className="group relative px-12 py-5 bg-[#007a64] text-white rounded-2xl font-black text-xs tracking-widest flex items-center gap-3 transition-all hover:bg-emerald-700 shadow-[0_20px_50px_rgba(0,122,100,0.3)] active:scale-95">
                {currentLanguage === 'en' ? 'EXPLORE DESTINATIONS' : 'መዳረሻዎችን ያግኙ'}
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={() => setShowVirtualTour(heroSlides[0].virtualTour)}
              className="flex items-center gap-4 text-white font-black text-[10px] tracking-widest group"
            >
                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-stone-900 transition-all duration-500 backdrop-blur-md">
                    <Play size={18} fill="currentColor" />
                </div>
                {currentLanguage === 'en' ? 'WATCH THE FILM' : 'ፊልሙን ይመልከቱ'}
            </button>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-50">
           <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
           <span className="text-white text-[8px] font-black uppercase tracking-[0.4em]">{currentLanguage === 'en' ? 'Scroll' : 'ይሸበል'}</span>
        </div>
      </header>

      {/* Advanced Search & Filters Section */}
      <section className="py-16 px-6 bg-stone-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input
                type="text"
                placeholder={currentLanguage === 'en' ? 'Search destinations, activities...' : 'መዳረሻዎች፣ እንቅስቃሴዎችን ይፈልግ...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-stone-200 focus:border-[#007a64] focus:outline-none focus:ring-4 ring-emerald-50 transition-all"
              />
            </div>
            
            {/* Price Range Filter */}
            <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-stone-200">
              <DollarSign size={20} className="text-stone-400" />
              <input
                type="range"
                min="0"
                max="5000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-32"
              />
              <span className="text-sm font-bold text-stone-600">{convertPrice(priceRange[1])}</span>
            </div>
            
            {/* Duration Filter */}
            <select 
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="px-6 py-4 bg-white rounded-2xl border border-stone-200 focus:border-[#007a64] focus:outline-none font-bold text-sm"
            >
              <option value="all">All Durations</option>
              <option value="3">3 days</option>
              <option value="5">5 days</option>
              <option value="7">7+ days</option>
            </select>
            
            <button className="px-6 py-4 bg-stone-900 text-white rounded-2xl font-black text-sm hover:bg-stone-800 transition-all flex items-center gap-2">
              <Filter size={16} />
              {currentLanguage === 'en' ? 'More Filters' : 'ተጨማሪ ማጣሪያዎች'}
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Discovery Hub */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-0.5 bg-[#007a64]" />
                <span className="text-[#007a64] font-black tracking-[0.3em] uppercase text-[10px]">
                  {currentLanguage === 'en' ? 'The Collection' : 'ስብስቦቹ'}
                </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter leading-tight">
              {currentLanguage === 'en' ? 'Extraordinary' : 'የሚያምር'} <br/> {currentLanguage === 'en' ? 'Destinations' : 'መዳረሻዎች'}
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {['All', 'History', 'Nature', 'Adventure'].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-stone-900 text-white shadow-2xl' : 'bg-stone-100 text-stone-400 hover:bg-stone-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {filteredDestinations.map((place) => (
            <div key={place.id} className="group relative bg-white p-4 rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.03)] hover:shadow-[0_50px_120px_rgba(0,0,0,0.08)] transition-all duration-700 border border-stone-100/50">
              <div className="relative h-[420px] overflow-hidden rounded-[32px]">
                <img 
                  src={place.image} 
                  alt={place.name}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
                
                {/* Enhanced Overlay with Quick Actions */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                    <div className="bg-white/90 backdrop-blur-md text-stone-900 text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest self-start">
                        {place.badge}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <button 
                          onClick={() => toggleWishlist(place.id)}
                          className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-900 hover:bg-white transition-all"
                        >
                          <Heart size={16} fill={wishlist.includes(place.id) ? "currentColor" : "none"} />
                        </button>
                        <button 
                          onClick={() => setShowVirtualTour(place.virtualTour)}
                          className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-900 hover:bg-white transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => setSelectedDestination(place)}
                          className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-900 hover:bg-white transition-all"
                        >
                          <Share2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-1 mb-2">
                        {[1,2,3,4,5].map(i => <Star key={i} size={10} fill={i <= Math.floor(place.rating) ? "#fcc419" : "none"} className="text-[#fcc419]" />)}
                        <span className="text-white/60 text-xs ml-2">({place.reviews.length} reviews)</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                      {currentLanguage === 'en' ? place.name : place.name_am}
                    </h3>
                    <p className="text-white/80 text-sm mb-4 line-clamp-2">
                      {currentLanguage === 'en' ? place.desc : place.desc_am}
                    </p>
                    <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                        <span className="text-white text-sm font-bold">{convertPrice(place.price)}</span>
                        <div className="flex gap-2">
                            <button 
                              onClick={() => setShowReviews(place)}
                              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                            >
                              <MessageCircle size={14} />
                            </button>
                            <button 
                              onClick={() => setShowWeather(!showWeather)}
                              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                            >
                              <Cloud size={14} />
                            </button>
                            <button 
                              onClick={() => setShowBookingModal(place)}
                              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#007a64] shadow-xl hover:scale-110 transition-all"
                            >
                              <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
              </div>
              
              {/* Weather Widget */}
              {showWeather && (
                <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getWeatherIcon(place.weather.condition)}
                      <div>
                        <p className="text-sm font-bold text-stone-900">{place.weather.temp}°C</p>
                        <p className="text-xs text-stone-500">{place.weather.condition}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-stone-500">Humidity: {place.weather.humidity}%</p>
                      <p className="text-xs text-stone-500">Wind: {place.weather.wind} km/h</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-32 px-6 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8">
              {currentLanguage === 'en' ? 'Interactive Map' : 'ይንቀሳቀስ የሚቻል ካርታ'}
            </h2>
            <p className="text-xl text-stone-400 max-w-3xl mx-auto">
              {currentLanguage === 'en' ? 'Explore Ethiopia\'s destinations on our interactive map. Click on markers to discover more about each location.' : 'የኢትዮጵያን መዳረሻዎች በይንቀሳቀስ የሚቻል ካርታዎ ላይ ይመልከቱ። ምልክቶችን ይጫኑ ለእያንዳንዱ ቦታ ተጨማማቪ ይምረፉ።'}
            </p>
          </div>
          
          {/* Map Placeholder */}
          <div className="relative h-[600px] bg-stone-800 rounded-[40px] overflow-hidden border border-stone-700">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Map size={64} className="mx-auto mb-4 text-stone-600" />
                <p className="text-stone-400 mb-4">Interactive Map Loading...</p>
                <p className="text-sm text-stone-500">In production: Google Maps integration with destination markers</p>
              </div>
            </div>
            
            {/* Destination Markers */}
            {featuredDestinations.map((dest, index) => (
              <div 
                key={dest.id}
                className="absolute w-4 h-4 bg-[#007a64] rounded-full cursor-pointer hover:scale-150 transition-all shadow-lg shadow-emerald-500/50"
                style={{
                  top: `${30 + index * 20}%`,
                  left: `${20 + index * 25}%`
                }}
                onClick={() => setSelectedDestination(dest)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBookingModal(null)} />
          <div className="relative bg-white rounded-[40px] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <button 
              onClick={() => setShowBookingModal(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center hover:bg-stone-200 transition-all"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-3xl font-serif font-bold mb-6">
              {currentLanguage === 'en' ? 'Book Your Journey' : 'ጉዞዎን ይቀበዙ'}
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  {currentLanguage === 'en' ? 'Select Date' : 'ቀን ይምረጡ'}
                </label>
                <input type="date" className="w-full p-4 border border-stone-200 rounded-2xl focus:border-[#007a64] focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  {currentLanguage === 'en' ? 'Number of Travelers' : 'ተጓዘኞች ብዛት'}
                </label>
                <select className="w-full p-4 border border-stone-200 rounded-2xl focus:border-[#007a64] focus:outline-none">
                  <option>1 Traveler</option>
                  <option>2 Travelers</option>
                  <option>3-5 Travelers</option>
                  <option>6+ Travelers</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  {currentLanguage === 'en' ? 'Special Requests' : 'ልዩ ጥያቄዎች'}
                </label>
                <textarea 
                  rows={4}
                  className="w-full p-4 border border-stone-200 rounded-2xl focus:border-[#007a64] focus:outline-none"
                  placeholder={currentLanguage === 'en' ? 'Any special requirements or preferences...' : 'ማንኛውም ልዩ ፍላጎቶች ወይም ምርጫዎች...'}
                />
              </div>
              
              <div className="bg-stone-50 p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-stone-700">{currentLanguage === 'en' ? 'Total Price' : 'የጠቅላላ ዋጋ'}</span>
                  <span className="text-2xl font-black text-[#007a64]">{convertPrice(showBookingModal.price)}</span>
                </div>
                <button className="w-full bg-[#007a64] text-white py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all">
                  {currentLanguage === 'en' ? 'Confirm Booking' : 'ብልሽክን ያረጋግጡ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Virtual Tour Modal */}
      {showVirtualTour && (
        <div className={`fixed inset-0 z-50 ${isVirtualTourFullscreen ? 'bg-black' : 'bg-black/90'}`}>
          <div className="relative h-full flex items-center justify-center">
            <button 
              onClick={() => {
                setShowVirtualTour(null);
                setIsVirtualTourFullscreen(false);
                setIsMuted(false);
                setIsPaused(false);
              }}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <X size={24} />
            </button>
            
            {/* Virtual Tour Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-full px-6 py-3">
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
              >
                {isPaused ? <Play size={20} /> : <Pause size={20} />}
              </button>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <button 
                onClick={() => setIsVirtualTourFullscreen(!isVirtualTourFullscreen)}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
              >
                {isVirtualTourFullscreen ? <RotateCw size={20} /> : <Maximize2 size={20} />}
              </button>
            </div>
            
            {/* Virtual Tour Content */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <CameraOff size={64} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-2xl font-bold mb-2">Virtual Tour: {showVirtualTour}</h3>
                <p className="text-stone-400 mb-4">
                  {currentLanguage === 'en' 
                    ? '360° virtual tour would load here with interactive hotspots'
                    : '360° የሚይንቀሳቀስ ጉዞ እዚህ ላይ በንቃዊ ነጥቦች ይጭናል'
                  }
                </p>
                <p className="text-sm text-stone-500">
                  {currentLanguage === 'en' 
                    ? 'In production: Matterport or similar 360° tour integration'
                    : 'በምርት ላይ: Matterport ወይም ተመሳሳይ 360° ጉዞ አገናኝ'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {showReviews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowReviews(null)} />
          <div className="relative bg-white rounded-[40px] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <button 
              onClick={() => setShowReviews(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center hover:bg-stone-200 transition-all"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-3xl font-serif font-bold mb-6">
              {currentLanguage === 'en' ? 'Traveler Reviews' : 'የተጓዘኞች ግምገማዎች'}
            </h3>
            
            <div className="space-y-6">
              {showReviews.reviews.map((review, index) => (
                <div key={index} className="border-b border-stone-100 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-stone-600">{review.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-bold text-stone-900">{review.name}</p>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={12} fill={i <= review.rating ? "#fcc419" : "none"} className="text-[#fcc419]" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-stone-500">{review.date}</span>
                  </div>
                  <p className="text-stone-700">{review.comment}</p>
                </div>
              ))}
              
              <button className="w-full bg-stone-100 text-stone-700 py-3 rounded-2xl font-bold hover:bg-stone-200 transition-all">
                {currentLanguage === 'en' ? 'Load More Reviews' : 'ተጨማማቪ ግምገማዎችን ይምረጡ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Travel Assistant Chat */}
      <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${showChat ? 'translate-y-0' : 'translate-y-0'}`}>
        {!showChat && (
          <button 
            onClick={() => setShowChat(true)}
            className="w-16 h-16 bg-stone-900 text-white rounded-[30px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#007a64] to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <MessageCircle size={28} className="relative z-10" />
          </button>
        )}
        
        {showChat && (
          <div className="bg-white rounded-[30px] shadow-2xl w-96 h-[500px] flex flex-col border border-stone-200">
            <div className="bg-[#007a64] text-white p-4 rounded-t-[30px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="font-bold">AI Travel Assistant</p>
                  <p className="text-xs opacity-80">Always here to help</p>
                </div>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-[#007a64] text-white' 
                      : 'bg-stone-100 text-stone-700'
                  }`}>
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            <div className="p-4 border-t border-stone-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about Ethiopia..."
                  className="flex-1 p-3 bg-stone-100 rounded-2xl focus:outline-none focus:ring-2 ring-emerald-500 text-sm"
                />
                <button 
                  onClick={sendMessage}
                  className="w-12 h-12 bg-[#007a64] text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Footer with Additional Features */}
      <footer className="bg-white pt-40 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-32">
                <div className="md:col-span-5">
                    <h4 className="text-4xl font-black text-stone-900 tracking-tighter mb-8">ETHIOPIA <span className="text-[#007a64]">361°</span></h4>
                    <p className="text-stone-400 text-lg leading-relaxed mb-12 max-w-md font-medium">
                        {currentLanguage === 'en' 
                          ? 'Redefining the landscape of luxury travel in the Horn of Africa. Deep heritage, silent luxury, and unparalleled access.'
                          : 'በቀረበኛው አፍሪካ ውስጥ የሽንግልና ጉዞ መልክያን በመቀየር ላይ። ጥልቅ ቅርስ፣ የምናም ሽንግልና እና ያለመሳሰብ መዳረሻ።'
                        }
                    </p>
                    <div className="flex gap-4 mb-8">
                        {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 rounded-2xl border border-stone-100 flex items-center justify-center text-stone-400 hover:bg-stone-900 hover:text-white transition-all">
                                <Icon size={20} />
                            </a>
                        ))}
                    </div>
                    
                    {/* Currency & Language Selector */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Globe2 size={16} className="text-stone-400" />
                            <select 
                              value={currentLanguage} 
                              onChange={(e) => setCurrentLanguage(e.target.value)}
                              className="text-sm font-bold text-stone-600 bg-transparent outline-none cursor-pointer"
                            >
                              <option value="en">English</option>
                              <option value="am">አማርኛ</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <DollarSign size={16} className="text-stone-400" />
                            <select 
                              value={selectedCurrency} 
                              onChange={(e) => setSelectedCurrency(e.target.value)}
                              className="text-sm font-bold text-stone-600 bg-transparent outline-none cursor-pointer"
                            >
                              <option value="USD">USD ($)</option>
                              <option value="EUR">EUR (€)</option>
                              <option value="ETB">ETB (Br)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <h5 className="font-black text-[10px] uppercase tracking-[0.3em] text-stone-300 mb-10">
                      {currentLanguage === 'en' ? 'Navigation' : 'አቅርጦት'}
                    </h5>
                    <ul className="space-y-6 text-stone-600 text-[13px] font-bold">
                        <li><a href="#" className="hover:text-[#007a64] transition-colors">
                          {currentLanguage === 'en' ? 'Destinations' : 'መዳረሻዎች'}
                        </a></li>
                        <li><a href="#" className="hover:text-[#007a64] transition-colors">
                          {currentLanguage === 'en' ? 'Our Ethos' : 'የእኛ ፍልስፍና'}
                        </a></li>
                        <li><a href="#" className="hover:text-[#007a64] transition-colors">
                          {currentLanguage === 'en' ? 'Private Jet' : 'የግል አየር ፕሌን'}
                        </a></li>
                        <li><a href="#" className="hover:text-[#007a64] transition-colors">
                          {currentLanguage === 'en' ? 'Press Kit' : 'የሚዲያ ኪት'}
                        </a></li>
                    </ul>
                </div>

                <div className="md:col-span-5 flex flex-col items-end">
                    <div className="w-full bg-stone-50 p-12 rounded-[48px] border border-stone-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Zap className="text-[#007a64]" size={20} />
                            <h4 className="font-black text-sm uppercase tracking-widest">
                              {currentLanguage === 'en' ? 'Join the Circle' : 'ክብሩን ይቀላቀሉ'}
                            </h4>
                        </div>
                        <p className="text-stone-400 text-sm mb-8 leading-relaxed">
                          {currentLanguage === 'en' 
                            ? 'Sign up for secret route launches and heritage alerts. No spam, only discovery.'
                            : 'ለሚስጥር የመንገድ መስመራት እና የቅርስ ማሳሰቢያዎች ይመዝገቡ። ስፓም የለም፣ መፍለጂያ ብቻ።'
                          }
                        </p>
                        <div className="relative">
                            <input 
                              type="email" 
                              placeholder={currentLanguage === 'en' ? 'Email Address' : 'ኢሜይል አድራሻ'}
                              className="w-full bg-white border border-stone-100 rounded-2xl py-5 px-8 text-sm font-bold outline-none focus:ring-4 ring-emerald-50 transition-all" 
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-stone-900 text-white px-8 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#007a64] transition-all">
                              {currentLanguage === 'en' ? 'Join' : 'ይቀላቀሉ'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="pt-12 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-stone-400 font-black uppercase tracking-[0.3em]">
                <span>© 2026 ETHIOPIA 361 GROUP. ALL RIGHTS RESERVED.</span>
                <div className="flex gap-12">
                    <a href="#" className="hover:text-stone-900 transition-colors">
                      {currentLanguage === 'en' ? 'Privacy' : 'ግላግላነት'}
                    </a>
                    <a href="#" className="hover:text-stone-900 transition-colors">
                      {currentLanguage === 'en' ? 'Terms' : 'ውልዋዎች'}
                    </a>
                    <a href="#" className="hover:text-stone-900 transition-colors">
                      {currentLanguage === 'en' ? 'Legal' : 'ህጋዊ'}
                    </a>
                </div>
            </div>
        </div>
      </footer>

      {/* Enhanced CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        html {
          scroll-behavior: smooth;
        }
        body {
            -webkit-font-smoothing: antialiased;
            background-color: #FDFCFB;
        }
        ::selection {
            background-color: #007a64;
            color: white;
        }
      `}} />

    </div>
  );
};

export default App;
