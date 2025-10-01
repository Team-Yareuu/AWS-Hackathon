import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CookingTechniqueLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState('tradisional');
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const categories = [
    { id: 'tradisional', name: 'Teknik Tradisional', icon: 'Flame', count: 8 },
    { id: 'modern', name: 'Adaptasi Modern', icon: 'Zap', count: 6 },
    { id: 'fermentasi', name: 'Fermentasi', icon: 'Clock', count: 4 },
    { id: 'pengawetan', name: 'Pengawetan', icon: 'Shield', count: 5 }
  ];

  const techniques = [
    {
      id: 'tumis-bumbu',
      name: 'Menumis Bumbu Halus',
      category: 'tradisional',
      difficulty: 'Mudah',
      duration: '5-10 menit',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      description: `Teknik dasar memasak Indonesia untuk mengeluarkan aroma rempah.\nBumbu halus ditumis hingga harum dan matang sempurna.\nKunci kelezatan masakan tradisional Indonesia.`,
      tools: ['Wajan', 'Spatula kayu', 'Kompor'],
      ingredients: ['Bumbu halus', 'Minyak goreng', 'Garam'],
      steps: [
        'Panaskan minyak dalam wajan dengan api sedang',
        'Masukkan bumbu halus, aduk rata',
        'Tumis hingga harum dan berubah warna (3-5 menit)',
        'Bumbu siap digunakan untuk masakan selanjutnya'
      ],
      tips: [
        'Gunakan api sedang agar bumbu tidak gosong',
        'Aduk terus menerus untuk hasil merata',
        'Bumbu matang ditandai dengan aroma harum'
      ],
      dishes: ['Rendang', 'Gulai', 'Opor', 'Sambal Goreng'],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      culturalSignificance: 'Teknik ini telah diwariskan turun-temurun dan menjadi fondasi masakan Indonesia'
    },
    {
      id: 'santan',
      name: 'Mengolah Santan',
      category: 'tradisional',
      difficulty: 'Sedang',
      duration: '15-20 menit',
      image: 'https://images.unsplash.com/photo-1447279506476-3faec8071eee?w=400',
      description: `Teknik mengolah santan agar tidak pecah dan menghasilkan kuah yang creamy.\nMemerlukan kesabaran dan teknik khusus.\nSantan adalah jiwa masakan Indonesia.`,
      tools: ['Panci', 'Sendok kayu', 'Saringan'],
      ingredients: ['Kelapa parut', 'Air hangat', 'Garam sedikit'],
      steps: [
        'Peras kelapa parut dengan air hangat',
        'Saring santan untuk mendapatkan santan kental',
        'Masak santan dengan api kecil sambil diaduk',
        'Jangan biarkan mendidih agar tidak pecah'
      ],
      tips: [
        'Selalu aduk searah jarum jam',
        'Gunakan api kecil untuk mencegah pecah',
        'Tambahkan sedikit garam untuk menstabilkan'
      ],
      dishes: ['Gulai', 'Opor', 'Rendang', 'Sayur Lodeh'],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      culturalSignificance: 'Santan adalah identitas kuliner Indonesia yang tidak bisa dipisahkan dari budaya'
    },
    {
      id: 'bacem',
      name: 'Teknik Bacem',
      category: 'tradisional',
      difficulty: 'Sedang',
      duration: '45-60 menit',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      description: `Teknik memasak dengan air gula merah hingga meresap.\nMenghasilkan rasa manis gurih yang khas.\nTeknik khas Jawa yang menghasilkan warna cokelat cantik.`,
      tools: ['Panci', 'Wajan', 'Sendok kayu'],
      ingredients: ['Gula merah', 'Air', 'Garam', 'Bahan utama'],
      steps: [
        'Rebus bahan dengan air gula merah dan bumbu',
        'Masak hingga air menyusut dan bumbu meresap',
        'Angkat dan goreng sebentar untuk finishing',
        'Sajikan dengan nasi hangat'
      ],
      tips: [
        'Gunakan gula merah asli untuk rasa autentik',
        'Masak dengan sabar hingga bumbu meresap',
        'Goreng sebentar untuk tekstur luar yang renyah'
      ],
      dishes: ['Tempe Bacem', 'Tahu Bacem', 'Ayam Bacem'],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      culturalSignificance: 'Teknik bacem mencerminkan kesabaran dan ketelatenan dalam budaya Jawa'
    },
    {
      id: 'sous-vide-rendang',
      name: 'Rendang Sous Vide',
      category: 'modern',
      difficulty: 'Sulit',
      duration: '4-6 jam',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      description: `Adaptasi modern teknik rendang menggunakan sous vide.\nMenghasilkan daging yang empuk dengan bumbu yang meresap sempurna.\nMempertahankan cita rasa tradisional dengan teknologi modern.`,
      tools: ['Sous vide machine', 'Vacuum sealer', 'Water bath'],
      ingredients: ['Daging sapi', 'Bumbu rendang', 'Santan kental'],
      steps: [
        'Vacuum seal daging dengan bumbu rendang',
        'Masak dalam water bath 60°C selama 4-6 jam',
        'Keluarkan dan tumis dengan santan hingga kering',
        'Selesaikan dengan teknik tradisional'
      ],
      tips: [
        'Gunakan suhu rendah untuk hasil optimal',
        'Kombinasikan dengan finishing tradisional',
        'Waktu memasak lebih lama menghasilkan tekstur lebih empuk'
      ],
      dishes: ['Modern Rendang', 'Fusion Beef'],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      culturalSignificance: 'Menunjukkan adaptasi kuliner tradisional dengan teknologi modern'
    },
    {
      id: 'fermentasi-tempe',
      name: 'Fermentasi Tempe',
      category: 'fermentasi',
      difficulty: 'Sulit',
      duration: '2-3 hari',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      description: `Proses fermentasi kedelai menjadi tempe menggunakan ragi tempe.\nTeknik tradisional yang menghasilkan protein berkualitas tinggi.\nWarisan budaya Indonesia yang mendunia.`,
      tools: ['Dandang', 'Tampah', 'Daun pisang', 'Plastik berlubang'],
      ingredients: ['Kedelai', 'Ragi tempe', 'Air', 'Asam jawa'],
      steps: [
        'Rendam kedelai 12-24 jam hingga kulitnya terkelupas',
        'Rebus kedelai hingga empuk, tiriskan',
        'Campurkan dengan ragi tempe secara merata',
        'Bungkus dengan daun pisang, fermentasi 2-3 hari'
      ],
      tips: [
        'Pastikan kedelai benar-benar kering sebelum dicampur ragi',
        'Suhu fermentasi ideal 25-30°C',
        'Hindari kontaminasi selama proses fermentasi'
      ],
      dishes: ['Tempe Goreng', 'Tempe Bacem', 'Gudeg'],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      culturalSignificance: 'Tempe adalah inovasi kuliner Indonesia yang diakui dunia sebagai superfood'
    },
    {
      id: 'pengasapan',
      name: 'Teknik Pengasapan',
      category: 'pengawetan',
      difficulty: 'Sedang',
      duration: '2-4 jam',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
      description: `Teknik pengawetan dan pemberian rasa dengan asap.\nMenggunakan kayu atau tempurung kelapa sebagai sumber asap.\nMenghasilkan aroma dan rasa yang khas.`,
      tools: ['Alat pengasap', 'Kayu/tempurung', 'Rak pengasap'],
      ingredients: ['Bahan utama', 'Garam', 'Bumbu marinasi'],
      steps: [
        'Marinasi bahan dengan bumbu dan garam',
        'Siapkan alat pengasap dengan kayu bakar',
        'Asapi bahan selama 2-4 jam dengan suhu terkontrol',
        'Pastikan asap merata dan tidak terlalu panas'
      ],
      tips: [
        'Gunakan kayu yang tidak beracun',
        'Kontrol suhu agar tidak terlalu panas',
        'Asapi hingga warna kecokelatan merata'
      ],
      dishes: ['Ikan Asap', 'Ayam Asap', 'Daging Asap'],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      culturalSignificance: 'Teknik pengasapan telah digunakan nenek moyang untuk mengawetkan makanan'
    }
  ];

  const filteredTechniques = techniques?.filter(technique => technique?.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Mudah': return 'bg-success/10 text-success';
      case 'Sedang': return 'bg-warning/10 text-warning';
      case 'Sulit': return 'bg-error/10 text-error';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="w-full">
      {/* Library Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Perpustakaan Teknik Memasak
        </h3>
        <p className="text-muted-foreground">
          Pelajari teknik memasak tradisional dan modern Indonesia
        </p>
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
      {/* Techniques Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {filteredTechniques?.map((technique) => (
          <div
            key={technique?.id}
            className="cultural-card p-4 cursor-pointer transition-all duration-300 hover:shadow-cultural-lg"
            onClick={() => setSelectedTechnique(technique)}
          >
            <div className="aspect-w-16 aspect-h-12 mb-4 overflow-hidden rounded-lg">
              <Image
                src={technique?.image}
                alt={technique?.name}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Icon name="Play" size={32} className="text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-semibold text-foreground">
                  {technique?.name}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(technique?.difficulty)}`}>
                  {technique?.difficulty}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} />
                  <span>{technique?.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="ChefHat" size={14} />
                  <span>{technique?.dishes?.length} hidangan</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {technique?.description?.split('\n')?.[0]}
              </p>
              
              <div className="flex flex-wrap gap-1 pt-2">
                {technique?.dishes?.slice(0, 2)?.map((dish, index) => (
                  <span
                    key={index}
                    className="text-xs bg-turmeric/10 text-turmeric px-2 py-1 rounded-full"
                  >
                    {dish}
                  </span>
                ))}
                {technique?.dishes?.length > 2 && (
                  <span className="text-xs text-muted-foreground px-2 py-1">
                    +{technique?.dishes?.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Technique Detail Modal */}
      {selectedTechnique && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  {selectedTechnique?.name}
                </h3>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`text-sm px-3 py-1 rounded-full ${getDifficultyColor(selectedTechnique?.difficulty)}`}>
                    {selectedTechnique?.difficulty}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Icon name="Clock" size={14} className="mr-1" />
                    {selectedTechnique?.duration}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTechnique(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Video and Description */}
                <div>
                  {/* Video Player */}
                  <div className="aspect-w-16 aspect-h-9 mb-6 overflow-hidden rounded-xl bg-muted">
                    {playingVideo === selectedTechnique?.id ? (
                      <iframe
                        src={selectedTechnique?.videoUrl}
                        title={selectedTechnique?.name}
                        className="w-full h-64"
                        allowFullScreen
                      />
                    ) : (
                      <div className="relative w-full h-64 bg-gradient-to-br from-primary/10 to-turmeric/10 flex items-center justify-center cursor-pointer"
                           onClick={() => setPlayingVideo(selectedTechnique?.id)}>
                        <Image
                          src={selectedTechnique?.image}
                          alt={selectedTechnique?.name}
                          className="w-full h-full object-cover absolute inset-0"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="bg-white/90 rounded-full p-4 hover:bg-white transition-colors duration-200">
                            <Icon name="Play" size={32} className="text-primary ml-1" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Deskripsi
                      </h4>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {selectedTechnique?.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Makna Budaya
                      </h4>
                      <p className="text-muted-foreground">
                        {selectedTechnique?.culturalSignificance}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructions and Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <Icon name="Package" size={16} className="mr-2" />
                      Alat yang Dibutuhkan
                    </h4>
                    <div className="grid gap-2">
                      {selectedTechnique?.tools?.map((tool, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Icon name="Check" size={14} className="text-success" />
                          <span className="text-sm text-foreground">{tool}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <Icon name="ShoppingCart" size={16} className="mr-2" />
                      Bahan Utama
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTechnique?.ingredients?.map((ingredient, index) => (
                        <span
                          key={index}
                          className="text-sm bg-pandan/10 text-pandan px-3 py-1 rounded-full"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <Icon name="List" size={16} className="mr-2" />
                      Langkah-langkah
                    </h4>
                    <div className="space-y-3">
                      {selectedTechnique?.steps?.map((step, index) => (
                        <div key={index} className="flex space-x-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <p className="text-sm text-foreground pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <Icon name="Lightbulb" size={16} className="mr-2" />
                      Tips & Trik
                    </h4>
                    <div className="space-y-2">
                      {selectedTechnique?.tips?.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Icon name="Star" size={14} className="text-warning mt-0.5" />
                          <span className="text-sm text-foreground">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <Icon name="ChefHat" size={16} className="mr-2" />
                      Hidangan yang Menggunakan Teknik Ini
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTechnique?.dishes?.map((dish, index) => (
                        <span
                          key={index}
                          className="text-sm bg-turmeric/10 text-turmeric px-3 py-1 rounded-full"
                        >
                          {dish}
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
                  <span>Lihat Resep Terkait</span>
                </button>
                <button className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Icon name="Share2" size={16} />
                  <span>Bagikan Teknik</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookingTechniqueLibrary;