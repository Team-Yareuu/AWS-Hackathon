import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const BudgetFriendlySection = () => {
  const navigate = useNavigate();
  const [selectedBudget, setSelectedBudget] = useState('25000');

  const budgetRanges = [
    { value: '15000', label: 'Rp 15.000', description: 'Hemat Maksimal' },
    { value: '25000', label: 'Rp 25.000', description: 'Budget Keluarga' },
    { value: '50000', label: 'Rp 50.000', description: 'Komfort Zone' },
    { value: '75000', label: 'Rp 75.000', description: 'Premium Choice' }
  ];

  const budgetRecipes = {
    '15000': [
      {
        id: 1,
        title: "Nasi Goreng Kampung",
        description: "Nasi goreng sederhana dengan telur dan sayuran yang ada di rumah",
        image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300&h=200&fit=crop",
        actualCost: "Rp 12.500",
        servings: 3,
        cookingTime: "20 menit",
        ingredients: ["Nasi sisa", "Telur", "Bawang merah", "Cabai", "Kecap manis"],
        savings: "Rp 2.500"
      },
      {
        id: 2,
        title: "Sayur Bayam Bening",
        description: "Sayur bayam segar dengan jagung manis yang bergizi tinggi",
        image: "https://images.pixabay.com/photo/2019/11/20/08/31/soup-4639743_1280.jpg?w=300&h=200&fit=crop",
        actualCost: "Rp 8.000",
        servings: 4,
        cookingTime: "15 menit",
        ingredients: ["Bayam", "Jagung manis", "Bawang putih", "Garam"],
        savings: "Rp 7.000"
      },
      {
        id: 3,
        title: "Tempe Goreng Krispy",
        description: "Tempe goreng tepung yang renyah dan gurih untuk lauk sehari-hari",
        image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=300&h=200&fit=crop",
        actualCost: "Rp 10.000",
        servings: 4,
        cookingTime: "25 menit",
        ingredients: ["Tempe", "Tepung terigu", "Bawang putih", "Garam"],
        savings: "Rp 5.000"
      }
    ],
    '25000': [
      {
        id: 4,
        title: "Ayam Kecap Sederhana",
        description: "Ayam kecap manis yang lezat dengan bumbu dapur yang mudah didapat",
        image: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?w=300&h=200&fit=crop",
        actualCost: "Rp 22.000",
        servings: 4,
        cookingTime: "45 menit",
        ingredients: ["Ayam potong", "Kecap manis", "Bawang bombay", "Tomat"],
        savings: "Rp 3.000"
      },
      {
        id: 5,
        title: "Gado-Gado Mini",
        description: "Gado-gado porsi keluarga dengan bumbu kacang buatan sendiri",
        image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300&h=200&fit=crop",
        actualCost: "Rp 18.500",
        servings: 4,
        cookingTime: "30 menit",
        ingredients: ["Sayuran rebus", "Tahu", "Tempe", "Kacang tanah"],
        savings: "Rp 6.500"
      },
      {
        id: 6,
        title: "Soto Ayam Kampung",
        description: "Soto ayam hangat dengan kuah bening yang menyegarkan",
        image: "https://images.pixabay.com/photo/2019/11/20/08/31/soup-4639743_1280.jpg?w=300&h=200&fit=crop",
        actualCost: "Rp 24.000",
        servings: 5,
        cookingTime: "1 jam",
        ingredients: ["Ayam kampung", "Bumbu soto", "Mie soun", "Telur rebus"],
        savings: "Rp 1.000"
      }
    ],
    '50000': [
      {
        id: 7,
        title: "Rendang Daging Mini",
        description: "Rendang daging sapi porsi kecil dengan bumbu lengkap khas Padang",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
        actualCost: "Rp 45.000",
        servings: 6,
        cookingTime: "3 jam",
        ingredients: ["Daging sapi", "Santan", "Bumbu rendang", "Cabai merah"],
        savings: "Rp 5.000"
      },
      {
        id: 8,
        title: "Ikan Bakar Kecap",
        description: "Ikan bakar dengan bumbu kecap manis yang menggugah selera",
        image: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?w=300&h=200&fit=crop",
        actualCost: "Rp 38.000",
        servings: 4,
        cookingTime: "40 menit",
        ingredients: ["Ikan bandeng", "Kecap manis", "Bumbu bakar", "Jeruk nipis"],
        savings: "Rp 12.000"
      },
      {
        id: 9,
        title: "Gudeg Jogja Express",
        description: "Gudeg khas Yogyakarta versi cepat dengan rasa autentik",
        image: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?w=300&h=200&fit=crop",
        actualCost: "Rp 42.500",
        servings: 5,
        cookingTime: "2 jam",
        ingredients: ["Nangka muda", "Santan", "Gula jawa", "Bumbu gudeg"],
        savings: "Rp 7.500"
      }
    ],
    '75000': [
      {
        id: 10,
        title: "Bebek Goreng Kremes",
        description: "Bebek goreng dengan kremes renyah dan sambal yang pedas mantap",
        image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=300&h=200&fit=crop",
        actualCost: "Rp 68.000",
        servings: 6,
        cookingTime: "2.5 jam",
        ingredients: ["Bebek muda", "Bumbu ungkep", "Tepung kremes", "Sambal"],
        savings: "Rp 7.000"
      },
      {
        id: 11,
        title: "Seafood Asam Pedas",
        description: "Seafood segar dengan kuah asam pedas yang menggugah selera",
        image: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?w=300&h=200&fit=crop",
        actualCost: "Rp 72.000",
        servings: 5,
        cookingTime: "1 jam",
        ingredients: ["Udang", "Cumi", "Bumbu asam pedas", "Sayuran"],
        savings: "Rp 3.000"
      },
      {
        id: 12,
        title: "Kambing Gulai Spesial",
        description: "Gulai kambing dengan bumbu rempah lengkap dan santan kental",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
        actualCost: "Rp 70.500",
        servings: 8,
        cookingTime: "3 jam",
        ingredients: ["Daging kambing", "Santan kental", "Bumbu gulai", "Kentang"],
        savings: "Rp 4.500"
      }
    ]
  };

  const currentRecipes = budgetRecipes?.[selectedBudget] || [];
  const currentBudgetInfo = budgetRanges?.find(b => b?.value === selectedBudget);

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe-detail/${recipe?.id}`, { state: { recipeId: recipe?.id, recipe } });
  };

  const handleSmartShopping = () => {
    navigate('/smart-shopping-assistant', { state: { budget: selectedBudget } });
  };

  const getTotalSavings = () => {
    return currentRecipes?.reduce((total, recipe) => {
      const savings = parseInt(recipe?.savings?.replace(/[^\d]/g, ''));
      return total + savings;
    }, 0);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-success/5 via-background to-turmeric/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 text-success mb-4">
            <Icon name="Wallet" size={20} />
            <span className="text-sm font-medium uppercase tracking-wide">Budget Hemat</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            Masak Enak dengan Budget Terbatas
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Temukan resep lezat yang sesuai dengan budget Anda. AI kami akan membantu 
            mengoptimalkan belanja dan memberikan alternatif bahan yang lebih hemat.
          </p>
        </div>

        {/* Budget Selector */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {budgetRanges?.map((budget) => (
              <button
                key={budget?.value}
                onClick={() => setSelectedBudget(budget?.value)}
                className={`px-6 py-4 rounded-2xl border-2 transition-all duration-200 ${
                  selectedBudget === budget?.value
                    ? 'border-success bg-success text-white shadow-cultural'
                    : 'border-border bg-white hover:border-success/50 hover:shadow-cultural'
                }`}
              >
                <div className="text-center">
                  <p className="font-bold text-lg">{budget?.label}</p>
                  <p className="text-sm opacity-80">{budget?.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Budget Summary */}
          <div className="bg-white rounded-2xl shadow-cultural p-6 max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="bg-success/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="Target" size={24} className="text-success" />
                </div>
                <p className="text-sm text-muted-foreground">Budget Target</p>
                <p className="text-xl font-bold text-success">{currentBudgetInfo?.label}</p>
              </div>
              
              <div className="space-y-2">
                <div className="bg-turmeric/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="ChefHat" size={24} className="text-turmeric" />
                </div>
                <p className="text-sm text-muted-foreground">Resep Tersedia</p>
                <p className="text-xl font-bold text-turmeric">{currentRecipes?.length} Resep</p>
              </div>
              
              <div className="space-y-2">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="TrendingDown" size={24} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Total Hemat</p>
                <p className="text-xl font-bold text-primary">Rp {getTotalSavings()?.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentRecipes?.map((recipe) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Savings Badge */}
                <div className="absolute top-3 left-3">
                  <div className="bg-success text-white px-3 py-1 rounded-full flex items-center space-x-1">
                    <Icon name="TrendingDown" size={12} />
                    <span className="text-xs font-medium">Hemat {recipe?.savings}</span>
                  </div>
                </div>

                {/* Actual Cost */}
                <div className="absolute bottom-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-bold text-success">{recipe?.actualCost}</span>
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

                {/* Recipe Stats */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={14} className="text-primary" />
                    <span className="text-sm text-muted-foreground">{recipe?.servings} porsi</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={14} className="text-turmeric" />
                    <span className="text-sm text-muted-foreground">{recipe?.cookingTime}</span>
                  </div>
                </div>

                {/* Ingredients Preview */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Bahan Utama:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {recipe?.ingredients?.slice(0, 3)?.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                      >
                        {ingredient}
                      </span>
                    ))}
                    {recipe?.ingredients?.length > 3 && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        +{recipe?.ingredients?.length - 3} lagi
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Smart Shopping CTA */}
        <div className="bg-gradient-to-r from-success to-turmeric rounded-2xl p-8 text-center text-white">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-heading font-bold">
                Belanja Lebih Hemat dengan AI Shopping Assistant
              </h3>
              <p className="text-white/90">
                Dapatkan rekomendasi toko termurah, bandingkan harga real-time, 
                dan temukan promo terbaik untuk bahan masakan Anda.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleSmartShopping}
                iconName="ShoppingCart"
                iconPosition="left"
                className="bg-white text-success hover:bg-white/90"
              >
                Mulai Belanja Pintar
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate('/ai-recipe-search')}
                iconName="Search"
                iconPosition="left"
                className="text-white border-white hover:bg-white/10"
              >
                Cari Resep Lain
              </Button>
            </div>

            {/* Money Saving Tips */}
            <div className="pt-6 border-t border-white/20">
              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <Icon name="Percent" size={16} />
                  <span>Hemat hingga 40%</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Icon name="MapPin" size={16} />
                  <span>Toko terdekat</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Icon name="Bell" size={16} />
                  <span>Alert promo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BudgetFriendlySection;
