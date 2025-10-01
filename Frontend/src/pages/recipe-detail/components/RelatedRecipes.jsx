import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RelatedRecipes = ({ recipes, currentRecipeId }) => {
  const navigate = useNavigate();

  const handleRecipeClick = (recipeId) => {
    // In a real app, this would navigate to the specific recipe
    navigate(`/recipe-detail?id=${recipeId}`);
    window.scrollTo(0, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount)?.replace('IDR', 'Rp');
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Mudah': return 'text-success bg-success/10';
      case 'Sedang': return 'text-warning bg-warning/10';
      case 'Sulit': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5]?.map((star) => (
          <Icon
            key={star}
            name="Star"
            size={12}
            className={`${
              star <= rating 
                ? 'text-warning fill-current' :'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  // Filter out current recipe
  const filteredRecipes = recipes?.filter(recipe => recipe?.id !== currentRecipeId);

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-bold text-foreground flex items-center">
          <Icon name="ChefHat" size={24} className="text-primary mr-3" />
          Resep Serupa
        </h3>
        
        <Button
          variant="outline"
          size="sm"
          iconName="ArrowRight"
          iconPosition="right"
          onClick={() => navigate('/ai-recipe-search')}
        >
          Lihat Semua
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes?.slice(0, 6)?.map((recipe) => (
          <div
            key={recipe?.id}
            className="group bg-background border border-border rounded-xl overflow-hidden hover:shadow-cultural-lg transition-all duration-300 cursor-pointer"
            onClick={() => handleRecipeClick(recipe?.id)}
          >
            {/* Recipe Image */}
            <div className="relative h-40 overflow-hidden">
              <Image
                src={recipe?.image}
                alt={recipe?.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Overlay with quick info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between text-white text-xs">
                    <span className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{recipe?.cookingTime}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Users" size={12} />
                      <span>{recipe?.servings}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                {recipe?.isTraditional && (
                  <span className="px-2 py-1 bg-turmeric text-white text-xs rounded-full">
                    Tradisional
                  </span>
                )}
                {recipe?.isNew && (
                  <span className="px-2 py-1 bg-accent text-white text-xs rounded-full">
                    Baru
                  </span>
                )}
              </div>

              {/* Difficulty Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe?.difficulty)}`}>
                  {recipe?.difficulty}
                </span>
              </div>
            </div>

            {/* Recipe Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {recipe?.name}
                </h4>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {recipe?.shortDescription}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{recipe?.cookingTime}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Users" size={12} />
                    <span>{recipe?.servings}</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  {renderStars(recipe?.rating)}
                  <span className="text-xs text-muted-foreground ml-1">
                    ({recipe?.reviewCount})
                  </span>
                </div>
              </div>

              {/* Price and Region */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-success">
                  {formatCurrency(recipe?.estimatedCost)}
                </span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {recipe?.region}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Categories */}
      <div className="mt-8 pt-6 border-t border-border">
        <h4 className="font-semibold text-foreground mb-4">Jelajahi Kategori</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Makanan Utama', icon: 'Utensils', count: 150 },
            { name: 'Camilan', icon: 'Cookie', count: 89 },
            { name: 'Minuman', icon: 'Coffee', count: 45 },
            { name: 'Dessert', icon: 'IceCream', count: 67 }
          ]?.map((category, index) => (
            <button
              key={index}
              onClick={() => navigate(`/ai-recipe-search?category=${category?.name?.toLowerCase()}`)}
              className="p-3 bg-muted/30 hover:bg-primary/10 rounded-lg transition-colors group text-left"
            >
              <div className="flex items-center space-x-2 mb-1">
                <Icon 
                  name={category?.icon} 
                  size={16} 
                  className="text-muted-foreground group-hover:text-primary transition-colors" 
                />
                <span className="font-medium text-foreground text-sm">
                  {category?.name}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {category?.count} resep
              </p>
            </button>
          ))}
        </div>
      </div>
      {/* Call to Action */}
      <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20 text-center">
        <Icon name="Sparkles" size={24} className="text-primary mx-auto mb-2" />
        <h5 className="font-semibold text-primary mb-2">Temukan Resep Impian Anda</h5>
        <p className="text-sm text-muted-foreground mb-3">
          Gunakan AI untuk menemukan resep yang sesuai dengan selera dan budget Anda
        </p>
        <Button
          variant="default"
          size="sm"
          iconName="Search"
          iconPosition="left"
          onClick={() => navigate('/ai-recipe-search')}
        >
          Cari dengan AI
        </Button>
      </div>
    </div>
  );
};

export default RelatedRecipes;