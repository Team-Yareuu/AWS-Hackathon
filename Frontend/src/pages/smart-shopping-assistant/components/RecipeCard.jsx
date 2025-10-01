import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecipeCard = ({ recipe, onAddToCart, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const getBudgetStatus = (estimated, actual) => {
    const percentage = (actual / estimated) * 100;
    if (percentage <= 90) return { status: 'under', color: 'text-success', icon: 'TrendingDown' };
    if (percentage <= 110) return { status: 'on', color: 'text-primary', icon: 'Target' };
    return { status: 'over', color: 'text-warning', icon: 'TrendingUp' };
  };

  const budgetStatus = getBudgetStatus(recipe?.estimatedCost, recipe?.actualCost);

  return (
    <div className="bg-card rounded-lg shadow-cultural hover:shadow-cultural-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <Image
          src={recipe?.image}
          alt={recipe?.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1">
          <div className="flex items-center space-x-1">
            <Icon name={budgetStatus?.icon} size={14} className={budgetStatus?.color} />
            <span className={`text-xs font-medium ${budgetStatus?.color}`}>
              {formatCurrency(recipe?.actualCost)}
            </span>
          </div>
        </div>
        <div className="absolute top-3 left-3 bg-primary text-primary-foreground rounded-full px-2 py-1">
          <span className="text-xs font-medium">{recipe?.servings} porsi</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-lg text-foreground mb-1">{recipe?.name}</h3>
            <p className="text-sm text-muted-foreground">{recipe?.region} • {recipe?.cookingTime}</p>
          </div>
          <div className="flex items-center space-x-1 ml-3">
            <Icon name="Star" size={16} className="text-warning fill-current" />
            <span className="text-sm font-medium text-foreground">{recipe?.rating}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Budget Estimasi:</span>
            <span className="font-medium text-foreground">{formatCurrency(recipe?.estimatedCost)}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Harga Aktual:</span>
            <span className={`font-medium ${budgetStatus?.color}`}>{formatCurrency(recipe?.actualCost)}</span>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Bahan Utama</span>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
              </button>
            </div>
            
            <div className="space-y-1">
              {recipe?.mainIngredients?.slice(0, isExpanded ? undefined : 3)?.map((ingredient, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{ingredient?.name}</span>
                  <span className="font-medium text-foreground">{formatCurrency(ingredient?.price)}</span>
                </div>
              ))}
              {!isExpanded && recipe?.mainIngredients?.length > 3 && (
                <div className="text-xs text-primary">+{recipe?.mainIngredients?.length - 3} bahan lainnya</div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>Diperbarui {recipe?.lastUpdated}</span>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <Icon name="MapPin" size={14} />
            <span>{recipe?.availableStores} toko</span>
          </div>
        </div>

        <div className="flex space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            iconName="Eye"
            iconPosition="left"
            onClick={() => onViewDetails(recipe)}
            className="flex-1"
          >
            Detail
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="ShoppingCart"
            iconPosition="left"
            onClick={() => onAddToCart(recipe)}
            className="flex-1"
          >
            Tambah ke Keranjang
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;