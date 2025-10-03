import React, { useState, useMemo, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const formatQuantityText = (quantity) => {
  if (!quantity) {
    return '';
  }

  if (typeof quantity === 'string') {
    return quantity;
  }

  if (typeof quantity === 'number') {
    return Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(1);
  }

  if (typeof quantity === 'object') {
    const { value, unit } = quantity || {};
    if (value == null) {
      return unit || '';
    }
    const numericValue = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numericValue)) {
      return unit || '';
    }
    const displayValue = Number.isInteger(numericValue)
      ? numericValue
      : parseFloat(numericValue.toFixed(1));
    return `${displayValue}${unit ? ` ${unit}` : ''}`;
  }

  return String(quantity);
};

const normalizeIngredients = (ingredients, defaultServings) => {
  if (!Array.isArray(ingredients)) {
    return [];
  }

  const flattened = [];

  ingredients.forEach((entry) => {
    if (
      entry &&
      typeof entry === 'object' &&
      !Array.isArray(entry) &&
      !entry.name &&
      !entry.category &&
      Object.keys(entry).length > 0
    ) {
      Object.entries(entry).forEach(([categoryKey, items]) => {
        if (Array.isArray(items)) {
          items.forEach((item) => {
            flattened.push({
              ...item,
              category: item?.category || categoryKey,
              originalServings: item?.originalServings ?? defaultServings,
            });
          });
        }
      });
      return;
    }

    if (entry) {
      flattened.push({
        ...entry,
        category: entry?.category,
        originalServings: entry?.originalServings ?? defaultServings,
      });
    }
  });

  return flattened.map((item, index) => ({
    ...item,
    originalIndex: index,
    category: item?.category || 'other',
  }));
};

