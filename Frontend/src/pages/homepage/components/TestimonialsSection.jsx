import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sari Dewi",
      role: "Ibu Rumah Tangga",
      location: "Jakarta",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5,
      text: "AI Resepku benar-benar mengubah cara saya memasak! Dengan budget terbatas, saya tetap bisa membuat masakan lezat untuk keluarga. Fitur pencarian AI-nya sangat memahami kebutuhan saya.",
      recipe: "Rendang Daging Budget",
      savings: "Rp 25.000",
      timeUsing: "8 bulan",
      highlight: "Hemat 40% budget belanja"
    },
    {
      id: 2,
      name: "Budi Santoso",
      role: "Karyawan Swasta",
      location: "Surabaya",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 5,
      text: "Sebagai pemula dalam memasak, AI assistant-nya sangat membantu. Step-by-step yang jelas dan tips real-time membuat saya percaya diri memasak untuk istri dan anak-anak.",
      recipe: "Soto Ayam Lamongan",
      savings: "Rp 15.000",
      timeUsing: "5 bulan",
      highlight: "Dari pemula jadi jago masak"
    },
    {
      id: 3,
      name: "Rina Maharani",
      role: "Wiraswasta",
      location: "Bandung",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 5,
      text: "Fitur foto kulkas untuk dapat rekomendasi resep itu genius! Tidak ada lagi bahan yang terbuang. AI-nya juga paham selera keluarga Sunda kami.",
      recipe: "Pepes Ikan Mas",
      savings: "Rp 20.000",
      timeUsing: "1 tahun",
      highlight: "Zero food waste di rumah"
    },
    {
      id: 4,
      name: "Ahmad Fauzi",
      role: "Mahasiswa",
      location: "Yogyakarta",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 5,
      text: "Sebagai mahasiswa dengan budget pas-pasan, aplikasi ini sangat membantu. Bisa masak enak dengan modal minim. Gudeg buatan sendiri jadi favorit teman-teman kos!",
      recipe: "Gudeg Jogja Express",
      savings: "Rp 30.000",
      timeUsing: "6 bulan",
      highlight: "Masak enak modal minim"
    },
    {
      id: 5,
      name: "Indira Sari",
      role: "Pekerja Kantoran",
      location: "Medan",
      avatar: "https://randomuser.me/api/portraits/women/35.jpg",
      rating: 5,
      text: "Cerita budaya di setiap resep membuat saya lebih menghargai warisan kuliner Indonesia. Anak-anak jadi tahu asal-usul masakan yang mereka makan.",
      recipe: "Rendang Padang Autentik",
      savings: "Rp 18.000",
      timeUsing: "10 bulan",
      highlight: "Anak-anak cinta budaya Indonesia"
    },
    {
      id: 6,
      name: "Dedi Kurniawan",
      role: "Pensiunan",
      location: "Solo",
      avatar: "https://randomuser.me/api/portraits/men/58.jpg",
      rating: 5,
      text: "Di usia senja, saya senang bisa berbagi resep keluarga dan belajar resep baru. Komunitas di AI Resepku sangat hangat dan saling membantu.",
      recipe: "Nasi Liwet Solo",
      savings: "Rp 12.000",
      timeUsing: "2 tahun",
      highlight: "Berbagi resep warisan keluarga"
    }
  ];

  const stats = [
    {
      icon: "Users",
      value: "50,000+",
      label: "Keluarga Terdaftar",
      color: "primary"
    },
    {
      icon: "Star",
      value: "4.9/5",
      label: "Rating Pengguna",
      color: "turmeric"
    },
    {
      icon: "ChefHat",
      value: "2,500+",
      label: "Resep Tersedia",
      color: "success"
    },
    {
      icon: "TrendingDown",
      value: "35%",
      label: "Rata-rata Penghematan",
      color: "accent"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials?.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const current = testimonials?.[currentTestimonial];

  return (
    <section className="py-16 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 text-primary mb-4">
            <Icon name="Heart" size={20} />
            <span className="text-sm font-medium uppercase tracking-wide">Testimoni</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            Dipercaya Ribuan Keluarga Indonesia
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bergabunglah dengan komunitas keluarga Indonesia yang telah merasakan 
            kemudahan dan kehematan memasak dengan bantuan AI.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Featured Testimonial */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-cultural-lg p-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
              
              <div className="relative z-10 space-y-6">
                {/* Quote Icon */}
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Icon name="Quote" size={24} className="text-primary" />
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(current?.rating)]?.map((_, i) => (
                    <Icon key={i} name="Star" size={20} className="text-turmeric fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-lg text-foreground leading-relaxed font-medium">
                  "{current?.text}"
                </blockquote>

                {/* User Info */}
                <div className="flex items-center space-x-4 pt-6 border-t border-border">
                  <div className="relative">
                    <Image
                      src={current?.avatar}
                      alt={current?.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                      <Icon name="Check" size={12} className="text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-heading font-bold text-foreground">{current?.name}</h4>
                    <p className="text-sm text-muted-foreground">{current?.role}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Icon name="MapPin" size={12} className="text-primary" />
                      <span className="text-xs text-primary">{current?.location}</span>
                      <span className="text-xs text-muted-foreground">• {current?.timeUsing}</span>
                    </div>
                  </div>
                </div>

                {/* Highlight Achievement */}
                <div className="bg-gradient-to-r from-success/10 to-turmeric/10 p-4 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Icon name="Award" size={20} className="text-success" />
                    <div>
                      <p className="font-medium text-success">{current?.highlight}</p>
                      <p className="text-sm text-muted-foreground">
                        Resep favorit: {current?.recipe} • Hemat: {current?.savings}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center space-x-2">
              {testimonials?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentTestimonial ? 'bg-primary w-8' : 'bg-border hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stats & Other Testimonials */}
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats?.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-cultural p-6 text-center">
                  <div className={`w-12 h-12 bg-${stat?.color}/10 rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon name={stat?.icon} size={24} className={`text-${stat?.color}`} />
                  </div>
                  <p className={`text-2xl font-bold text-${stat?.color} mb-1`}>{stat?.value}</p>
                  <p className="text-sm text-muted-foreground">{stat?.label}</p>
                </div>
              ))}
            </div>

            {/* Mini Testimonials */}
            <div className="space-y-4">
              {testimonials?.slice(0, 3)?.map((testimonial, index) => (
                <div
                  key={testimonial?.id}
                  className={`bg-white rounded-2xl shadow-cultural p-4 cursor-pointer transition-all duration-200 hover:shadow-cultural-lg ${
                    currentTestimonial === index ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src={testimonial?.avatar}
                      alt={testimonial?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-foreground truncate">{testimonial?.name}</h5>
                        <div className="flex">
                          {[...Array(testimonial?.rating)]?.map((_, i) => (
                            <Icon key={i} name="Star" size={12} className="text-turmeric fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {testimonial?.text?.substring(0, 80)}...
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Icon name="MapPin" size={10} className="text-primary" />
                        <span className="text-xs text-primary">{testimonial?.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="bg-gradient-to-r from-primary to-turmeric rounded-2xl p-6 text-white">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Icon name="Shield" size={20} />
                  <span className="font-medium">Dipercaya & Aman</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <Icon name="Lock" size={16} className="mx-auto mb-1" />
                    <p>Data Aman</p>
                  </div>
                  <div className="text-center">
                    <Icon name="Award" size={16} className="mx-auto mb-1" />
                    <p>Resep Autentik</p>
                  </div>
                  <div className="text-center">
                    <Icon name="Users" size={16} className="mx-auto mb-1" />
                    <p>Komunitas Aktif</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-white rounded-2xl shadow-cultural p-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl font-heading font-bold text-foreground">
              Bergabunglah dengan Keluarga Bahagia Lainnya
            </h3>
            <p className="text-muted-foreground">
              Mulai perjalanan kuliner Anda bersama AI Resepku. 
              Gratis untuk semua keluarga Indonesia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <div className="flex items-center space-x-2 text-sm text-success">
                <Icon name="Check" size={16} />
                <span>100% Gratis</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary">
                <Icon name="Check" size={16} />
                <span>Tanpa Iklan</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-turmeric">
                <Icon name="Check" size={16} />
                <span>Resep Unlimited</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;