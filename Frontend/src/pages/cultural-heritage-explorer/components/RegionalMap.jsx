import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import indonesiaMap from '@svg-maps/indonesia';

const regions = [
  {
    id: 'sumatra',
    name: 'Sumatera',
    position: { top: '52%', left: '23%' },
    specialties: ['Rendang', 'Gulai', 'Sate Padang'],
    description: 'Kaya akan rempah-rempah dan santan',
    provinceIds: ['id-ac', 'id-su', 'id-sb', 'id-ri', 'id-kr', 'id-ja', 'id-bb', 'id-be', 'id-ss', 'id-la']
  },
  {
    id: 'java',
    name: 'Jawa',
    position: { top: '75%', left: '44%' },
    specialties: ['Gudeg', 'Rawon', 'Gado-gado'],
    description: 'Pusat kuliner tradisional Indonesia',
    provinceIds: ['id-bt', 'id-jk', 'id-jb', 'id-jt', 'id-yo', 'id-ji']
  },
  {
    id: 'kalimantan',
    name: 'Kalimantan',
    position: { top: '48%', left: '51%' },
    specialties: ['Soto Banjar', 'Ayam Cincane', 'Ketupat Kandangan'],
    description: 'Perpaduan rasa manis dan gurih',
    provinceIds: ['id-kb', 'id-kt', 'id-ks', 'id-ki', 'id-ku']
  },
  {
    id: 'sulawesi',
    name: 'Sulawesi',
    position: { top: '50%', left: '68%' },
    specialties: ['Coto Makassar', 'Pallubasa', 'Konro'],
    description: 'Cita rasa pedas dan khas',
    provinceIds: ['id-sa', 'id-st', 'id-sn', 'id-sg', 'id-sr', 'id-go']
  },
  {
    id: 'bali-nusa',
    name: 'Bali & Nusa Tenggara',
    position: { top: '78%', left: '58%' },
    specialties: ['Ayam Betutu', 'Plecing Kangkung', 'Sate Lilit'],
    description: 'Bumbu khas dan tradisi unik',
    provinceIds: ['id-ba', 'id-nb', 'id-nt']
  },
  {
    id: 'maluku',
    name: 'Maluku',
    position: { top: '60%', left: '74%' },
    specialties: ['Ikan Asar', 'Papeda Maluku', 'Kohu-kohu'],
    description: 'Rempah laut dan tradisi bahari',
    provinceIds: ['id-ma', 'id-mu']
  },
  {
    id: 'papua',
    name: 'Papua',
    position: { top: '56%', left: '88%' },
    specialties: ['Papeda', 'Ikan Bakar Manokwari', 'Sagu Lempeng'],
    description: 'Kuliner tradisional asli Indonesia',
    provinceIds: ['id-pa', 'id-pb']
  }
];

const mapDefinition = indonesiaMap?.locations ? indonesiaMap : indonesiaMap?.default;
const mapViewBox = mapDefinition?.viewBox || '0 0 800 400';
const mapLocations = mapDefinition?.locations || [];