const IngredientsList = ({
  ingredients,
  servings,
  onServingsChange,
  onSubstitute,
  baseServings,
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const defaultServings = Number.isFinite(baseServings) && baseServings > 0 ? baseServings : 4;

  const normalizedIngredients = useMemo(
    () => normalizeIngredients(ingredients, defaultServings),
    [ingredients, defaultServings]
  );

  useEffect(() => {
    setCheckedIngredients((prev) => {
      const next = new Set();
      normalizedIngredients.forEach((item) => {
        if (prev.has(item.originalIndex)) {
          next.add(item.originalIndex);
        }
      });
      return next;
    });
  }, [normalizedIngredients]);

  const categorizedIngredients = useMemo(
    () =>
      normalizedIngredients.reduce((acc, ingredient) => {
        const categoryKey = ingredient?.category || 'other';
        if (!acc[categoryKey]) {
          acc[categoryKey] = [];
        }
        acc[categoryKey].push(ingredient);
        return acc;
      }, {}),
    [normalizedIngredients]
  );

  const totalIngredients = normalizedIngredients.length;
  const checkedCount = checkedIngredients.size;
  const progressPercentage = totalIngredients > 0
    ? Math.min(100, (checkedCount / totalIngredients) * 100)
    : 0;

  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const adjustQuantity = (quantity, originalServings, newServings) => {
    const base = Number.isFinite(originalServings) && originalServings > 0
      ? originalServings
      : defaultServings;

    if (!quantity) {
      return '';
    }

    if (typeof quantity === 'object') {
      const { value, unit } = quantity || {};
      const numericValue = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(numericValue) || !Number.isFinite(newServings) || !Number.isFinite(base) || base === 0) {
        return formatQuantityText(quantity);
      }
      const adjustedValue = numericValue * (newServings / base);
      const displayValue = Number.isInteger(adjustedValue)
        ? adjustedValue
        : parseFloat(adjustedValue.toFixed(1));
      return `${displayValue}${unit ? ` ${unit}` : ''}`;
    }

    if (typeof quantity === 'string') {
      const ratio = Number.isFinite(newServings) && Number.isFinite(base) && base > 0
        ? newServings / base
        : 1;
      const numericPart = quantity.match(/[\d.,]+/);
      if (numericPart) {
        const number = parseFloat(numericPart[0].replace(',', '.'));
        if (Number.isFinite(number)) {
          const adjustedNumber = (number * ratio).toFixed(1).replace(/\.0$/, '');
          return quantity.replace(numericPart[0], adjustedNumber);
        }
      }
      return quantity;
    }

    if (typeof quantity === 'number') {
      const ratio = Number.isFinite(newServings) && Number.isFinite(base) && base > 0
        ? newServings / base
        : 1;
      const adjustedNumber = quantity * ratio;
      return Number.isInteger(adjustedNumber)
        ? String(adjustedNumber)
        : adjustedNumber.toFixed(1);
    }

    return formatQuantityText(quantity);
  };

  const getIngredientIcon = (category) => {
    const icons = {
      protein: 'Beef',
      vegetable: 'Carrot',
      spice: 'Sparkles',
      grain: 'Wheat',
      dairy: 'Milk',
      oil: 'Droplets',
      sauce: 'Soup',
      herb: 'Leaf',
      bahan_utama: 'ChefHat',
      bahan_pelengkap: 'Utensils',
      bumbu: 'Sparkles',
    };
    return icons[category] || 'Package';
  };

  const getCategoryColor = (category) => {
    const colors = {
      protein: 'text-chili bg-chili/10',
      vegetable: 'text-pandan bg-pandan/10',
      spice: 'text-turmeric bg-turmeric/10',
      grain: 'text-cinnamon bg-cinnamon/10',
      dairy: 'text-primary bg-primary/10',
      oil: 'text-warning bg-warning/10',
      sauce: 'text-accent bg-accent/10',
      herb: 'text-success bg-success/10',
      bahan_utama: 'text-primary bg-primary/10',
      bahan_pelengkap: 'text-accent bg-accent/10',
      bumbu: 'text-turmeric bg-turmeric/10',
    };
    return colors[category] || 'text-muted-foreground bg-muted/10';
  };

  const formatCategoryLabel = (category) => {
    const labels = {
      other: 'Lainnya',
      protein: 'Protein',
      vegetable: 'Sayuran',
      spice: 'Bumbu & Rempah',
      grain: 'Biji-bijian',
      dairy: 'Produk Susu',
      oil: 'Minyak & Lemak',
      sauce: 'Saus & Cairan',
      herb: 'Herbal',
      bahan_utama: 'Bahan Utama',
      bahan_pelengkap: 'Bahan Pelengkap',
      bumbu: 'Bumbu',
    };
    if (labels[category]) {
      return labels[category];
    }
    return category ? category.replace(/_/g, ' ') : 'Lainnya';
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-bold text-foreground flex items-center">
          <Icon name="List" size={24} className="text-primary mr-3" />
          Bahan-Bahan
        </h3>

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

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progress Persiapan</span>
          <span className="text-sm font-medium text-primary">
            {checkedCount}/{totalIngredients}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {totalIngredients === 0 ? (
        <div className="text-sm text-muted-foreground">
          Data bahan belum tersedia untuk resep ini.
        </div>
      ) : (
        Object.entries(categorizedIngredients).map(([category, categoryIngredients]) => (
          <div key={category} className="mb-6 last:mb-0">
            <h4 className="font-semibold text-foreground mb-3 flex items-center">
              <Icon
                name={getIngredientIcon(category)}
                size={18}
                className={`mr-2 ${getCategoryColor(category).split(' ')[0]}`}
              />
              <span className="capitalize">{formatCategoryLabel(category)}</span>
            </h4>

            <div className="space-y-3">
              {categoryIngredients.map((ingredient) => {
                const isChecked = checkedIngredients.has(ingredient.originalIndex);
                const quantityText = adjustQuantity(
                  ingredient?.quantity,
                  ingredient?.originalServings,
                  servings
                ) || formatQuantityText(ingredient?.quantity);

                return (
                  <div
                    key={ingredient.originalIndex}
                    className={`flex items-center space-x-4 p-4 rounded-lg border transition-all ${
                      isChecked
                        ? 'bg-success/5 border-success/20'
                        : 'bg-muted/30 border-border hover:border-primary/30'
                    }`}
                  >
                    <button
                      onClick={() => toggleIngredient(ingredient.originalIndex)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-success border-success text-white'
                          : 'border-muted-foreground hover:border-primary'
                      }`}
                    >
                      {isChecked && <Icon name="Check" size={14} />}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColor(category)}`}>
                          <Icon name={getIngredientIcon(category)} size={16} />
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              isChecked
                                ? 'line-through text-muted-foreground'
                                : 'text-foreground'
                            }`}
                          >
                            {ingredient?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">{quantityText}</p>
                          {ingredient?.notes && (
                            <p className="text-xs text-muted-foreground">{ingredient.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {ingredient?.substitutes && (
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="RefreshCw"
                          onClick={() => onSubstitute(ingredient.originalIndex)}
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
                );
              })}
            </div>
          </div>
        ))
      )}

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

      <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h5 className="font-semibold text-primary mb-2">Tips Bahan</h5>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>- Pilih bahan segar untuk hasil terbaik</li>
              <li>- Siapkan semua bahan sebelum mulai memasak</li>
              <li>- Gunakan fitur substitusi jika bahan tidak tersedia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientsList;
