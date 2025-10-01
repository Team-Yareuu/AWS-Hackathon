import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const calculateDistance = (from, to) => {
  if (!from || !to) return null;

  const { lat: lat1, lng: lng1 } = from;
  const { lat: lat2, lng: lng2 } = to;

  if (
    typeof lat1 !== 'number' ||
    typeof lng1 !== 'number' ||
    typeof lat2 !== 'number' ||
    typeof lng2 !== 'number'
  ) {
    return null;
  }

  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const BudgetBreakdown = ({ budgetData, onShopNow }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const totalBudget =
    typeof budgetData?.total === 'number' ? budgetData.total : null;

  const formatCurrency = (amount) => {
    const numericAmount =
      typeof amount === 'number' ? amount : Number(amount);

    if (!Number.isFinite(numericAmount)) {
      return '-';
    }

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
      ?.format(numericAmount)
      ?.replace('IDR', 'Rp');
  };

  const getMarketplaceIcon = (marketplace) => {
    const icons = {
      shopee: 'ShoppingCart'
    };
    return icons?.[marketplace] || 'ShoppingBag';
  };

  const getBudgetColor = (percentage) => {
    if (percentage <= 50) return 'text-success bg-success/10';
    if (percentage <= 75) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  const shopeeMarketplace = useMemo(
    () =>
      budgetData?.marketplaces?.find(
        (marketplace) => marketplace?.name?.toLowerCase() === 'shopee'
      ) ?? null,
    [budgetData]
  );

  const offlineStores = useMemo(() => {
    const stores = budgetData?.offlineStores ?? [];
    return stores
      ?.map((store) => {
        const hasCoordinates =
          typeof store?.location?.lat === 'number' &&
          typeof store?.location?.lng === 'number';

        const computedDistance =
          userLocation && hasCoordinates
            ? calculateDistance(userLocation, store?.location)
            : null;

        const estimatedDistance =
          typeof store?.estimatedDistance === 'number'
            ? store?.estimatedDistance
            : null;

        const distanceToShow = computedDistance ?? estimatedDistance;

        return {
          ...store,
          distanceToShow,
          distanceLabel:
            distanceToShow != null
              ? `${distanceToShow.toFixed(1)} km`
              : 'Jarak belum tersedia',
          distanceSource:
            computedDistance != null ? 'Berdasarkan lokasi Anda' : 'Perkiraan jarak'
        };
      })
      ?.sort((a, b) => {
        const distA =
          typeof a?.distanceToShow === 'number'
            ? a?.distanceToShow
            : Number.POSITIVE_INFINITY;
        const distB =
          typeof b?.distanceToShow === 'number'
            ? b?.distanceToShow
            : Number.POSITIVE_INFINITY;

        return distA - distB;
      });
  }, [budgetData, userLocation]);

  const handleUseLocation = () => {
    if (typeof window === 'undefined' || !navigator?.geolocation) {
      setLocationError('Perangkat Anda tidak mendukung GPS.');
      return;
    }

    setIsLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position?.coords?.latitude,
          lng: position?.coords?.longitude
        });
        setIsLocating(false);
      },
      (error) => {
        if (error?.code === 1) {
          setLocationError('Izin lokasi ditolak. Aktifkan GPS pada browser Anda.');
        } else {
          setLocationError('Tidak dapat mengambil lokasi. Coba lagi beberapa saat lagi.');
        }
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
    );
  };

  const buildMapsLink = (store) => {
    const hasCoordinates =
      typeof store?.location?.lat === 'number' &&
      typeof store?.location?.lng === 'number';

    if (hasCoordinates && userLocation) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${store.location.lat},${store.location.lng}&travelmode=driving`;
    }

    if (hasCoordinates) {
      return `https://www.google.com/maps/search/?api=1&query=${store.location.lat},${store.location.lng}`;
    }

    const query = encodeURIComponent(`${store?.name || ''} ${store?.address || ''}`.trim());
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const locationButtonLabel = userLocation ? 'Perbarui Lokasi' : 'Aktifkan GPS';
  const locationButtonVariant = userLocation ? 'success' : 'outline';
  const locationButtonIcon = userLocation ? 'RefreshCw' : 'MapPin';

  const shopeeMarketplaceName = shopeeMarketplace?.name ?? 'shopee';
  const shopeeLabel =
    shopeeMarketplaceName.charAt(0).toUpperCase() + shopeeMarketplaceName.slice(1);

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-bold text-foreground flex items-center">
          <Icon name="Calculator" size={24} className="text-success mr-3" />
          Rincian Biaya
        </h3>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Total:</span>
          <span className="text-xl font-bold text-success">
            {typeof budgetData?.total === 'number' ? formatCurrency(budgetData.total) : '-'}
          </span>
        </div>
      </div>
      {/* Budget Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-success/5 rounded-lg p-4 text-center">
          <Icon name="TrendingDown" size={20} className="text-success mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Hemat</p>
          <p className="font-semibold text-success">
            {typeof budgetData?.savings === 'number' ? formatCurrency(budgetData.savings) : '-'}
          </p>
        </div>
        
        <div className="bg-primary/5 rounded-lg p-4 text-center">
          <Icon name="Users" size={20} className="text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Per Porsi</p>
          <p className="font-semibold text-primary">
            {typeof budgetData?.perServing === 'number' ? formatCurrency(budgetData.perServing) : '-'}
          </p>
        </div>
        
        <div className="bg-accent/5 rounded-lg p-4 text-center">
          <Icon name="Percent" size={20} className="text-accent mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">vs Restoran</p>
          <p className="font-semibold text-accent">
            {typeof budgetData?.restaurantSavings === 'number'
              ? `-${budgetData.restaurantSavings}%`
              : '-'}
          </p>
        </div>
      </div>
      {/* Marketplace Selector */}
      <div className="mb-6">
        <h4 className="font-semibold text-foreground mb-3">Pilih Marketplace</h4>
        {shopeeMarketplace ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 rounded-lg border border-primary bg-primary/10 text-primary">
                <Icon
                  name={getMarketplaceIcon(shopeeMarketplace?.name)}
                  size={20}
                  className="mx-auto mb-1"
                />
                <p className="text-xs font-medium capitalize text-center">{shopeeLabel}</p>
                <p className="text-xs text-center text-foreground">
                  {typeof shopeeMarketplace?.total === 'number'
                    ? formatCurrency(shopeeMarketplace.total)
                    : '-'}
                </p>
              </div>
            </div>
            {onShopNow && (
              <Button
                variant="default"
                fullWidth
                iconName="ShoppingCart"
                iconPosition="left"
                onClick={() => onShopNow(shopeeMarketplaceName)}
              >
                Belanja Sekarang di {shopeeLabel}
              </Button>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Data marketplace {shopeeLabel} belum tersedia untuk resep ini.
          </p>
        )}
      </div>
      {/* Ingredient Breakdown */}
      <div className="space-y-4 mb-6">
        <div>
          <h4 className="font-semibold text-foreground">Rincian Bahan</h4>
          <div className="space-y-3 mt-3">
            {budgetData?.ingredients?.length ? (
              budgetData.ingredients.map((ingredient, index) => {
                const marketplacePrice =
                  shopeeMarketplace?.ingredients?.[index]?.price;
                const fallbackPrice =
                  typeof ingredient?.price === 'number' ? ingredient.price : 0;
                const priceValue =
                  typeof marketplacePrice === 'number' ? marketplacePrice : fallbackPrice;
                const budgetPercentage =
                  totalBudget && totalBudget > 0 ? (priceValue / totalBudget) * 100 : 0;
                const percentageLabel = Number.isFinite(budgetPercentage)
                  ? `${Math.round(budgetPercentage)}%`
                  : '0%';

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon name="Package" size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{ingredient?.name}</p>
                          <p className="text-xs text-muted-foreground">{ingredient?.quantity}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {formatCurrency(priceValue)}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getBudgetColor(budgetPercentage)}`}
                      >
                        {percentageLabel}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                Belum ada data rincian bahan untuk resep ini.
              </p>
            )}
          </div>
        </div>
        {/* Offline Stores Integrated */}
        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground">Toko/Pasar Offline Terdekat</h4>
              <p className="text-xs text-muted-foreground">
                Aktifkan GPS untuk rekomendasi lebih akurat
              </p>
            </div>
            <Button
              variant={locationButtonVariant}
              size="sm"
              iconName={locationButtonIcon}
              onClick={handleUseLocation}
              loading={isLocating}
            >
              {locationButtonLabel}
            </Button>
          </div>
          {locationError && (
            <div className="text-xs text-error bg-error/10 border border-error/20 rounded-md p-2">
              {locationError}
            </div>
          )}
          <div className="space-y-3">
            {offlineStores?.length ? (
              offlineStores.map((store, index) => (
                <div
                  key={`${store?.name}-${index}`}
                  className="p-3 bg-muted/30 rounded-lg border border-border/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground text-sm">{store?.name}</p>
                      <p className="text-xs text-muted-foreground">{store?.address}</p>
                      {store?.openingHours && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Jam buka: {store?.openingHours}
                        </p>
                      )}
                      {store?.recommendedItems?.length ? (
                        <p className="text-xs text-muted-foreground mt-2">
                          Bahan unggulan: {store?.recommendedItems?.join(', ')}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                        {store?.distanceLabel}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {store?.distanceSource}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Icon name="Navigation" size={14} className="mr-2 text-primary" />
                      <span>Buka rute di Google Maps</span>
                    </div>
                    <Button
                      asChild
                      size="xs"
                      variant="outline"
                      iconName="ExternalLink"
                      iconSize={12}
                    >
                      <a
                        href={buildMapsLink(store)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Buka Maps
                      </a>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Belum ada data toko offline untuk resep ini.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetBreakdown;












