import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const PreferencesSettings = () => {
  const [activeTab, setActiveTab] = useState('dietary');
  const [preferences, setPreferences] = useState({
    dietary: {
      vegetarian: false,
      vegan: false,
      halal: true,
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
      lowSodium: false,
      lowSugar: false
    },
    allergies: {
      nuts: false,
      shellfish: false,
      eggs: false,
      dairy: false,
      soy: false,
      wheat: false,
      fish: false,
      sesame: false
    },
    cooking: {
      skillLevel: 'intermediate',
      maxCookingTime: 60,
      preferredMealTypes: ['lunch', 'dinner'],
      kitchenEquipment: ['stove', 'oven', 'microwave', 'blender'],
      spiceLevel: 'medium',
      servingSize: 4
    },
    cultural: {
      preferredRegions: ['jawa', 'sumatra', 'bali'],
      traditionalOnly: false,
      modernFusion: true,
      streetFood: true,
      festivalFood: true
    },
    budget: {
      dailyBudget: 50000,
      weeklyBudget: 350000,
      monthlyBudget: 1500000,
      priceAlerts: true,
      budgetTracking: true
    },
    notifications: {
      recipeRecommendations: true,
      priceDrops: true,
      newRecipes: false,
      cookingReminders: true,
      shoppingListUpdates: true,
      achievementUnlocks: true
    }
  });

  const tabs = [
    { id: 'dietary', label: 'Diet & Makanan', icon: 'Apple' },
    { id: 'allergies', label: 'Alergi', icon: 'AlertTriangle' },
    { id: 'cooking', label: 'Memasak', icon: 'ChefHat' },
    { id: 'cultural', label: 'Budaya', icon: 'Globe' },
    { id: 'budget', label: 'Budget', icon: 'Wallet' },
    { id: 'notifications', label: 'Notifikasi', icon: 'Bell' }
  ];

  const dietaryOptions = [
    { key: 'vegetarian', label: 'Vegetarian', description: 'Tidak mengonsumsi daging dan ikan' },
    { key: 'vegan', label: 'Vegan', description: 'Tidak mengonsumsi produk hewani sama sekali' },
    { key: 'halal', label: 'Halal', description: 'Hanya makanan yang halal menurut syariat Islam' },
    { key: 'glutenFree', label: 'Bebas Gluten', description: 'Tidak mengandung gluten dari gandum' },
    { key: 'dairyFree', label: 'Bebas Susu', description: 'Tidak mengandung produk susu' },
    { key: 'nutFree', label: 'Bebas Kacang', description: 'Tidak mengandung kacang-kacangan' },
    { key: 'lowSodium', label: 'Rendah Garam', description: 'Kandungan sodium rendah' },
    { key: 'lowSugar', label: 'Rendah Gula', description: 'Kandungan gula rendah' }
  ];

  const allergyOptions = [
    { key: 'nuts', label: 'Kacang-kacangan', icon: '🥜' },
    { key: 'shellfish', label: 'Kerang & Udang', icon: '🦐' },
    { key: 'eggs', label: 'Telur', icon: '🥚' },
    { key: 'dairy', label: 'Produk Susu', icon: '🥛' },
    { key: 'soy', label: 'Kedelai', icon: '🫘' },
    { key: 'wheat', label: 'Gandum', icon: '🌾' },
    { key: 'fish', label: 'Ikan', icon: '🐟' },
    { key: 'sesame', label: 'Wijen', icon: '🫘' }
  ];

  const indonesianRegions = [
    { key: 'jawa', label: 'Jawa', description: 'Gudeg, Rendang, Gado-gado' },
    { key: 'sumatra', label: 'Sumatra', description: 'Rendang, Pempek, Soto Medan' },
    { key: 'bali', label: 'Bali', description: 'Ayam Betutu, Lawar, Bebek Betutu' },
    { key: 'sulawesi', label: 'Sulawesi', description: 'Coto Makassar, Konro, Pallubasa' },
    { key: 'kalimantan', label: 'Kalimantan', description: 'Soto Banjar, Ketupat Kandangan' },
    { key: 'papua', label: 'Papua', description: 'Papeda, Ikan Bakar, Sagu' },
    { key: 'maluku', label: 'Maluku', description: 'Ikan Kuah Kuning, Kohu-kohu' },
    { key: 'ntt', label: 'Nusa Tenggara', description: 'Se\'i Sapi, Jagung Bose' }
  ];

  const handlePreferenceChange = (category, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [key]: value
      }
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const renderDietaryTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Preferensi Diet</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dietaryOptions?.map((option) => (
            <div key={option?.key} className="cultural-card p-4">
              <Checkbox
                label={option?.label}
                description={option?.description}
                checked={preferences?.dietary?.[option?.key]}
                onChange={(e) => handlePreferenceChange('dietary', option?.key, e?.target?.checked)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAllergiesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Alergi Makanan</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Pilih bahan makanan yang menyebabkan alergi untuk menghindari resep yang mengandung bahan tersebut.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allergyOptions?.map((option) => (
            <div key={option?.key} className="cultural-card p-4 text-center">
              <div className="text-2xl mb-2">{option?.icon}</div>
              <Checkbox
                label={option?.label}
                checked={preferences?.allergies?.[option?.key]}
                onChange={(e) => handlePreferenceChange('allergies', option?.key, e?.target?.checked)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCookingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="cultural-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Tingkat Keahlian</h3>
          <div className="space-y-3">
            {[
              { value: 'beginner', label: 'Pemula', description: 'Baru belajar memasak' },
              { value: 'intermediate', label: 'Menengah', description: 'Sudah bisa masak dasar' },
              { value: 'advanced', label: 'Mahir', description: 'Berpengalaman memasak' }
            ]?.map((level) => (
              <label key={level?.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="skillLevel"
                  value={level?.value}
                  checked={preferences?.cooking?.skillLevel === level?.value}
                  onChange={(e) => handlePreferenceChange('cooking', 'skillLevel', e?.target?.value)}
                  className="text-primary focus:ring-primary"
                />
                <div>
                  <p className="font-medium text-foreground">{level?.label}</p>
                  <p className="text-sm text-muted-foreground">{level?.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="cultural-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Waktu Memasak Maksimal</h3>
          <Input
            type="number"
            label="Menit"
            value={preferences?.cooking?.maxCookingTime}
            onChange={(e) => handlePreferenceChange('cooking', 'maxCookingTime', parseInt(e?.target?.value))}
            min="15"
            max="480"
            step="15"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Resep dengan waktu memasak lebih dari ini akan disembunyikan
          </p>
        </div>

        <div className="cultural-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Tingkat Kepedasan</h3>
          <div className="space-y-3">
            {[
              { value: 'mild', label: 'Tidak Pedas', icon: '😊' },
              { value: 'medium', label: 'Sedang', icon: '🌶️' },
              { value: 'hot', label: 'Pedas', icon: '🔥' },
              { value: 'very-hot', label: 'Sangat Pedas', icon: '🌋' }
            ]?.map((level) => (
              <label key={level?.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="spiceLevel"
                  value={level?.value}
                  checked={preferences?.cooking?.spiceLevel === level?.value}
                  onChange={(e) => handlePreferenceChange('cooking', 'spiceLevel', e?.target?.value)}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-lg">{level?.icon}</span>
                <span className="font-medium text-foreground">{level?.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="cultural-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Jumlah Porsi Default</h3>
          <Input
            type="number"
            label="Orang"
            value={preferences?.cooking?.servingSize}
            onChange={(e) => handlePreferenceChange('cooking', 'servingSize', parseInt(e?.target?.value))}
            min="1"
            max="20"
          />
        </div>
      </div>
    </div>
  );

  const renderCulturalTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Daerah Favorit</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Pilih daerah Indonesia yang resepnya ingin Anda lihat lebih sering.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {indonesianRegions?.map((region) => (
            <div key={region?.key} className="cultural-card p-4">
              <Checkbox
                label={region?.label}
                description={region?.description}
                checked={preferences?.cultural?.preferredRegions?.includes(region?.key)}
                onChange={(e) => {
                  const newRegions = e?.target?.checked
                    ? [...preferences?.cultural?.preferredRegions, region?.key]
                    : preferences?.cultural?.preferredRegions?.filter(r => r !== region?.key);
                  handlePreferenceChange('cultural', 'preferredRegions', newRegions);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="cultural-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Jenis Masakan</h3>
        <div className="space-y-4">
          <Checkbox
            label="Hanya Resep Tradisional"
            description="Tampilkan hanya resep asli tanpa modifikasi modern"
            checked={preferences?.cultural?.traditionalOnly}
            onChange={(e) => handlePreferenceChange('cultural', 'traditionalOnly', e?.target?.checked)}
          />
          <Checkbox
            label="Fusion Modern"
            description="Resep tradisional dengan sentuhan modern"
            checked={preferences?.cultural?.modernFusion}
            onChange={(e) => handlePreferenceChange('cultural', 'modernFusion', e?.target?.checked)}
          />
          <Checkbox
            label="Makanan Jalanan"
            description="Resep street food dan jajanan kaki lima"
            checked={preferences?.cultural?.streetFood}
            onChange={(e) => handlePreferenceChange('cultural', 'streetFood', e?.target?.checked)}
          />
          <Checkbox
            label="Makanan Festival"
            description="Hidangan khusus hari raya dan perayaan"
            checked={preferences?.cultural?.festivalFood}
            onChange={(e) => handlePreferenceChange('cultural', 'festivalFood', e?.target?.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderBudgetTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="cultural-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Budget Harian</h3>
          <Input
            type="number"
            label="Rupiah"
            value={preferences?.budget?.dailyBudget}
            onChange={(e) => handlePreferenceChange('budget', 'dailyBudget', parseInt(e?.target?.value))}
            min="10000"
            step="5000"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {formatCurrency(preferences?.budget?.dailyBudget)} per hari
          </p>
        </div>

        <div className="cultural-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Budget Mingguan</h3>
          <Input
            type="number"
            label="Rupiah"
            value={preferences?.budget?.weeklyBudget}
            onChange={(e) => handlePreferenceChange('budget', 'weeklyBudget', parseInt(e?.target?.value))}
            min="50000"
            step="25000"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {formatCurrency(preferences?.budget?.weeklyBudget)} per minggu
          </p>
        </div>

        <div className="cultural-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Budget Bulanan</h3>
          <Input
            type="number"
            label="Rupiah"
            value={preferences?.budget?.monthlyBudget}
            onChange={(e) => handlePreferenceChange('budget', 'monthlyBudget', parseInt(e?.target?.value))}
            min="200000"
            step="100000"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {formatCurrency(preferences?.budget?.monthlyBudget)} per bulan
          </p>
        </div>
      </div>

      <div className="cultural-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Pengaturan Budget</h3>
        <div className="space-y-4">
          <Checkbox
            label="Alert Harga Turun"
            description="Dapatkan notifikasi ketika harga bahan makanan turun"
            checked={preferences?.budget?.priceAlerts}
            onChange={(e) => handlePreferenceChange('budget', 'priceAlerts', e?.target?.checked)}
          />
          <Checkbox
            label="Pelacakan Budget Otomatis"
            description="Catat pengeluaran secara otomatis dari riwayat belanja"
            checked={preferences?.budget?.budgetTracking}
            onChange={(e) => handlePreferenceChange('budget', 'budgetTracking', e?.target?.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="cultural-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Notifikasi Resep</h3>
        <div className="space-y-4">
          <Checkbox
            label="Rekomendasi Resep Harian"
            description="Dapatkan saran resep sesuai preferensi setiap hari"
            checked={preferences?.notifications?.recipeRecommendations}
            onChange={(e) => handlePreferenceChange('notifications', 'recipeRecommendations', e?.target?.checked)}
          />
          <Checkbox
            label="Resep Baru"
            description="Notifikasi ketika ada resep baru dari daerah favorit"
            checked={preferences?.notifications?.newRecipes}
            onChange={(e) => handlePreferenceChange('notifications', 'newRecipes', e?.target?.checked)}
          />
          <Checkbox
            label="Pengingat Memasak"
            description="Ingatkan untuk memasak sesuai jadwal meal plan"
            checked={preferences?.notifications?.cookingReminders}
            onChange={(e) => handlePreferenceChange('notifications', 'cookingReminders', e?.target?.checked)}
          />
        </div>
      </div>

      <div className="cultural-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Notifikasi Belanja</h3>
        <div className="space-y-4">
          <Checkbox
            label="Penurunan Harga"
            description="Alert ketika harga bahan makanan favorit turun"
            checked={preferences?.notifications?.priceDrops}
            onChange={(e) => handlePreferenceChange('notifications', 'priceDrops', e?.target?.checked)}
          />
          <Checkbox
            label="Update Shopping List"
            description="Notifikasi ketika ada perubahan pada daftar belanja"
            checked={preferences?.notifications?.shoppingListUpdates}
            onChange={(e) => handlePreferenceChange('notifications', 'shoppingListUpdates', e?.target?.checked)}
          />
        </div>
      </div>

      <div className="cultural-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Notifikasi Pencapaian</h3>
        <div className="space-y-4">
          <Checkbox
            label="Achievement Unlock"
            description="Notifikasi ketika membuka pencapaian baru"
            checked={preferences?.notifications?.achievementUnlocks}
            onChange={(e) => handlePreferenceChange('notifications', 'achievementUnlocks', e?.target?.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dietary': return renderDietaryTab();
      case 'allergies': return renderAllergiesTab();
      case 'cooking': return renderCookingTab();
      case 'cultural': return renderCulturalTab();
      case 'budget': return renderBudgetTab();
      case 'notifications': return renderNotificationsTab();
      default: return renderDietaryTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="cultural-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Pengaturan Preferensi</h2>
          <Button variant="default" size="sm" iconName="Save" iconPosition="left">
            Simpan Perubahan
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground shadow-cultural'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      {renderTabContent()}
      {/* Save Actions */}
      <div className="cultural-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Simpan Perubahan</p>
            <p className="text-sm text-muted-foreground">
              Preferensi akan diterapkan pada rekomendasi resep selanjutnya
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              Reset ke Default
            </Button>
            <Button variant="default" size="sm" iconName="Save" iconPosition="left">
              Simpan Semua
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSettings;