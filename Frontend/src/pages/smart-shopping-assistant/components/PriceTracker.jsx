import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const DATA_ENDPOINT = 'https://data.jabarprov.go.id/api-dashboard-jabar/public/pangan/list-komoditas?search=&page=1&limit=9&order=asc&order_by=name';

const formatHistoryLabel = (isoDate) => {
  if (!isoDate) {
    return '';
  }

  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short'
  }).format(parsed);
};

const formatFullDate = (isoDate) => {
  if (!isoDate) {
    return '-';
  }

  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(parsed);
};

const mapPriceTrendLabel = (trend) => {
  switch (trend) {
    case 'naik':
      return 'Harga Naik';
    case 'turun':
      return 'Harga Turun';
    case 'stabil':
    case 'tetap':
      return 'Harga Stabil';
    default:
      return 'Pergerakan Harga';
  }
};

const normalizeCommodity = (item) => {
  if (!item) {
    return null;
  }

  const histories = Array.isArray(item?.histories) ? item.histories : [];
  const normalizedHistories = histories.map((entry, index) => {
    const currentPrice = Number(entry?.price) || 0;
    const previousPrice = index > 0 ? Number(histories[index - 1]?.price) || 0 : currentPrice;
    const delta = currentPrice - previousPrice;

    return {
      date: formatHistoryLabel(entry?.date),
      rawDate: entry?.date,
      price: currentPrice,
      delta,
      deltaAbs: Math.abs(delta)
    };
  });

  const priceTrend = String(item?.kondisi_harga || '')?.toLowerCase() || 'stabil';
  const unitLabel = item?.unit ? `per ${item.unit}` : 'per unit';

  return {
    id: String(item?.commodity_id ?? item?.name ?? Math.random().toString(36).slice(2)),
    name: item?.name || 'Komoditas',
    unitLabel,
    currentPrice: Number(item?.price) || 0,
    lastPrice: Number(item?.last_price) || 0,
    changePercent: Number(item?.diff_percent) || 0,
    changeValue: Number(item?.diff) || 0,
    category: item?.categories || '-',
    priceTrend,
    priceTrendLabel: mapPriceTrendLabel(priceTrend),
    sourceName: item?.source_name || 'Provinsi Jawa Barat',
    lastUpdate: item?.date || '',
    previousUpdate: item?.last_date || '',
    imageUrl: item?.url,
    histories: normalizedHistories
  };
};

const formatPercent = (value) => {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return Math.abs(value).toFixed(2).replace(/\.00$/, '');
};

