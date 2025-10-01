import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CulturalTimeline = () => {
  const [selectedEra, setSelectedEra] = useState('modern');

  const timelineData = [
    {
      id: 'ancient',
      period: 'Zaman Kuno',
      year: '2000 SM - 500 M',
      title: 'Awal Mula Kuliner Nusantara',
      description: `Periode awal pengembangan teknik memasak tradisional Indonesia.\nPenggunaan rempah-rempah lokal dan teknik fermentasi alami.\nPengaruh perdagangan maritim dalam perkembangan cita rasa.`,
      dishes: ['Tempe', 'Tape', 'Asinan'],
      techniques: ['Fermentasi', 'Pengasapan', 'Pengeringan'],
      icon: 'Flame'
    },
    {
      id: 'kingdom',
      period: 'Kerajaan Nusantara',
      year: '500 - 1500 M',
      title: 'Era Keemasan Rempah',
      description: `Masa kejayaan kerajaan-kerajaan Nusantara dan perdagangan rempah.\nPerkembangan teknik memasak istana dan rakyat.\nPengaruh India, Cina, dan Arab dalam kuliner Indonesia.`,
      dishes: ['Rendang', 'Gulai', 'Opor'],
      techniques: ['Tumis', 'Santan', 'Bumbu Halus'],
      icon: 'Crown'
    },
    {
      id: 'colonial',
      period: 'Masa Kolonial',
      year: '1500 - 1945',
      title: 'Perpaduan Budaya Kuliner',
      description: `Pengaruh Belanda, Portugis, dan bangsa Eropa lainnya.\nPerkembangan kuliner Indo dan Peranakan.\nAdaptasi bahan-bahan baru dari luar negeri.`,
      dishes: ['Rijsttafel', 'Semur', 'Bistik'],
      techniques: ['Panggang Oven', 'Rebus', 'Goreng Mentega'],
      icon: 'Ship'
    },
    {
      id: 'independence',
      period: 'Kemerdekaan',
      year: '1945 - 1980',
      title: 'Identitas Kuliner Nasional',
      description: `Pembentukan identitas kuliner Indonesia yang bersatu.\nStandardisasi resep-resep tradisional.\nPerkembangan warung dan rumah makan lokal.`,
      dishes: ['Nasi Gudeg', 'Soto Ayam', 'Gado-gado'],
      techniques: ['Bacem', 'Pepes', 'Lalap'],
      icon: 'Flag'
    },
    {
      id: 'modern',
      period: 'Era Modern',
      year: '1980 - Sekarang',
      title: 'Inovasi dan Globalisasi',
      description: `Modernisasi teknik memasak dengan teknologi.\nFusi kuliner Indonesia dengan internasional.\nKebangkitan kuliner tradisional di era digital.`,
      dishes: ['Fusion Rendang', 'Modern Gudeg', 'Artisan Tempe'],
      techniques: ['Sous Vide', 'Molecular', 'AI Cooking'],
      icon: 'Smartphone'
    }
  ];

  return (
    <div className="w-full">
      {/* Timeline Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Perjalanan Kuliner Indonesia
        </h3>
        <p className="text-muted-foreground">
          Dari masa ke masa, cita rasa yang tak terlupakan
        </p>
      </div>
      {/* Timeline Navigation */}
      <div className="flex overflow-x-auto pb-4 mb-8 space-x-2">
        {timelineData?.map((era, index) => (
          <button
            key={era?.id}
            onClick={() => setSelectedEra(era?.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedEra === era?.id
                ? 'bg-primary text-primary-foreground shadow-cultural'
                : 'bg-muted text-muted-foreground hover:bg-primary/10'
            }`}
          >
            {era?.period}
          </button>
        ))}
      </div>
      {/* Timeline Visualization */}
      <div className="relative mb-8">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-turmeric to-accent"></div>
        
        {timelineData?.map((era, index) => (
          <div
            key={era?.id}
            className={`relative flex items-center mb-8 transition-all duration-500 ${
              index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            }`}
          >
            {/* Timeline Node */}
            <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
              <div
                className={`w-12 h-12 rounded-full border-4 border-white shadow-cultural-lg flex items-center justify-center transition-all duration-300 ${
                  selectedEra === era?.id
                    ? 'bg-accent scale-110' :'bg-primary hover:scale-105'
                }`}
              >
                <Icon 
                  name={era?.icon} 
                  size={20} 
                  className="text-white" 
                />
              </div>
            </div>

            {/* Content Card */}
            <div
              className={`w-5/12 ${
                selectedEra === era?.id ? 'opacity-100' : 'opacity-70'
              } transition-all duration-300`}
            >
              <div
                className={`cultural-card p-6 cursor-pointer transition-all duration-300 ${
                  selectedEra === era?.id
                    ? 'shadow-cultural-lg border-2 border-primary/20'
                    : 'hover:shadow-cultural'
                }`}
                onClick={() => setSelectedEra(era?.id)}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {era?.year}
                  </span>
                </div>
                
                <h4 className="text-lg font-bold text-foreground mb-2">
                  {era?.title}
                </h4>
                
                <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
                  {era?.description}
                </p>

                {/* Signature Dishes */}
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                    <Icon name="ChefHat" size={14} className="mr-1" />
                    Hidangan Khas
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {era?.dishes?.map((dish, dishIndex) => (
                      <span
                        key={dishIndex}
                        className="text-xs bg-turmeric/10 text-turmeric px-2 py-1 rounded-full"
                      >
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cooking Techniques */}
                <div>
                  <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                    <Icon name="Utensils" size={14} className="mr-1" />
                    Teknik Memasak
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {era?.techniques?.map((technique, techIndex) => (
                      <span
                        key={techIndex}
                        className="text-xs bg-pandan/10 text-pandan px-2 py-1 rounded-full"
                      >
                        {technique}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Selected Era Details */}
      {selectedEra && (
        <div className="bg-gradient-to-r from-primary/5 to-turmeric/5 rounded-xl p-6 border border-primary/10">
          <div className="text-center">
            <h4 className="text-xl font-bold text-foreground mb-2">
              {timelineData?.find(era => era?.id === selectedEra)?.title}
            </h4>
            <p className="text-muted-foreground mb-4">
              Pelajari lebih dalam tentang era kuliner ini
            </p>
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 flex items-center space-x-2 mx-auto">
              <Icon name="BookOpen" size={16} />
              <span>Jelajahi Resep Era Ini</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturalTimeline;