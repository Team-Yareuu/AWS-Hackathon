import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ isOpen, onClose, filters, onFiltersChange, onClearFilters }) => {
  const [expandedSections, setExpandedSections] = useState({
    budget: true,
    time: true,
    difficulty: true,
    dietary: false,
    cuisine: false,
    ingredients: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const handleFilterChange = (category, value, checked) => {
    const currentFilters = filters?.[category] || [];
    const newFilters = checked 
      ? [...currentFilters, value]
      : currentFilters?.filter(item => item !== value);
    
    onFiltersChange({
      ...filters,
      [category]: newFilters
    });
  };

  const handleRangeChange = (category, field, value) => {
    onFiltersChange({
      ...filters,
      [category]: {
        ...filters?.[category],
        [field]: value
      }
    });
  };

  const budgetRanges = [
    { label: "< Rp 25.000", value: "0-25000" },
    { label: "Rp 25.000 - 50.000", value: "25000-50000" },
    { label: "Rp 50.000 - 100.000", value: "50000-100000" },
    { label: "Rp 100.000 - 200.000", value: "100000-200000" },
    { label: "> Rp 200.000", value: "200000+" }
  ];

  const timeRanges = [
    { label: "< 15 menit", value: "0-15" },
    { label: "15 - 30 menit", value: "15-30" },
    { label: "30 - 60 menit", value: "30-60" },
    { label: "1 - 2 jam", value: "60-120" },
    { label: "> 2 jam", value: "120+" }
  ];

  const difficultyLevels = [
    { label: "Sangat Mudah", value: "very-easy", icon: "Star" },
    { label: "Mudah", value: "easy", icon: "Star" },
    { label: "Sedang", value: "medium", icon: "Star" },
    { label: "Sulit", value: "hard", icon: "Star" },
    { label: "Sangat Sulit", value: "very-hard", icon: "Star" }
  ];

  const dietaryOptions = [
    { label: "Vegetarian", value: "vegetarian", icon: "Leaf" },
    { label: "Vegan", value: "vegan", icon: "Sprout" },
    { label: "Halal", value: "halal", icon: "Shield" },
    { label: "Bebas Gluten", value: "gluten-free", icon: "Wheat" },
    { label: "Rendah Garam", value: "low-sodium", icon: "Droplets" },
    { label: "Rendah Gula", value: "low-sugar", icon: "Candy" },
    { label: "Keto", value: "keto", icon: "Zap" },
    { label: "Diabetes", value: "diabetic", icon: "Heart" }
  ];

  const cuisineTypes = [
    { label: "Jawa", value: "javanese", region: "Jawa" },
    { label: "Sumatera", value: "sumatran", region: "Sumatera" },
    { label: "Bali", value: "balinese", region: "Bali" },
    { label: "Sulawesi", value: "sulawesi", region: "Sulawesi" },
    { label: "Kalimantan", value: "kalimantan", region: "Kalimantan" },
    { label: "Papua", value: "papuan", region: "Papua" },
    { label: "Betawi", value: "betawi", region: "Jakarta" },
    { label: "Sunda", value: "sundanese", region: "Jawa Barat" }
  ];

  const commonIngredients = [
    { label: "Ayam", value: "chicken", category: "protein" },
    { label: "Daging Sapi", value: "beef", category: "protein" },
    { label: "Ikan", value: "fish", category: "protein" },
    { label: "Tahu/Tempe", value: "tofu-tempeh", category: "protein" },
    { label: "Nasi", value: "rice", category: "carb" },
    { label: "Mie", value: "noodles", category: "carb" },
    { label: "Kentang", value: "potato", category: "carb" },
    { label: "Santan", value: "coconut-milk", category: "dairy" }
  ];

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-border pb-4 mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <h3 className="font-medium text-foreground">{title}</h3>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && <div className="mt-3">{children}</div>}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 bg-background border-r border-border z-50 lg:z-auto
        transform transition-transform duration-300 ease-cultural overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Filter Pencarian</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="RotateCcw"
                onClick={onClearFilters}
                className="text-muted-foreground hover:text-foreground"
                title="Reset filter"
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={onClose}
                className="lg:hidden touch-target"
              />
            </div>
          </div>

          {/* Budget Filter */}
          <FilterSection
            title="Budget"
            isExpanded={expandedSections?.budget}
            onToggle={() => toggleSection('budget')}
          >
            <div className="space-y-2">
              {budgetRanges?.map((range) => (
                <Checkbox
                  key={range?.value}
                  label={range?.label}
                  checked={(filters?.budget || [])?.includes(range?.value)}
                  onChange={(e) => handleFilterChange('budget', range?.value, e?.target?.checked)}
                />
              ))}
            </div>
            <div className="mt-4 space-y-3">
              <Input
                type="number"
                label="Budget Minimum (Rp)"
                placeholder="25000"
                value={filters?.budgetRange?.min || ''}
                onChange={(e) => handleRangeChange('budgetRange', 'min', e?.target?.value)}
              />
              <Input
                type="number"
                label="Budget Maksimum (Rp)"
                placeholder="100000"
                value={filters?.budgetRange?.max || ''}
                onChange={(e) => handleRangeChange('budgetRange', 'max', e?.target?.value)}
              />
            </div>
          </FilterSection>

          {/* Cooking Time Filter */}
          <FilterSection
            title="Waktu Memasak"
            isExpanded={expandedSections?.time}
            onToggle={() => toggleSection('time')}
          >
            <div className="space-y-2">
              {timeRanges?.map((time) => (
                <Checkbox
                  key={time?.value}
                  label={time?.label}
                  checked={(filters?.cookingTime || [])?.includes(time?.value)}
                  onChange={(e) => handleFilterChange('cookingTime', time?.value, e?.target?.checked)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Difficulty Filter */}
          <FilterSection
            title="Tingkat Kesulitan"
            isExpanded={expandedSections?.difficulty}
            onToggle={() => toggleSection('difficulty')}
          >
            <div className="space-y-2">
              {difficultyLevels?.map((level) => (
                <Checkbox
                  key={level?.value}
                  label={level?.label}
                  checked={(filters?.difficulty || [])?.includes(level?.value)}
                  onChange={(e) => handleFilterChange('difficulty', level?.value, e?.target?.checked)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Dietary Restrictions */}
          <FilterSection
            title="Kebutuhan Diet"
            isExpanded={expandedSections?.dietary}
            onToggle={() => toggleSection('dietary')}
          >
            <div className="space-y-2">
              {dietaryOptions?.map((option) => (
                <div key={option?.value} className="flex items-center space-x-2">
                  <Checkbox
                    checked={(filters?.dietary || [])?.includes(option?.value)}
                    onChange={(e) => handleFilterChange('dietary', option?.value, e?.target?.checked)}
                  />
                  <Icon name={option?.icon} size={16} className="text-muted-foreground" />
                  <span className="text-sm">{option?.label}</span>
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Cuisine Type */}
          <FilterSection
            title="Jenis Masakan"
            isExpanded={expandedSections?.cuisine}
            onToggle={() => toggleSection('cuisine')}
          >
            <div className="space-y-2">
              {cuisineTypes?.map((cuisine) => (
                <div key={cuisine?.value} className="flex items-center justify-between">
                  <Checkbox
                    label={cuisine?.label}
                    checked={(filters?.cuisine || [])?.includes(cuisine?.value)}
                    onChange={(e) => handleFilterChange('cuisine', cuisine?.value, e?.target?.checked)}
                  />
                  <span className="text-xs text-muted-foreground">{cuisine?.region}</span>
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Ingredients */}
          <FilterSection
            title="Bahan Utama"
            isExpanded={expandedSections?.ingredients}
            onToggle={() => toggleSection('ingredients')}
          >
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Cari bahan..."
                className="mb-3"
              />
              <div className="space-y-2">
                {commonIngredients?.map((ingredient) => (
                  <Checkbox
                    key={ingredient?.value}
                    label={ingredient?.label}
                    checked={(filters?.ingredients || [])?.includes(ingredient?.value)}
                    onChange={(e) => handleFilterChange('ingredients', ingredient?.value, e?.target?.checked)}
                  />
                ))}
              </div>
            </div>
          </FilterSection>

          {/* Apply Filters Button */}
          <div className="mt-6 pt-4 border-t border-border">
            <Button
              variant="default"
              fullWidth
              iconName="Filter"
              iconPosition="left"
              onClick={onClose}
            >
              Terapkan Filter
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;