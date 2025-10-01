import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import all dashboard components
import DashboardStats from './components/DashboardStats';
import SavedRecipesSection from './components/SavedRecipesSection';
import BudgetTracker from './components/BudgetTracker';
import CookingAchievements from './components/CookingAchievements';
import WeeklyMealPlanner from './components/WeeklyMealPlanner';
import ShoppingHistory from './components/ShoppingHistory';
import PreferencesSettings from './components/PreferencesSettings';

const PersonalKitchenDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const navigationSections = [
    { id: 'overview', label: 'Ringkasan', icon: 'LayoutDashboard' },
    { id: 'recipes', label: 'Resep Tersimpan', icon: 'BookOpen' },
    { id: 'meal-planner', label: 'Perencanaan Makan', icon: 'Calendar' },
    { id: 'budget', label: 'Budget Tracker', icon: 'Wallet' },
    { id: 'shopping', label: 'Riwayat Belanja', icon: 'ShoppingCart' },
    { id: 'achievements', label: 'Pencapaian', icon: 'Trophy' },
    { id: 'preferences', label: 'Pengaturan', icon: 'Settings' }
  ];

  const userProfile = {
    name: "Sari Dewi",
    email: "sari.dewi@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    joinDate: "Bergabung sejak Maret 2024",
    level: "Master Chef",
    totalRecipes: 47,
    cookingStreak: 12,
    achievements: 8
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            <DashboardStats />
            {/* Quick Actions */}
            <div className="cultural-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Aksi Cepat</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  fullWidth 
                  iconName="Search" 
                  iconPosition="left"
                  onClick={() => window.location.href = '/ai-recipe-search'}
                >
                  Cari Resep AI
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth 
                  iconName="Plus" 
                  iconPosition="left"
                  onClick={() => setActiveSection('meal-planner')}
                >
                  Tambah ke Meal Plan
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth 
                  iconName="ShoppingCart" 
                  iconPosition="left"
                  onClick={() => window.location.href = '/smart-shopping-assistant'}
                >
                  Belanja Pintar
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth 
                  iconName="Globe" 
                  iconPosition="left"
                  onClick={() => window.location.href = '/cultural-heritage-explorer'}
                >
                  Jelajahi Budaya
                </Button>
              </div>
            </div>
            {/* Recent Activity */}
            <div className="cultural-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Aktivitas Terbaru</h2>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    type: 'recipe_saved',
                    title: 'Menyimpan resep Rendang Daging Sapi',
                    time: '2 jam lalu',
                    icon: 'BookOpen',
                    color: 'text-primary'
                  },
                  {
                    id: 2,
                    type: 'cooking_completed',
                    title: 'Berhasil memasak Gado-Gado Jakarta',
                    time: '1 hari lalu',
                    icon: 'ChefHat',
                    color: 'text-success'
                  },
                  {
                    id: 3,
                    type: 'achievement_unlocked',
                    title: 'Membuka pencapaian "Community Helper"',
                    time: '2 hari lalu',
                    icon: 'Trophy',
                    color: 'text-warning'
                  },
                  {
                    id: 4,
                    type: 'shopping_completed',
                    title: 'Berbelanja bahan untuk Soto Ayam',
                    time: '3 hari lalu',
                    icon: 'ShoppingBag',
                    color: 'text-turmeric'
                  }
                ]?.map((activity) => (
                  <div key={activity?.id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                    <div className={`p-2 rounded-lg bg-muted ${activity?.color}`}>
                      <Icon name={activity?.icon} size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{activity?.title}</p>
                      <p className="text-sm text-muted-foreground">{activity?.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'recipes':
        return <SavedRecipesSection />;
      case 'meal-planner':
        return <WeeklyMealPlanner />;
      case 'budget':
        return <BudgetTracker />;
      case 'shopping':
        return <ShoppingHistory />;
      case 'achievements':
        return <CookingAchievements />;
      case 'preferences':
        return <PreferencesSettings />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="cultural-card p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <img
                  src={userProfile?.avatar}
                  alt={userProfile?.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
                  <Icon name="Check" size={12} className="text-success-foreground" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{userProfile?.name}</h1>
                    <p className="text-muted-foreground">{userProfile?.email}</p>
                    <p className="text-sm text-muted-foreground">{userProfile?.joinDate}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">{userProfile?.level}</p>
                      <p className="text-xs text-muted-foreground">Level</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{userProfile?.totalRecipes}</p>
                      <p className="text-xs text-muted-foreground">Resep</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-accent">{userProfile?.cookingStreak}</p>
                      <p className="text-xs text-muted-foreground">Streak</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="cultural-card p-6 sticky top-24">
                <h2 className="font-semibold text-foreground mb-4">Navigasi Dashboard</h2>
                <nav className="space-y-2">
                  {navigationSections?.map((section) => (
                    <button
                      key={section?.id}
                      onClick={() => setActiveSection(section?.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeSection === section?.id
                          ? 'bg-primary text-primary-foreground shadow-cultural'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={section?.icon} size={18} />
                      <span>{section?.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-medium text-foreground mb-3">Statistik Cepat</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Resep Dicoba</span>
                      <span className="font-medium text-foreground">23</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Budget Hemat</span>
                      <span className="font-medium text-success">Rp 450k</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Pencapaian</span>
                      <span className="font-medium text-warning">{userProfile?.achievements}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {renderSectionContent()}
            </div>
          </div>
        </div>
      </div>
      {/* Cultural Trust Signal */}
      <div className="bg-primary/5 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="trust-signal justify-center mb-4">
              <Icon name="Shield" size={20} className="text-success" />
              <span className="font-medium">Data Aman & Terenkripsi</span>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <span>10,000+ Keluarga Terpercaya</span>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <span>Resep Asli Indonesia</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date()?.getFullYear()} AI Resepku. Melestarikan warisan kuliner Indonesia dengan teknologi modern.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalKitchenDashboard;