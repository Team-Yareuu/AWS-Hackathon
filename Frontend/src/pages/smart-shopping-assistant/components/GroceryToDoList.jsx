import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DATA_ENDPOINT = 'https://data.jabarprov.go.id/api-dashboard-jabar/public/pangan/list-komoditas?search=&page=1&limit=9&order=asc&order_by=name';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount ?? 0);
};

const GroceryToDoList = ({ onAddItems }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commodities, setCommodities] = useState([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState({}); // id -> {qty}

  const fetchCommodities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(DATA_ENDPOINT);
      if (!response?.ok) {
        throw new Error(`Gagal mengambil data (status ${response?.status})`);
      }
      const payload = await response.json();
      const items = Array.isArray(payload?.data) ? payload.data : [];
      const normalized = items.map((item) => ({
        id: String(item?.commodity_id ?? item?.name ?? Math.random().toString(36).slice(2)),
        name: item?.name || 'Komoditas',
        price: Number(item?.price) || 0,
        lastPrice: Number(item?.last_price) || 0,
        changePercent: Number(item?.diff_percent) || 0,
        changeValue: Number(item?.diff) || 0,
        unit: item?.unit || 'unit',
        category: item?.categories || 'commodity',
        sourceName: item?.source_name || 'Provinsi Jawa Barat',
        lastUpdate: item?.date || ''
      }));
      setCommodities(normalized);
    } catch (err) {
      console.error('GroceryToDoList fetch error:', err);
      setError('Gagal memuat daftar harga komoditas. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommodities();
  }, [fetchCommodities]);

  const filteredCommodities = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return commodities;
    return commodities.filter((c) => c?.name?.toLowerCase()?.includes(q));
  }, [commodities, filter]);

  const totalSelected = useMemo(() => {
    return Object.entries(selected).reduce((sum, [id, data]) => {
      const item = commodities.find((c) => c.id === id);
      if (!item) return sum;
      const qty = Number(data?.qty) || 0;
      return sum + qty * (item.price || 0);
    }, 0);
  }, [selected, commodities]);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      if (prev[id]) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: { qty: 1 } };
    });
  };

  const updateQty = (id, delta) => {
    setSelected((prev) => {
      const current = prev[id]?.qty || 0;
      const next = Math.max(0, Number((current + delta).toFixed(2)));
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: { qty: next } };
    });
  };

  const handleAddToShopping = () => {
    const items = Object.entries(selected).map(([id, data]) => {
      const item = commodities.find((c) => c.id === id);
      return {
        id: Date.now() + Math.random(),
        name: item?.name,
        quantity: Number(data?.qty) || 1,
        unit: item?.unit || 'unit',
        price: item?.price || 0,
        category: 'commodity'
      };
    });
    if (items.length > 0) {
      onAddItems?.(items);
      setSelected({});
    }
  };

  const getChangeColor = (change) => {
    if (!Number.isFinite(change) || change === 0) return 'text-muted-foreground';
    return change > 0 ? 'text-destructive' : 'text-success';
  };

  const getChangeIcon = (change) => {
    if (!Number.isFinite(change) || change === 0) return 'Minus';
    return change > 0 ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-cultural">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="ShoppingBasket" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Daftar Belanja Pasar</h3>
            <p className="text-sm text-muted-foreground">Pilih bahan dan atur jumlah sebelum ke pasar</p>
          </div>
        </div>
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari komoditas..."
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
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

      <div className="space-y-2">
        {filteredCommodities?.map((item) => {
          const isSelected = !!selected[item.id];
          const qty = selected[item.id]?.qty || 0;
          return (
            <div key={item.id} className={`flex items-center p-3 rounded-lg border ${isSelected ? 'bg-primary/5 border-primary/30' : 'bg-background border-border'}`}>
              <div className="mr-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(item.id)}
                  className="w-4 h-4 accent-primary"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-foreground">{item.name}</h5>
                  <div className={`flex items-center space-x-1 ${getChangeColor(item.changePercent)}`}>
                    <Icon name={getChangeIcon(item.changePercent)} size={14} />
                    <span className="text-xs font-medium">{Math.abs(item.changePercent || 0).toFixed(2).replace(/\.00$/, '')}%</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{formatCurrency(item.price)} per {item.unit}</span>
                  {isSelected && (
                    <>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                      <span className="text-foreground font-medium">Subtotal: {formatCurrency((qty || 0) * (item.price || 0))}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-3">
                <button
                  onClick={() => updateQty(item.id, -1)}
                  className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors disabled:opacity-50"
                  disabled={!isSelected}
                >
                  <Icon name="Minus" size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium text-foreground">{isSelected ? qty : '-'}</span>
                <button
                  onClick={() => updateQty(item.id, +1)}
                  className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                  disabled={!isSelected}
                >
                  <Icon name="Plus" size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border pt-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Total Pilihan</span>
          <span className="font-semibold text-xl text-foreground">{formatCurrency(totalSelected)}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="default"
            iconName="ShoppingCart"
            iconPosition="left"
            onClick={handleAddToShopping}
            disabled={Object.keys(selected).length === 0}
          >
            Tambahkan ke Daftar Belanja
          </Button>
          <Button
            variant="outline"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={fetchCommodities}
          >
            Muat Ulang Harga
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GroceryToDoList;

