import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const RegionalMap = ({ onRegionSelect, selectedRegion }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const regions = [
    {
      id: 'sumatra',
      name: 'Sumatera',
      position: { top: '20%', left: '15%' },
      specialties: ['Rendang', 'Gulai', 'Sate Padang'],
      description: 'Kaya akan rempah-rempah dan santan'
    },
    {
      id: 'java',
      name: 'Jawa',
      position: { top: '45%', left: '35%' },
      specialties: ['Gudeg', 'Rawon', 'Gado-gado'],
      description: 'Pusat kuliner tradisional Indonesia'
    },
    {
      id: 'kalimantan',
      name: 'Kalimantan',
      position: { top: '30%', left: '50%' },
      specialties: ['Soto Banjar', 'Ayam Cincane', 'Ketupat Kandangan'],
      description: 'Perpaduan rasa manis dan gurih'
    },
    {
      id: 'sulawesi',
      name: 'Sulawesi',
      position: { top: '35%', left: '65%' },
      specialties: ['Coto Makassar', 'Pallubasa', 'Konro'],
      description: 'Cita rasa pedas dan khas'
    },
    {
      id: 'bali-nusa',
      name: 'Bali & Nusa Tenggara',
      position: { top: '55%', left: '45%' },
      specialties: ['Ayam Betutu', 'Plecing Kangkung', 'Sate Lilit'],
      description: 'Bumbu khas dan tradisi unik'
    },
    {
      id: 'papua',
      name: 'Papua',
      position: { top: '40%', left: '80%' },
      specialties: ['Papeda', 'Ikan Bakar Manokwari', 'Sagu Lempeng'],
      description: 'Kuliner tradisional asli Indonesia'
    }
  ];

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-primary/5 to-turmeric/5 rounded-xl overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pandan/10 to-primary/10 opacity-50"></div>
      {/* Indonesia Outline SVG */}
      <svg
        viewBox="0 0 400 200"
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(45, 90, 39, 0.1))' }}
      >
        <path
          d="M50 80 Q80 70 120 75 Q160 80 200 85 Q240 90 280 85 Q320 80 350 85 L350 120 Q320 125 280 120 Q240 115 200 120 Q160 125 120 120 Q80 115 50 120 Z"
          fill="var(--color-primary)"
          opacity="0.2"
          className="batik-reveal"
        />
        <path
          d="M60 100 Q90 95 130 100 Q170 105 210 100 Q250 95 290 100 Q330 105 360 100"
          stroke="var(--color-primary)"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
          className="batik-reveal"
        />
      </svg>
      {/* Regional Markers */}
      {regions?.map((region) => (
        <div
          key={region?.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={region?.position}
          onMouseEnter={() => setHoveredRegion(region?.id)}
          onMouseLeave={() => setHoveredRegion(null)}
          onClick={() => onRegionSelect(region)}
        >
          {/* Marker Pin */}
          <div
            className={`w-6 h-6 rounded-full border-2 border-white shadow-cultural transition-all duration-300 ${
              selectedRegion?.id === region?.id
                ? 'bg-accent scale-125'
                : hoveredRegion === region?.id
                ? 'bg-turmeric scale-110' :'bg-primary'
            }`}
          >
            <div className="absolute inset-0 rounded-full animate-ping bg-current opacity-20"></div>
          </div>

          {/* Region Label */}
          <div
            className={`absolute top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-2 shadow-cultural-lg border border-border transition-all duration-300 ${
              hoveredRegion === region?.id || selectedRegion?.id === region?.id
                ? 'opacity-100 visible scale-100' :'opacity-0 invisible scale-95'
            }`}
          >
            <div className="text-sm font-semibold text-foreground mb-1">
              {region?.name}
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {region?.description}
            </div>
            <div className="flex flex-wrap gap-1">
              {region?.specialties?.slice(0, 2)?.map((specialty, index) => (
                <span
                  key={index}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
            
            {/* Arrow pointer */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
          </div>
        </div>
      ))}
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-cultural">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
          <Icon name="Map" size={16} />
          <span>Peta Kuliner Indonesia</span>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Daerah</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span>Terpilih</span>
          </div>
        </div>
      </div>
      {/* Explore Button */}
      <div className="absolute bottom-4 right-4">
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow-cultural hover:bg-primary/90 transition-colors duration-200 flex items-center space-x-2">
          <Icon name="Compass" size={16} />
          <span>Jelajahi Semua</span>
        </button>
      </div>
    </div>
  );
};

export default RegionalMap;