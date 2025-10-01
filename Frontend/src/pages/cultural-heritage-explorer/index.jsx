import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import RegionalMap from './components/RegionalMap';
import CulturalTimeline from './components/CulturalTimeline';
import FestivalCalendar from './components/FestivalCalendar';
import IngredientEncyclopedia from './components/IngredientEncyclopedia';
import CookingTechniqueLibrary from './components/CookingTechniqueLibrary';
import CulturalStoryCard from './components/CulturalStoryCard';

const CulturalHeritageExplorer = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  const tabs = [
    { id: 'overview', name: 'Ringkasan', icon: 'Home' },
    { id: 'regions', name: 'Peta Daerah', icon: 'Map' },
    { id: 'timeline', name: 'Sejarah', icon: 'Clock' },
    { id: 'festivals', name: 'Perayaan', icon: 'Calendar' },
    { id: 'ingredients', name: 'Bahan', icon: 'Leaf' },
    { id: 'techniques', name: 'Teknik', icon: 'ChefHat' }
  ];

  const featuredStories = [
    {
      id: 'rendang-story',
      title: 'Rendang: Dari Minangkabau ke Dunia',
      excerpt: `Perjalanan rendang dari hidangan tradisional Minangkabau menjadi masakan terenak di dunia.\nBagaimana teknik memasak yang memakan waktu berjam-jam ini menjadi kebanggaan Indonesia.`,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600',
      region: 'Sumatera Barat',
      category: 'Hidangan Utama',
      readTime: 8,
      views: 12500,
      likes: 890,
      publishedDate: '2024-03-15',
      author: 'Chef Rina Sari',
      content: `Rendang bukan sekadar masakan, tetapi sebuah filosofi hidup masyarakat Minangkabau.\n\nProses memasak rendang yang memakan waktu berjam-jam melambangkan kesabaran dan ketekunan. Setiap bumbu yang digunakan memiliki makna tersendiri - cabai melambangkan ketegasan, kunyit melambangkan kebijaksanaan, dan santan melambangkan kemurnian hati.\n\nTeknik memasak rendang yang unik, yaitu memasak daging dalam santan dan rempah-rempah hingga cairan mengering dan bumbu meresap sempurna, menghasilkan cita rasa yang tak tertandingi. Inilah yang membuat rendang terpilih sebagai masakan terenak di dunia versi CNN International.\n\nDalam budaya Minangkabau, rendang tidak hanya disajikan sebagai makanan sehari-hari, tetapi juga memiliki peran penting dalam upacara adat dan perayaan besar. Setiap keluarga memiliki resep rahasia yang diwariskan turun-temurun.`
    },
    {
      id: 'gudeg-story',
      title: 'Gudeg: Jiwa Yogyakarta dalam Setiap Suapan',
      excerpt: `Mengapa gudeg disebut sebagai jiwa Yogyakarta? Temukan filosofi di balik rasa manis yang khas.\nDari nangka muda hingga menjadi identitas kuliner Kota Gudeg.`,
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600',
      region: 'Yogyakarta',
      category: 'Hidangan Tradisional',
      readTime: 6,
      views: 8900,
      likes: 654,
      publishedDate: '2024-03-10',
      author: 'Mbah Lindu',
      content: `Gudeg adalah cerminan karakter masyarakat Yogyakarta yang sabar dan tekun.\n\nProses memasak gudeg yang memakan waktu seharian penuh, mulai dari pukul 3 pagi hingga sore hari, mencerminkan kesabaran dan dedikasi yang tinggi. Nangka muda yang awalnya pahit, melalui proses perebusan dan pemasakan yang panjang, berubah menjadi manis dan gurih.\n\nGula merah yang menjadi kunci kelezatan gudeg bukan hanya memberikan rasa manis, tetapi juga melambangkan kehidupan yang manis meskipun melalui proses yang pahit. Daun jati yang digunakan memberikan warna cokelat khas dan aroma yang tidak bisa digantikan.\n\nSetiap warung gudeg di Yogyakarta memiliki ciri khas tersendiri, namun semuanya tetap mempertahankan tradisi dan filosofi yang sama.`
    }
  ];

  const culturalStories = [
    {
      id: 'tempe-story',
      title: 'Tempe: Inovasi Fermentasi Nusantara',
      excerpt: 'Bagaimana nenek moyang Indonesia menciptakan superfood dari kedelai sederhana',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      region: 'Jawa',
      category: 'Fermentasi',
      readTime: 5,
      views: 6700,
      likes: 423,
      publishedDate: '2024-03-08'
    },
    {
      id: 'soto-story',
      title: 'Soto: Keragaman dalam Kesatuan',
      excerpt: 'Mengapa setiap daerah di Indonesia memiliki soto dengan cita rasa yang berbeda',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
      region: 'Seluruh Indonesia',
      category: 'Sup Tradisional',
      readTime: 7,
      views: 9200,
      likes: 567,
      publishedDate: '2024-03-05'
    },
    {
      id: 'sambal-story',
      title: 'Sambal: Api yang Menyatukan Nusantara',
      excerpt: 'Dari Aceh hingga Papua, sambal menjadi jiwa masakan Indonesia',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
      region: 'Seluruh Indonesia',
      category: 'Bumbu Tradisional',
      readTime: 4,
      views: 5400,
      likes: 389,
      publishedDate: '2024-03-02'
    },
    {
      id: 'nasi-story',
      title: 'Nasi: Lebih dari Sekedar Makanan Pokok',
      excerpt: 'Peran nasi dalam budaya dan ritual masyarakat Indonesia',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      region: 'Seluruh Indonesia',
      category: 'Makanan Pokok',
      readTime: 6,
      views: 7800,
      likes: 445,
      publishedDate: '2024-02-28'
    }
  ];

  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-turmeric to-accent p-8 text-white">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10 max-w-3xl">
                <h1 className="text-4xl font-bold mb-4">
                  Warisan Kuliner Nusantara
                </h1>
                <p className="text-xl opacity-90 mb-6">
                  Jelajahi kekayaan budaya kuliner Indonesia dari Sabang sampai Merauke. 
                  Temukan cerita di balik setiap hidangan, teknik memasak tradisional, 
                  dan filosofi yang terkandung dalam setiap rasa.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Icon name="MapPin" size={16} />
                    <span>34 Provinsi</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Icon name="ChefHat" size={16} />
                    <span>1000+ Resep</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Icon name="BookOpen" size={16} />
                    <span>500+ Cerita</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full"></div>
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full"></div>
            </div>
            {/* Featured Stories */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Cerita Unggulan
                  </h2>
                  <p className="text-muted-foreground">
                    Kisah menarik di balik hidangan legendaris Indonesia
                  </p>
                </div>
                <button className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-200">
                  <span>Lihat Semua</span>
                  <Icon name="ArrowRight" size={16} />
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {featuredStories?.map((story) => (
                  <CulturalStoryCard
                    key={story?.id}
                    story={story}
                    onClick={handleStoryClick}
                    featured={true}
                  />
                ))}
              </div>
            </div>
            {/* Quick Access Cards */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Jelajahi Warisan Kuliner
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tabs?.slice(1)?.map((tab) => (
                  <div
                    key={tab?.id}
                    className="cultural-card p-6 cursor-pointer text-center group"
                    onClick={() => setActiveTab(tab?.id)}
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon name={tab?.icon} size={24} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {tab?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tab?.id === 'regions' && 'Jelajahi kuliner dari berbagai daerah'}
                      {tab?.id === 'timeline' && 'Perjalanan sejarah kuliner Indonesia'}
                      {tab?.id === 'festivals' && 'Hidangan khas perayaan tradisional'}
                      {tab?.id === 'ingredients' && 'Ensiklopedia bahan makanan tradisional'}
                      {tab?.id === 'techniques' && 'Teknik memasak warisan nenek moyang'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Cultural Stories Grid */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Cerita Budaya
                  </h2>
                  <p className="text-muted-foreground">
                    Temukan filosofi dan makna di balik setiap hidangan
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {culturalStories?.map((story) => (
                  <CulturalStoryCard
                    key={story?.id}
                    story={story}
                    onClick={handleStoryClick}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case 'regions':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Peta Kuliner Indonesia
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Klik pada setiap daerah untuk menjelajahi kekayaan kuliner tradisional 
                dari Sabang sampai Merauke
              </p>
            </div>
            <RegionalMap 
              onRegionSelect={setSelectedRegion} 
              selectedRegion={selectedRegion} 
            />
            {selectedRegion && (
              <div className="bg-gradient-to-r from-primary/5 to-turmeric/5 rounded-xl p-8 border border-primary/10">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Kuliner {selectedRegion?.name}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {selectedRegion?.description}
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {selectedRegion?.specialties?.map((specialty, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-cultural">
                      <h4 className="font-semibold text-foreground mb-2">
                        {specialty}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Hidangan khas {selectedRegion?.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'timeline':
        return <CulturalTimeline />;
      case 'festivals':
        return <FestivalCalendar />;
      case 'ingredients':
        return <IngredientEncyclopedia />;
      case 'techniques':
        return <CookingTechniqueLibrary />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Navigation Tabs */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-cultural border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto py-4 space-x-1">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground shadow-cultural'
                      : 'text-foreground hover:bg-muted hover:text-primary'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderTabContent()}
        </div>

        {/* Story Detail Modal */}
        {selectedStory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {selectedStory?.title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span>{selectedStory?.region}</span>
                    <span>•</span>
                    <span>{selectedStory?.readTime} menit baca</span>
                    <span>•</span>
                    <span>{selectedStory?.author}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="aspect-w-16 aspect-h-9 mb-6 overflow-hidden rounded-xl">
                  <Image
                    src={selectedStory?.image}
                    alt={selectedStory?.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-lg text-muted-foreground mb-6 whitespace-pre-line">
                    {selectedStory?.excerpt}
                  </p>
                  
                  {selectedStory?.content && (
                    <div className="text-foreground whitespace-pre-line leading-relaxed">
                      {selectedStory?.content}
                    </div>
                  )}
                </div>

                {/* Story Actions */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200">
                      <Icon name="Heart" size={16} />
                      <span>{selectedStory?.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200">
                      <Icon name="Eye" size={16} />
                      <span>{selectedStory?.views}</span>
                    </button>
                  </div>
                  
                  <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200">
                    <Icon name="Share2" size={16} />
                    <span>Bagikan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Warisan Kuliner Indonesia
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Melestarikan dan merayakan kekayaan budaya kuliner Nusantara 
              untuk generasi mendatang
            </p>
            <div className="trust-signal justify-center">
              <Icon name="Shield" size={16} className="text-success" />
              <span>Konten Terverifikasi</span>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <span>Budaya Asli Indonesia</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>&copy; {new Date()?.getFullYear()} AI Resepku. Melestarikan warisan kuliner Indonesia.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CulturalHeritageExplorer;