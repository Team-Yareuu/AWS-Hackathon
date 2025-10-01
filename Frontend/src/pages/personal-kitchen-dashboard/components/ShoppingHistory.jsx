import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ShoppingHistory = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filters = [
    { id: 'all', label: 'Semua', count: 24 },
    { id: 'this-month', label: 'Bulan Ini', count: 8 },
    { id: 'last-month', label: 'Bulan Lalu', count: 12 },
    { id: 'high-value', label: 'Nilai Tinggi', count: 4 }
  ];

  const shoppingHistory = [
    {
      id: 1,
      date: '2024-09-28',
      time: '14:30',
      marketplace: 'Tokopedia',
      totalAmount: 185000,
      itemCount: 12,
      status: 'delivered',
      recipe: 'Rendang Daging Sapi',
      items: [
        { name: 'Daging Sapi', quantity: '1 kg', price: 120000 },
        { name: 'Santan Kelapa', quantity: '2 pack', price: 15000 },
        { name: 'Cabai Merah', quantity: '250g', price: 12000 },
        { name: 'Bawang Merah', quantity: '500g', price: 18000 },
        { name: 'Lengkuas', quantity: '100g', price: 8000 },
        { name: 'Serai', quantity: '3 batang', price: 5000 },
        { name: 'Daun Jeruk', quantity: '20 lembar', price: 7000 }
      ],
      savings: 25000,
      deliveryFee: 0
    },
    {
      id: 2,
      date: '2024-09-25',
      time: '10:15',
      marketplace: 'Shopee',
      totalAmount: 95000,
      itemCount: 8,
      status: 'delivered',
      recipe: 'Gado-Gado Jakarta',
      items: [
        { name: 'Tahu', quantity: '10 potong', price: 15000 },
        { name: 'Tempe', quantity: '2 papan', price: 12000 },
        { name: 'Kangkung', quantity: '2 ikat', price: 8000 },
        { name: 'Tauge', quantity: '500g', price: 6000 },
        { name: 'Kacang Tanah', quantity: '250g', price: 18000 },
        { name: 'Kerupuk', quantity: '2 pack', price: 16000 },
        { name: 'Telur Ayam', quantity: '10 butir', price: 20000 }
      ],
      savings: 12000,
      deliveryFee: 5000
    },
    {
      id: 3,
      date: '2024-09-22',
      time: '16:45',
      marketplace: 'Blibli',
      totalAmount: 145000,
      itemCount: 10,
      status: 'delivered',
      recipe: 'Soto Ayam Lamongan',
      items: [
        { name: 'Ayam Kampung', quantity: '1 ekor', price: 85000 },
        { name: 'Mie Kuning', quantity: '3 pack', price: 15000 },
        { name: 'Tauge', quantity: '300g', price: 5000 },
        { name: 'Daun Bawang', quantity: '2 ikat', price: 8000 },
        { name: 'Bawang Goreng', quantity: '200g', price: 12000 },
        { name: 'Kerupuk Udang', quantity: '2 pack', price: 20000 }
      ],
      savings: 18000,
      deliveryFee: 8000
    },
    {
      id: 4,
      date: '2024-09-20',
      time: '09:20',
      marketplace: 'Tokopedia',
      totalAmount: 75000,
      itemCount: 6,
      status: 'cancelled',
      recipe: 'Nasi Gudeg',
      items: [
        { name: 'Nangka Muda', quantity: '1 kg', price: 25000 },
        { name: 'Ayam Kampung', quantity: '500g', price: 40000 },
        { name: 'Telur Puyuh', quantity: '20 butir', price: 10000 }
      ],
      savings: 0,
      deliveryFee: 0
    },
    {
      id: 5,
      date: '2024-09-18',
      time: '13:10',
      marketplace: 'Shopee',
      totalAmount: 220000,
      itemCount: 15,
      status: 'delivered',
      recipe: 'Paket Bumbu Lengkap',
      items: [
        { name: 'Beras Premium', quantity: '5 kg', price: 75000 },
        { name: 'Minyak Goreng', quantity: '2 liter', price: 35000 },
        { name: 'Gula Pasir', quantity: '1 kg', price: 15000 },
        { name: 'Garam', quantity: '500g', price: 5000 },
        { name: 'Kecap Manis', quantity: '2 botol', price: 20000 },
        { name: 'Bumbu Instan', quantity: '10 pack', price: 50000 },
        { name: 'Santan Instan', quantity: '5 pack', price: 20000 }
      ],
      savings: 35000,
      deliveryFee: 0
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-success bg-success/10';
      case 'processing': return 'text-warning bg-warning/10';
      case 'cancelled': return 'text-error bg-error/10';
      case 'pending': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'delivered': return 'Terkirim';
      case 'processing': return 'Diproses';
      case 'cancelled': return 'Dibatalkan';
      case 'pending': return 'Menunggu';
      default: return status;
    }
  };

  const getMarketplaceIcon = (marketplace) => {
    switch (marketplace?.toLowerCase()) {
      case 'tokopedia': return 'ShoppingBag';
      case 'shopee': return 'ShoppingCart';
      case 'blibli': return 'Store';
      default: return 'ShoppingBag';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredHistory = shoppingHistory?.filter(item => {
    switch (activeFilter) {
      case 'this-month':
        return new Date(item.date)?.getMonth() === new Date()?.getMonth();
      case 'last-month':
        return new Date(item.date)?.getMonth() === new Date()?.getMonth() - 1;
      case 'high-value':
        return item?.totalAmount >= 150000;
      default:
        return true;
    }
  });

  const sortedHistory = [...filteredHistory]?.sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b?.totalAmount - a?.totalAmount;
      case 'items':
        return b?.itemCount - a?.itemCount;
      case 'date':
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  const totalSpent = shoppingHistory?.reduce((sum, item) => sum + item?.totalAmount, 0);
  const totalSavings = shoppingHistory?.reduce((sum, item) => sum + item?.savings, 0);
  const averageOrder = totalSpent / shoppingHistory?.length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="cultural-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Riwayat Belanja</h2>
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
            Ekspor Data
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <Icon name="ShoppingCart" size={24} className="text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{shoppingHistory?.length}</p>
            <p className="text-sm text-muted-foreground">Total Pesanan</p>
          </div>
          
          <div className="text-center p-4 bg-warning/5 rounded-lg">
            <Icon name="Wallet" size={24} className="text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSpent)}</p>
            <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
          </div>
          
          <div className="text-center p-4 bg-success/5 rounded-lg">
            <Icon name="PiggyBank" size={24} className="text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSavings)}</p>
            <p className="text-sm text-muted-foreground">Total Hemat</p>
          </div>
          
          <div className="text-center p-4 bg-turmeric/5 rounded-lg">
            <Icon name="TrendingUp" size={24} className="text-turmeric mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{formatCurrency(averageOrder)}</p>
            <p className="text-sm text-muted-foreground">Rata-rata Pesanan</p>
          </div>
        </div>
      </div>
      {/* Filters and Sort */}
      <div className="cultural-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {filters?.map((filter) => (
              <button
                key={filter?.id}
                onClick={() => setActiveFilter(filter?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter?.id
                    ? 'bg-primary text-primary-foreground shadow-cultural'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <span>{filter?.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === filter?.id
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-foreground/10 text-foreground'
                }`}>
                  {filter?.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-2 bg-muted text-foreground rounded-lg text-sm border-0 focus:ring-2 focus:ring-primary"
            >
              <option value="date">Tanggal Terbaru</option>
              <option value="amount">Nilai Tertinggi</option>
              <option value="items">Jumlah Item</option>
            </select>
          </div>
        </div>

        {/* Shopping History List */}
        <div className="space-y-4">
          {sortedHistory?.map((order) => (
            <div key={order?.id} className="cultural-card p-6 hover:shadow-cultural-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon name={getMarketplaceIcon(order?.marketplace)} size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{order?.marketplace}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order?.date)} • {order?.time}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{formatCurrency(order?.totalAmount)}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order?.status)}`}>
                    {getStatusLabel(order?.status)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Icon name="Package" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{order?.itemCount} item</span>
                  </div>
                  {order?.recipe && (
                    <div className="flex items-center space-x-1">
                      <Icon name="ChefHat" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{order?.recipe}</span>
                    </div>
                  )}
                </div>
                
                {order?.savings > 0 && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Tag" size={16} className="text-success" />
                    <span className="text-sm font-medium text-success">
                      Hemat {formatCurrency(order?.savings)}
                    </span>
                  </div>
                )}
              </div>

              {/* Item List (Collapsible) */}
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  <span>Lihat Detail Item</span>
                  <Icon name="ChevronDown" size={16} className="group-open:rotate-180 transition-transform" />
                </summary>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order?.items?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground text-sm">{item?.name}</p>
                          <p className="text-xs text-muted-foreground">{item?.quantity}</p>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {formatCurrency(item?.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {order?.deliveryFee > 0 && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <span className="text-sm text-muted-foreground">Biaya Pengiriman</span>
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(order?.deliveryFee)}
                      </span>
                    </div>
                  )}
                </div>
              </details>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex space-x-2">
                  {order?.status === 'delivered' && (
                    <Button variant="outline" size="sm" iconName="RotateCcw" iconPosition="left">
                      Pesan Lagi
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" iconName="FileText" iconPosition="left">
                    Invoice
                  </Button>
                </div>
                
                {order?.status === 'delivered' && (
                  <Button variant="ghost" size="sm" iconName="Star" iconPosition="left">
                    Beri Rating
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {sortedHistory?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="ShoppingCart" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Riwayat</h3>
            <p className="text-muted-foreground mb-4">
              Riwayat belanja Anda akan muncul di sini
            </p>
            <Button variant="default" iconName="ShoppingBag" iconPosition="left">
              Mulai Belanja
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingHistory;