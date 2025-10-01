import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ShoppingList = ({ items, onUpdateQuantity, onRemoveItem, onAddCustomItem, onSaveList, onShareList }) => {
  const [customItem, setCustomItem] = useState({ name: '', quantity: '', unit: '', estimatedPrice: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [listName, setListName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const calculateTotal = () => {
    return items?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
  };

  const handleAddCustomItem = () => {
    if (customItem?.name && customItem?.quantity && customItem?.estimatedPrice) {
      onAddCustomItem({
        id: Date.now(),
        name: customItem?.name,
        quantity: parseFloat(customItem?.quantity),
        unit: customItem?.unit || 'pcs',
        price: parseFloat(customItem?.estimatedPrice),
        isCustom: true
      });
      setCustomItem({ name: '', quantity: '', unit: '', estimatedPrice: '' });
      setShowAddForm(false);
    }
  };

  const handleSaveList = () => {
    if (listName?.trim()) {
      onSaveList(listName?.trim());
      setListName('');
      setShowSaveForm(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'protein': 'Fish',
      'vegetable': 'Carrot',
      'spice': 'Zap',
      'grain': 'Wheat',
      'dairy': 'Milk',
      'custom': 'Plus'
    };
    return icons?.[category] || 'Package';
  };

  const groupedItems = items?.reduce((groups, item) => {
    const category = item?.category || 'custom';
    if (!groups?.[category]) {
      groups[category] = [];
    }
    groups?.[category]?.push(item);
    return groups;
  }, {});

  const categoryLabels = {
    'protein': 'Protein',
    'vegetable': 'Sayuran',
    'spice': 'Bumbu & Rempah',
    'grain': 'Biji-bijian',
    'dairy': 'Susu & Olahan',
    'custom': 'Item Tambahan'
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-cultural">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="ShoppingCart" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Daftar Belanja</h3>
            <p className="text-sm text-muted-foreground">{items?.length} item • {formatCurrency(calculateTotal())}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Plus"
            onClick={() => setShowAddForm(!showAddForm)}
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Save"
            onClick={() => setShowSaveForm(!showSaveForm)}
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Share"
            onClick={onShareList}
          />
        </div>
      </div>
      {/* Add Custom Item Form */}
      {showAddForm && (
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-foreground mb-3">Tambah Item Custom</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Nama Item"
              placeholder="Contoh: Bawang Merah"
              value={customItem?.name}
              onChange={(e) => setCustomItem({ ...customItem, name: e?.target?.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Jumlah"
                type="number"
                placeholder="500"
                value={customItem?.quantity}
                onChange={(e) => setCustomItem({ ...customItem, quantity: e?.target?.value })}
              />
              <Input
                label="Satuan"
                placeholder="gram"
                value={customItem?.unit}
                onChange={(e) => setCustomItem({ ...customItem, unit: e?.target?.value })}
              />
            </div>
            <Input
              label="Perkiraan Harga"
              type="number"
              placeholder="15000"
              value={customItem?.estimatedPrice}
              onChange={(e) => setCustomItem({ ...customItem, estimatedPrice: e?.target?.value })}
            />
          </div>
          <div className="flex space-x-2 mt-3">
            <Button
              variant="default"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              onClick={handleAddCustomItem}
            >
              Tambah
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddForm(false)}
            >
              Batal
            </Button>
          </div>
        </div>
      )}
      {/* Save List Form */}
      {showSaveForm && (
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-foreground mb-3">Simpan Daftar Belanja</h4>
          <div className="flex space-x-2">
            <Input
              placeholder="Nama daftar belanja..."
              value={listName}
              onChange={(e) => setListName(e?.target?.value)}
              className="flex-1"
            />
            <Button
              variant="default"
              size="sm"
              iconName="Save"
              onClick={handleSaveList}
            >
              Simpan
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSaveForm(false)}
            >
              Batal
            </Button>
          </div>
        </div>
      )}
      {/* Shopping List Items */}
      <div className="space-y-4">
        {Object.entries(groupedItems)?.map(([category, categoryItems]) => (
          <div key={category}>
            <div className="flex items-center space-x-2 mb-3">
              <Icon name={getCategoryIcon(category)} size={16} className="text-primary" />
              <h4 className="font-medium text-foreground">{categoryLabels?.[category]}</h4>
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted-foreground">{categoryItems?.length} item</span>
            </div>
            
            <div className="space-y-2">
              {categoryItems?.map((item) => (
                <div key={item?.id} className="flex items-center space-x-3 p-3 bg-background rounded-lg border border-border">
                  <div className="flex-1">
                    <h5 className="font-medium text-foreground">{item?.name}</h5>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{item?.quantity} {item?.unit}</span>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                      <span>{formatCurrency(item?.price)}</span>
                      {item?.isCustom && (
                        <>
                          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                          <span className="text-primary">Custom</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateQuantity(item?.id, Math.max(0.1, item?.quantity - 0.5))}
                      className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                    >
                      <Icon name="Minus" size={14} />
                    </button>
                    
                    <span className="w-12 text-center text-sm font-medium text-foreground">
                      {item?.quantity}
                    </span>
                    
                    <button
                      onClick={() => onUpdateQuantity(item?.id, item?.quantity + 0.5)}
                      className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                    >
                      <Icon name="Plus" size={14} />
                    </button>
                    
                    <button
                      onClick={() => onRemoveItem(item?.id)}
                      className="w-8 h-8 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive flex items-center justify-center transition-colors ml-2"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {items?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="ShoppingCart" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="font-medium text-foreground mb-2">Daftar Belanja Kosong</h4>
          <p className="text-sm text-muted-foreground mb-4">Tambahkan resep atau item custom untuk memulai</p>
          <Button
            variant="outline"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setShowAddForm(true)}
          >
            Tambah Item
          </Button>
        </div>
      )}
      {/* Total Summary */}
      {items?.length > 0 && (
        <div className="border-t border-border pt-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-foreground">Total Estimasi</span>
            <span className="font-semibold text-xl text-foreground">{formatCurrency(calculateTotal())}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              iconName="Calculator"
              iconPosition="left"
              fullWidth
            >
              Hitung Budget Detail
            </Button>
            <Button
              variant="default"
              iconName="ShoppingBag"
              iconPosition="left"
              fullWidth
            >
              Lanjut ke Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;