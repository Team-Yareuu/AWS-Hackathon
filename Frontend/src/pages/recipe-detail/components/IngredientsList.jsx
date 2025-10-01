import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IngredientsList = ({ ingredients, servings, onServingsChange, onSubstitute }) => {
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());

  const toggleIngredient = (index) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked?.has(index)) {
      newChecked?.delete(index);
    } else {
      newChecked?.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const adjustQuantity = (originalQuantity, originalServings, newServings) => {
    if (!originalQuantity || !originalServings) return originalQuantity;
    
    const ratio = newServings / originalServings;
    const numericPart = originalQuantity?.match(/[\d.,]+/);
    
    if (numericPart) {
      const number = parseFloat(numericPart?.[0]?.replace(',', '.'));
      const adjustedNumber = (number * ratio)?.toFixed(1)?.replace('.0', '');
      return originalQuantity?.replace(numericPart?.[0], adjustedNumber);
    }
    
    return originalQuantity;
  };

  const getIngredientIcon = (category) => {
    const icons = {
      'protein': 'Beef',
      'vegetable': 'Carrot',
      'spice': 'Sparkles',
      'grain': 'Wheat',
      'dairy': 'Milk',
      'oil': 'Droplets',
      'sauce': 'Soup',
      'herb': 'Leaf'
    };
    return icons?.[category] || 'Package';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'protein': 'text-chili bg-chili/10',
      'vegetable': 'text-pandan bg-pandan/10',
      'spice': 'text-turmeric bg-turmeric/10',
      'grain': 'text-cinnamon bg-cinnamon/10',
      'dairy': 'text-primary bg-primary/10',
      'oil': 'text-warning bg-warning/10',
      'sauce': 'text-accent bg-accent/10',
      'herb': 'text-success bg-success/10'
    };
    return colors?.[category] || 'text-muted-foreground bg-muted/10';
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-bold text-foreground flex items-center">
          <Icon name="List" size={24} className="text-primary mr-3" />
          Bahan-Bahan
        </h3>
        
        {/* Servings Adjuster */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground">Porsi:</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onServingsChange(Math.max(1, servings - 1))}
              disabled={servings <= 1}
            >
              <Icon name="Minus" size={16} />
            </Button>
            <span className="w-8 text-center font-semibold">{servings}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onServingsChange(servings + 1)}
            >
              <Icon name="Plus" size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progress Persiapan</span>
          <span className="text-sm font-medium text-primary">
            {checkedIngredients?.size}/{ingredients?.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(checkedIngredients?.size / ingredients?.length) * 100}%` }}
          />
        </div>
      </div>
      {/* Ingredients by Category */}
      {Object.entries(
        ingredients?.reduce((acc, ingredient, index) => {
          const category = ingredient?.category || 'other';
          if (!acc?.[category]) acc[category] = [];
          acc?.[category]?.push({ ...ingredient, originalIndex: index });
          return acc;
        }, {})
      )?.map(([category, categoryIngredients]) => (
        <div key={category} className="mb-6 last:mb-0">
          <h4 className="font-semibold text-foreground mb-3 flex items-center">
            <Icon 
              name={getIngredientIcon(category)} 
              size={18} 
              className={`mr-2 ${getCategoryColor(category)?.split(' ')?.[0]}`}
            />
            <span className="capitalize">
              {category === 'other' ? 'Lainnya' : 
               category === 'protein' ? 'Protein' :
               category === 'vegetable' ? 'Sayuran' :
               category === 'spice' ? 'Bumbu & Rempah' :
               category === 'grain' ? 'Biji-bijian' :
               category === 'dairy' ? 'Produk Susu' :
               category === 'oil' ? 'Minyak & Lemak' :
               category === 'sauce' ? 'Saus & Cairan' :
               category === 'herb' ? 'Herbal' : category}
            </span>
          </h4>
          
          <div className="space-y-3">
            {categoryIngredients?.map((ingredient) => (
              <div 
                key={ingredient?.originalIndex}
                className={`flex items-center space-x-4 p-4 rounded-lg border transition-all ${
                  checkedIngredients?.has(ingredient?.originalIndex)
                    ? 'bg-success/5 border-success/20' :'bg-muted/30 border-border hover:border-primary/30'
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleIngredient(ingredient?.originalIndex)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    checkedIngredients?.has(ingredient?.originalIndex)
                      ? 'bg-success border-success text-white' :'border-muted-foreground hover:border-primary'
                  }`}
                >
                  {checkedIngredients?.has(ingredient?.originalIndex) && (
                    <Icon name="Check" size={14} />
                  )}
                </button>

                {/* Ingredient Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColor(category)}`}>
                      <Icon name={getIngredientIcon(category)} size={16} />
                    </div>
                    <div>
                      <p className={`font-medium ${
                        checkedIngredients?.has(ingredient?.originalIndex) 
                          ? 'line-through text-muted-foreground' 
                          : 'text-foreground'
                      }`}>
                        {ingredient?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {adjustQuantity(ingredient?.quantity, ingredient?.originalServings || 4, servings)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {ingredient?.substitutes && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="RefreshCw"
                      onClick={() => onSubstitute(ingredient?.originalIndex)}
                      className="text-xs"
                    >
                      Ganti
                    </Button>
                  )}
                  
                  {ingredient?.optional && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      Opsional
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Action Buttons */}
      <div className="mt-6 pt-6 border-t border-border space-y-3">
        <Button
          variant="default"
          fullWidth
          iconName="ShoppingCart"
          iconPosition="left"
        >
          Belanja Semua Bahan
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" iconName="Download" iconPosition="left">
            Unduh Daftar
          </Button>
          <Button variant="outline" iconName="Share2" iconPosition="left">
            Bagikan Daftar
          </Button>
        </div>
      </div>
      {/* Ingredient Tips */}
      <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h5 className="font-semibold text-primary mb-2">Tips Bahan</h5>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Pilih bahan segar untuk hasil terbaik</li>
              <li>• Siapkan semua bahan sebelum mulai memasak</li>
              <li>• Gunakan fitur substitusi jika bahan tidak tersedia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientsList;