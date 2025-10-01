import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const IngredientEncyclopedia = () => {
  const [selectedCategory, setSelectedCategory] = useState('rempah');
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'rempah', name: 'Rempah-rempah', icon: 'Leaf', count: 12 },
    { id: 'sayuran', name: 'Sayuran', icon: 'Carrot', count: 8 },
    { id: 'protein', name: 'Protein', icon: 'Fish', count: 6 },
    { id: 'karbohidrat', name: 'Karbohidrat', icon: 'Wheat', count: 5 },
    { id: 'buah', name: 'Buah-buahan', icon: 'Apple', count: 7 }
  ];

  const ingredients = [
    {
      id: 'kunyit',
      name: 'Kunyit',
      category: 'rempah',
      scientificName: 'Curcuma longa',
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400',
      description: `Rempah kuning keemasan yang menjadi jiwa masakan Indonesia.\nMemiliki rasa pahit dan aroma khas yang hangat.\nKaya akan kurkumin yang bermanfaat untuk kesehatan.`,
      origin: 'Asia Tenggara',
      season: 'Sepanjang tahun',
      regions: ['Jawa', 'Sumatera', 'Bali'],
      uses: ['Bumbu dasar', 'Pewarna alami', 'Obat tradisional'],
      dishes: ['Rendang', 'Gulai', 'Nasi Kuning', 'Opor'],
      nutritionalBenefits: ['Anti-inflamasi', 'Antioksidan', 'Pencernaan'],
      storageInfo: 'Simpan di tempat kering, tahan 6-12 bulan',
      substitutes: ['Kunyit bubuk', 'Saffron (untuk warna)']
    },
    {
      id: 'lengkuas',
      name: 'Lengkuas',
      category: 'rempah',
      scientificName: 'Alpinia galanga',
      image: 'https://images.unsplash.com/photo-1609501676725-7186f734b2e1?w=400',
      description: `Rimpang aromatik dengan rasa pedas dan segar.\nMemberikan aroma khas pada masakan tradisional.\nSering digunakan dalam bumbu halus dan kuah santan.`,
      origin: 'Indonesia',
      season: 'Sepanjang tahun',
      regions: ['Jawa', 'Sumatera', 'Kalimantan'],
      uses: ['Bumbu halus', 'Penghilang amis', 'Aromaterapi'],
      dishes: ['Soto', 'Gulai', 'Rendang', 'Tom Yum'],
      nutritionalBenefits: ['Antibakteri', 'Pencernaan', 'Anti-mual'],
      storageInfo: 'Simpan di kulkas, tahan 2-3 minggu',
      substitutes: ['Jahe', 'Kencur']
    },
    {
      id: 'daun-pandan',
      name: 'Daun Pandan',
      category: 'rempah',
      scientificName: 'Pandanus amaryllifolius',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      description: `Daun hijau dengan aroma wangi yang khas.\nMemberikan warna hijau alami dan rasa manis.\nSering disebut sebagai vanila Asia.`,
      origin: 'Asia Tenggara',
      season: 'Sepanjang tahun',
      regions: ['Seluruh Indonesia'],
      uses: ['Pewarna alami', 'Pengharum', 'Pembungkus'],
      dishes: ['Klepon', 'Onde-onde', 'Nasi Uduk', 'Es Cendol'],
      nutritionalBenefits: ['Antioksidan', 'Aromaterapi', 'Relaksasi'],
      storageInfo: 'Simpan di kulkas, tahan 1 minggu',
      substitutes: ['Ekstrak pandan', 'Pewarna hijau']
    },
    {
      id: 'kangkung',
      name: 'Kangkung',
      category: 'sayuran',
      scientificName: 'Ipomoea aquatica',
      image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400',
      description: `Sayuran hijau yang tumbuh di air atau tanah basah.\nMemiliki batang berongga dan daun hijau lebar.\nSayuran favorit untuk tumisan dan plecing.`,
      origin: 'Asia Tenggara',
      season: 'Sepanjang tahun',
      regions: ['Seluruh Indonesia'],
      uses: ['Tumisan', 'Lalapan', 'Sayur bening'],
      dishes: ['Plecing Kangkung', 'Cah Kangkung', 'Gado-gado'],
      nutritionalBenefits: ['Vitamin A', 'Zat besi', 'Serat'],
      storageInfo: 'Simpan di kulkas, tahan 2-3 hari',
      substitutes: ['Bayam', 'Sawi hijau']
    },
    {
      id: 'tempe',
      name: 'Tempe',
      category: 'protein',
      scientificName: 'Fermented Glycine max',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      description: `Protein nabati hasil fermentasi kedelai dengan ragi tempe.\nMemiliki tekstur padat dan rasa gurih khas.\nSumber protein lengkap dan probiotik alami.`,
      origin: 'Jawa, Indonesia',
      season: 'Sepanjang tahun',
      regions: ['Seluruh Indonesia'],
      uses: ['Lauk utama', 'Camilan', 'Bahan dasar'],
      dishes: ['Tempe Goreng', 'Tempe Bacem', 'Gudeg', 'Sambal Goreng'],
      nutritionalBenefits: ['Protein tinggi', 'Probiotik', 'Vitamin B12'],
      storageInfo: 'Simpan di kulkas, tahan 3-5 hari',
      substitutes: ['Tahu', 'Daging ayam']
    },
    {
      id: 'beras',
      name: 'Beras',
      category: 'karbohidrat',
      scientificName: 'Oryza sativa',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      description: `Makanan pokok utama masyarakat Indonesia.\nTersedia dalam berbagai varietas dan kualitas.\nSumber karbohidrat dan energi utama.`,
      origin: 'Asia',
      season: 'Sepanjang tahun',
      regions: ['Seluruh Indonesia'],
      uses: ['Makanan pokok', 'Tepung', 'Fermentasi'],
      dishes: ['Nasi Putih', 'Nasi Gudeg', 'Lontong', 'Ketupat'],
      nutritionalBenefits: ['Karbohidrat', 'Vitamin B', 'Energi'],
      storageInfo: 'Simpan di tempat kering, tahan 6-12 bulan',
      substitutes: ['Jagung', 'Ubi', 'Sagu']
    },
    {
      id: 'kelapa',
      name: 'Kelapa',
      category: 'buah',
      scientificName: 'Cocos nucifera',
      image: 'https://images.unsplash.com/photo-1447279506476-3faec8071eee?w=400',
      description: `Buah tropis serbaguna yang menjadi bahan utama masakan Indonesia.\nDaging buah dapat diolah menjadi santan dan minyak.\nAir kelapa segar dan bergizi tinggi.`,
      origin: 'Asia Tenggara',
      season: 'Sepanjang tahun',
      regions: ['Seluruh Indonesia'],
      uses: ['Santan', 'Minyak goreng', 'Parutan'],
      dishes: ['Rendang', 'Gulai', 'Opor', 'Es Kelapa'],
      nutritionalBenefits: ['Lemak sehat', 'Elektrolit', 'Serat'],
      storageInfo: 'Kelapa utuh tahan 2-3 bulan',
      substitutes: ['Santan kemasan', 'Susu kental']
    }
  ];

  const filteredIngredients = ingredients?.filter(ingredient => {
    const matchesCategory = ingredient?.category === selectedCategory;
    const matchesSearch = ingredient?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         ingredient?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Encyclopedia Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Ensiklopedia Bahan Makanan
        </h3>
        <p className="text-muted-foreground">
          Pelajari bahan-bahan tradisional Indonesia dan kegunaannya
        </p>
      </div>
      {/* Search Bar */}
      <div className="relative mb-6">
        <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari bahan makanan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      {/* Category Navigation */}
      <div className="flex overflow-x-auto pb-4 mb-8 space-x-2">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => setSelectedCategory(category?.id)}
            className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === category?.id
                ? 'bg-primary text-primary-foreground shadow-cultural'
                : 'bg-muted text-muted-foreground hover:bg-primary/10'
            }`}
          >
            <Icon name={category?.icon} size={16} />
            <span>{category?.name}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {category?.count}
            </span>
          </button>
        ))}
      </div>
      {/* Ingredients Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {filteredIngredients?.map((ingredient) => (
          <div
            key={ingredient?.id}
            className="cultural-card p-4 cursor-pointer transition-all duration-300 hover:shadow-cultural-lg"
            onClick={() => setSelectedIngredient(ingredient)}
          >
            <div className="aspect-w-16 aspect-h-12 mb-4 overflow-hidden rounded-lg">
              <Image
                src={ingredient?.image}
                alt={ingredient?.name}
                className="w-full h-32 object-cover"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-semibold text-foreground">
                  {ingredient?.name}
                </h4>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {ingredient?.season}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground italic">
                {ingredient?.scientificName}
              </p>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {ingredient?.description?.split('\n')?.[0]}
              </p>
              
              <div className="flex flex-wrap gap-1 pt-2">
                {ingredient?.dishes?.slice(0, 3)?.map((dish, index) => (
                  <span
                    key={index}
                    className="text-xs bg-turmeric/10 text-turmeric px-2 py-1 rounded-full"
                  >
                    {dish}
                  </span>
                ))}
                {ingredient?.dishes?.length > 3 && (
                  <span className="text-xs text-muted-foreground px-2 py-1">
                    +{ingredient?.dishes?.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* No Results */}
      {filteredIngredients?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-foreground mb-2">
            Tidak ditemukan
          </h4>
          <p className="text-muted-foreground">
            Coba ubah kata kunci atau kategori pencarian
          </p>
        </div>
      )}
      {/* Ingredient Detail Modal */}
      {selectedIngredient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  {selectedIngredient?.name}
                </h3>
                <p className="text-sm text-muted-foreground italic">
                  {selectedIngredient?.scientificName}
                </p>
              </div>
              <button
                onClick={() => setSelectedIngredient(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Image and Basic Info */}
                <div>
                  <div className="aspect-w-16 aspect-h-12 mb-6 overflow-hidden rounded-xl">
                    <Image
                      src={selectedIngredient?.image}
                      alt={selectedIngredient?.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center">
                        <Icon name="MapPin" size={16} className="mr-2" />
                        Asal dan Musim
                      </h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        <strong>Asal:</strong> {selectedIngredient?.origin}
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">
                        <strong>Musim:</strong> {selectedIngredient?.season}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Daerah:</strong> {selectedIngredient?.regions?.join(', ')}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center">
                        <Icon name="Package" size={16} className="mr-2" />
                        Penyimpanan
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedIngredient?.storageInfo}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Information */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">
                      Deskripsi
                    </h4>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {selectedIngredient?.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <Icon name="Utensils" size={16} className="mr-2" />
                      Kegunaan
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedIngredient?.uses?.map((use, index) => (
                        <span
                          key={index}
                          className="text-sm bg-pandan/10 text-pandan px-3 py-1 rounded-full"
                        >
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <Icon name="ChefHat" size={16} className="mr-2" />
                      Hidangan Populer
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedIngredient?.dishes?.map((dish, index) => (
                        <span
                          key={index}
                          className="text-sm bg-turmeric/10 text-turmeric px-3 py-1 rounded-full"
                        >
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <Icon name="Heart" size={16} className="mr-2" />
                      Manfaat Kesehatan
                    </h4>
                    <div className="grid gap-2">
                      {selectedIngredient?.nutritionalBenefits?.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Icon name="Check" size={14} className="text-success" />
                          <span className="text-sm text-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <Icon name="RefreshCw" size={16} className="mr-2" />
                      Pengganti
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedIngredient?.substitutes?.map((substitute, index) => (
                        <span
                          key={index}
                          className="text-sm bg-secondary/10 text-secondary px-3 py-1 rounded-full"
                        >
                          {substitute}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-8 pt-6 border-t border-border">
                <button className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Icon name="BookOpen" size={16} />
                  <span>Lihat Resep</span>
                </button>
                <button className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Icon name="ShoppingCart" size={16} />
                  <span>Beli Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientEncyclopedia;