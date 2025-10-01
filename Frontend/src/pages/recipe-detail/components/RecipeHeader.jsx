import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecipeHeader = ({ recipe, onSave, onShare, isSaved }) => {
  const navigate = useNavigate();
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleBack = () => {
    navigate(-1);
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Mudah': return 'text-success bg-success/10';
      case 'Sedang': return 'text-warning bg-warning/10';
      case 'Sulit': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-80 sm:h-96 lg:h-[28rem] overflow-hidden rounded-xl bg-muted">
        <Image
          src={recipe?.image}
          alt={recipe?.name}
          className="w-full h-full object-cover"
          onLoad={() => setIsImageLoading(false)}
        />
        
        {isImageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <Icon name="ImageIcon" size={48} className="text-muted-foreground" />
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSave}
            className={`backdrop-blur-sm transition-colors ${
              isSaved 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-background/80 hover:bg-background/90'
            }`}
          >
            <Icon name={isSaved ? "Heart" : "Heart"} size={20} className={isSaved ? "fill-current" : ""} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onShare}
            className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <Icon name="Share2" size={20} />
          </Button>
        </div>

        {/* Recipe Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe?.difficulty)}`}>
              {recipe?.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">
              {recipe?.region}
            </span>
            {recipe?.isTraditional && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-turmeric text-white">
                Resep Tradisional
              </span>
            )}
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold mb-2">
            {recipe?.name}
          </h1>
          
          <p className="text-white/90 text-sm sm:text-base max-w-2xl">
            {recipe?.shortDescription}
          </p>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="bg-background border border-border rounded-xl p-4 -mt-8 mx-4 relative z-10 shadow-cultural">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mb-2 mx-auto">
              <Icon name="Clock" size={20} className="text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Waktu Masak</p>
            <p className="font-semibold text-sm">{recipe?.cookingTime}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg mb-2 mx-auto">
              <Icon name="Users" size={20} className="text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Porsi</p>
            <p className="font-semibold text-sm">{recipe?.servings} orang</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg mb-2 mx-auto">
              <Icon name="DollarSign" size={20} className="text-success" />
            </div>
            <p className="text-xs text-muted-foreground">Estimasi Biaya</p>
            <p className="font-semibold text-sm">{recipe?.estimatedCost}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-lg mb-2 mx-auto">
              <Icon name="Star" size={20} className="text-warning" />
            </div>
            <p className="text-xs text-muted-foreground">Rating</p>
            <p className="font-semibold text-sm">{recipe?.rating}/5</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeHeader;