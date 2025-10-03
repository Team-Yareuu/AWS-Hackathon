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

const formatIngredientQuantity = (quantity) => {
  if (!quantity) {
    return '';
  }

  if (typeof quantity === 'string') {
    return quantity;
  }

  if (typeof quantity === 'number') {
    return Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(1);
  }

  if (typeof quantity === 'object') {
    const { value, unit } = quantity || {};
    if (value == null) {
      return unit || '';
    }
    const numericValue = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numericValue)) {
      return unit || '';
    }
    const displayValue = Number.isInteger(numericValue)
      ? numericValue
      : parseFloat(numericValue.toFixed(1));
    return `${displayValue}${unit ? ` ${unit}` : ''}`;
  }

  return String(quantity);
};

const normalizeIngredientKey = (name) =>
  typeof name === 'string' ? name.trim().toLowerCase() : null;

const BudgetBreakdown = ({ budgetData, onShopNow }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const totalBudget =
    typeof budgetData?.total === 'number' ? budgetData.total : null;

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

  const ingredientBreakdown = useMemo(() => {
    if (Array.isArray(budgetData?.ingredients) && budgetData.ingredients.length) {
      return budgetData.ingredients;
    }

    const storeWithBreakdown =
      budgetData?.offlineStores?.find(
        (store) => Array.isArray(store?.rincianBahan) && store.rincianBahan.length
      ) ?? null;

    if (!storeWithBreakdown) {
      return [];
    }

    return storeWithBreakdown.rincianBahan.map((item) => ({
      name: item?.name,
      quantity: item?.quantity,
      price: typeof item?.estimatedPrice === 'number' ? item.estimatedPrice : undefined,
      estimatedPrice: item?.estimatedPrice,
      notes: item?.note ?? item?.notes
    }));
  }, [budgetData]);

  const { stores: offlineStores, ingredientStats } = useMemo(() => {
    const stores = budgetData?.offlineStores ?? [];
    const stats = new Map();

    const baseStores = stores.map((store) => {
      const storeDetails = Array.isArray(store?.rincianBahan)
        ? store.rincianBahan.map((item) => {
          const key = normalizeIngredientKey(item?.name);
          const priceValue =
            typeof item?.estimatedPrice === 'number'
              ? item.estimatedPrice
              : null;

          if (key && Number.isFinite(priceValue)) {
            const current = stats.get(key) || { min: Number.POSITIVE_INFINITY, max: 0 };
            current.min = Math.min(current.min, priceValue);
            current.max = Math.max(current.max, priceValue);
            stats.set(key, current);
          }

          return {
            name: item?.name,
            quantity: item?.quantity,
            notes: item?.note ?? item?.notes,
            priceValue,
            key
          };
        })
        : [];

      const hasPricing = storeDetails.some((detail) => Number.isFinite(detail.priceValue));
      const totalPrice = hasPricing
        ? storeDetails.reduce(
          (sum, detail) => sum + (Number.isFinite(detail.priceValue) ? detail.priceValue : 0),
          0
        )
        : null;

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
        details: storeDetails,
        hasPricing,
        totalPrice,
        distanceToShow,
        distanceLabel:
          distanceToShow != null
            ? `${distanceToShow.toFixed(1)} km`
            : 'Jarak belum tersedia',
        distanceSource:
          computedDistance != null ? 'Berdasarkan lokasi Anda' : 'Perkiraan jarak'
      };
    });

    const validTotals = baseStores
      .filter((store) => store.hasPricing && Number.isFinite(store.totalPrice))
      .map((store) => store.totalPrice);
    const minTotalPrice = validTotals.length
      ? Math.min(...validTotals)
      : null;

    const validDistances = baseStores
      .map((store) => store.distanceToShow)
      .filter((distance) => Number.isFinite(distance));
    const minDistance = validDistances.length
      ? Math.min(...validDistances)
      : null;

    const enrichedStores = baseStores
      .map((store) => {
        const cheapestItemCount = store.details.reduce((count, detail) => {
          const stat = detail.key ? stats.get(detail.key) : null;
          if (
            stat &&
            Number.isFinite(detail.priceValue) &&
            Number.isFinite(stat?.min) &&
            detail.priceValue === stat.min
          ) {
            return count + 1;
          }
          return count;
        }, 0);

        const priceDiff =
          minTotalPrice != null && Number.isFinite(store.totalPrice)
            ? store.totalPrice - minTotalPrice
            : null;

        const distanceDiff =
          minDistance != null && Number.isFinite(store.distanceToShow)
            ? store.distanceToShow - minDistance
            : null;

        return {
          ...store,
          cheapestItemCount,
          totalItems: store.details.length,
          isCheapest: store.hasPricing && priceDiff === 0,
          priceDiff: priceDiff && priceDiff > 0 ? priceDiff : 0,
          isNearest: Number.isFinite(store.distanceToShow) && distanceDiff === 0,
          distanceDiff: distanceDiff && distanceDiff > 0 ? distanceDiff : 0
        };
      })
      ?.sort((a, b) => {
        const distA = Number.isFinite(a?.distanceToShow)
          ? a?.distanceToShow
          : Number.POSITIVE_INFINITY;
        const distB = Number.isFinite(b?.distanceToShow)
          ? b?.distanceToShow
          : Number.POSITIVE_INFINITY;

        return distA - distB;
      });

    return { stores: enrichedStores, ingredientStats: stats };
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

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="space-y-4 mb-6">
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
                  className={`p-4 rounded-lg border transition-colors ${store.isCheapest
                      ? 'border-success/60 bg-success/5'
                      : store.isNearest
                        ? 'border-primary/40 bg-primary/5'
                        : 'bg-muted/30 border-border/60'
                    }`}
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
                    <div className="text-right space-y-1">
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                        {store?.distanceLabel}
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        {store?.distanceSource}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {store.isCheapest && (
                      <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium">
                        Termurah
                      </span>
                    )}
                    {store.priceDiff > 0 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        +{formatCurrency(store.priceDiff)} vs termurah
                      </span>
                    )}
                    {store.isNearest && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        Terdekat
                      </span>
                    )}
                    {store.distanceDiff > 0 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        +{store.distanceDiff.toFixed(1)} km
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Perkiraan total belanja</span>
                    <span className="font-semibold text-foreground">
                      {store.hasPricing ? formatCurrency(store.totalPrice) : 'Data belum tersedia'}
                    </span>
                  </div>
                  {store.hasPricing && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {store.isCheapest
                        ? 'Sebagian besar harga bahan paling murah ada di toko ini.'
                        : `${store.cheapestItemCount}/${store.totalItems} bahan dengan harga termurah`}
                    </p>
                  )}

                  <div className="mt-4 space-y-2 bg-background/60 rounded-lg border border-border/60 p-3">
                    {store.details.length ? (
                      store.details.map((detail, detailIndex) => {
                        const stat = detail.key ? ingredientStats.get(detail.key) : null;
                        const isCheapest =
                          stat &&
                          Number.isFinite(detail.priceValue) &&
                          Number.isFinite(stat?.min) &&
                          detail.priceValue === stat.min;
                        const moreExpensiveBy =
                          stat &&
                            Number.isFinite(detail.priceValue) &&
                            Number.isFinite(stat?.min) &&
                            detail.priceValue !== stat.min
                            ? detail.priceValue - stat.min
                            : null;

                        return (
                          <div
                            key={`${detail?.name ?? 'detail'}-${detailIndex}`}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">{detail?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatIngredientQuantity(detail?.quantity)}
                              </p>
                              {detail?.notes && (
                                <p className="text-xs text-muted-foreground">{detail.notes}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-foreground">
                                {Number.isFinite(detail.priceValue)
                                  ? formatCurrency(detail.priceValue)
                                  : '-'}
                              </p>
                              <span
                                className={`inline-flex items-center px-2 py-1 text-[11px] rounded-full ${isCheapest
                                    ? 'bg-success/10 text-success'
                                    : 'bg-muted text-muted-foreground'
                                  }`}
                              >
                                {isCheapest
                                  ? 'Termurah'
                                  : moreExpensiveBy != null
                                    ? `+${formatCurrency(moreExpensiveBy)}`
                                    : 'Harga belum pasti'}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Belum ada rincian harga bahan untuk toko ini.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
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
