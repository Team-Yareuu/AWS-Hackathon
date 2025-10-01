import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIFeaturesShowcase = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const aiFeatures = [
    {
      id: 1,
      title: "Pencarian Resep Cerdas",
      subtitle: "Natural Language Processing",
      description: "Cukup ketik \'masakan pedas untuk 4 orang budget 50rb\' dan AI kami akan memahami kebutuhan Anda dengan sempurna",
      icon: "Search",
      color: "primary",
      benefits: [
        "Pemahaman bahasa natural Indonesia",
        "Pencarian berdasarkan mood dan situasi",
        "Rekomendasi personal yang akurat",
        "Filter otomatis sesuai preferensi"
      ],
      demoText: "Cari: \'Masakan hangat untuk cuaca hujan budget 30rb'",
      gradient: "from-primary to-turmeric"
    },
    {
      id: 2,
      title: "Optimasi Budget Pintar",
      subtitle: "Smart Budget Calculator",
      description: "AI menghitung biaya real-time, memberikan alternatif bahan yang lebih hemat, dan menemukan promo terbaik di sekitar Anda",
      icon: "Calculator",
      color: "success",
      benefits: [
        "Perhitungan biaya real-time",
        "Alternatif bahan yang lebih murah",
        "Deteksi promo dan diskon",
        "Optimasi belanja multi-toko"
      ],
      demoText: "Budget Rp 25.000 → Hemat Rp 8.500",
      gradient: "from-success to-pandan"
    },
    {
      id: 3,
      title: "Asisten Memasak AI",
      subtitle: "Real-time Cooking Guide",
      description: "Panduan step-by-step dengan AI yang memahami tingkat keahlian Anda dan memberikan tips personal saat memasak",
      icon: "ChefHat",
      color: "turmeric",
      benefits: [
        "Panduan real-time saat memasak",
        "Tips berdasarkan tingkat keahlian",
        "Deteksi masalah dan solusi cepat",
        "Voice assistant untuk hands-free"
      ],
      demoText: "AI: 'Tambahkan garam sedikit, api terlalu besar'",
      gradient: "from-turmeric to-accent"
    },
    {
      id: 4,
      title: "Pengenalan Bahan Visual",
      subtitle: "Computer Vision Technology",
      description: "Foto bahan yang ada di kulkas, AI akan mengenali dan memberikan rekomendasi resep yang bisa dibuat dengan bahan tersebut",
      icon: "Camera",
      color: "accent",
      benefits: [
        "Identifikasi bahan dari foto",
        "Deteksi kesegaran bahan",
        "Rekomendasi resep otomatis",
        "Pengurangan food waste"
      ],
      demoText: "Foto kulkas → 15 resep yang bisa dibuat",
      gradient: "from-accent to-chili"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveFeature((prev) => (prev + 1) % aiFeatures?.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentFeature = aiFeatures?.[activeFeature];

  const handleFeatureClick = (index) => {
    if (index !== activeFeature) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveFeature(index);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleTryFeature = () => {
    navigate('/ai-recipe-search');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 batik-pattern opacity-20"></div>
      <div className="absolute top-20 right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-60 h-60 bg-turmeric/5 rounded-full blur-3xl"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 text-primary mb-4">
            <Icon name="Sparkles" size={20} />
            <span className="text-sm font-medium uppercase tracking-wide">Teknologi AI</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            Kecerdasan Buatan untuk
            <span className="block text-primary">Pengalaman Memasak Terbaik</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Teknologi AI terdepan yang memahami kebutuhan kuliner Indonesia. 
            Dari pencarian resep hingga optimasi budget, semua dirancang khusus untuk keluarga Indonesia.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature Showcase */}
          <div className="space-y-8">
            {/* Feature Navigation */}
            <div className="grid grid-cols-2 gap-4">
              {aiFeatures?.map((feature, index) => (
                <button
                  key={feature?.id}
                  onClick={() => handleFeatureClick(index)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                    activeFeature === index
                      ? `border-${feature?.color} bg-${feature?.color}/5 shadow-cultural`
                      : 'border-border bg-white hover:border-border/60 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl bg-${feature?.color}/10 flex items-center justify-center`}>
                      <Icon name={feature?.icon} size={20} className={`text-${feature?.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${
                        activeFeature === index ? `text-${feature?.color}` : 'text-foreground'
                      }`}>
                        {feature?.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {feature?.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Active Feature Details */}
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentFeature?.gradient} flex items-center justify-center`}>
                      <Icon name={currentFeature?.icon} size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-heading font-bold text-foreground">
                        {currentFeature?.title}
                      </h3>
                      <p className={`text-${currentFeature?.color} font-medium`}>
                        {currentFeature?.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {currentFeature?.description}
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-3">
                  <p className="font-medium text-foreground">Keunggulan:</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {currentFeature?.benefits?.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Icon name="Check" size={16} className={`text-${currentFeature?.color}`} />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demo Example */}
                <div className={`bg-gradient-to-r ${currentFeature?.gradient} p-4 rounded-xl text-white`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Play" size={16} />
                    <span className="text-sm font-medium">Contoh Penggunaan:</span>
                  </div>
                  <p className="font-mono text-sm bg-white/20 px-3 py-2 rounded-lg">
                    {currentFeature?.demoText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Demo Area */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-cultural-lg p-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className={`absolute inset-0 bg-gradient-to-br ${currentFeature?.gradient} opacity-5`}></div>
              
              <div className="relative z-10 space-y-6">
                {/* Demo Header */}
                <div className="text-center space-y-2">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${currentFeature?.gradient} flex items-center justify-center`}>
                    <Icon name={currentFeature?.icon} size={32} className="text-white" />
                  </div>
                  <h4 className="text-xl font-heading font-bold text-foreground">
                    Coba {currentFeature?.title}
                  </h4>
                  <p className="text-muted-foreground">
                    Rasakan pengalaman AI yang revolusioner
                  </p>
                </div>

                {/* Interactive Elements */}
                <div className="space-y-4">
                  {activeFeature === 0 && (
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Ketik: 'Masakan pedas untuk keluarga budget 40rb'"
                          className="w-full p-3 border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10"
                          readOnly
                        />
                        <Icon name="Mic" size={20} className="absolute right-3 top-3 text-muted-foreground" />
                      </div>
                      <div className="bg-primary/5 p-3 rounded-xl">
                        <p className="text-sm text-primary">
                          ✨ AI menemukan 12 resep yang cocok dengan kriteria Anda
                        </p>
                      </div>
                    </div>
                  )}

                  {activeFeature === 1 && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-success/5 p-3 rounded-xl text-center">
                          <p className="text-xs text-muted-foreground">Budget Target</p>
                          <p className="font-bold text-success">Rp 40.000</p>
                        </div>
                        <div className="bg-turmeric/5 p-3 rounded-xl text-center">
                          <p className="text-xs text-muted-foreground">Biaya Aktual</p>
                          <p className="font-bold text-turmeric">Rp 31.500</p>
                        </div>
                      </div>
                      <div className="bg-success/5 p-3 rounded-xl">
                        <p className="text-sm text-success">
                          💰 Hemat Rp 8.500 dengan 3 alternatif bahan
                        </p>
                      </div>
                    </div>
                  )}

                  {activeFeature === 2 && (
                    <div className="space-y-3">
                      <div className="bg-turmeric/5 p-3 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon name="ChefHat" size={16} className="text-turmeric" />
                          <span className="text-sm font-medium">AI Cooking Assistant</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          "Langkah 3: Tumis bumbu hingga harum. Api sedang ya, jangan terlalu besar."
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" iconName="Volume2">
                          Suara
                        </Button>
                        <Button variant="outline" size="sm" iconName="Timer">
                          Timer
                        </Button>
                      </div>
                    </div>
                  )}

                  {activeFeature === 3 && (
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                        <Icon name="Camera" size={32} className="text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Foto bahan di kulkas Anda
                        </p>
                      </div>
                      <div className="bg-accent/5 p-3 rounded-xl">
                        <p className="text-sm text-accent">
                          📸 Terdeteksi: Ayam, Bawang, Cabai → 8 resep tersedia
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  variant="default"
                  fullWidth
                  size="lg"
                  onClick={handleTryFeature}
                  iconName="ArrowRight"
                  iconPosition="right"
                  className={`bg-gradient-to-r ${currentFeature?.gradient} border-0 hover:shadow-cultural-lg`}
                >
                  Coba Sekarang Gratis
                </Button>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-turmeric/20 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-cultural p-8">
          <div className="grid sm:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Zap" size={24} className="text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">99.2%</p>
              <p className="text-sm text-muted-foreground">Akurasi AI</p>
            </div>
            
            <div className="space-y-2">
              <div className="bg-success/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Clock" size={24} className="text-success" />
              </div>
              <p className="text-2xl font-bold text-success">&lt;2 detik</p>
              <p className="text-sm text-muted-foreground">Waktu Respons</p>
            </div>
            
            <div className="space-y-2">
              <div className="bg-turmeric/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Users" size={24} className="text-turmeric" />
              </div>
              <p className="text-2xl font-bold text-turmeric">50K+</p>
              <p className="text-sm text-muted-foreground">Pengguna Aktif</p>
            </div>
            
            <div className="space-y-2">
              <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Heart" size={24} className="text-accent" />
              </div>
              <p className="text-2xl font-bold text-accent">4.9/5</p>
              <p className="text-sm text-muted-foreground">Rating Pengguna</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeaturesShowcase;