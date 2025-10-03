import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSpotlight, setCurrentSpotlight] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const culturalSpotlights = [
    {
      id: 1,
      title: "Rendang Padang Autentik",
      subtitle: "Warisan Kuliner Minangkabau",
      description: "Resep turun temurun dengan bumbu rempah pilihan yang dimasak hingga 8 jam untuk cita rasa yang sempurna",
      image: "https://api.meatguy.id/admin/image/blogs/6cfa140f-ccbc-4580-a4a0-9261b7af9aa9",
      region: "Sumatera Barat",
      cookingTime: "8 jam",
      difficulty: "Menengah",
      budget: "Rp 75.000"
    },
    {
      id: 2,
      title: "Gudeg Jogja Manis",
      subtitle: "Kelezatan Istimewa Yogyakarta",
      description: "Nangka muda yang dimasak dengan santan dan gula jawa, disajikan dengan ayam kampung dan sambal krecek",
      image: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?w=800&h=600&fit=crop",
      region: "Yogyakarta",
      cookingTime: "6 jam",
      difficulty: "Sulit",
      budget: "Rp 65.000"
    },
    {
      id: 3,
      title: "Soto Betawi Khas Jakarta",
      subtitle: "Kehangatan Tradisi Betawi",
      description: "Kuah santan gurih dengan daging sapi dan jeroan, dilengkapi kerupuk dan emping untuk kelezatan maksimal",
      image: "https://img-global.cpcdn.com/recipes/9d3c4827e205db74/1200x630cq80/photo.jpg",
      region: "DKI Jakarta",
      cookingTime: "3 jam",
      difficulty: "Mudah",
      budget: "Rp 45.000"
    }
  ];

  const searchSuggestionsList = [
    "Rendang daging sapi budget 50rb",
    "Masakan pedas untuk keluarga",
    "Resep dengan bahan yang ada di kulkas",
    "Makanan tradisional Jawa Timur",
    "Menu sahur praktis dan bergizi",
    "Olahan ayam untuk 4 orang",
    "Sayuran hijau untuk anak-anak",
    "Dessert Indonesia mudah dibuat"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpotlight((prev) => (prev + 1) % culturalSpotlights?.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    
    if (value?.length > 2) {
      const filtered = searchSuggestionsList?.filter(suggestion =>
        suggestion?.toLowerCase()?.includes(value?.toLowerCase())
      );
      setSearchSuggestions(filtered?.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (query = searchQuery) => {
    if (query?.trim()) {
      navigate('/ai-recipe-search', { state: { searchQuery: query } });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearchSubmit(suggestion);
  };

  const currentRecipe = culturalSpotlights?.[currentSpotlight];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary/5 via-background to-turmeric/5 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 batik-pattern opacity-30"></div>
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
          
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Main Heading */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-primary">
                <Icon name="Sparkles" size={20} />
                <span className="text-sm font-medium uppercase tracking-wide">AI-Powered Culinary Discovery</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight">
                Temukan Resep
                <span className="block text-primary">Indonesia Autentik</span>
                <span className="block text-turmeric">dengan AI</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Jelajahi warisan kuliner Indonesia dengan bantuan kecerdasan buatan. 
                Dari budget terbatas hingga bahan yang tersedia, temukan resep sempurna untuk keluarga Anda.
              </p>
            </div>

            {/* AI Search Bar */}
            <div className="relative max-w-2xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icon name="Search" size={20} className="text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => e?.key === 'Enter' && handleSearchSubmit()}
                  placeholder="Coba: 'Rendang untuk 4 orang budget 50rb' "
                  className="w-full pl-12 pr-4 py-4 text-base bg-white border-2 border-border rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 shadow-cultural"
                />
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSearchSubmit()}
                    className="rounded-xl"
                    iconName="ArrowRight"
                    iconPosition="right"
                  >
                    Cari Resep
                  </Button>
                </div>
              </div>

              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions?.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-cultural-lg z-50">
                  <div className="py-2">
                    {searchSuggestions?.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-muted transition-colors duration-150 flex items-center space-x-3"
                      >
                        <Icon name="Search" size={16} className="text-muted-foreground" />
                        <span className="text-sm">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/cultural-heritage-explorer')}
                iconName="BookOpen"
                iconPosition="left"
                className="bg-white/80 backdrop-blur-sm"
              >
                Jelajahi Budaya
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/smart-shopping-assistant')}
                iconName="ShoppingCart"
                iconPosition="left"
                className="bg-white/80 backdrop-blur-sm"
              >
                Belanja Hemat
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/personal-kitchen-dashboard')}
                iconName="ChefHat"
                iconPosition="left"
                className="bg-white/80 backdrop-blur-sm"
              >
                Dapur Saya
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/50">
              <div className="trust-signal">
                <Icon name="Users" size={16} className="text-success" />
                <span className="font-medium">50,000+ Keluarga</span>
              </div>
              <div className="trust-signal">
                <Icon name="BookOpen" size={16} className="text-primary" />
                <span className="font-medium">2,500+ Resep Autentik</span>
              </div>
              <div className="trust-signal">
                <Icon name="Award" size={16} className="text-turmeric" />
                <span className="font-medium">98% Tingkat Kepuasan</span>
              </div>
            </div>
          </div>

          {/* Right Content - Cultural Spotlight */}
          <div className="relative animate-slide-up">
            <div className="relative bg-white rounded-3xl shadow-cultural-lg overflow-hidden">
              {/* Recipe Image */}
              <div className="relative h-80 sm:h-96 overflow-hidden">
                <Image
                  src={currentRecipe?.image}
                  alt={currentRecipe?.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Region Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-2">
                    <Icon name="MapPin" size={14} className="text-primary" />
                    <span className="text-xs font-medium text-primary">{currentRecipe?.region}</span>
                  </div>
                </div>

                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  {culturalSpotlights?.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSpotlight(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentSpotlight ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Recipe Info */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-heading font-bold text-foreground">
                    {currentRecipe?.title}
                  </h3>
                  <p className="text-primary font-medium">{currentRecipe?.subtitle}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {currentRecipe?.description}
                  </p>
                </div>

                {/* Recipe Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-turmeric mb-1">
                      <Icon name="Clock" size={16} />
                    </div>
                    <p className="text-xs text-muted-foreground">Waktu</p>
                    <p className="text-sm font-medium">{currentRecipe?.cookingTime}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-accent mb-1">
                      <Icon name="BarChart3" size={16} />
                    </div>
                    <p className="text-xs text-muted-foreground">Tingkat</p>
                    <p className="text-sm font-medium">{currentRecipe?.difficulty}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-success mb-1">
                      <Icon name="Wallet" size={16} />
                    </div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-sm font-medium">{currentRecipe?.budget}</p>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  variant="default"
                  fullWidth
                  onClick={() => navigate(`/recipe-detail/${currentRecipe?.id}`, { state: { recipeId: currentRecipe?.id } })}
                  iconName="ChefHat"
                  iconPosition="left"
                  className="mt-4"
                >
                  Lihat Resep Lengkap
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Floating Elements */}
      <div className="absolute top-1/4 right-10 w-20 h-20 bg-turmeric/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse delay-1000"></div>
    </section>
  );
};

export default HeroSection;