const PriceTracker = ({ onSetAlert }) => {
  const [commodities, setCommodities] = useState([]);
  const [selectedCommodityId, setSelectedCommodityId] = useState(null);
  const [alertPrice, setAlertPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCommodities = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(DATA_ENDPOINT);

      if (!response?.ok) {
        throw new Error(`Gagal mengambil data (status ${response?.status})`);
      }

      const payload = await response.json();
      const normalized = Array.isArray(payload?.data)
        ? payload.data.map(normalizeCommodity).filter(Boolean)
        : [];

      setCommodities(normalized);
      setSelectedCommodityId((previous) => {
        if (previous && normalized?.some((item) => item?.id === previous)) {
          return previous;
        }
        return normalized?.[0]?.id ?? null;
      });
    } catch (fetchError) {
      console.error('PriceTracker fetch error:', fetchError);
      setError('Gagal memuat data harga komoditas. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommodities();
  }, [fetchCommodities]);

  const selectedCommodity = useMemo(
    () => commodities?.find((item) => item?.id === selectedCommodityId) || null,
    [commodities, selectedCommodityId]
  );

  const chartData = selectedCommodity?.histories || [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount ?? 0);
  };

  const getChangeColor = (change) => {
    if (!Number.isFinite(change) || change === 0) {
      return 'text-muted-foreground';
    }

    return change > 0 ? 'text-destructive' : 'text-success';
  };

  const getChangeIcon = (change) => {
    if (!Number.isFinite(change) || change === 0) {
      return 'Minus';
    }

    return change > 0 ? 'TrendingUp' : 'TrendingDown';
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'turun':
        return 'text-success';
      case 'naik':
        return 'text-destructive';
      case 'stabil':
      case 'tetap':
        return 'text-muted-foreground';
      default:
        return 'text-accent';
    }
  };

  const handleSetAlert = () => {
    if (alertPrice && selectedCommodity) {
      onSetAlert?.({
        ingredientId: selectedCommodity?.id,
        ingredientName: selectedCommodity?.name,
        targetPrice: parseFloat(alertPrice),
        currentPrice: selectedCommodity?.currentPrice
      });
      setAlertPrice('');
    }
  };

  const placeholderPrice = useMemo(() => {
    if (!selectedCommodity?.currentPrice) {
      return 0;
    }

    const suggestion = selectedCommodity.currentPrice - 1000;
    return suggestion > 0 ? Math.round(suggestion) : Math.round(selectedCommodity.currentPrice / 2);
  }, [selectedCommodity?.currentPrice]);

  return (
    <div className="bg-card rounded-lg p-6 shadow-cultural">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
          <Icon name="TrendingUp" size={20} className="text-warning" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-lg text-foreground">Pelacak Harga</h3>
          <p className="text-sm text-muted-foreground">Monitor harga bahan makanan favorit</p>
        </div>
      </div>

      {isLoading && (
        <div className="mb-4 flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Loader2" size={16} className="animate-spin" />
          <span>Memuat data harga komoditas...</span>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <div className="flex items-start justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={fetchCommodities}>
              Coba Lagi
            </Button>
          </div>
        </div>
      )}

      {/* Commodity Selection */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-3">Pilih Komoditas</h4>
        {commodities?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commodities?.map((commodity) => (
              <button
                key={commodity?.id}
                onClick={() => setSelectedCommodityId(commodity?.id)}
                className={`p-4 rounded-lg text-left transition-all duration-200 ${
                  selectedCommodityId === commodity?.id
                    ? 'bg-primary text-primary-foreground shadow-cultural'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium">{commodity?.name}</h5>
                  <div
                    className={`flex items-center space-x-1 ${
                      selectedCommodityId === commodity?.id
                        ? 'text-primary-foreground'
                        : getChangeColor(commodity?.changePercent)
                    }`}
                  >
                    <Icon name={getChangeIcon(commodity?.changePercent)} size={14} />
                    <span className="text-sm font-medium">{formatPercent(commodity?.changePercent)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={
                      selectedCommodityId === commodity?.id
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground'
                    }
                  >
                    {formatCurrency(commodity?.currentPrice)} {commodity?.unitLabel}
                  </span>
                  <span
                    className={
                      selectedCommodityId === commodity?.id
                        ? 'text-primary-foreground'
                        : getTrendColor(commodity?.priceTrend)
                    }
                  >
                    {commodity?.priceTrendLabel}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          !isLoading && (
            <p className="text-sm text-muted-foreground">Data harga belum tersedia.</p>
          )
        )}
      </div>

      {/* Selected Commodity Details */}
      {selectedCommodity && (
        <div className="mb-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-lg text-foreground">{selectedCommodity?.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedCommodity?.category} â€¢ {selectedCommodity?.sourceName}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-xl text-foreground">
                  {formatCurrency(selectedCommodity?.currentPrice)}
                </p>
                <p className="text-sm text-muted-foreground">{selectedCommodity?.unitLabel}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Perubahan Harian</p>
                <div
                  className={`flex items-center justify-center space-x-1 ${getChangeColor(
                    selectedCommodity?.changePercent
                  )}`}
                >
                  <Icon name={getChangeIcon(selectedCommodity?.changePercent)} size={14} />
                  <span className="font-medium">{formatPercent(selectedCommodity?.changePercent)}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Selisih {formatCurrency(selectedCommodity?.changeValue)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kondisi Harga</p>
                <p className={`font-medium ${getTrendColor(selectedCommodity?.priceTrend)}`}>
                  {selectedCommodity?.priceTrendLabel}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Update Terakhir</p>
                <p className="font-medium text-foreground">{formatFullDate(selectedCommodity?.lastUpdate)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Chart */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-3">Grafik Harga (7 Hari Terakhir)</h4>
        <div className="bg-muted/30 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `${Math.round(value / 1000)}k`}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value), 'Harga']}
                labelStyle={{ color: 'var(--color-foreground)' }}
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'var(--color-accent)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Change Chart */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-3">Perubahan Harga Harian</h4>
        <div className="bg-muted/30 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                formatter={(value, _name, payload) => {
                  const delta = payload?.payload?.delta ?? value;
                  const label = delta >= 0 ? 'Kenaikan' : 'Penurunan';
                  return [formatCurrency(delta), label];
                }}
                labelStyle={{ color: 'var(--color-foreground)' }}
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="deltaAbs" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price Alert */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Set Alert Harga</h4>
        <p className="text-sm text-muted-foreground mb-3">
          Dapatkan notifikasi ketika harga {selectedCommodity?.name || 'komoditas'} mencapai target Anda
        </p>
        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
          <div className="flex-1">
            <input
              type="number"
              placeholder={`Contoh: ${placeholderPrice}`}
              value={alertPrice}
              onChange={(event) => setAlertPrice(event?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <Button
            variant="default"
            iconName="Bell"
            iconPosition="left"
            onClick={handleSetAlert}
            disabled={!alertPrice || !selectedCommodity}
          >
            Set Alert
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Harga saat ini: {formatCurrency(selectedCommodity?.currentPrice || 0)}
        </p>
      </div>
    </div>
  );
};

export default PriceTracker;



