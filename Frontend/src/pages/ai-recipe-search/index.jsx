import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SearchInterface from './components/SearchInterface';
import FilterSidebar from './components/FilterSidebar';
import SearchResults from './components/SearchResults';
import SavedSearches from './components/SavedSearches';
import AIInsights from './components/AIInsights';

const AIRecipeSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({});
  const [hasSearched, setHasSearched] = useState(false);

  // Mock recipe data
  const mockRecipes = [
    {
      id: 1,
      name: "Rendang Daging Sapi Tradisional",
      description: "Rendang autentik Minangkabau dengan bumbu rempah lengkap dan santan kental. Dimasak dengan teknik tradisional hingga bumbu meresap sempurna.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 234,
      cookingTime: "3 jam",
      difficulty: "hard",
      estimatedCost: 85000,
      servings: 6,
      cultural: "Minang",
      aiGenerated: false,
      tags: ["Tradisional", "Pedas", "Protein", "Santan", "Rempah"]
    },
    {
      id: 2,
      name: "Gado-Gado Jakarta Komplit",
      description: "Salad sayuran segar khas Betawi dengan bumbu kacang yang gurih dan lontong sebagai pelengkap. Cocok untuk vegetarian.",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 189,
      cookingTime: "45 menit",
      difficulty: "easy",
      estimatedCost: 35000,
      servings: 4,
      cultural: "Betawi",
      aiGenerated: true,
      tags: ["Vegetarian", "Sehat", "Segar", "Kacang", "Sayuran"]
    },
    {
      id: 3,
      name: "Soto Ayam Lamongan",
      description: "Soto ayam khas Jawa Timur dengan kuah bening yang segar, dilengkapi dengan koya dan sambal yang pedas.",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 156,
      cookingTime: "1.5 jam",
      difficulty: "medium",
      estimatedCost: 45000,
      servings: 5,
      cultural: "Jawa Timur",
      aiGenerated: false,
      tags: ["Sup", "Ayam", "Kuah", "Tradisional", "Hangat"]
    },
    {
      id: 4,
      name: "Nasi Goreng Kampung Spesial",
      description: "Nasi goreng dengan cita rasa kampung yang autentik, menggunakan kecap manis dan cabai rawit untuk rasa yang pas.",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      rating: 4.5,
      reviews: 298,
      cookingTime: "30 menit",
      difficulty: "easy",
      estimatedCost: 25000,
      servings: 3,
      cultural: "Nusantara",
      aiGenerated: true,
      tags: ["Nasi", "Cepat", "Praktis", "Pedas", "Ekonomis"]
    },
    {
      id: 5,
      name: "Gudeg Yogya Khas",
      description: "Gudeg manis khas Yogyakarta dengan nangka muda yang empuk, disajikan dengan ayam kampung dan sambal krecek.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 167,
      cookingTime: "4 jam",
      difficulty: "very-hard",
      estimatedCost: 65000,
      servings: 8,
      cultural: "Yogyakarta",
      aiGenerated: false,
      tags: ["Manis", "Tradisional", "Nangka", "Ayam", "Khas"]
    },
    {
      id: 6,
      name: "Sayur Asem Betawi",
      description: "Sayur asem segar dengan berbagai macam sayuran dan bumbu asam yang menyegarkan, cocok untuk cuaca panas.",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
      rating: 4.4,
      reviews: 123,
      cookingTime: "40 menit",
      difficulty: "easy",
      estimatedCost: 20000,
      servings: 4,
      cultural: "Betawi",
      aiGenerated: true,
      tags: ["Sayuran", "Asam", "Segar", "Sehat", "Murah"]
    }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsLoading(true);
    setHasSearched(true);

    // Simulate API call
    setTimeout(() => {
      // Filter recipes based on query and filters
      let filteredResults = mockRecipes?.filter(recipe => 
        recipe?.name?.toLowerCase()?.includes(query?.toLowerCase()) ||
        recipe?.description?.toLowerCase()?.includes(query?.toLowerCase()) ||
        recipe?.tags?.some(tag => tag?.toLowerCase()?.includes(query?.toLowerCase())) ||
        recipe?.cultural?.toLowerCase()?.includes(query?.toLowerCase())
      );

      // Apply additional filters
      if (filters?.budget?.length) {
        filteredResults = filteredResults?.filter(recipe => {
          return filters?.budget?.some(budgetRange => {
            const [min, max] = budgetRange?.split('-')?.map(Number);
            if (budgetRange?.includes('+')) {
              return recipe?.estimatedCost >= min;
            }
            return recipe?.estimatedCost >= min && recipe?.estimatedCost <= max;
          });
        });
      }

      if (filters?.difficulty?.length) {
        filteredResults = filteredResults?.filter(recipe => 
          filters?.difficulty?.includes(recipe?.difficulty)
        );
      }

      if (filters?.cuisine?.length) {
        filteredResults = filteredResults?.filter(recipe => 
          filters?.cuisine?.some(cuisine => 
            recipe?.cultural?.toLowerCase()?.includes(cuisine) ||
            recipe?.tags?.some(tag => tag?.toLowerCase()?.includes(cuisine))
          )
        );
      }

      switch (sortBy) {
        case 'rating':
          filteredResults?.sort((a, b) => b?.rating - a?.rating);
          break;
        case 'time':
          filteredResults?.sort((a, b) => {
            const timeA = parseInt(a?.cookingTime);
            const timeB = parseInt(b?.cookingTime);
            return timeA - timeB;
          });
          break;
        case 'budget':
          filteredResults?.sort((a, b) => a?.estimatedCost - b?.estimatedCost);
          break;
        case 'difficulty':
          const difficultyOrder = ['very-easy', 'easy', 'medium', 'hard', 'very-hard'];
          filteredResults?.sort((a, b) => 
            difficultyOrder?.indexOf(a?.difficulty) - difficultyOrder?.indexOf(b?.difficulty)
          );
          break;
        default:
          break;
      }

      setSearchResults(filteredResults);
      setIsLoading(false);
    }, 1500);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    if (hasSearched) {
      handleSearch(searchQuery);
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    if (hasSearched) {
      handleSearch(searchQuery);
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    if (hasSearched) {
      handleSearch(searchQuery);
    }
  };

  const handleSavedSearchSelect = (query, savedFilters) => {
    setFilters(savedFilters);
    handleSearch(query);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters)?.reduce((count, filterArray) => {
      if (Array.isArray(filterArray)) {
        return count + filterArray?.length;
      } else if (typeof filterArray === 'object' && filterArray !== null) {
        return count + Object.values(filterArray)?.filter(Boolean)?.length;
      }
      return count;
    }, 0);
  };

  return (
    <>
      <Helmet>
        <title>AI Recipe Search - Cari Resep Cerdas | AI Resepku</title>
        <meta name="description" content="Temukan resep Indonesia terbaik dengan teknologi AI. Cari berdasarkan bahan, budget, waktu memasak, dan preferensi diet Anda." />
        <meta name="keywords" content="resep indonesia, ai recipe search, cari resep, masakan indonesia, resep tradisional" />
        <meta property="og:title" content="AI Recipe Search - Cari Resep Cerdas | AI Resepku" />
        <meta property="og:description" content="Platform pencarian resep Indonesia dengan teknologi AI yang memahami preferensi dan kebutuhan kuliner Anda." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Icon name="Search" size={32} className="text-primary" />
                </div>
                <div className="p-3 bg-accent/10 rounded-full">
                  <Icon name="Brain" size={32} className="text-accent" />
                </div>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Pencarian Resep <span className="text-primary">Cerdas AI</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Temukan resep Indonesia yang sempurna dengan bantuan kecerdasan buatan. 
                Cari berdasarkan bahan, budget, waktu, atau ceritakan keinginan Anda.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filter Sidebar */}
              <div className="lg:w-80 flex-shrink-0">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-4">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Filter"
                    iconPosition="left"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    Filter Pencarian
                    {getActiveFilterCount() > 0 && (
                      <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs">
                        {getActiveFilterCount()}
                      </span>
                    )}
                  </Button>
                </div>

                <FilterSidebar
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
              </div>

              {/* Main Content */}
              <div className="flex-1 space-y-8">
                {/* Search Interface */}
                <SearchInterface
                  onSearch={handleSearch}
                  isLoading={isLoading}
                />

                {/* Saved Searches - Show when no search has been performed */}
                {!hasSearched && (
                  <SavedSearches
                    onSearchSelect={handleSavedSearchSelect}
                  />
                )}

                {/* AI Insights - Show after search */}
                {hasSearched && searchResults?.length > 0 && (
                  <AIInsights
                    searchQuery={searchQuery}
                    results={searchResults}
                    filters={filters}
                  />
                )}

                {/* Search Results */}
                {hasSearched && (
                  <SearchResults
                    results={searchResults}
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                  />
                )}

                {/* Getting Started Guide - Show when no search performed */}
                {!hasSearched && (
                  <div className="bg-card rounded-xl p-8 border border-border">
                    <div className="text-center mb-6">
                      <Icon name="Compass" size={48} className="text-primary mx-auto mb-4" />
                      <h2 className="text-2xl font-semibold text-foreground mb-2">
                        Panduan Pencarian AI
                      </h2>
                      <p className="text-muted-foreground">
                        Maksimalkan pengalaman pencarian resep Anda dengan tips berikut
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="text-center p-4">
                        <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-3">
                          <Icon name="MessageSquare" size={24} className="text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">Pencarian Natural</h3>
                        <p className="text-sm text-muted-foreground">
                          Gunakan bahasa sehari-hari: "Masakan untuk 4 orang dengan budget 50rb"
                        </p>
                      </div>

                      <div className="text-center p-4">
                        <div className="p-3 bg-accent/10 rounded-full w-fit mx-auto mb-3">
                          <Icon name="Camera" size={24} className="text-accent" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">Pencarian Visual</h3>
                        <p className="text-sm text-muted-foreground">
                          Upload foto bahan yang tersedia untuk mendapat rekomendasi resep
                        </p>
                      </div>

                      <div className="text-center p-4">
                        <div className="p-3 bg-success/10 rounded-full w-fit mx-auto mb-3">
                          <Icon name="Mic" size={24} className="text-success" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">Pencarian Suara</h3>
                        <p className="text-sm text-muted-foreground">
                          Gunakan perintah suara saat tangan Anda sibuk memasak
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-gradient-to-r from-turmeric/10 to-cinnamon/10 rounded-lg border border-turmeric/20">
                      <div className="flex items-start space-x-3">
                        <Icon name="Lightbulb" size={20} className="text-turmeric mt-0.5" />
                        <div>
                          <h4 className="font-medium text-foreground mb-1">Pro Tips</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Sebutkan jumlah porsi untuk rekomendasi yang lebih akurat</li>
                            <li>• Tambahkan preferensi diet (vegetarian, halal, keto) dalam pencarian</li>
                            <li>• Gunakan nama daerah untuk resep tradisional (Padang, Jawa, Bali)</li>
                            <li>• Kombinasikan filter untuk hasil yang lebih spesifik</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Cultural Trust Signal */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="trust-signal">
                <Icon name="Shield" size={16} className="text-success" />
                <span>Resep Terverifikasi</span>
              </div>
              <div className="trust-signal">
                <Icon name="Users" size={16} className="text-primary" />
                <span>10,000+ Keluarga Indonesia</span>
              </div>
              <div className="trust-signal">
                <Icon name="Star" size={16} className="text-warning" />
                <span>Rating 4.8/5</span>
              </div>
              <div className="trust-signal">
                <Icon name="Clock" size={16} className="text-accent" />
                <span>Update Harian</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIRecipeSearchPage;