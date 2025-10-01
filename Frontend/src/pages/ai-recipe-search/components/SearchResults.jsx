import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SearchResults = ({ results, isLoading, searchQuery, sortBy, onSortChange }) => {
  const navigate = useNavigate();
  const [savedRecipes, setSavedRecipes] = useState(new Set());

  const sortOptions = [
    { value: 'relevance', label: 'Paling Relevan', icon: 'Target' },
    { value: 'rating', label: 'Rating Tertinggi', icon: 'Star' },
    { value: 'time', label: 'Tercepat', icon: 'Clock' },
    { value: 'budget', label: 'Termurah', icon: 'Wallet' },
    { value: 'difficulty', label: 'Termudah', icon: 'TrendingUp' },
    { value: 'recent', label: 'Terbaru', icon: 'Calendar' }
  ];

  const handleSaveRecipe = (recipeId) => {
    setSavedRecipes(prev => {
      const newSaved = new Set(prev);
      if (newSaved?.has(recipeId)) {
        newSaved?.delete(recipeId);
      } else {
        newSaved?.add(recipeId);
      }
      return newSaved;
    });
  };

  const handleRecipeClick = (recipe) => {
    navigate('/recipe-detail', { state: { recipe } });
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'very-easy': 'text-success bg-success/10',
      'easy': 'text-success bg-success/10',
      'medium': 'text-warning bg-warning/10',
      'hard': 'text-error bg-error/10',
      'very-hard': 'text-error bg-error/10'
    };
    return colors?.[difficulty] || 'text-muted-foreground bg-muted/10';
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      'very-easy': 'Sangat Mudah',
      'easy': 'Mudah',
      'medium': 'Sedang',
      'hard': 'Sulit',
      'very-hard': 'Sangat Sulit'
    };
    return labels?.[difficulty] || 'Tidak Diketahui';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    })?.format(price);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading Header */}
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <Icon name="Loader2" size={24} className="animate-spin text-primary" />
            <span className="text-lg font-medium text-foreground">Mencari resep terbaik untuk Anda...</span>
          </div>
        </div>
        {/* Loading Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)]?.map((_, index) => (
            <div key={index} className="bg-card rounded-xl border border-border p-4 animate-pulse">
              <div className="bg-muted rounded-lg h-48 mb-4"></div>
              <div className="space-y-3">
                <div className="bg-muted rounded h-4 w-3/4"></div>
                <div className="bg-muted rounded h-3 w-1/2"></div>
                <div className="flex space-x-2">
                  <div className="bg-muted rounded h-6 w-16"></div>
                  <div className="bg-muted rounded h-6 w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!results || results?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? 'Tidak Ada Resep Ditemukan' : 'Mulai Pencarian Anda'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery 
              ? `Tidak ada resep yang cocok dengan "${searchQuery}". Coba kata kunci lain atau ubah filter pencarian.`
              : 'Gunakan kotak pencarian di atas untuk menemukan resep yang sempurna untuk Anda.'
            }
          </p>
          {searchQuery && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Saran:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Coba kata kunci yang lebih umum</li>
                <li>• Periksa ejaan kata kunci</li>
                <li>• Gunakan nama bahan atau jenis masakan</li>
                <li>• Hapus beberapa filter untuk hasil lebih luas</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {results?.length} Resep Ditemukan
          </h2>
          {searchQuery && (
            <p className="text-muted-foreground">
              Hasil pencarian untuk: <span className="font-medium text-foreground">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e?.target?.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sortOptions?.map((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results?.map((recipe) => (
          <div
            key={recipe?.id}
            className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-cultural-lg transition-all duration-300 ease-cultural group cursor-pointer"
            onClick={() => handleRecipeClick(recipe)}
          >
            {/* Recipe Image */}
            <div className="relative overflow-hidden">
              <Image
                src={recipe?.image}
                alt={recipe?.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Save Button */}
              <button
                onClick={(e) => {
                  e?.stopPropagation();
                  handleSaveRecipe(recipe?.id);
                }}
                className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors duration-200"
              >
                <Icon
                  name={savedRecipes?.has(recipe?.id) ? "Heart" : "Heart"}
                  size={16}
                  className={savedRecipes?.has(recipe?.id) ? "text-accent fill-current" : "text-muted-foreground"}
                />
              </button>

              {/* Cultural Badge */}
              {recipe?.cultural && (
                <div className="absolute top-3 left-3 px-2 py-1 bg-primary/90 backdrop-blur-sm rounded-full">
                  <span className="text-xs font-medium text-primary-foreground">{recipe?.cultural}</span>
                </div>
              )}

              {/* AI Generated Badge */}
              {recipe?.aiGenerated && (
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-accent/90 backdrop-blur-sm rounded-full">
                  <span className="text-xs font-medium text-accent-foreground">AI Generated</span>
                </div>
              )}
            </div>

            {/* Recipe Content */}
            <div className="p-4">
              {/* Recipe Title */}
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {recipe?.name}
              </h3>

              {/* Recipe Description */}
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {recipe?.description}
              </p>

              {/* Recipe Stats */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-warning fill-current" />
                    <span className="text-sm font-medium text-foreground">{recipe?.rating}</span>
                    <span className="text-xs text-muted-foreground">({recipe?.reviews})</span>
                  </div>

                  {/* Cooking Time */}
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{recipe?.cookingTime}</span>
                  </div>
                </div>

                {/* Difficulty */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe?.difficulty)}`}>
                  {getDifficultyLabel(recipe?.difficulty)}
                </span>
              </div>

              {/* Price and Servings */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-1">
                  <Icon name="Wallet" size={14} className="text-success" />
                  <span className="text-sm font-semibold text-success">{formatPrice(recipe?.estimatedCost)}</span>
                  <span className="text-xs text-muted-foreground">/ {recipe?.servings} porsi</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{recipe?.servings} porsi</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {recipe?.tags?.slice(0, 3)?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
                {recipe?.tags?.length > 3 && (
                  <span className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                    +{recipe?.tags?.length - 3}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  fullWidth
                  iconName="ChefHat"
                  iconPosition="left"
                  onClick={(e) => {
                    e?.stopPropagation();
                    handleRecipeClick(recipe);
                  }}
                >
                  Lihat Resep
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="ShoppingCart"
                  onClick={(e) => {
                    e?.stopPropagation();
                    navigate('/smart-shopping-assistant', { state: { recipe } });
                  }}
                  title="Belanja bahan"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Load More Button */}
      {results?.length >= 12 && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            iconName="ChevronDown"
            iconPosition="right"
          >
            Muat Lebih Banyak Resep
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;