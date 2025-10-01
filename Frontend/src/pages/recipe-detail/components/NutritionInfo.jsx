import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const NutritionInfo = ({ nutrition, servings }) => {
  const [selectedServing, setSelectedServing] = useState(1);

  const calculateNutrition = (value, servings, selectedServing) => {
    return Math.round((value / servings) * selectedServing);
  };

  const getNutritionColor = (type) => {
    const colors = {
      calories: 'text-accent bg-accent/10',
      protein: 'text-chili bg-chili/10',
      carbs: 'text-turmeric bg-turmeric/10',
      fat: 'text-cinnamon bg-cinnamon/10',
      fiber: 'text-pandan bg-pandan/10',
      sugar: 'text-warning bg-warning/10',
      sodium: 'text-error bg-error/10'
    };
    return colors?.[type] || 'text-muted-foreground bg-muted/10';
  };

  const getNutritionIcon = (type) => {
    const icons = {
      calories: 'Zap',
      protein: 'Beef',
      carbs: 'Wheat',
      fat: 'Droplets',
      fiber: 'Leaf',
      sugar: 'Candy',
      sodium: 'Saltshaker'
    };
    return icons?.[type] || 'Info';
  };

  const getHealthScore = (nutrition) => {
    // Simple health score calculation based on balanced nutrition
    const proteinScore = Math.min(nutrition?.protein / 25, 1) * 25;
    const fiberScore = Math.min(nutrition?.fiber / 25, 1) * 25;
    const sodiumScore = Math.max(0, (2300 - nutrition?.sodium) / 2300) * 25;
    const sugarScore = Math.max(0, (50 - nutrition?.sugar) / 50) * 25;
    
    return Math.round(proteinScore + fiberScore + sodiumScore + sugarScore);
  };

  const healthScore = getHealthScore(nutrition);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success bg-success/10';
    if (score >= 60) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-bold text-foreground flex items-center">
          <Icon name="Activity" size={24} className="text-success mr-3" />
          Informasi Gizi
        </h3>
        
        {/* Serving Selector */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground">Per porsi:</span>
          <select
            value={selectedServing}
            onChange={(e) => setSelectedServing(Number(e?.target?.value))}
            className="px-3 py-1 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {[1, 2, 3, 4, 5, 6]?.map(num => (
              <option key={num} value={num}>{num} porsi</option>
            ))}
          </select>
        </div>
      </div>
      {/* Health Score */}
      <div className="mb-6 p-4 bg-gradient-to-r from-success/5 to-primary/5 rounded-lg border border-success/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-foreground mb-1">Skor Kesehatan</h4>
            <p className="text-sm text-muted-foreground">Berdasarkan keseimbangan nutrisi</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(healthScore)?.split(' ')?.[0]}`}>
              {healthScore}
            </div>
            <div className="text-sm text-muted-foreground">dari 100</div>
          </div>
        </div>
        
        <div className="mt-3 w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              healthScore >= 80 ? 'bg-success' :
              healthScore >= 60 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${healthScore}%` }}
          />
        </div>
      </div>
      {/* Main Nutrition Facts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-accent/5 rounded-lg">
          <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="Zap" size={24} className="text-accent" />
          </div>
          <p className="text-2xl font-bold text-accent">
            {calculateNutrition(nutrition?.calories, servings, selectedServing)}
          </p>
          <p className="text-xs text-muted-foreground">Kalori</p>
        </div>

        <div className="text-center p-4 bg-chili/5 rounded-lg">
          <div className="w-12 h-12 bg-chili/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="Beef" size={24} className="text-chili" />
          </div>
          <p className="text-2xl font-bold text-chili">
            {calculateNutrition(nutrition?.protein, servings, selectedServing)}g
          </p>
          <p className="text-xs text-muted-foreground">Protein</p>
        </div>

        <div className="text-center p-4 bg-turmeric/5 rounded-lg">
          <div className="w-12 h-12 bg-turmeric/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="Wheat" size={24} className="text-turmeric" />
          </div>
          <p className="text-2xl font-bold text-turmeric">
            {calculateNutrition(nutrition?.carbs, servings, selectedServing)}g
          </p>
          <p className="text-xs text-muted-foreground">Karbohidrat</p>
        </div>

        <div className="text-center p-4 bg-cinnamon/5 rounded-lg">
          <div className="w-12 h-12 bg-cinnamon/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="Droplets" size={24} className="text-cinnamon" />
          </div>
          <p className="text-2xl font-bold text-cinnamon">
            {calculateNutrition(nutrition?.fat, servings, selectedServing)}g
          </p>
          <p className="text-xs text-muted-foreground">Lemak</p>
        </div>
      </div>
      {/* Detailed Nutrition */}
      <div className="space-y-3 mb-6">
        <h4 className="font-semibold text-foreground">Detail Nutrisi</h4>
        
        {[
          { key: 'fiber', label: 'Serat', unit: 'g', dailyValue: 25 },
          { key: 'sugar', label: 'Gula', unit: 'g', dailyValue: 50 },
          { key: 'sodium', label: 'Natrium', unit: 'mg', dailyValue: 2300 },
          { key: 'cholesterol', label: 'Kolesterol', unit: 'mg', dailyValue: 300 },
          { key: 'calcium', label: 'Kalsium', unit: 'mg', dailyValue: 1000 },
          { key: 'iron', label: 'Zat Besi', unit: 'mg', dailyValue: 18 }
        ]?.map((nutrient) => {
          const value = calculateNutrition(nutrition?.[nutrient?.key] || 0, servings, selectedServing);
          const percentage = Math.round((value / nutrient?.dailyValue) * 100);
          
          return (
            <div key={nutrient?.key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getNutritionColor(nutrient?.key)}`}>
                  <Icon name={getNutritionIcon(nutrient?.key)} size={16} />
                </div>
                <span className="font-medium text-foreground">{nutrient?.label}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">
                  {value}{nutrient?.unit}
                </p>
                <p className="text-xs text-muted-foreground">
                  {percentage}% AKG*
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/* Vitamins & Minerals */}
      {nutrition?.vitamins && (
        <div className="mb-6">
          <h4 className="font-semibold text-foreground mb-3">Vitamin & Mineral</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {nutrition?.vitamins?.map((vitamin, index) => (
              <div key={index} className="p-3 bg-primary/5 rounded-lg text-center">
                <p className="font-medium text-primary text-sm">{vitamin?.name}</p>
                <p className="text-xs text-muted-foreground">{vitamin?.percentage}% AKG</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Health Benefits */}
      {nutrition?.benefits && (
        <div className="mb-6 p-4 bg-success/5 rounded-lg border border-success/20">
          <h4 className="font-semibold text-success mb-3 flex items-center">
            <Icon name="Heart" size={18} className="mr-2" />
            Manfaat Kesehatan
          </h4>
          <ul className="space-y-2">
            {nutrition?.benefits?.map((benefit, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Dietary Information */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {nutrition?.dietary?.map((diet, index) => (
          <div key={index} className="flex items-center justify-center p-2 bg-muted/30 rounded-lg">
            <Icon name="Check" size={16} className="text-success mr-2" />
            <span className="text-sm font-medium text-foreground">{diet}</span>
          </div>
        ))}
      </div>
      {/* Footer Note */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          *AKG = Angka Kecukupan Gizi harian berdasarkan diet 2000 kalori. 
          Kebutuhan individu dapat bervariasi.
        </p>
      </div>
    </div>
  );
};

export default NutritionInfo;