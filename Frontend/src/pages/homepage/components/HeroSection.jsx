import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon.jsx';
import Image from '../../../components/AppImage.jsx';
import Button from '../../../components/ui/Button.jsx';
import { recipeAPI } from '../../../services/api.js';

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSpotlight, setCurrentSpotlight] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [culturalSpotlights, setCulturalSpotlights] = useState([]);
  const [_isLoading, setIsLoading] = useState(true);

  // Fetch spotlight recipes from API
  useEffect(() => {
    const fetchSpotlightRecipes = async () => {
      try {
        setIsLoading(true);
        const recipes = await recipeAPI.getSpotlight(3);
        
        // Transform API data to match component format
        const transformedRecipes = recipes.map(recipe => ({
          id: recipe.id,
          title: recipe.name,
          subtitle: recipe.culturalStory?.shortStory || `Hidangan Tradisional ${recipe.region}`,
          description: recipe.shortDescription || recipe.description,
          image: recipe.image,
          region: recipe.region,
          cookingTime: recipe.cookingTimeMinutes ? `${Math.floor(recipe.cookingTimeMinutes / 60)} jam ${recipe.cookingTimeMinutes % 60 > 0 ? `${recipe.cookingTimeMinutes % 60} menit` : ''}`.trim() : 'N/A',
          difficulty: recipe.difficulty || 'Sedang',
          budget: recipe.estimatedCost ? `Rp ${recipe.estimatedCost.toLocaleString('id-ID')}` : 'N/A'
        }));
        
        setCulturalSpotlights(transformedRecipes);
      } catch (error) {
        console.error('Failed to fetch spotlight recipes:', error);
        // Fallback to empty array, the carousel will handle it gracefully
        setCulturalSpotlights([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpotlightRecipes();
  }, []);

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
    if (culturalSpotlights.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSpotlight((prev) => (prev + 1) % culturalSpotlights.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [culturalSpotlights]);

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
                        type="button"
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
                Bugdet Smart
              </Button>
              {/* <Button
                variant="outline"
                onClick={() => navigate('/personal-kitchen-dashboard')}
                iconName="ChefHat"
                iconPosition="left"
                className="bg-white/80 backdrop-blur-sm"
              >
                Dapur Saya
              </Button> */}
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
            {culturalSpotlights.length > 0 ? (
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
                      type="button"
                      onClick={() => setCurrentSpotlight(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentSpotlight ? 'bg-white' : 'bg-white/50'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
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
            ) : (
              <div className="relative bg-white rounded-3xl shadow-cultural-lg overflow-hidden p-12 flex items-center justify-center min-h-[500px]">
                <div className="text-center space-y-4">
                  <Icon name="ChefHat" size={48} className="text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Memuat resep spesial untuk Anda...</p>
                </div>
              </div>
            )}
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