const RegionalMap = ({ onRegionSelect, selectedRegion }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const provinceRegionMap = useMemo(() => {
    const lookup = {};
    regions.forEach((region) => {
      region.provinceIds.forEach((provinceId) => {
        lookup[provinceId] = region.id;
      });
    });
    return lookup;
  }, []);

  const regionLookup = useMemo(() => {
    return regions.reduce((acc, region) => {
      acc[region.id] = region;
      return acc;
    }, {});
  }, []);

  const handleRegionEnter = (regionId) => setHoveredRegion(regionId);
  const handleRegionLeave = () => setHoveredRegion(null);
  const handleRegionClick = (regionId) => {
    const region = regionLookup[regionId];
    if (region && onRegionSelect) {
      onRegionSelect(region);
    }
  };

  const isRegionActive = (regionId) => selectedRegion?.id === regionId;
  const isRegionHovered = (regionId) => hoveredRegion === regionId;

  const getProvinceFill = (provinceId) => {
    const regionId = provinceRegionMap[provinceId];
    if (!regionId) {
      return 'rgba(45, 90, 39, 0.18)';
    }

    if (isRegionActive(regionId)) {
      return 'var(--color-accent)';
    }

    if (isRegionHovered(regionId)) {
      return 'rgba(233, 173, 56, 0.75)';
    }

    return 'rgba(45, 90, 39, 0.32)';
  };

  const getProvinceStroke = (provinceId) => {
    const regionId = provinceRegionMap[provinceId];
    if (isRegionActive(regionId)) {
      return 'rgba(33, 64, 39, 0.9)';
    }
    if (isRegionHovered(regionId)) {
      return 'rgba(45, 90, 39, 0.7)';
    }
    return 'rgba(45, 90, 39, 0.45)';
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-primary/5 to-turmeric/5 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pandan/10 to-primary/10 opacity-50" />

      <svg
        viewBox={mapViewBox}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="mapOcean" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(45, 90, 39, 0.08)" />
            <stop offset="100%" stopColor="rgba(233, 173, 56, 0.12)" />
          </linearGradient>
          <linearGradient id="mapShine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
          <filter id="provinceGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(45, 90, 39, 0.25)" />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#mapOcean)" />
        <rect width="100%" height="100%" fill="url(#mapShine)" opacity="0.25" />

        <g filter="url(#provinceGlow)">
          {mapLocations.map((province) => {
            const regionId = provinceRegionMap[province.id];
            const isInteractive = Boolean(regionId);
            const isActive = isRegionActive(regionId);
            const isHovered = isRegionHovered(regionId);

            return (
              <path
                key={province.id}
                d={province.path}
                fill={getProvinceFill(province.id)}
                stroke={getProvinceStroke(province.id)}
                strokeWidth={isActive ? 2.2 : 1.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                className={`transition-all duration-300 ease-out ${
                  isInteractive ? 'cursor-pointer' : 'cursor-default'
                }`}
                style={{
                  transform:
                    isActive || isHovered ? 'translateY(-2px)' : 'translateY(0)',
                  filter: isActive
                    ? 'drop-shadow(0 8px 16px rgba(45, 90, 39, 0.35))'
                    : isHovered
                    ? 'drop-shadow(0 5px 12px rgba(45, 90, 39, 0.25))'
                    : 'drop-shadow(0 2px 6px rgba(45, 90, 39, 0.18))'
                }}
                onMouseEnter={() => (isInteractive ? handleRegionEnter(regionId) : null)}
                onMouseLeave={() => (isInteractive ? handleRegionLeave() : null)}
                onClick={() => (isInteractive ? handleRegionClick(regionId) : null)}
              >
                <title>{province.name}</title>
              </path>
            );
          })}
        </g>
      </svg>

      {regions.map((region) => (
        <div
          key={region.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={region.position}
          onMouseEnter={() => handleRegionEnter(region.id)}
          onMouseLeave={handleRegionLeave}
          onClick={() => handleRegionClick(region.id)}
        >
          <div
            className={`relative w-6 h-6 rounded-full border-2 border-white shadow-cultural transition-all duration-300 ${
              selectedRegion?.id === region.id
                ? 'bg-accent scale-125'
                : hoveredRegion === region.id
                ? 'bg-turmeric scale-110'
                : 'bg-primary'
            }`}
          >
            <div className="absolute inset-0 rounded-full animate-ping bg-current opacity-20" />
          </div>
          <div
            className={`absolute top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-2 shadow-cultural-lg border border-border transition-all duration-300 ${
              hoveredRegion === region.id || selectedRegion?.id === region.id
                ? 'opacity-100 visible scale-100'
                : 'opacity-0 invisible scale-95'
            }`}
          >
            <div className="text-sm font-semibold text-foreground mb-1">{region.name}</div>
            <div className="text-xs text-muted-foreground mb-2">{region.description}</div>
            <div className="flex flex-wrap gap-1">
              {region.specialties.slice(0, 2).map((specialty, index) => (
                <span
                  key={index}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white" />
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-cultural">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
          <Icon name="Map" size={16} />
          <span>Peta Kuliner Indonesia</span>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span>Daerah</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-accent rounded-full" />
            <span>Terpilih</span>
          </div>
        </div>
      </div>

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
