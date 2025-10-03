import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import SearchInterface from './components/SearchInterface';
import SearchResults from './components/SearchResults';
import AIInsights from './components/AIInsights';

const AIRecipeSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [searchMode, setSearchMode] = useState('search');
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

  const normalizeText = (value) => value?.toString()?.toLowerCase() ?? '';

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

  const getCookingTimeInMinutes = (timeLabel = '') => {
    const normalized = timeLabel.toLowerCase();
    const match = normalized.match(/(\d+(?:[.,]\d+)?)\s*(jam|menit)/);
    if (!match) {
      return Number.MAX_SAFE_INTEGER;
    }
    const numericValue = Number(match[1].replace(',', '.'));
    if (!Number.isFinite(numericValue)) {
      return Number.MAX_SAFE_INTEGER;
    }
    const unit = match[2];
    return unit === 'jam'
      ? Math.round(numericValue * 60)
      : Math.round(numericValue);
  };

  const difficultyOrder = ['very-easy', 'easy', 'medium', 'hard', 'very-hard'];

  const runAISearchAgent = (query) => {
    if (!query) {
      return [];
    }

    const normalizedQuery = query.toLowerCase();
    const tokens = normalizedQuery
      .replace(/[-_]/g, ' ')
      .split(/[\s,]+/)
      .filter(Boolean);

    const synonymsDictionary = {
      pedas: ['spicy', 'cabai', 'cabe', 'rawit'],
      spicy: ['pedas', 'cabai', 'rawit'],
      sehat: ['healthy', 'bergizi', 'diet'],
      healthy: ['sehat', 'bergizi'],
      cepat: ['kilat', 'praktis', 'quick', 'simple'],
      praktis: ['cepat', 'simple', 'kilat'],
      murah: ['budget', 'hemat', 'ekonomis'],
      budget: ['murah', 'hemat', 'ekonomis'],
      tradisional: ['heritage', 'otentik', 'klasik'],
      vegetarian: ['nabati', 'plant based', 'sayuran'],
      sayur: ['vegetarian', 'nabati'],
      rendang: ['padang', 'daging'],
      gado: ['salad', 'sayur'],
      soto: ['kuah', 'soup', 'kaldu'],
      gudeg: ['nangka', 'yogyakarta'],
      nasi: ['rice'],
      goreng: ['fried'],
      ayam: ['chicken', 'poultry'],
      sup: ['soup', 'kuah'],
      manis: ['sweet', 'dessert'],
      sarapan: ['pagi', 'breakfast']
    };

    const expandedTerms = new Set(tokens);
    tokens.forEach((token) => {
      Object.entries(synonymsDictionary).forEach(([key, values]) => {
        if (token.includes(key) || key.includes(token)) {
          values.forEach((value) => expandedTerms.add(value));
        }
      });
    });

    const budgetLimit = parseBudgetFromQuery(query);
    const timeLimit = parseTimeFromQuery(query);

    const scoredResults = mockRecipes.map((recipe) => {
      const name = normalizeText(recipe?.name);
      const description = normalizeText(recipe?.description);
      const cultural = normalizeText(recipe?.cultural);
      const tags = (recipe?.tags || []).map((tag) => normalizeText(tag));
      const timeInMinutes = getCookingTimeInMinutes(recipe?.cookingTime);
      let score = 0;

      if (name.includes(normalizedQuery)) {
        score += 8;
      }

      expandedTerms.forEach((term) => {
        if (!term) {
          return;
        }
        if (name.includes(term)) {
          score += 6;
        } else if (tags.some((tag) => tag.includes(term))) {
          score += 4;
        } else if (description.includes(term)) {
          score += 3;
        } else if (cultural.includes(term)) {
          score += 2;
        }
      });

      if (budgetLimit !== null) {
        if ((recipe?.estimatedCost || 0) <= budgetLimit) {
          score += 5;
        } else {
          score -= 3;
        }
      }

      if (timeLimit !== null) {
        if (timeInMinutes <= timeLimit) {
          score += 4;
        } else {
          score -= 2;
        }
      }

      if (normalizedQuery.includes('ai') && recipe?.aiGenerated) {
        score += 2;
      }

      score += recipe?.rating || 0;

      return { recipe, score };
    });

    const highestScore = Math.max(...scoredResults.map((item) => item.score));
    const relevantResults =
      highestScore > 0
        ? scoredResults.filter((item) => item.score > 0)
        : scoredResults;

    return relevantResults
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return (b.recipe?.rating || 0) - (a.recipe?.rating || 0);
      })
      .map((item) => item.recipe);
  };

  const applySort = (results = [], sortKey = 'relevance') => {
    if (!Array.isArray(results)) {
      return [];
    }

    const nextResults = [...results];

    switch (sortKey) {
      case 'rating':
        nextResults.sort((a, b) => (b?.rating || 0) - (a?.rating || 0));
        break;
      case 'time':
        nextResults.sort(
          (a, b) =>
            getCookingTimeInMinutes(a?.cookingTime) - getCookingTimeInMinutes(b?.cookingTime)
        );
        break;
      case 'budget':
        nextResults.sort(
          (a, b) => (a?.estimatedCost || 0) - (b?.estimatedCost || 0)
        );
        break;
      case 'difficulty':
        nextResults.sort(
          (a, b) =>
            difficultyOrder.indexOf(a?.difficulty) - difficultyOrder.indexOf(b?.difficulty)
        );
        break;
      case 'recent':
        nextResults.sort((a, b) => (b?.id || 0) - (a?.id || 0));
        break;
      default:
        break;
    }

    return nextResults;
  };

  const handleSearch = (query) => {
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

    setTimeout(() => {
      const agentResults = runAISearchAgent(trimmedQuery);
      const sortedResults = sortBy === 'relevance' ? agentResults : applySort(agentResults, sortBy);
      setSearchResults(sortedResults);
      setIsLoading(false);
    }, 900);
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
    if (!hasSearched) {
      return;
    }
    setSearchResults((previousResults) => applySort(previousResults, newSortBy));
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