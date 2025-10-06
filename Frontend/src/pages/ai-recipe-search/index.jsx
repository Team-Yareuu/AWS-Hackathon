import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import SearchInterface from './components/SearchInterface';
import SearchResults from './components/SearchResults';
import AIInsights from './components/AIInsights';
import { recipeAPI } from '../../services/api';

const AIRecipeSearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [searchMode, setSearchMode] = useState('search');
  const [hasSearched, setHasSearched] = useState(false);
  const handleSearchRef = useRef(null);
  const consumedQueryRef = useRef('');
  const locationStateQuery = location?.state?.searchQuery;
  const locationPathname = location?.pathname;

  const parseBudgetFromQuery = (query) => {
    if (!query) {
      return null;
    }
    const normalized = query.toLowerCase();
    const match = normalized.match(/(\d{1,3}(?:[.,]\d{3})+|\d+)\s*(rb|ribu|k)?/);
    if (!match) {
      return null;
    }
    const numericValue = Number(match[1].replace(/[^\d]/g, ''));
    if (!Number.isFinite(numericValue)) {
      return null;
    }
    const suffix = match[2];
    if (suffix === 'rb' || suffix === 'ribu' || suffix === 'k') {
      return numericValue * 1000;
    }
    if (normalized.includes('rb') && numericValue < 1000) {
      return numericValue * 1000;
    }
    return numericValue;
  };

  const parseTimeFromQuery = (query) => {
    if (!query) {
      return null;
    }
    const normalized = query.toLowerCase();
    const match = normalized.match(/(\d+(?:[.,]\d+)?)\s*(menit|mnt|minute|jam|hours?)/);
    if (!match) {
      return null;
    }
    const numericValue = Number(match[1].replace(',', '.'));
    if (!Number.isFinite(numericValue)) {
      return null;
    }
    const unit = match[2];
    return unit?.includes('jam') || unit?.includes('hour')
      ? Math.round(numericValue * 60)
      : Math.round(numericValue);
  };

  // API-based search function
  const handleSearch = async (query) => {
    if (searchMode !== 'search') {
      return;
    }

    const trimmedQuery = query?.trim();

    if (!trimmedQuery) {
      setSearchQuery('');
      setSearchResults([]);
      setHasSearched(false);
      setSearchMode('search');
      return;
    }

    setSearchQuery(trimmedQuery);
    setIsLoading(true);
    setHasSearched(true);

    try {
      // Call the AI search API
      const results = await recipeAPI.aiSearch({
        query: trimmedQuery,
        budget: parseBudgetFromQuery(trimmedQuery),
        maxTime: parseTimeFromQuery(trimmedQuery),
        sortBy: sortBy
      });

      // Transform data to match frontend format
      const formattedResults = results.map(recipe => ({
        ...recipe,
        // Convert cookingTimeMinutes to readable format
        cookingTime: recipe.cookingTimeMinutes >= 60 
          ? `${Math.floor(recipe.cookingTimeMinutes / 60)} jam ${recipe.cookingTimeMinutes % 60 > 0 ? `${recipe.cookingTimeMinutes % 60} menit` : ''}`
          : `${recipe.cookingTimeMinutes} menit`,
        // Use region as cultural
        cultural: recipe.region || recipe.cultural,
        // Default rating if not available
        rating: recipe.rating || 4.5,
        reviews: recipe.reviews || 0,
        // Add aiGenerated flag based on isNew
        aiGenerated: recipe.isNew || false,
        // Format description
        description: recipe.shortDescription || recipe.description
      }));

      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Search failed:', error);
      // Show error or empty results
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (nextMode) => {
    if (nextMode === 'chat' && !hasSearched) {
      return;
    }

    setSearchMode(nextMode);

    if (nextMode === 'chat') {
      setIsLoading(false);
    }
  };
  
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    if (!hasSearched || !searchQuery) {
      return;
    }
    // Re-search with new sort order
    handleSearch(searchQuery);
  };

  useEffect(() => {
    handleSearchRef.current = handleSearch;
  }, [searchMode, sortBy]); // Update when searchMode or sortBy changes

  useEffect(() => {
    const normalizedQuery = locationStateQuery?.trim();
    if (!normalizedQuery || consumedQueryRef.current === normalizedQuery) {
      return;
    }

    consumedQueryRef.current = normalizedQuery;
    if (searchMode !== 'search') {
      setSearchMode('search');
    }
    handleSearchRef.current?.(normalizedQuery);
    navigate(locationPathname, { replace: true, state: {} });
  }, [locationStateQuery, locationPathname, navigate, searchMode]);

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

            <div className="space-y-8">
              {/* Main Content */}
              <div className="space-y-2">
                {/* Search Interface */}
                <SearchInterface
                  mode={searchMode}
                  hasSearched={hasSearched}
                  onModeChange={handleModeChange}
                  onSearch={handleSearch}
                  isLoading={isLoading}
                  initialQuery={searchQuery}
                />


                {/* AI Insights - Show after search */}
                {searchMode === 'search' && hasSearched && searchResults?.length > 0 && (
                  <AIInsights
                    searchQuery={searchQuery}
                    results={searchResults}
                  />
                )}

                {/* Search Results */}
                {searchMode === 'search' && hasSearched && (
                  <SearchResults
                    results={searchResults}
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                  />
                )}

                {/* Getting Started Guide - Show when no search performed */}
                {searchMode === 'search' && !hasSearched && (
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
                            <li>• Eksperimen dengan kata kunci detail (misal "budget 50rb", "tanpa santan")</li>
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