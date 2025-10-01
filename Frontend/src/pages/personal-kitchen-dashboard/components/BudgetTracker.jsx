import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const BudgetTracker = () => {
  const [activeView, setActiveView] = useState('monthly');

  const monthlyData = [
    { month: 'Jan', budget: 800000, spent: 650000, saved: 150000 },
    { month: 'Feb', budget: 800000, spent: 720000, saved: 80000 },
    { month: 'Mar', budget: 800000, spent: 580000, saved: 220000 },
    { month: 'Apr', budget: 800000, spent: 690000, saved: 110000 },
    { month: 'Mei', budget: 800000, spent: 750000, saved: 50000 },
    { month: 'Jun', budget: 800000, spent: 620000, saved: 180000 }
  ];

  const categoryData = [
    { name: 'Protein', value: 35, amount: 280000, color: '#2D5A27' },
    { name: 'Sayuran', value: 25, amount: 200000, color: '#228B22' },
    { name: 'Bumbu & Rempah', value: 20, amount: 160000, color: '#D2691E' },
    { name: 'Karbohidrat', value: 15, amount: 120000, color: '#8B4513' },
    { name: 'Lainnya', value: 5, amount: 40000, color: '#FF6B35' }
  ];

  const currentMonth = {
    budget: 800000,
    spent: 620000,
    remaining: 180000,
    percentageUsed: 77.5,
    daysLeft: 8,
    avgDaily: 77500
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const formatCompactCurrency = (amount) => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000)?.toFixed(1)}jt`;
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000)?.toFixed(0)}rb`;
    }
    return formatCurrency(amount);
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview Card */}
      <div className="cultural-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Budget Belanja</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveView('monthly')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'monthly' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setActiveView('category')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'category' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Kategori
            </button>
          </div>
        </div>

        {/* Current Month Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <Icon name="Target" size={24} className="text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Budget Bulanan</p>
            <p className="text-lg font-bold text-foreground">{formatCompactCurrency(currentMonth?.budget)}</p>
          </div>
          
          <div className="text-center p-4 bg-warning/5 rounded-lg">
            <Icon name="ShoppingCart" size={24} className="text-warning mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Sudah Digunakan</p>
            <p className="text-lg font-bold text-foreground">{formatCompactCurrency(currentMonth?.spent)}</p>
          </div>
          
          <div className="text-center p-4 bg-success/5 rounded-lg">
            <Icon name="PiggyBank" size={24} className="text-success mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Sisa Budget</p>
            <p className="text-lg font-bold text-foreground">{formatCompactCurrency(currentMonth?.remaining)}</p>
          </div>
          
          <div className="text-center p-4 bg-accent/5 rounded-lg">
            <Icon name="TrendingUp" size={24} className="text-accent mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Rata-rata Harian</p>
            <p className="text-lg font-bold text-foreground">{formatCompactCurrency(currentMonth?.avgDaily)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Penggunaan Budget</span>
            <span className="text-sm text-muted-foreground">{currentMonth?.percentageUsed}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary to-turmeric h-3 rounded-full transition-all duration-500"
              style={{ width: `${currentMonth?.percentageUsed}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {currentMonth?.daysLeft} hari tersisa bulan ini
          </p>
        </div>
      </div>
      {/* Charts */}
      <div className="cultural-card p-6">
        {activeView === 'monthly' ? (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Tren Pengeluaran 6 Bulan Terakhir</h3>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickFormatter={(value) => formatCompactCurrency(value)}
                  />
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(value), name === 'spent' ? 'Digunakan' : name === 'budget' ? 'Budget' : 'Hemat']}
                    labelStyle={{ color: 'var(--color-foreground)' }}
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
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Pengeluaran per Kategori</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry?.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [`${value}%`, props?.payload?.name]}
                      labelFormatter={() => ''}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                {categoryData?.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category?.color }}
                      ></div>
                      <span className="font-medium text-foreground">{category?.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{formatCompactCurrency(category?.amount)}</p>
                      <p className="text-sm text-muted-foreground">{category?.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Quick Actions */}
      <div className="cultural-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
            <Icon name="Plus" size={20} className="text-primary" />
            <div className="text-left">
              <p className="font-medium text-foreground">Tambah Pengeluaran</p>
              <p className="text-sm text-muted-foreground">Catat belanja manual</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-turmeric/5 hover:bg-turmeric/10 rounded-lg transition-colors">
            <Icon name="Settings" size={20} className="text-turmeric" />
            <div className="text-left">
              <p className="font-medium text-foreground">Atur Budget</p>
              <p className="text-sm text-muted-foreground">Ubah target bulanan</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-success/5 hover:bg-success/10 rounded-lg transition-colors">
            <Icon name="Download" size={20} className="text-success" />
            <div className="text-left">
              <p className="font-medium text-foreground">Ekspor Data</p>
              <p className="text-sm text-muted-foreground">Download laporan</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;