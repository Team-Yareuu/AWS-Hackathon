import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FeaturedRecipes = () => {
  const navigate = useNavigate();

  const featuredRecipes = [
    {
      id: 1,
      title: "Nasi Goreng Telur Warkop",
      description: "Nasi goreng simpel pakai telur dan daun bawang andalan anak kos saat tanggal tua",
      image: "https://images.unsplash.com/photo-1604908554027-912f4c4bdcb4?w=400&h=300&fit=crop",
      region: "Nusantara",
      cookingTime: "15 menit",
      difficulty: "Mudah",
      budget: "Rp 12.000",
      servings: 1,
      rating: 4.7,
      reviews: 120,
      tags: ["Praktis", "Murah", "Telur"],
      isPopular: true,
      isBudgetFriendly: true
    },
    {
      id: 2,
      title: "Ayam Goreng Kecap Hemat",
      description: "Potongan ayam kecil dimarinasi sederhana lalu ditumis kecap manis gurih, nasi nambah",
      image: "https://images.unsplash.com/photo-1599120011070-16a9a8f2a5d3?w=400&h=300&fit=crop",
      region: "Jawa",
      cookingTime: "25 menit",
      difficulty: "Mudah",
      budget: "Rp 18.000",
      servings: 2,
      rating: 4.6,
      reviews: 86,
      tags: ["Rumahan", "Protein", "Kecap"],
      isNew: true,
      isBudgetFriendly: true
    },
    {
      id: 3,
      title: "Tumis Kangkung Bawang Putih",
      description: "Sayur tumis 3 bahan: kangkung, bawang putih, cabai segar dan super cepat",
      image: "https://images.unsplash.com/photo-1625944529558-7a6a2b0ca78d?w=400&h=300&fit=crop",
      region: "Nusantara",
      cookingTime: "10 menit",
      difficulty: "Mudah",
      budget: "Rp 8.000",
      servings: 2,
      rating: 4.5,
      reviews: 64,
      tags: ["Sehat", "Vegetarian", "Tumis"],
      isHealthy: true,
      isBudgetFriendly: true
    },
    {
      id: 4,
      title: "Sayur Sop Sederhana",
      description: "Sop bening isi wortel, kentang, kol, dan sosis/bakso opsional hangat dan hemat",
      image: "https://images.unsplash.com/photo-1617093727343-374698b1b08a?w=400&h=300&fit=crop",
      region: "Nusantara",
      cookingTime: "20 menit",
      difficulty: "Mudah",
      budget: "Rp 14.000",
      servings: 2,
      rating: 4.6,
      reviews: 75,
      tags: ["Berkuah", "Segar", "Rumahan"],
      isBudgetFriendly: true
    },
    {
      id: 5,
      title: "Tahu Tempe Cabai Garam",
      description: "Kriuk asin pedas modal tahu tempe lauk murah meriah favorit anak kos",
      image: "https://images.unsplash.com/photo-1580740097994-8e1f2f2bd2c8?w=400&h=300&fit=crop",
      region: "Nusantara",
      cookingTime: "15 menit",
      difficulty: "Mudah",
      budget: "Rp 10.000",
      servings: 2,
      rating: 4.7,
      reviews: 132,
      tags: ["Murah", "Kriuk", "Pedas"],
      isSpicy: true,
      isBudgetFriendly: true
    },
    {
      id: 6,
      title: "Mie Goreng Telur + Sayur",
      description: "Upgrade mie instan: tambah telur orak-arik dan sedikit sawi/kol biar lebih bergizi",
      image: "https://images.unsplash.com/photo-1585238342028-4bbc1a39ec2a?w=400&h=300&fit=crop",
      region: "Nusantara",
      cookingTime: "12 menit",
      difficulty: "Mudah",
      budget: "Rp 9.000",
      servings: 1,
      rating: 4.4,
      reviews: 58,
      tags: ["Instan", "Praktis", "Murah"],
      isSignature: true,
      isBudgetFriendly: true
    }
  ];


  const handleRecipeClick = (recipe) => {
    navigate('/recipe-detail', { state: { recipeId: recipe?.id, recipe } });
  };

  const handleViewAll = () => {
    navigate('/ai-recipe-search');
  };

  const getBadgeInfo = (recipe) => {
    if (recipe?.isPopular) return { text: "Populer", color: "bg-accent text-white", icon: "TrendingUp" };
    if (recipe?.isNew) return { text: "Baru", color: "bg-success text-white", icon: "Sparkles" };
    if (recipe?.isBudgetFriendly) return { text: "Hemat", color: "bg-turmeric text-white", icon: "Wallet" };
    if (recipe?.isHealthy) return { text: "Sehat", color: "bg-pandan text-white", icon: "Heart" };
    if (recipe?.isSpicy) return { text: "Pedas", color: "bg-chili text-white", icon: "Flame" };
    if (recipe?.isSignature) return { text: "Khas", color: "bg-primary text-white", icon: "Award" };
    return null;
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 text-primary mb-4">
            <Icon name="ChefHat" size={20} />
            <span className="text-sm font-medium uppercase tracking-wide">Resep Pilihan</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            Resep Terpopuler Indonesia
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Koleksi resep autentik yang telah dipercaya ribuan keluarga Indonesia.
            Dari yang tradisional hingga modern, semua dengan panduan AI yang mudah diikuti.
          </p>
        </div>

        {/* Recipe Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredRecipes?.map((recipe) => {
            const badge = getBadgeInfo(recipe);

            return (
              <div
                key={recipe?.id}
                className="cultural-card cursor-pointer group"
                onClick={() => handleRecipeClick(recipe)}
              >
                {/* Recipe Image */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={recipe?.image}
                    alt={recipe?.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                  {/* Badge */}
                  {badge && (
                    <div className="absolute top-3 left-3">
                      <div className={`${badge?.color} px-2 py-1 rounded-full flex items-center space-x-1`}>
                        <Icon name={badge?.icon} size={12} />
                        <span className="text-xs font-medium">{badge?.text}</span>
                      </div>
                    </div>
                  )}

                  {/* Region */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                      <Icon name="MapPin" size={12} className="text-primary" />
                      <span className="text-xs font-medium text-primary">{recipe?.region}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                      <Icon name="Star" size={12} className="text-turmeric fill-current" />
                      <span className="text-xs font-medium text-foreground">{recipe?.rating}</span>
                      <span className="text-xs text-muted-foreground">({recipe?.reviews})</span>
                    </div>
                  </div>
                </div>
                {/* Recipe Info */}
                <div className="p-4 space-y-3">
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                      {recipe?.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {recipe?.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {recipe?.tags?.slice(0, 3)?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Recipe Stats */}
                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border text-center">
                    <div>
                      <Icon name="Clock" size={14} className="text-turmeric mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">{recipe?.cookingTime}</p>
                    </div>
                    <div>
                      <Icon name="BarChart3" size={14} className="text-accent mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">{recipe?.difficulty}</p>
                    </div>
                    <div>
                      <Icon name="Users" size={14} className="text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">{recipe?.servings} porsi</p>
                    </div>
                    <div>
                      <Icon name="Wallet" size={14} className="text-success mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">{recipe?.budget}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleViewAll}
            iconName="ArrowRight"
            iconPosition="right"
            className="bg-white shadow-cultural hover:shadow-cultural-lg"
          >
            Lihat Semua Resep
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRecipes;