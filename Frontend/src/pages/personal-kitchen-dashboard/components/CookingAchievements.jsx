import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CookingAchievements = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const achievements = [
    {
      id: 1,
      title: "Master Rendang",
      description: "Berhasil memasak rendang dengan sempurna 5 kali",
      icon: "Award",
      category: "mastery",
      progress: 5,
      target: 5,
      completed: true,
      points: 500,
      unlockedDate: "15 Juni 2024",
      rarity: "legendary",
      badge: "🏆"
    },
    {
      id: 2,
      title: "Streak Champion",
      description: "Memasak setiap hari selama 30 hari berturut-turut",
      icon: "Flame",
      category: "consistency",
      progress: 12,
      target: 30,
      completed: false,
      points: 300,
      rarity: "epic",
      badge: "🔥"
    },
    {
      id: 3,
      title: "Budget Ninja",
      description: "Hemat budget belanja 6 bulan berturut-turut",
      icon: "PiggyBank",
      category: "budget",
      progress: 4,
      target: 6,
      completed: false,
      points: 250,
      rarity: "rare",
      badge: "💰"
    },
    {
      id: 4,
      title: "Explorer Nusantara",
      description: "Coba resep dari 10 daerah berbeda di Indonesia",
      icon: "Map",
      category: "exploration",
      progress: 7,
      target: 10,
      completed: false,
      points: 400,
      rarity: "epic",
      badge: "🗺️"
    },
    {
      id: 5,
      title: "Spice Master",
      description: "Gunakan 50 jenis bumbu dan rempah berbeda",
      icon: "Sparkles",
      category: "mastery",
      progress: 32,
      target: 50,
      completed: false,
      points: 350,
      rarity: "rare",
      badge: "✨"
    },
    {
      id: 6,
      title: "Community Helper",
      description: "Bagikan 20 resep ke komunitas",
      icon: "Users",
      category: "social",
      progress: 20,
      target: 20,
      completed: true,
      points: 200,
      unlockedDate: "8 Juni 2024",
      rarity: "common",
      badge: "👥"
    },
    {
      id: 7,
      title: "Speed Cook",
      description: "Selesaikan 15 resep dalam waktu kurang dari 30 menit",
      icon: "Zap",
      category: "skill",
      progress: 9,
      target: 15,
      completed: false,
      points: 180,
      rarity: "common",
      badge: "⚡"
    },
    {
      id: 8,
      title: "Healthy Choice",
      description: "Masak 25 resep sehat berturut-turut",
      icon: "Heart",
      category: "health",
      progress: 14,
      target: 25,
      completed: false,
      points: 220,
      rarity: "rare",
      badge: "❤️"
    }
  ];

  const categories = [
    { id: 'all', label: 'Semua', count: achievements?.length },
    { id: 'mastery', label: 'Keahlian', count: achievements?.filter(a => a?.category === 'mastery')?.length },
    { id: 'consistency', label: 'Konsistensi', count: achievements?.filter(a => a?.category === 'consistency')?.length },
    { id: 'budget', label: 'Budget', count: achievements?.filter(a => a?.category === 'budget')?.length },
    { id: 'exploration', label: 'Eksplorasi', count: achievements?.filter(a => a?.category === 'exploration')?.length },
    { id: 'social', label: 'Sosial', count: achievements?.filter(a => a?.category === 'social')?.length }
  ];

  const filteredAchievements = activeCategory === 'all' 
    ? achievements 
    : achievements?.filter(achievement => achievement?.category === activeCategory);

  const completedAchievements = achievements?.filter(a => a?.completed);
  const totalPoints = completedAchievements?.reduce((sum, a) => sum + a?.points, 0);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      case 'common': return 'from-gray-400 to-gray-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400';
      case 'epic': return 'border-purple-400';
      case 'rare': return 'border-blue-400';
      case 'common': return 'border-gray-400';
      default: return 'border-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Achievement Summary */}
      <div className="cultural-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Pencapaian Memasak</h2>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{totalPoints}</p>
            <p className="text-sm text-muted-foreground">Total Poin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-success/5 rounded-lg">
            <Icon name="Trophy" size={24} className="text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{completedAchievements?.length}</p>
            <p className="text-sm text-muted-foreground">Pencapaian Selesai</p>
          </div>
          
          <div className="text-center p-4 bg-warning/5 rounded-lg">
            <Icon name="Target" size={24} className="text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{achievements?.length - completedAchievements?.length}</p>
            <p className="text-sm text-muted-foreground">Sedang Berlangsung</p>
          </div>
          
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <Icon name="Star" size={24} className="text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {Math.round((completedAchievements?.length / achievements?.length) * 100)}%
            </p>
            <p className="text-sm text-muted-foreground">Tingkat Penyelesaian</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Progress Keseluruhan</span>
            <span className="text-sm text-muted-foreground">
              {completedAchievements?.length}/{achievements?.length}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary to-success h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedAchievements?.length / achievements?.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      {/* Category Filter */}
      <div className="cultural-card p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => setActiveCategory(category?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === category?.id
                  ? 'bg-primary text-primary-foreground shadow-cultural'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <span>{category?.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeCategory === category?.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-foreground/10 text-foreground'
              }`}>
                {category?.count}
              </span>
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAchievements?.map((achievement) => (
            <div 
              key={achievement?.id} 
              className={`relative p-6 rounded-lg border-2 transition-all duration-300 hover:shadow-cultural-lg ${
                achievement?.completed 
                  ? `bg-gradient-to-br ${getRarityColor(achievement?.rarity)} text-white ${getRarityBorder(achievement?.rarity)}`
                  : 'bg-card border-border hover:border-primary/30'
              }`}
            >
              {achievement?.completed && (
                <div className="absolute top-3 right-3">
                  <Icon name="CheckCircle" size={20} className="text-white" />
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  achievement?.completed 
                    ? 'bg-white/20' :'bg-primary/10'
                }`}>
                  <Icon 
                    name={achievement?.icon} 
                    size={24} 
                    className={achievement?.completed ? 'text-white' : 'text-primary'} 
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className={`font-bold ${
                      achievement?.completed ? 'text-white' : 'text-foreground'
                    }`}>
                      {achievement?.title}
                    </h3>
                    <span className="text-lg">{achievement?.badge}</span>
                  </div>

                  <p className={`text-sm mb-3 ${
                    achievement?.completed ? 'text-white/90' : 'text-muted-foreground'
                  }`}>
                    {achievement?.description}
                  </p>

                  {achievement?.completed ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/90">
                        Selesai: {achievement?.unlockedDate}
                      </span>
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                        +{achievement?.points} poin
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">
                          Progress: {achievement?.progress}/{achievement?.target}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round((achievement?.progress / achievement?.target) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mb-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(achievement?.progress / achievement?.target) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground capitalize">
                          {achievement?.rarity}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {achievement?.points} poin
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAchievements?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Trophy" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Pencapaian</h3>
            <p className="text-muted-foreground mb-4">
              Mulai memasak untuk membuka pencapaian pertama Anda
            </p>
            <Button variant="default" iconName="ChefHat" iconPosition="left">
              Mulai Memasak
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookingAchievements;