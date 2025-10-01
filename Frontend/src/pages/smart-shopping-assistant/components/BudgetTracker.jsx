import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const BudgetTracker = ({ monthlyBudget, onSetBudget }) => {
  const [newBudget, setNewBudget] = useState(monthlyBudget || '');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const currentDate = new Date();
  const currentMonth = currentDate?.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  const budgetData = {
    month: {
      total: monthlyBudget || 1500000,
      spent: 1125000,
      remaining: 375000,
      categories: [
        { name: 'Protein', spent: 450000, budget: 600000, color: '#2D5A27' },
        { name: 'Sayuran', spent: 225000, budget: 300000, color: '#8B4513' },
        { name: 'Bumbu', spent: 150000, budget: 200000, color: '#FF6B35' },
        { name: 'Biji-bijian', spent: 180000, budget: 250000, color: '#D97706' },
        { name: 'Lainnya', spent: 120000, budget: 150000, color: '#059669' }
      ]
    },
    week: {
      total: (monthlyBudget || 1500000) / 4,
      spent: 280000,
      remaining: 95000,
      categories: [
        { name: 'Protein', spent: 112000, budget: 150000, color: '#2D5A27' },
        { name: 'Sayuran', spent: 56000, budget: 75000, color: '#8B4513' },
        { name: 'Bumbu', spent: 38000, budget: 50000, color: '#FF6B35' },
        { name: 'Biji-bijian', spent: 45000, budget: 62500, color: '#D97706' },
        { name: 'Lainnya', spent: 29000, budget: 37500, color: '#059669' }
      ]
    }
  };

  const monthlyHistory = [
    { month: 'Jun', budget: 1500000, spent: 1420000, saved: 80000 },
    { month: 'Jul', budget: 1500000, spent: 1380000, saved: 120000 },
    { month: 'Agu', budget: 1500000, spent: 1450000, saved: 50000 },
    { month: 'Sep', budget: 1500000, spent: 1125000, saved: 375000 }
  ];

  const currentData = budgetData?.[selectedPeriod];
  const spentPercentage = (currentData?.spent / currentData?.total) * 100;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const getBudgetStatus = (percentage) => {
    if (percentage <= 70) return { status: 'good', color: 'text-success', bgColor: 'bg-success/10' };
    if (percentage <= 90) return { status: 'warning', color: 'text-warning', bgColor: 'bg-warning/10' };
    return { status: 'danger', color: 'text-destructive', bgColor: 'bg-destructive/10' };
  };

  const budgetStatus = getBudgetStatus(spentPercentage);

  const pieData = currentData?.categories?.map(cat => ({
    name: cat?.name,
    value: cat?.spent,
    color: cat?.color
  }));

  const handleSetBudget = () => {
    if (newBudget) {
      onSetBudget(parseFloat(newBudget));
      setNewBudget('');
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-cultural">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="PiggyBank" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Budget Tracker</h3>
            <p className="text-sm text-muted-foreground">Monitor pengeluaran belanja {currentMonth}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'week' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-primary/10'
            }`}
          >
            Minggu
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'month' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-primary/10'
            }`}
          >
            Bulan
          </button>
        </div>
      </div>
      {/* Budget Overview */}
      <div className={`rounded-lg p-4 mb-6 ${budgetStatus?.bgColor}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-foreground">Budget {selectedPeriod === 'month' ? 'Bulanan' : 'Mingguan'}</h4>
          <span className={`text-sm font-medium ${budgetStatus?.color}`}>
            {spentPercentage?.toFixed(1)}% terpakai
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Budget:</span>
            <span className="font-medium text-foreground">{formatCurrency(currentData?.total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sudah Digunakan:</span>
            <span className={`font-medium ${budgetStatus?.color}`}>{formatCurrency(currentData?.spent)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sisa Budget:</span>
            <span className="font-medium text-success">{formatCurrency(currentData?.remaining)}</span>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                budgetStatus?.status === 'good' ? 'bg-success' :
                budgetStatus?.status === 'warning' ? 'bg-warning' : 'bg-destructive'
              }`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-medium text-foreground mb-3">Pengeluaran per Kategori</h4>
          <div className="bg-muted/30 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-foreground mb-3">Detail Kategori</h4>
          <div className="space-y-3">
            {currentData?.categories?.map((category, index) => {
              const categoryPercentage = (category?.spent / category?.budget) * 100;
              return (
                <div key={index} className="bg-background rounded-lg p-3 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category?.color }}
                      ></div>
                      <span className="font-medium text-foreground">{category?.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {categoryPercentage?.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{formatCurrency(category?.spent)}</span>
                    <span className="text-muted-foreground">dari {formatCurrency(category?.budget)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(categoryPercentage, 100)}%`,
                        backgroundColor: category?.color
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Monthly History */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-3">Riwayat 4 Bulan Terakhir</h4>
        <div className="bg-muted/30 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `${value/1000000}M`}
              />
              <Tooltip 
                formatter={(value, name) => [
                  formatCurrency(value), 
                  name === 'spent' ? 'Pengeluaran' : name === 'budget' ? 'Budget' : 'Hemat'
                ]}
                contentStyle={{ 
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="budget" fill="var(--color-muted)" name="budget" />
              <Bar dataKey="spent" fill="var(--color-primary)" name="spent" />
              <Bar dataKey="saved" fill="var(--color-success)" name="saved" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Budget Settings */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Atur Budget Bulanan</h4>
        <div className="flex space-x-3">
          <input
            type="number"
            placeholder="1500000"
            value={newBudget}
            onChange={(e) => setNewBudget(e?.target?.value)}
            className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Button
            variant="default"
            iconName="Save"
            iconPosition="left"
            onClick={handleSetBudget}
            disabled={!newBudget}
          >
            Simpan Budget
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Budget saat ini: {formatCurrency(currentData?.total)}
        </p>
      </div>
      {/* Tips */}
      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={16} className="text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Tips Menghemat Budget:</p>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>• Beli bahan dalam jumlah besar saat ada diskon</li>
              <li>• Manfaatkan bahan musiman yang lebih murah</li>
              <li>• Bandingkan harga di berbagai marketplace</li>
              <li>• Gunakan substitusi bahan yang lebih ekonomis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;