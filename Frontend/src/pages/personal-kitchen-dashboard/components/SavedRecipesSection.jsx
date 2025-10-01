import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SavedRecipesSection = () => {
  const [activeTab, setActiveTab] = useState('semua');

  const collections = [
    { id: 'semua', label: 'Semua', count: 47 },
    { id: 'favorit', label: 'Favorit', count: 12 },
    { id: 'mau-dicoba', label: 'Mau Dicoba', count: 18 },
    { id: 'sudah-dicoba', label: 'Sudah Dicoba', count: 23 }
  ];

  const savedRecipes = [
    {
      id: 1,
      title: "Rendang Daging Sapi Padang",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      cookingTime: "3 jam",
      difficulty: "Sulit",
      rating: 4.8,
      savedDate: "2 hari lalu",
      collection: "favorit",
      tried: true,
      budget: "Rp 85.000"
    },
    {
      id: 2,
      title: "Gado-Gado Jakarta",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      cookingTime: "45 menit",
      difficulty: "Mudah",
      rating: 4.6,
      savedDate: "5 hari lalu",
      collection: "mau-dicoba",
      tried: false,
      budget: "Rp 25.000"
    },
    {
      id: 3,
      title: "Soto Ayam Lamongan",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
      cookingTime: "1.5 jam",
      difficulty: "Sedang",
      rating: 4.7,
      savedDate: "1 minggu lalu",
      collection: "sudah-dicoba",
      tried: true,
      budget: "Rp 45.000"
    },
    {
      id: 4,
      title: "Nasi Gudeg Yogyakarta",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
      cookingTime: "4 jam",
      difficulty: "Sulit",
      rating: 4.9,
      savedDate: "3 hari lalu",
      collection: "favorit",
      tried: false,
      budget: "Rp 65.000"
    },
    {
      id: 5,
      title: "Ayam Betutu Bali",
      image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop",
      cookingTime: "6 jam",
      difficulty: "Sulit",
      rating: 4.8,
      savedDate: "1 minggu lalu",
      collection: "mau-dicoba",
      tried: false,
      budget: "Rp 75.000"
    },
    {
      id: 6,
      title: "Pempek Palembang",
      image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop",
      cookingTime: "2 jam",
      difficulty: "Sedang",
      rating: 4.5,
      savedDate: "4 hari lalu",
      collection: "sudah-dicoba",
      tried: true,
      budget: "Rp 35.000"
    }
  ];

  const filteredRecipes = activeTab === 'semua' 
    ? savedRecipes 
    : savedRecipes?.filter(recipe => recipe?.collection === activeTab);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Mudah': return 'text-success bg-success/10';
      case 'Sedang': return 'text-warning bg-warning/10';
      case 'Sulit': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="cultural-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Resep Tersimpan</h2>
        <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
          Tambah Koleksi
        </Button>
      </div>
      {/* Collection Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {collections?.map((collection) => (
          <button
            key={collection?.id}
            onClick={() => setActiveTab(collection?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === collection?.id
                ? 'bg-primary text-primary-foreground shadow-cultural'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <span>{collection?.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === collection?.id
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-foreground/10 text-foreground'
            }`}>
              {collection?.count}
            </span>
          </button>
        ))}
      </div>
      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes?.map((recipe) => (
          <div key={recipe?.id} className="group cursor-pointer">
            <div className="cultural-card overflow-hidden">
              <div className="relative">
                <Image
                  src={recipe?.image}
                  alt={recipe?.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button className="p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition-colors">
                    <Icon name="Heart" size={16} className="text-error fill-current" />
                  </button>
                  <button className="p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition-colors">
                    <Icon name="Share2" size={16} className="text-foreground" />
                  </button>
                </div>
                {recipe?.tried && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-success text-success-foreground text-xs font-medium rounded-full">
                      Sudah Dicoba
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {recipe?.title}
                </h3>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-warning fill-current" />
                    <span className="text-sm font-medium text-foreground">{recipe?.rating}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe?.difficulty)}`}>
                    {recipe?.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{recipe?.cookingTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Wallet" size={14} />
                    <span>{recipe?.budget}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Disimpan {recipe?.savedDate}
                  </span>
                  <Button variant="ghost" size="sm" iconName="ExternalLink">
                    Lihat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredRecipes?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="BookOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Resep</h3>
          <p className="text-muted-foreground mb-4">
            Mulai simpan resep favorit Anda untuk akses mudah
          </p>
          <Button variant="default" iconName="Search" iconPosition="left">
            Cari Resep
          </Button>
        </div>
      )}
    </div>
  );
};

export default SavedRecipesSection;