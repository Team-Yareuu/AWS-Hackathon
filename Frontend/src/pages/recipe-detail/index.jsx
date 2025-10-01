import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import RecipeHeader from './components/RecipeHeader';
import CulturalStory from './components/CulturalStory';
import BudgetBreakdown from './components/BudgetBreakdown';
import IngredientsList from './components/IngredientsList';
import CookingSteps from './components/CookingSteps';
import NutritionInfo from './components/NutritionInfo';
import UserReviews from './components/UserReviews';
import AIAssistant from './components/AIAssistant';
import RelatedRecipes from './components/RelatedRecipes';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const RecipeDetail = () => {
  const [searchParams] = useSearchParams();
  const recipeId = searchParams?.get('id') || '1';
  
  const [recipe, setRecipe] = useState(null);
  const [servings, setServings] = useState(4);
  const [isSaved, setIsSaved] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [activeTab, setActiveTab] = useState('ingredients');

  const mockRecipe = {
    id: recipeId,
    name: "Rendang Daging Sapi Padang",
    shortDescription: "Rendang daging sapi autentik dengan bumbu rempah tradisional Minangkabau yang kaya cita rasa",
    image: "https://api.meatguy.id/admin/image/blogs/6cfa140f-ccbc-4580-a4a0-9261b7af9aa9",
    region: "Sumatera Barat",
    difficulty: "Sedang",
    cookingTime: "3 jam",
    servings: 4,
    rating: 4.8,
    reviewCount: 234,
    estimatedCost: 85000,
    isTraditional: true,
    isNew: false,
    culturalStory: {
      shortStory: "Rendang adalah masakan tradisional Minangkabau yang telah diakui UNESCO sebagai warisan budaya dunia. Hidangan ini melambangkan filosofi kehidupan masyarakat Minang.",
      fullStory: `Rendang adalah masakan tradisional Minangkabau yang telah diakui UNESCO sebagai warisan budaya dunia. Hidangan ini melambangkan filosofi kehidupan masyarakat Minang yang penuh makna.\n\nDalam tradisi Minangkabau, rendang bukan sekadar makanan, tetapi simbol ketahanan dan kesabaran. Proses memasak yang memakan waktu berjam-jam mencerminkan nilai kesabaran dalam menghadapi kehidupan.\n\nSetiap bumbu dalam rendang memiliki makna filosofis. Daging melambangkan niniak mamak (pemimpin adat), santan adalah bundo kanduang (ibu), cabai adalah alim ulama, dan rempah-rempah lainnya mewakili cerdik pandai dan masyarakat biasa.\n\nRendang biasanya disajikan dalam acara-acara penting seperti pernikahan, batagak penghulu, dan hari raya. Kemampuan membuat rendang yang lezat menjadi kebanggaan tersendiri bagi perempuan Minang.`,
      culturalElements: [
        {
          title: "Filosofi Kesabaran",
          description: "Proses memasak yang lama mengajarkan nilai kesabaran dan ketekunan"
        },
        {
          title: "Simbol Persatuan",
          description: "Setiap bumbu mewakili elemen masyarakat yang bersatu"
        },
        {
          title: "Warisan Leluhur",
          description: "Resep turun temurun dari generasi ke generasi"
        },
        {
          title: "Identitas Budaya",
          description: "Menjadi penanda identitas masyarakat Minangkabau"
        }
      ],
      regionalVariations: [
        {
          region: "Padang",
          province: "Sumatera Barat",
          difference: "Menggunakan santan kental dan dimasak hingga kering sempurna"
        },
        {
          region: "Payakumbuh",
          province: "Sumatera Barat", 
          difference: "Ditambahkan daun kunyit untuk aroma yang lebih harum"
        },
        {
          region: "Bukittinggi",
          province: "Sumatera Barat",
          difference: "Menggunakan cabai yang lebih banyak untuk rasa pedas yang kuat"
        }
      ]
    },
    budgetData: {
      total: 85000,
      perServing: 21250,
      savings: 15000,
      restaurantSavings: 65,
      marketplaces: [
        {
          name: "tokopedia",
          total: 85000,
          ingredients: [
            { price: 45000 },
            { price: 8000 },
            { price: 12000 },
            { price: 5000 },
            { price: 15000 }
          ]
        },
        {
          name: "shopee",
          total: 82000,
          ingredients: [
            { price: 43000 },
            { price: 7500 },
            { price: 11500 },
            { price: 5000 },
            { price: 15000 }
          ]
        },
      ],
      offlineStores: [
        {
          name: "Pasar Raya Padang",
          address: "Jl. Pasar Raya No. 1, Padang",
          openingHours: "05.00 - 18.00",
          estimatedDistance: 2.5,
          location: { lat: -0.9501, lng: 100.3531 },
          recommendedItems: ["Daging sapi segar", "Rempah tradisional"]
        },
        {
          name: "Pasar Lubuk Buaya",
          address: "Jl. Adinegoro, Lubuk Buaya",
          openingHours: "06.00 - 17.00",
          estimatedDistance: 6.1,
          location: { lat: -0.8932, lng: 100.3501 },
          recommendedItems: ["Cabai merah", "Kelapa parut"]
        },
        {
          name: "Toko Bahan Masak Andalas",
          address: "Jl. Andalas No. 25, Padang Timur",
          openingHours: "08.00 - 21.00",
          estimatedDistance: 3.2,
          location: { lat: -0.9344, lng: 100.3675 },
          recommendedItems: ["Santan segar", "Bumbu instan"]
        }
      ],
      ingredients: [
        { name: "Daging Sapi Has Dalam", quantity: "1 kg", price: 45000 },
        { name: "Santan Kental", quantity: "400 ml", price: 8000 },
        { name: "Bumbu Rendang Halus", quantity: "1 paket", price: 12000 },
        { name: "Daun Jeruk", quantity: "10 lembar", price: 5000 },
        { name: "Rempah Pelengkap", quantity: "1 set", price: 15000 }
      ]
    },
    ingredients: [
      {
        name: "Daging sapi has dalam",
        quantity: "1 kg",
        category: "protein",
        originalServings: 4,
        substitutes: ["Daging kerbau", "Daging kambing"],
        optional: false
      },
      {
        name: "Santan kental",
        quantity: "400 ml",
        category: "dairy",
        originalServings: 4,
        substitutes: ["Susu full cream + mentega"],
        optional: false
      },
      {
        name: "Cabai merah keriting",
        quantity: "15 buah",
        category: "spice",
        originalServings: 4,
        substitutes: ["Paprika + cabai bubuk"],
        optional: false
      },
      {
        name: "Bawang merah",
        quantity: "8 siung",
        category: "spice",
        originalServings: 4,
        substitutes: ["Bawang bombay"],
        optional: false
      },
      {
        name: "Bawang putih",
        quantity: "6 siung",
        category: "spice",
        originalServings: 4,
        substitutes: ["Bawang putih bubuk"],
        optional: false
      },
      {
        name: "Jahe",
        quantity: "3 cm",
        category: "spice",
        originalServings: 4,
        substitutes: ["Jahe bubuk"],
        optional: false
      },
      {
        name: "Lengkuas",
        quantity: "4 cm",
        category: "spice",
        originalServings: 4,
        substitutes: ["Jahe (porsi lebih sedikit)"],
        optional: false
      },
      {
        name: "Kunyit",
        quantity: "2 cm",
        category: "spice",
        originalServings: 4,
        substitutes: ["Kunyit bubuk"],
        optional: false
      },
      {
        name: "Daun jeruk",
        quantity: "10 lembar",
        category: "herb",
        originalServings: 4,
        substitutes: ["Kulit jeruk nipis parut"],
        optional: false
      },
      {
        name: "Serai",
        quantity: "2 batang",
        category: "herb",
        originalServings: 4,
        substitutes: ["Serai bubuk"],
        optional: true
      },
      {
        name: "Daun kunyit",
        quantity: "3 lembar",
        category: "herb",
        originalServings: 4,
        substitutes: ["Kunyit parut"],
        optional: true
      },
      {
        name: "Garam",
        quantity: "1 sdt",
        category: "spice",
        originalServings: 4,
        substitutes: ["Garam laut"],
        optional: false
      },
      {
        name: "Gula merah",
        quantity: "2 sdm",
        category: "spice",
        originalServings: 4,
        substitutes: ["Gula aren", "Gula kelapa"],
        optional: false
      }
    ],
    cookingSteps: [
      {
        title: "Persiapan Daging",
        description: "Potong daging sapi menjadi kubus berukuran 5x5 cm. Cuci bersih dan tiriskan. Pastikan daging dalam kondisi segar dan tidak berlemak berlebihan.",
        duration: "15 menit",
        difficulty: "mudah",
        image: "https://images.unsplash.com/photo-1588347818121-d6d4b4e8e8d2?w=400&h=300&fit=crop",
        tips: [
          "Pilih daging has dalam untuk tekstur yang empuk",
          "Potong melawan serat daging agar tidak alot",
          "Keringkan daging dengan tissue sebelum dimasak"
        ]
      },
      {
        title: "Haluskan Bumbu",
        description: "Haluskan cabai merah, bawang merah, bawang putih, jahe, lengkuas, dan kunyit menggunakan blender atau cobek. Tambahkan sedikit air jika perlu.",
        duration: "20 menit",
        difficulty: "sedang",
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
        tips: [
          "Gunakan cobek untuk hasil yang lebih halus",
          "Jangan terlalu banyak air saat menghaluskan",
          "Haluskan hingga benar-benar smooth"
        ]
      },
      {
        title: "Tumis Bumbu",
        description: "Panaskan minyak dalam wajan besar. Tumis bumbu halus bersama daun jeruk dan serai hingga harum dan matang. Masak dengan api sedang selama 10-15 menit.",
        duration: "15 menit",
        difficulty: "sedang",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        tips: [
          "Jangan biarkan bumbu gosong",
          "Aduk terus agar bumbu tidak lengket",
          "Bumbu matang ditandai dengan aroma yang harum"
        ]
      },
      {
        title: "Masukkan Daging",
        description: "Masukkan potongan daging ke dalam bumbu yang sudah ditumis. Aduk rata dan masak hingga daging berubah warna. Bumbui dengan garam dan gula merah.",
        duration: "20 menit",
        difficulty: "mudah",
        image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop",
        tips: [
          "Masak daging hingga berubah warna merata",
          "Jangan terlalu sering diaduk agar daging tidak hancur",
          "Koreksi rasa garam dan gula sesuai selera"
        ]
      },
      {
        title: "Tambahkan Santan",
        description: "Tuang santan kental ke dalam wajan. Aduk perlahan dan masak dengan api kecil. Biarkan mendidih sambil sesekali diaduk agar santan tidak pecah.",
        duration: "30 menit",
        difficulty: "sedang",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
        tips: [
          "Gunakan api kecil agar santan tidak pecah",
          "Aduk perlahan dari bawah ke atas",
          "Jangan tutup wajan agar santan tidak pecah"
        ]
      },
      {
        title: "Masak Hingga Mengental",
        description: "Lanjutkan memasak dengan api kecil sambil terus diaduk hingga santan menyusut dan mengental. Proses ini membutuhkan waktu sekitar 1-2 jam.",
        duration: "120 menit",
        difficulty: "sulit",
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
        tips: [
          "Sabar dalam proses ini, jangan terburu-buru",
          "Aduk secara berkala agar tidak gosong",
          "Rendang siap ketika santan sudah menyusut dan berminyak"
        ]
      },
      {
        title: "Finishing dan Penyajian",
        description: "Ketika rendang sudah kering dan berwarna cokelat kehitaman, angkat dari api. Koreksi rasa terakhir kali. Sajikan rendang dengan nasi putih hangat.",
        duration: "10 menit",
        difficulty: "mudah",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
        tips: [
          "Rendang yang baik berwarna cokelat kehitaman",
          "Daging harus empuk dan bumbu meresap sempurna",
          "Sajikan dalam keadaan hangat untuk cita rasa terbaik"
        ]
      }
    ],
    nutrition: {
      calories: 420,
      protein: 35,
      carbs: 8,
      fat: 28,
      fiber: 3,
      sugar: 6,
      sodium: 680,
      cholesterol: 95,
      calcium: 45,
      iron: 4.2,
      benefits: [
        "Tinggi protein untuk pembentukan otot",
        "Mengandung antioksidan dari rempah-rempah",
        "Sumber zat besi untuk mencegah anemia",
        "Mengandung kurkumin dari kunyit yang anti-inflamasi"
      ],
      dietary: ["Halal", "Gluten Free", "Keto Friendly"],
      vitamins: [
        { name: "Vitamin A", percentage: 15 },
        { name: "Vitamin C", percentage: 25 },
        { name: "Vitamin E", percentage: 12 },
        { name: "Vitamin B6", percentage: 18 }
      ]
    }
  };

  const mockReviews = [
    {
      id: 1,
      name: "Sari Dewi",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5,
      date: "2024-09-25",
      comment: "Resep rendang ini benar-benar autentik! Rasanya persis seperti buatan nenek saya di Padang. Bumbu-bumbunya pas dan cara memasaknya sangat detail. Keluarga saya sangat suka!",
      images: [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1574484284002-952d92456975?w=200&h=200&fit=crop"
      ],
      tags: ["Autentik", "Enak", "Mudah diikuti"],
      helpful: 23,
      modifications: "Saya tambahkan sedikit daun kunyit untuk aroma yang lebih harum"
    },
    {
      id: 2,
      name: "Budi Santoso",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 4,
      date: "2024-09-20",
      comment: "Pertama kali coba bikin rendang dan hasilnya memuaskan! Memang butuh waktu lama tapi worth it banget. Cuma agak susah dapat lengkuas segar di daerah saya.",
      tags: ["Pemula", "Berhasil", "Butuh waktu"],
      helpful: 15,
      modifications: "Pakai lengkuas bubuk karena susah dapat yang segar"
    },
    {
      id: 3,
      name: "Maya Sari",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 5,
      date: "2024-09-18",
      comment: "Resep terbaik yang pernah saya coba! Suami saya yang orang Padang bilang rasanya sama persis dengan rendang buatan mamaknya. Terima kasih untuk resep yang detail ini.",
      images: [
        "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop"
      ],
      tags: ["Approved suami", "Rasa autentik", "Recommended"],
      helpful: 31
    },
    {
      id: 4,
      name: "Andi Wijaya",
      avatar: "https://randomuser.me/api/portraits/men/35.jpg",
      rating: 4,
      date: "2024-09-15",
      comment: "Bagus banget resepnya, step by step jelas. Cuma untuk pemula seperti saya, mungkin perlu video tutorial juga. Overall hasilnya enak dan keluarga suka.",
      tags: ["Pemula", "Butuh video", "Hasil memuaskan"],
      helpful: 8
    }
  ];

  const mockRelatedRecipes = [
    {
      id: 2,
      name: "Gulai Kambing Aceh",
      shortDescription: "Gulai kambing khas Aceh dengan rempah yang kaya dan santan yang gurih",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      region: "Aceh",
      difficulty: "Sedang",
      cookingTime: "2 jam",
      servings: 6,
      rating: 4.6,
      reviewCount: 189,
      estimatedCost: 95000,
      isTraditional: true,
      isNew: false
    },
    {
      id: 3,
      name: "Sate Padang",
      shortDescription: "Sate khas Padang dengan kuah gulai yang kental dan bumbu rempah",
      image: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400&h=300&fit=crop",
      region: "Sumatera Barat",
      difficulty: "Mudah",
      cookingTime: "1 jam",
      servings: 4,
      rating: 4.7,
      reviewCount: 156,
      estimatedCost: 65000,
      isTraditional: true,
      isNew: false
    },
    {
      id: 4,
      name: "Dendeng Balado",
      shortDescription: "Dendeng sapi dengan sambal balado pedas khas Minangkabau",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      region: "Sumatera Barat",
      difficulty: "Sedang",
      cookingTime: "1.5 jam",
      servings: 4,
      rating: 4.5,
      reviewCount: 98,
      estimatedCost: 75000,
      isTraditional: true,
      isNew: false
    },
    {
      id: 5,
      name: "Ayam Pop Padang",
      shortDescription: "Ayam goreng khas Padang yang dimasak dengan teknik khusus",
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
      region: "Sumatera Barat",
      difficulty: "Mudah",
      cookingTime: "45 menit",
      servings: 4,
      rating: 4.4,
      reviewCount: 203,
      estimatedCost: 55000,
      isTraditional: true,
      isNew: false
    },
    {
      id: 6,
      name: "Gulai Tunjang",
      shortDescription: "Gulai kikil sapi dengan bumbu rempah khas Minangkabau",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      region: "Sumatera Barat",
      difficulty: "Sulit",
      cookingTime: "3 jam",
      servings: 6,
      rating: 4.3,
      reviewCount: 87,
      estimatedCost: 70000,
      isTraditional: true,
      isNew: false
    },
    {
      id: 7,
      name: "Sambal Lado Mudo",
      shortDescription: "Sambal cabai hijau khas Padang yang segar dan pedas",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
      region: "Sumatera Barat",
      difficulty: "Mudah",
      cookingTime: "30 menit",
      servings: 4,
      rating: 4.6,
      reviewCount: 145,
      estimatedCost: 25000,
      isTraditional: true,
      isNew: false
    }
  ];

  useEffect(() => {
   
    setRecipe(mockRecipe);
  }, [recipeId]);

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe?.name,
        text: recipe?.shortDescription,
        url: window.location?.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location?.href);
      // Could show toast notification here
    }
  };

  const handleServingsChange = (newServings) => {
    setServings(newServings);
  };

  const handleSubstitute = (ingredientIndex) => {
    // Handle ingredient substitution
    console.log('Substitute ingredient at index:', ingredientIndex);
  };

  const handleShopNow = (marketplace) => {
    // Handle shopping navigation
    console.log('Shop now at:', marketplace);
  };

  const handleAIHelp = (stepIndex) => {
    setShowAIAssistant(true);
  };

  const handleAddReview = () => {
    // Handle adding new review
    console.log('Add new review');
  };

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat resep...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Recipe Header */}
          <RecipeHeader
            recipe={recipe}
            onSave={handleSave}
            onShare={handleShare}
            isSaved={isSaved}
          />

          {/* Main Content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cultural Story */}
              <CulturalStory story={recipe?.culturalStory} />

              {/* Tab Navigation */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="flex border-b border-border">
                  {[
                    { id: 'ingredients', label: 'Bahan-Bahan', icon: 'List' },
                    { id: 'steps', label: 'Langkah Memasak', icon: 'ChefHat' },
                    { id: 'nutrition', label: 'Informasi Gizi', icon: 'Activity' }
                  ]?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span className="hidden sm:inline">{tab?.label}</span>
                    </button>
                  ))}
                </div>

                <div className="p-0">
                  {activeTab === 'ingredients' && (
                    <IngredientsList
                      ingredients={recipe?.ingredients}
                      servings={servings}
                      onServingsChange={handleServingsChange}
                      onSubstitute={handleSubstitute}
                    />
                  )}
                  
                  {activeTab === 'steps' && (
                    <CookingSteps
                      steps={recipe?.cookingSteps}
                      onAIHelp={handleAIHelp}
                    />
                  )}
                  
                  {activeTab === 'nutrition' && (
                    <NutritionInfo
                      nutrition={recipe?.nutrition}
                      servings={servings}
                    />
                  )}
                </div>
              </div>

              {/* User Reviews */}
              <UserReviews
                reviews={mockReviews}
                onAddReview={handleAddReview}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Budget Breakdown */}
              <BudgetBreakdown
                budgetData={recipe?.budgetData}
                onShopNow={handleShopNow}
              />

              {/* Related Recipes */}
              <RelatedRecipes
                recipes={mockRelatedRecipes}
                currentRecipeId={recipe?.id}
              />
            </div>
          </div>
        </div>
      </main>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          variant="default"
          size="lg"
          iconName="MessageCircle"
          iconPosition="left"
          onClick={() => setShowAIAssistant(true)}
          className="shadow-cultural-lg"
        >
          <span className="hidden sm:inline">Bantuan AI</span>
        </Button>
      </div>
      {/* AI Assistant */}
      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        recipe={recipe}
      />
    </div>
  );
};

export default RecipeDetail;