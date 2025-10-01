import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BudgetCalculator from './components/BudgetCalculator';
import RecipeCard from './components/RecipeCard';
import MarketplaceComparison from './components/MarketplaceComparison';
import ShoppingList from './components/ShoppingList';
import PriceTracker from './components/PriceTracker';
import BudgetTracker from './components/BudgetTracker';

const SmartShoppingAssistant = () => {
  const [currentBudget, setCurrentBudget] = useState(null);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [activeTab, setActiveTab] = useState('budget');
  const [monthlyBudget, setMonthlyBudget] = useState(1500000);
  const [priceAlerts, setPriceAlerts] = useState([]);

  // Mock recipe data based on budget
  const mockRecipes = [
    {
      id: 1,
      name: "Ayam Bakar Kecap",
      region: "Jawa Tengah",
      image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop",
      cookingTime: "45 menit",
      servings: 4,
      rating: 4.8,
      estimatedCost: 75000,
      actualCost: 68000,
      lastUpdated: "2 jam lalu",
      availableStores: 8,
      mainIngredients: [
        { name: "Ayam potong", price: 35000 },
        { name: "Kecap manis", price: 8000 },
        { name: "Bawang merah", price: 12000 },
        { name: "Bawang putih", price: 6000 },
        { name: "Cabai merah", price: 7000 }
      ]
    },
    {
      id: 2,
      name: "Gado-Gado Jakarta",
      region: "DKI Jakarta",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      cookingTime: "30 menit",
      servings: 4,
      rating: 4.6,
      estimatedCost: 45000,
      actualCost: 42000,
      lastUpdated: "1 jam lalu",
      availableStores: 12,
      mainIngredients: [
        { name: "Tahu", price: 8000 },
        { name: "Tempe", price: 6000 },
        { name: "Kangkung", price: 5000 },
        { name: "Tauge", price: 4000 },
        { name: "Kacang tanah", price: 15000 },
        { name: "Telur rebus", price: 4000 }
      ]
    },
    {
      id: 3,
      name: "Rendang Daging Sapi",
      region: "Sumatera Barat",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      cookingTime: "3 jam",
      servings: 6,
      rating: 4.9,
      estimatedCost: 120000,
      actualCost: 115000,
      lastUpdated: "30 menit lalu",
      availableStores: 6,
      mainIngredients: [
        { name: "Daging sapi", price: 80000 },
        { name: "Santan kelapa", price: 12000 },
        { name: "Cabai merah", price: 8000 },
        { name: "Bawang merah", price: 6000 },
        { name: "Lengkuas", price: 4000 },
        { name: "Serai", price: 3000 },
        { name: "Daun jeruk", price: 2000 }
      ]
    }
  ];

  const mockIngredients = [
    {
      id: 1,
      name: "Ayam potong",
      quantity: 1,
      unit: "kg",
      price: 35000,
      category: "protein",
      basePrice: 35000,
      prices: {
        tokopedia: 35000,
        shopee: 33000,
        blibli: 37000,
        gojek: 36000
      }
    },
    {
      id: 2,
      name: "Bawang merah",
      quantity: 0.5,
      unit: "kg",
      price: 16000,
      category: "spice",
      basePrice: 16000,
      prices: {
        tokopedia: 16000,
        shopee: 15500,
        blibli: 17000,
        gojek: 15000
      }
    },
    {
      id: 3,
      name: "Cabai merah",
      quantity: 0.25,
      unit: "kg",
      price: 11250,
      category: "spice",
      basePrice: 11250,
      prices: {
        tokopedia: 11250,
        shopee: 12000,
        blibli: 11500,
        gojek: 10800
      }
    },
    {
      id: 4,
      name: "Beras premium",
      quantity: 2,
      unit: "kg",
      price: 24000,
      category: "grain",
      basePrice: 24000,
      prices: {
        tokopedia: 24000,
        shopee: 23500,
        blibli: 25000,
        gojek: 24500
      }
    }
  ];

  const tabs = [
    { id: 'budget', label: 'Budget Calculator', icon: 'Calculator' },
    { id: 'recipes', label: 'Resep Rekomendasi', icon: 'ChefHat' },
    { id: 'comparison', label: 'Perbandingan Harga', icon: 'BarChart3' },
    { id: 'shopping', label: 'Daftar Belanja', icon: 'ShoppingCart' },
    { id: 'tracker', label: 'Pelacak Harga', icon: 'TrendingUp' },
    { id: 'budget-tracker', label: 'Budget Tracker', icon: 'PiggyBank' }
  ];

  useEffect(() => {
    // Simulate loading recommended recipes based on budget
    if (currentBudget) {
      const filteredRecipes = mockRecipes?.filter(recipe => 
        recipe?.actualCost <= currentBudget?.budget
      );
      setRecommendedRecipes(filteredRecipes);
    }
  }, [currentBudget]);

  const handleBudgetSet = (budgetData) => {
    setCurrentBudget(budgetData);
    setActiveTab('recipes');
  };

  const handleAddToCart = (recipe) => {
    const newItems = recipe?.mainIngredients?.map(ingredient => ({
      id: Date.now() + Math.random(),
      name: ingredient?.name,
      quantity: 1,
      unit: 'pcs',
      price: ingredient?.price,
      category: 'custom',
      recipeId: recipe?.id,
      recipeName: recipe?.name
    }));
    
    setShoppingList(prev => [...prev, ...newItems]);
    setActiveTab('shopping');
  };

  const handleViewDetails = (recipe) => {
    // Navigate to recipe detail page
    window.location.href = '/recipe-detail';
  };

  const handleSelectStore = (marketplace, ingredients) => {
    console.log('Selected store:', marketplace?.name, 'for ingredients:', ingredients);
    // Here you would typically redirect to the marketplace or open their app
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    setShoppingList(prev => 
      prev?.map(item => 
        item?.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setShoppingList(prev => prev?.filter(item => item?.id !== itemId));
  };

  const handleAddCustomItem = (item) => {
    setShoppingList(prev => [...prev, item]);
  };

  const handleSaveList = (listName) => {
    console.log('Saving list:', listName, shoppingList);
    // Here you would save to localStorage or send to backend
  };

  const handleShareList = () => {
    const listText = shoppingList?.map(item => 
      `${item?.name} - ${item?.quantity} ${item?.unit}`
    )?.join('\n');
    
    if (navigator.share) {
      navigator.share({
        title: 'Daftar Belanja AI Resepku',
        text: listText
      });
    } else {
      navigator.clipboard?.writeText(listText);
      alert('Daftar belanja telah disalin ke clipboard!');
    }
  };

  const handleSetPriceAlert = (alertData) => {
    setPriceAlerts(prev => [...prev, { ...alertData, id: Date.now() }]);
    console.log('Price alert set:', alertData);
  };

  const handleSetMonthlyBudget = (budget) => {
    setMonthlyBudget(budget);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
                Smart Shopping Assistant
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Belanja cerdas dengan budget terbatas. Temukan resep terbaik, bandingkan harga, 
                dan kelola pengeluaran dapur Anda dengan AI yang memahami kebutuhan keluarga Indonesia.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card rounded-lg p-4 text-center shadow-cultural">
                <Icon name="Calculator" size={24} className="text-primary mx-auto mb-2" />
                <p className="font-semibold text-foreground">Budget Smart</p>
                <p className="text-sm text-muted-foreground">Hitung budget optimal</p>
              </div>
              <div className="bg-card rounded-lg p-4 text-center shadow-cultural">
                <Icon name="TrendingDown" size={24} className="text-success mx-auto mb-2" />
                <p className="font-semibold text-foreground">Hemat 25%</p>
                <p className="text-sm text-muted-foreground">Rata-rata penghematan</p>
              </div>
              <div className="bg-card rounded-lg p-4 text-center shadow-cultural">
                <Icon name="Store" size={24} className="text-accent mx-auto mb-2" />
                <p className="font-semibold text-foreground">15+ Marketplace</p>
                <p className="text-sm text-muted-foreground">Perbandingan harga</p>
              </div>
              <div className="bg-card rounded-lg p-4 text-center shadow-cultural">
                <Icon name="Users" size={24} className="text-secondary mx-auto mb-2" />
                <p className="font-semibold text-foreground">50K+ Keluarga</p>
                <p className="text-sm text-muted-foreground">Sudah berhemat</p>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="bg-card border-b border-border sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 overflow-x-auto py-4">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground shadow-cultural'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {activeTab === 'budget' && (
              <div className="max-w-2xl mx-auto">
                <BudgetCalculator 
                  onBudgetSet={handleBudgetSet}
                  currentBudget={currentBudget?.budget}
                />
              </div>
            )}

            {activeTab === 'recipes' && (
              <div>
                {currentBudget ? (
                  <div>
                    <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon name="Target" size={20} className="text-primary" />
                        <div>
                          <h3 className="font-medium text-foreground">
                            Budget: Rp {currentBudget?.budget?.toLocaleString('id-ID')} untuk {currentBudget?.servings} porsi
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Jenis: {currentBudget?.mealType} • Ditemukan {recommendedRecipes?.length} resep sesuai budget
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommendedRecipes?.map((recipe) => (
                        <RecipeCard
                          key={recipe?.id}
                          recipe={recipe}
                          onAddToCart={handleAddToCart}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon name="Calculator" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-2">Tentukan Budget Terlebih Dahulu</h3>
                    <p className="text-muted-foreground mb-4">
                      Gunakan kalkulator budget untuk mendapatkan rekomendasi resep yang sesuai
                    </p>
                    <Button
                      variant="default"
                      iconName="Calculator"
                      iconPosition="left"
                      onClick={() => setActiveTab('budget')}
                    >
                      Hitung Budget
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comparison' && (
              <div>
                <MarketplaceComparison 
                  ingredients={mockIngredients}
                  onSelectStore={handleSelectStore}
                />
              </div>
            )}

            {activeTab === 'shopping' && (
              <div>
                <ShoppingList
                  items={shoppingList}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onAddCustomItem={handleAddCustomItem}
                  onSaveList={handleSaveList}
                  onShareList={handleShareList}
                />
              </div>
            )}

            {activeTab === 'tracker' && (
              <div>
                <PriceTracker onSetAlert={handleSetPriceAlert} />
              </div>
            )}

            {activeTab === 'budget-tracker' && (
              <div>
                <BudgetTracker 
                  monthlyBudget={monthlyBudget}
                  onSetBudget={handleSetMonthlyBudget}
                />
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
                Fitur Smart Shopping
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Teknologi AI yang membantu Anda berbelanja lebih cerdas dan menghemat budget keluarga
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 shadow-cultural">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Brain" size={24} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  AI Budget Optimizer
                </h3>
                <p className="text-muted-foreground text-sm">
                  Algoritma cerdas yang menganalisis pola belanja dan memberikan rekomendasi 
                  budget optimal berdasarkan kebutuhan keluarga Anda.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-cultural">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="BarChart3" size={24} className="text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  Real-time Price Comparison
                </h3>
                <p className="text-muted-foreground text-sm">
                  Bandingkan harga dari 15+ marketplace Indonesia secara real-time dan 
                  dapatkan notifikasi ketika ada diskon atau promo menarik.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-cultural">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Leaf" size={24} className="text-success" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  Seasonal Ingredient Alerts
                </h3>
                <p className="text-muted-foreground text-sm">
                  Dapatkan informasi bahan makanan musiman yang lebih murah dan berkualitas, 
                  serta tips substitusi untuk menghemat budget.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-cultural">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Truck" size={24} className="text-secondary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  Delivery Integration
                </h3>
                <p className="text-muted-foreground text-sm">
                  Terintegrasi dengan Gojek, Grab, dan layanan delivery lainnya untuk 
                  kemudahan berbelanja langsung dari aplikasi.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-cultural">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="PieChart" size={24} className="text-warning" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  Budget Analytics
                </h3>
                <p className="text-muted-foreground text-sm">
                  Analisis mendalam tentang pola pengeluaran dapur Anda dengan insights 
                  untuk mengoptimalkan budget bulanan keluarga.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-cultural">
                <div className="w-12 h-12 bg-turmeric/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Share2" size={24} className="text-turmeric" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  Family Shopping Lists
                </h3>
                <p className="text-muted-foreground text-sm">
                  Bagikan daftar belanja dengan anggota keluarga, sinkronisasi real-time, 
                  dan kolaborasi dalam perencanaan menu mingguan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">
              Mulai Berhemat Hari Ini
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Bergabung dengan 50,000+ keluarga Indonesia yang sudah menghemat budget dapur 
              hingga 25% dengan AI Resepku Smart Shopping Assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                iconName="Calculator"
                iconPosition="left"
                onClick={() => setActiveTab('budget')}
              >
                Hitung Budget Sekarang
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconName="TrendingUp"
                iconPosition="left"
                onClick={() => setActiveTab('tracker')}
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Lacak Harga Bahan
              </Button>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Icon name="ShoppingBag" size={24} className="text-primary" />
              <span className="font-heading font-bold text-lg text-foreground">Smart Shopping Assistant</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Belanja cerdas, hemat maksimal. Powered by AI Resepku.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <span>© {new Date()?.getFullYear()} AI Resepku</span>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <span>Warisan Rasa Indonesia</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SmartShoppingAssistant;