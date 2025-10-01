import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MarketplaceComparison = ({ ingredients, onSelectStore }) => {
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const marketplaces = [
    {
      id: 'tokopedia',
      name: 'Tokopedia',
      logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop',
      deliveryFee: 15000,
      minOrder: 50000,
      estimatedDelivery: '2-4 jam',
      rating: 4.8,
      color: 'bg-green-500'
    },
    {
      id: 'shopee',
      name: 'Shopee',
      logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop',
      deliveryFee: 12000,
      minOrder: 40000,
      estimatedDelivery: '1-3 jam',
      rating: 4.7,
      color: 'bg-orange-500'
    },
    {
      id: 'blibli',
      name: 'Blibli',
      logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop',
      deliveryFee: 18000,
      minOrder: 75000,
      estimatedDelivery: '3-6 jam',
      rating: 4.6,
      color: 'bg-blue-500'
    },
    {
      id: 'gojek',
      name: 'GoMart',
      logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop',
      deliveryFee: 8000,
      minOrder: 25000,
      estimatedDelivery: '30-60 menit',
      rating: 4.5,
      color: 'bg-green-600'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const calculateTotal = (marketplace) => {
    const subtotal = ingredients?.reduce((sum, ingredient) => {
      const price = ingredient?.prices?.[marketplace?.id] || ingredient?.basePrice;
      return sum + price;
    }, 0);
    
    const deliveryFee = subtotal >= marketplace?.minOrder ? 0 : marketplace?.deliveryFee;
    return subtotal + deliveryFee;
  };

  const getBestPrice = (ingredient) => {
    const prices = Object.values(ingredient?.prices);
    return Math.min(...prices, ingredient?.basePrice);
  };

  const sortedMarketplaces = marketplaces?.sort((a, b) => calculateTotal(a) - calculateTotal(b));

  return (
    <div className="bg-card rounded-lg p-6 shadow-cultural">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="ShoppingBag" size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-lg text-foreground">Perbandingan Marketplace</h3>
          <p className="text-sm text-muted-foreground">Bandingkan harga dari berbagai platform</p>
        </div>
      </div>
      {/* Ingredient Selection */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-3">Pilih Bahan untuk Detail Harga</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {ingredients?.map((ingredient) => (
            <button
              key={ingredient?.id}
              onClick={() => setSelectedIngredient(selectedIngredient?.id === ingredient?.id ? null : ingredient)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedIngredient?.id === ingredient?.id
                  ? 'bg-primary text-primary-foreground shadow-cultural'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10'
              }`}
            >
              {ingredient?.name}
            </button>
          ))}
        </div>
      </div>
      {/* Marketplace Comparison */}
      <div className="space-y-4">
        {sortedMarketplaces?.map((marketplace, index) => {
          const total = calculateTotal(marketplace);
          const subtotal = total - (total >= marketplace?.minOrder ? 0 : marketplace?.deliveryFee);
          const isDeliveryFree = subtotal >= marketplace?.minOrder;
          
          return (
            <div
              key={marketplace?.id}
              className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-cultural ${
                index === 0 ? 'border-success bg-success/5' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${marketplace?.color} rounded-lg flex items-center justify-center`}>
                    <Image
                      src={marketplace?.logo}
                      alt={marketplace?.name}
                      className="w-6 h-6 rounded"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{marketplace?.name}</h4>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Icon name="Star" size={12} className="text-warning fill-current" />
                      <span>{marketplace?.rating}</span>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                      <Icon name="Clock" size={12} />
                      <span>{marketplace?.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>
                
                {index === 0 && (
                  <div className="bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-medium">
                    Termurah
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-xs text-muted-foreground">Subtotal Bahan</span>
                  <p className="font-medium text-foreground">{formatCurrency(subtotal)}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Ongkos Kirim</span>
                  <p className={`font-medium ${isDeliveryFree ? 'text-success' : 'text-foreground'}`}>
                    {isDeliveryFree ? 'GRATIS' : formatCurrency(marketplace?.deliveryFee)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Total</span>
                  <p className="font-semibold text-lg text-foreground">{formatCurrency(total)}</p>
                </div>
              </div>
              {selectedIngredient && (
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <h5 className="font-medium text-foreground mb-2">Harga {selectedIngredient?.name}</h5>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {selectedIngredient?.quantity} {selectedIngredient?.unit}
                    </span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(selectedIngredient?.prices?.[marketplace?.id] || selectedIngredient?.basePrice)}
                    </span>
                  </div>
                  {selectedIngredient?.prices?.[marketplace?.id] === getBestPrice(selectedIngredient) && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Icon name="TrendingDown" size={12} className="text-success" />
                      <span className="text-xs text-success">Harga terbaik</span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Min. pembelian {formatCurrency(marketplace?.minOrder)}
                </div>
                <Button
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                  iconName="ExternalLink"
                  iconPosition="right"
                  onClick={() => onSelectStore(marketplace, ingredients)}
                >
                  Pilih & Beli
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Tips Berbelanja Hemat:</p>
            <ul className="space-y-1 text-xs">
              <li>• Gabungkan pesanan untuk mencapai minimum gratis ongkir</li>
              <li>• Cek promo dan voucher yang tersedia</li>
              <li>• Bandingkan harga per unit untuk kemasan berbeda</li>
              <li>• Pertimbangkan waktu pengiriman sesuai kebutuhan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceComparison;