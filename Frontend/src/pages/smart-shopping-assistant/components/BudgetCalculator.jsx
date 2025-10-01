import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BudgetCalculator = ({ onBudgetSet, currentBudget }) => {
  const [budget, setBudget] = useState(currentBudget || '');
  const [servings, setServings] = useState('4');
  const [mealType, setMealType] = useState('lunch');
  const [budgetBreakdown, setBudgetBreakdown] = useState(null);

  const mealTypes = [
    { id: 'breakfast', label: 'Sarapan', multiplier: 0.7 },
    { id: 'lunch', label: 'Makan Siang', multiplier: 1.0 },
    { id: 'dinner', label: 'Makan Malam', multiplier: 1.2 },
    { id: 'snack', label: 'Camilan', multiplier: 0.5 }
  ];

  const calculateBudgetBreakdown = () => {
    if (!budget || !servings) return null;

    const totalBudget = parseFloat(budget);
    const numServings = parseInt(servings);
    const selectedMeal = mealTypes?.find(m => m?.id === mealType);
    
    const adjustedBudget = totalBudget * selectedMeal?.multiplier;
    const perServing = adjustedBudget / numServings;
    
    return {
      total: adjustedBudget,
      perServing: perServing,
      ingredients: adjustedBudget * 0.75,
      seasonings: adjustedBudget * 0.15,
      extras: adjustedBudget * 0.10
    };
  };

  useEffect(() => {
    setBudgetBreakdown(calculateBudgetBreakdown());
  }, [budget, servings, mealType]);

  const handleSetBudget = () => {
    if (budget && servings) {
      const breakdown = calculateBudgetBreakdown();
      onBudgetSet({
        budget: parseFloat(budget),
        servings: parseInt(servings),
        mealType,
        breakdown
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-cultural">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Calculator" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-lg text-foreground">Kalkulator Budget</h3>
          <p className="text-sm text-muted-foreground">Tentukan budget masakan Anda</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Budget Total"
            type="number"
            placeholder="50000"
            value={budget}
            onChange={(e) => setBudget(e?.target?.value)}
            description="Masukkan budget dalam Rupiah"
          />
          
          <Input
            label="Jumlah Porsi"
            type="number"
            placeholder="4"
            value={servings}
            onChange={(e) => setServings(e?.target?.value)}
            description="Berapa porsi yang dibutuhkan"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Jenis Makanan</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {mealTypes?.map((meal) => (
              <button
                key={meal?.id}
                onClick={() => setMealType(meal?.id)}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mealType === meal?.id
                    ? 'bg-primary text-primary-foreground shadow-cultural'
                    : 'bg-muted text-muted-foreground hover:bg-primary/10'
                }`}
              >
                {meal?.label}
              </button>
            ))}
          </div>
        </div>

        {budgetBreakdown && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-foreground">Perkiraan Pembagian Budget</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Per Porsi:</span>
                <span className="font-medium text-foreground">{formatCurrency(budgetBreakdown?.perServing)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bahan Utama:</span>
                <span className="font-medium text-foreground">{formatCurrency(budgetBreakdown?.ingredients)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bumbu:</span>
                <span className="font-medium text-foreground">{formatCurrency(budgetBreakdown?.seasonings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tambahan:</span>
                <span className="font-medium text-foreground">{formatCurrency(budgetBreakdown?.extras)}</span>
              </div>
            </div>
          </div>
        )}

        <Button
          variant="default"
          fullWidth
          iconName="Search"
          iconPosition="left"
          onClick={handleSetBudget}
          disabled={!budget || !servings}
        >
          Cari Resep Sesuai Budget
        </Button>
      </div>
    </div>
  );
};

export default BudgetCalculator;