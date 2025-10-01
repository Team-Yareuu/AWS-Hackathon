import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: "Fitur Utama",
      links: [
        { label: "Pencarian Resep AI", path: "/ai-recipe-search", icon: "Search" },
        { label: "Warisan Budaya", path: "/cultural-heritage-explorer", icon: "BookOpen" },
        { label: "Belanja Pintar", path: "/smart-shopping-assistant", icon: "ShoppingCart" },
        { label: "Dapur Personal", path: "/personal-kitchen-dashboard", icon: "ChefHat" }
      ]
    },
    {
      title: "Komunitas",
      links: [
        { label: "Berbagi Resep", path: "/community/share", icon: "Share2" },
        { label: "Forum Diskusi", path: "/community/forum", icon: "MessageCircle" },
        { label: "Tips & Trik", path: "/community/tips", icon: "Lightbulb" },
        { label: "Event Kuliner", path: "/community/events", icon: "Calendar" }
      ]
    },
    {
      title: "Bantuan",
      links: [
        { label: "Panduan Penggunaan", path: "/help/guide", icon: "HelpCircle" },
        { label: "FAQ", path: "/help/faq", icon: "MessageSquare" },
        { label: "Kontak Support", path: "/help/contact", icon: "Phone" },
        { label: "Lapor Masalah", path: "/help/report", icon: "AlertCircle" }
      ]
    },
    {
      title: "Perusahaan",
      links: [
        { label: "Tentang Kami", path: "/about", icon: "Info" },
        { label: "Karir", path: "/careers", icon: "Briefcase" },
        { label: "Press Kit", path: "/press", icon: "FileText" },
        { label: "Partnership", path: "/partnership", icon: "Handshake" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Instagram", icon: "Instagram", url: "https://instagram.com/airesepku", color: "text-pink-500" },
    { name: "Facebook", icon: "Facebook", url: "https://facebook.com/airesepku", color: "text-blue-600" },
    { name: "Twitter", icon: "Twitter", url: "https://twitter.com/airesepku", color: "text-blue-400" },
    { name: "YouTube", icon: "Youtube", url: "https://youtube.com/airesepku", color: "text-red-500" },
    { name: "TikTok", icon: "Music", url: "https://tiktok.com/@airesepku", color: "text-black" }
  ];

  const handleLinkClick = (path) => {
    if (path?.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-primary via-primary to-secondary text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 batik-pattern opacity-10"></div>
      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-white/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-heading font-bold">
                  Dapatkan Resep Terbaru & Tips Kuliner
                </h3>
                <p className="text-white/80 max-w-2xl mx-auto">
                  Berlangganan newsletter kami dan dapatkan resep eksklusif, tips memasak, 
                  dan update fitur terbaru langsung di email Anda.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    placeholder="Masukkan email Anda"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all duration-200"
                  />
                </div>
                <Button
                  variant="secondary"
                  iconName="Send"
                  iconPosition="right"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Berlangganan
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-white/70">
                <div className="flex items-center space-x-1">
                  <Icon name="Check" size={14} />
                  <span>Resep Mingguan</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Check" size={14} />
                  <span>Tips Hemat</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Check" size={14} />
                  <span>Update Fitur</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Check" size={14} />
                  <span>Event Eksklusif</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                </div>
                <div>
                  <h4 className="text-xl font-heading font-bold">AI Resepku</h4>
                  <p className="text-sm text-white/70 font-accent">Warisan Rasa Indonesia</p>
                </div>
              </div>

              <p className="text-white/80 leading-relaxed">
                Platform kuliner AI pertama di Indonesia yang menggabungkan teknologi modern 
                dengan kearifan tradisional untuk membantu keluarga Indonesia memasak dengan 
                lebih mudah, hemat, dan bermakna.
              </p>

              {/* Social Links */}
              <div className="space-y-3">
                <p className="font-medium">Ikuti Kami:</p>
                <div className="flex space-x-3">
                  {socialLinks?.map((social) => (
                    <button
                      key={social?.name}
                      onClick={() => handleLinkClick(social?.url)}
                      className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                      title={social?.name}
                    >
                      <Icon name={social?.icon} size={18} />
                    </button>
                  ))}
                </div>
              </div>

              {/* App Download */}
              <div className="space-y-3">
                <p className="font-medium">Download Aplikasi:</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-200">
                    <Icon name="Smartphone" size={16} />
                    <span className="text-sm">Google Play</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-200">
                    <Icon name="Smartphone" size={16} />
                    <span className="text-sm">App Store</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections?.map((section, index) => (
              <div key={index} className="space-y-4">
                <h5 className="font-heading font-bold text-lg">{section?.title}</h5>
                <ul className="space-y-3">
                  {section?.links?.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <button
                        onClick={() => handleLinkClick(link?.path)}
                        className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 group"
                      >
                        <Icon name={link?.icon} size={14} className="group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-sm">{link?.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              {/* Copyright */}
              <div className="text-center lg:text-left">
                <p className="text-white/70 text-sm">
                  © {currentYear} AI Resepku. Seluruh hak cipta dilindungi undang-undang.
                </p>
                <p className="text-white/60 text-xs mt-1">
                  Dibuat dengan ❤️ untuk keluarga Indonesia
                </p>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <button
                  onClick={() => handleLinkClick('/privacy')}
                  className="text-white/70 hover:text-white transition-colors duration-200"
                >
                  Kebijakan Privasi
                </button>
                <button
                  onClick={() => handleLinkClick('/terms')}
                  className="text-white/70 hover:text-white transition-colors duration-200"
                >
                  Syarat & Ketentuan
                </button>
                <button
                  onClick={() => handleLinkClick('/cookies')}
                  className="text-white/70 hover:text-white transition-colors duration-200"
                >
                  Kebijakan Cookie
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-turmeric/10 rounded-full blur-2xl"></div>
    </footer>
  );
};

export default Footer;