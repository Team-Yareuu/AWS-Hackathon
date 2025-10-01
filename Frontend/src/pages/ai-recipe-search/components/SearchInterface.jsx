import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SearchInterface = ({ onSearch, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isImageSearch, setIsImageSearch] = useState(false);
  const fileInputRef = useRef(null);

  const searchSuggestions = [
    "Rendang dengan bumbu tradisional",
    "Masakan vegetarian untuk keluarga",
    "Resep dengan budget Rp 50.000",
    "Makanan penutup khas Jawa",
    "Sup ayam untuk orang sakit",
    "Camilan sehat untuk anak"
  ];

  const quickFilters = [
    { label: "< 30 menit", icon: "Clock", value: "quick" },
    { label: "Budget < 50rb", icon: "Wallet", value: "budget" },
    { label: "Vegetarian", icon: "Leaf", value: "vegetarian" },
    { label: "Tradisional", icon: "Crown", value: "traditional" },
    { label: "Sehat", icon: "Heart", value: "healthy" },
    { label: "Pedas", icon: "Flame", value: "spicy" }
  ];

  const handleSearch = (query = searchQuery) => {
    if (query?.trim()) {
      onSearch(query?.trim());
    }
  };

  const handleVoiceSearch = () => {
    setIsVoiceActive(true);
    // Mock voice search simulation
    setTimeout(() => {
      const voiceQuery = "Resep nasi goreng kampung";
      setSearchQuery(voiceQuery);
      setIsVoiceActive(false);
      handleSearch(voiceQuery);
    }, 2000);
  };

  const handleImageUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setIsImageSearch(true);
      // Mock image recognition
      setTimeout(() => {
        const recognizedIngredients = "ayam, bawang merah, cabai, tomat";
        setSearchQuery(`Resep dengan bahan: ${recognizedIngredients}`);
        setIsImageSearch(false);
        handleSearch(`Resep dengan bahan: ${recognizedIngredients}`);
      }, 3000);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleQuickFilter = (filterValue) => {
    const filterQueries = {
      quick: "Resep cepat masak dalam 30 menit",
      budget: "Resep hemat budget dibawah 50 ribu",
      vegetarian: "Resep vegetarian Indonesia",
      traditional: "Resep tradisional nusantara",
      healthy: "Resep sehat bergizi",
      spicy: "Resep pedas khas Indonesia"
    };
    
    const query = filterQueries?.[filterValue];
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-cultural border border-border">
      {/* Main Search Bar */}
      <div className="relative mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Cari resep, bahan, atau ceritakan keinginan Anda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            onKeyPress={(e) => e?.key === 'Enter' && handleSearch()}
            className="pr-32 text-base"
            disabled={isLoading || isVoiceActive || isImageSearch}
          />
          
          {/* Search Actions */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            {/* Voice Search */}
            <Button
              variant="ghost"
              size="sm"
              iconName={isVoiceActive ? "Square" : "Mic"}
              onClick={handleVoiceSearch}
              disabled={isLoading || isImageSearch}
              className={`touch-target ${isVoiceActive ? 'text-accent animate-pulse' : ''}`}
              title="Pencarian suara"
            />
            
            {/* Image Search */}
            <Button
              variant="ghost"
              size="sm"
              iconName={isImageSearch ? "Loader2" : "Camera"}
              onClick={() => fileInputRef?.current?.click()}
              disabled={isLoading || isVoiceActive}
              className={`touch-target ${isImageSearch ? 'text-accent animate-spin' : ''}`}
              title="Cari dengan foto"
            />
            
            {/* Search Button */}
            <Button
              variant="default"
              size="sm"
              iconName="Search"
              onClick={() => handleSearch()}
              loading={isLoading}
              disabled={!searchQuery?.trim() || isVoiceActive || isImageSearch}
              className="touch-target"
            />
          </div>
        </div>
        
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
      {/* Status Messages */}
      {isVoiceActive && (
        <div className="mb-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center space-x-2 text-accent">
            <Icon name="Mic" size={16} className="animate-pulse" />
            <span className="text-sm font-medium">Mendengarkan... Silakan berbicara</span>
          </div>
        </div>
      )}
      {isImageSearch && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-2 text-primary">
            <Icon name="Loader2" size={16} className="animate-spin" />
            <span className="text-sm font-medium">Menganalisis gambar... Mengenali bahan-bahan</span>
          </div>
        </div>
      )}
      {/* Quick Filters */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Filter Cepat</h3>
        <div className="flex flex-wrap gap-2">
          {quickFilters?.map((filter) => (
            <Button
              key={filter?.value}
              variant="outline"
              size="sm"
              iconName={filter?.icon}
              iconPosition="left"
              onClick={() => handleQuickFilter(filter?.value)}
              className="text-xs"
            >
              {filter?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Search Suggestions */}
      {!searchQuery && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Saran Pencarian</h3>
          <div className="space-y-2">
            {searchSuggestions?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center space-x-3 w-full p-3 text-left bg-muted/50 hover:bg-muted rounded-lg transition-colors duration-200 group"
              >
                <Icon name="Search" size={16} className="text-muted-foreground group-hover:text-primary" />
                <span className="text-sm text-foreground group-hover:text-primary">{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* AI Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-primary mb-1">Tips Pencarian AI</h4>
            <p className="text-xs text-muted-foreground">
              Coba: "Masakan untuk 4 orang dengan budget 75rb" atau "Resep sehat tanpa santan untuk diet"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;