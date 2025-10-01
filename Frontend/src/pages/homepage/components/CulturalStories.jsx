import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CulturalStories = () => {
  const navigate = useNavigate();
  const [activeStory, setActiveStory] = useState(0);

  const culturalStories = [
    {
      id: 1,
      title: "Filosofi Rendang: Lebih dari Sekedar Masakan",
      subtitle: "Warisan Minangkabau yang Mendunia",
      excerpt: "Rendang bukan hanya masakan, tetapi cerminan filosofi hidup masyarakat Minangkabau. Setiap bumbu memiliki makna mendalam yang mengajarkan tentang kesabaran, ketekunan, dan keharmonisan.",
      fullStory: `Rendang adalah manifestasi dari filosofi hidup masyarakat Minangkabau yang kaya akan nilai-nilai luhur. Proses memasak rendang yang memakan waktu berjam-jam mengajarkan tentang kesabaran dan ketekunan.\n\nSetiap bumbu dalam rendang memiliki makna filosofis: cabai melambangkan ketegasan, bawang putih sebagai kebijaksanaan, jahe untuk kehangatan keluarga, dan santan yang melambangkan kemurnian hati.\n\nTradisi memasak rendang biasanya dilakukan secara gotong royong oleh para perempuan dalam keluarga, mencerminkan nilai kebersamaan dan solidaritas yang kuat dalam budaya Minangkabau.`,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
      region: "Sumatera Barat",
      readTime: "5 menit",
      category: "Filosofi Kuliner",
      author: "Dr. Siti Aminah",
      publishDate: "2025-09-25",
      tags: ["Minangkabau", "Filosofi", "Tradisi", "Rendang"]
    },
    {
      id: 2,
      title: "Gudeg: Simbol Kesederhanaan dan Kemanisan Hidup",
      subtitle: "Kearifan Lokal Yogyakarta",
      excerpt: "Gudeg mengajarkan bahwa kemanisan hidup datang dari kesederhanaan. Nangka muda yang dimasak dengan sabar menjadi simbol bagaimana kesabaran menghasilkan kelezatan yang tak terlupakan.",
      fullStory: `Gudeg lahir dari kearifan lokal masyarakat Yogyakarta yang menghargai kesederhanaan. Nangka muda yang awalnya dianggap makanan rakyat biasa, diolah dengan penuh cinta menjadi hidangan istimewa.\n\nProses memasak gudeg yang memakan waktu semalaman mengajarkan tentang kesabaran dan dedikasi. Gula jawa yang memberikan rasa manis melambangkan kemanisan hidup yang harus diperjuangkan dengan kerja keras.\n\nTradisi makan gudeg bersama keluarga di pagi hari mencerminkan nilai-nilai kekeluargaan yang kuat dalam budaya Jawa, di mana makanan menjadi pengikat hubungan sosial.`,
      image: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?w=600&h=400&fit=crop",
      region: "Yogyakarta",
      readTime: "4 menit",
      category: "Sejarah Kuliner",
      author: "Prof. Bambang Sutrisno",
      publishDate: "2025-09-28",
      tags: ["Yogyakarta", "Jawa", "Kesederhanaan", "Gudeg"]
    },
    {
      id: 3,
      title: "Soto: Kehangatan dalam Setiap Suapan",
      subtitle: "Persatuan dalam Keberagaman",
      excerpt: "Soto hadir dalam berbagai variasi di seluruh Indonesia, namun tetap mempertahankan esensi kehangatan. Setiap daerah memiliki interpretasi unik yang mencerminkan kekayaan budaya lokal.",
      fullStory: `Soto adalah bukti nyata bagaimana satu konsep makanan dapat beradaptasi dengan kearifan lokal di berbagai daerah. Dari Soto Betawi hingga Soto Lamongan, setiap variasi memiliki karakter unik.\n\nKuah soto yang hangat melambangkan kehangatan hubungan sosial dalam masyarakat Indonesia. Tradisi makan soto bersama keluarga atau teman mencerminkan nilai gotong royong dan kebersamaan.\n\nBahan-bahan lokal yang digunakan dalam setiap variasi soto menunjukkan bagaimana masyarakat Indonesia pandai memanfaatkan sumber daya alam sekitar untuk menciptakan cita rasa yang khas dan berkarakter.`,
      image: "https://images.pixabay.com/photo/2019/11/20/08/31/soup-4639743_1280.jpg?w=600&h=400&fit=crop",
      region: "Seluruh Indonesia",
      readTime: "6 menit",
      category: "Keberagaman Kuliner",
      author: "Dra. Kartini Sari",
      publishDate: "2025-09-30",
      tags: ["Soto", "Keberagaman", "Tradisi", "Indonesia"]
    }
  ];

  const handleStoryClick = (story) => {
    navigate('/cultural-heritage-explorer', { state: { storyId: story?.id, story } });
  };

  const handleExploreAll = () => {
    navigate('/cultural-heritage-explorer');
  };

  const currentStory = culturalStories?.[activeStory];

  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 text-primary mb-4">
            <Icon name="BookOpen" size={20} />
            <span className="text-sm font-medium uppercase tracking-wide">Warisan Budaya</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            Cerita di Balik Setiap Resep
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Jelajahi kekayaan filosofi dan sejarah di balik masakan Indonesia. 
            Setiap hidangan memiliki cerita yang menghubungkan kita dengan warisan leluhur.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Featured Story */}
          <div className="space-y-6">
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-cultural-lg">
              <Image
                src={currentStory?.image}
                alt={currentStory?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Story Overlay Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-2">
                    <Icon name="MapPin" size={14} />
                    <span className="text-sm font-medium">{currentStory?.region}</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-2">
                    <Icon name="Clock" size={14} />
                    <span className="text-sm font-medium">{currentStory?.readTime}</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-heading font-bold mb-2">
                  {currentStory?.title}
                </h3>
                <p className="text-white/90 font-medium">
                  {currentStory?.subtitle}
                </p>
              </div>
            </div>

            {/* Story Navigation */}
            <div className="flex justify-center space-x-2">
              {culturalStories?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStory(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === activeStory ? 'bg-primary' : 'bg-border hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Story Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Icon name="Scroll" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary font-medium">{currentStory?.category}</p>
                  <p className="text-xs text-muted-foreground">
                    Oleh {currentStory?.author} • {new Date(currentStory.publishDate)?.toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-heading font-bold text-foreground">
                {currentStory?.title}
              </h3>
              
              <p className="text-lg text-primary font-medium">
                {currentStory?.subtitle}
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                {currentStory?.excerpt}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {currentStory?.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="default"
                onClick={() => handleStoryClick(currentStory)}
                iconName="ArrowRight"
                iconPosition="right"
                className="flex-1"
              >
                Baca Cerita Lengkap
              </Button>
              <Button
                variant="outline"
                onClick={handleExploreAll}
                iconName="BookOpen"
                iconPosition="left"
                className="flex-1"
              >
                Jelajahi Semua Cerita
              </Button>
            </div>

            {/* Cultural Trust Signal */}
            <div className="pt-6 border-t border-border">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="trust-signal">
                  <Icon name="Users" size={16} className="text-primary" />
                  <span>15,000+ Pembaca</span>
                </div>
                <div className="trust-signal">
                  <Icon name="Heart" size={16} className="text-accent" />
                  <span>98% Suka Cerita Ini</span>
                </div>
                <div className="trust-signal">
                  <Icon name="Share2" size={16} className="text-success" />
                  <span>2,500+ Dibagikan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story List */}
        <div className="mt-16">
          <h3 className="text-xl font-heading font-bold text-foreground mb-6 text-center">
            Cerita Budaya Lainnya
          </h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {culturalStories?.map((story, index) => (
              <div
                key={story?.id}
                className={`cultural-card cursor-pointer ${
                  index === activeStory ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setActiveStory(index)}
              >
                <div className="relative h-32 overflow-hidden rounded-t-lg">
                  <Image
                    src={story?.image}
                    alt={story?.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {story?.title}
                    </p>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={12} />
                      <span>{story?.region}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{story?.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CulturalStories;