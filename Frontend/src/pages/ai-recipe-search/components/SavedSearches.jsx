import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SavedSearches = ({ onSearchSelect }) => {
  const [savedSearches, setSavedSearches] = useState([
    {
      id: 1,
      query: "Rendang daging sapi tradisional",
      filters: { budget: ["50000-100000"], cuisine: ["sumatran"], difficulty: ["medium"] },
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      resultCount: 23
    },
    {
      id: 2,
      query: "Masakan vegetarian sehat",
      filters: { dietary: ["vegetarian"], cookingTime: ["15-30"], difficulty: ["easy"] },
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      resultCount: 45
    },
    {
      id: 3,
      query: "Resep cepat untuk sarapan",
      filters: { cookingTime: ["0-15"], difficulty: ["very-easy"] },
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      resultCount: 18
    },
    {
      id: 4,
      query: "Makanan penutup khas Jawa",
      filters: { cuisine: ["javanese"], budget: ["25000-50000"] },
      timestamp: new Date(Date.now() - 432000000), // 5 days ago
      resultCount: 12
    },
    {
      id: 5,
      query: "Sup ayam untuk orang sakit",
      filters: { dietary: ["healthy"], difficulty: ["easy"], cookingTime: ["30-60"] },
      timestamp: new Date(Date.now() - 604800000), // 1 week ago
      resultCount: 8
    }
  ]);

  const handleDeleteSearch = (searchId) => {
    setSavedSearches(prev => prev?.filter(search => search?.id !== searchId));
  };

  const handleSearchClick = (search) => {
    onSearchSelect(search?.query, search?.filters);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hari ini';
    if (days === 1) return 'Kemarin';
    if (days < 7) return `${days} hari lalu`;
    if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
    return `${Math.floor(days / 30)} bulan lalu`;
  };

  const getFilterSummary = (filters) => {
    const summary = [];
    
    if (filters?.budget?.length) {
      summary?.push(`Budget: ${filters?.budget?.[0]}`);
    }
    if (filters?.cookingTime?.length) {
      summary?.push(`Waktu: ${filters?.cookingTime?.[0]} menit`);
    }
    if (filters?.difficulty?.length) {
      const difficultyLabels = {
        'very-easy': 'Sangat Mudah',
        'easy': 'Mudah',
        'medium': 'Sedang',
        'hard': 'Sulit',
        'very-hard': 'Sangat Sulit'
      };
      summary?.push(`Kesulitan: ${difficultyLabels?.[filters?.difficulty?.[0]]}`);
    }
    if (filters?.cuisine?.length) {
      const cuisineLabels = {
        'javanese': 'Jawa',
        'sumatran': 'Sumatera',
        'balinese': 'Bali',
        'sundanese': 'Sunda'
      };
      summary?.push(`Masakan: ${cuisineLabels?.[filters?.cuisine?.[0]]}`);
    }
    if (filters?.dietary?.length) {
      summary?.push(`Diet: ${filters?.dietary?.[0]}`);
    }
    
    return summary?.slice(0, 2)?.join(' • ');
  };

  if (savedSearches?.length === 0) {
    return (
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="text-center py-8">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Pencarian Tersimpan</h3>
          <p className="text-muted-foreground">
            Pencarian Anda akan tersimpan otomatis untuk akses cepat di masa mendatang.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Pencarian Tersimpan</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="History"
          className="text-muted-foreground"
        >
          Lihat Semua
        </Button>
      </div>
      <div className="space-y-3">
        {savedSearches?.map((search) => (
          <div
            key={search?.id}
            className="group flex items-center justify-between p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors duration-200 cursor-pointer"
            onClick={() => handleSearchClick(search)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Search" size={14} className="text-muted-foreground" />
                <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200">
                  {search?.query}
                </h4>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{formatTimestamp(search?.timestamp)}</span>
                <span>•</span>
                <span>{search?.resultCount} resep</span>
                {getFilterSummary(search?.filters) && (
                  <>
                    <span>•</span>
                    <span>{getFilterSummary(search?.filters)}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                iconName="RotateCcw"
                onClick={(e) => {
                  e?.stopPropagation();
                  handleSearchClick(search);
                }}
                className="text-muted-foreground hover:text-primary"
                title="Ulangi pencarian"
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="Trash2"
                onClick={(e) => {
                  e?.stopPropagation();
                  handleDeleteSearch(search?.id);
                }}
                className="text-muted-foreground hover:text-error"
                title="Hapus pencarian"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {savedSearches?.length} pencarian tersimpan
          </span>
          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            onClick={() => setSavedSearches([])}
            className="text-muted-foreground hover:text-error"
          >
            Hapus Semua
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SavedSearches;