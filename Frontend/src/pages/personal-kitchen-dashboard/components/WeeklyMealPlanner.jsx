import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const WeeklyMealPlanner = () => {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);

  const weeks = [
    { id: 0, label: 'Minggu Ini', date: '23-29 Sep 2024' },
    { id: 1, label: 'Minggu Depan', date: '30 Sep - 6 Okt 2024' },
    { id: 2, label: 'Minggu Berikutnya', date: '7-13 Okt 2024' }
  ];

  const mealPlans = {
    0: { // This week
      monday: {
        breakfast: { name: 'Bubur Ayam', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop', time: '07:00', budget: 15000 },
        lunch: { name: 'Nasi Gudeg', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop', time: '12:00', budget: 25000 },
        dinner: { name: 'Soto Ayam', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop', time: '19:00', budget: 30000 }
      },
      tuesday: {
        breakfast: { name: 'Nasi Uduk', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop', time: '07:00', budget: 12000 },
        lunch: { name: 'Gado-Gado', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop', time: '12:30', budget: 20000 },
        dinner: { name: 'Rendang Daging', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop', time: '19:30', budget: 45000 }
      },
      wednesday: {
        breakfast: { name: 'Lontong Sayur', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop', time: '07:00', budget: 18000 },
        lunch: { name: 'Ayam Geprek', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=200&fit=crop', time: '12:00', budget: 22000 },
        dinner: null
      },
      thursday: {
        breakfast: null,
        lunch: { name: 'Nasi Padang', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop', time: '12:00', budget: 35000 },
        dinner: { name: 'Pecel Lele', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=200&fit=crop', time: '19:00', budget: 25000 }
      },
      friday: {
        breakfast: { name: 'Ketoprak', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop', time: '07:30', budget: 16000 },
        lunch: { name: 'Bakso', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop', time: '12:30', budget: 18000 },
        dinner: { name: 'Ikan Bakar', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=200&fit=crop', time: '19:30', budget: 40000 }
      },
      saturday: {
        breakfast: null,
        lunch: null,
        dinner: null
      },
      sunday: {
        breakfast: null,
        lunch: null,
        dinner: null
      }
    }
  };

  const days = [
    { key: 'monday', label: 'Sen', fullLabel: 'Senin', date: '23' },
    { key: 'tuesday', label: 'Sel', fullLabel: 'Selasa', date: '24' },
    { key: 'wednesday', label: 'Rab', fullLabel: 'Rabu', date: '25' },
    { key: 'thursday', label: 'Kam', fullLabel: 'Kamis', date: '26' },
    { key: 'friday', label: 'Jum', fullLabel: 'Jumat', date: '27' },
    { key: 'saturday', label: 'Sab', fullLabel: 'Sabtu', date: '28' },
    { key: 'sunday', label: 'Min', fullLabel: 'Minggu', date: '29' }
  ];

  const mealTypes = [
    { key: 'breakfast', label: 'Sarapan', icon: 'Coffee', color: 'text-turmeric' },
    { key: 'lunch', label: 'Makan Siang', icon: 'Sun', color: 'text-warning' },
    { key: 'dinner', label: 'Makan Malam', icon: 'Moon', color: 'text-primary' }
  ];

  const currentWeekPlan = mealPlans?.[selectedWeek] || {};

  const calculateDayBudget = (dayPlan) => {
    if (!dayPlan) return 0;
    return Object.values(dayPlan)?.reduce((total, meal) => {
      return total + (meal?.budget || 0);
    }, 0);
  };

  const calculateWeekBudget = () => {
    return Object.values(currentWeekPlan)?.reduce((total, dayPlan) => {
      return total + calculateDayBudget(dayPlan);
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const MealCard = ({ meal, mealType, dayKey }) => {
    if (!meal) {
      return (
        <div className="p-3 border-2 border-dashed border-muted rounded-lg text-center">
          <Icon name="Plus" size={20} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Tambah {mealTypes?.find(m => m?.key === mealType)?.label}</p>
        </div>
      );
    }

    return (
      <div className="cultural-card p-3 cursor-pointer hover:shadow-cultural transition-all duration-200">
        <div className="flex items-center space-x-3">
          <Image
            src={meal?.image}
            alt={meal?.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground text-sm truncate">{meal?.name}</h4>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">{meal?.time}</span>
              <span className="text-xs font-medium text-success">{formatCurrency(meal?.budget)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="cultural-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Perencanaan Makan</h2>
          <Button variant="outline" size="sm" iconName="Calendar" iconPosition="left">
            Atur Jadwal
          </Button>
        </div>

        {/* Week Selector */}
        <div className="flex space-x-2 mb-6">
          {weeks?.map((week) => (
            <button
              key={week?.id}
              onClick={() => setSelectedWeek(week?.id)}
              className={`flex-1 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedWeek === week?.id
                  ? 'bg-primary text-primary-foreground shadow-cultural'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <div>{week?.label}</div>
              <div className="text-xs opacity-80">{week?.date}</div>
            </button>
          ))}
        </div>

        {/* Week Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <Icon name="Calendar" size={24} className="text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">
              {Object.values(currentWeekPlan)?.filter(day => 
                Object.values(day || {})?.some(meal => meal !== null)
              )?.length}
            </p>
            <p className="text-sm text-muted-foreground">Hari Terencana</p>
          </div>
          
          <div className="text-center p-4 bg-success/5 rounded-lg">
            <Icon name="Utensils" size={24} className="text-success mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">
              {Object.values(currentWeekPlan)?.reduce((total, day) => 
                total + Object.values(day || {})?.filter(meal => meal !== null)?.length, 0
              )}
            </p>
            <p className="text-sm text-muted-foreground">Total Makanan</p>
          </div>
          
          <div className="text-center p-4 bg-turmeric/5 rounded-lg">
            <Icon name="Wallet" size={24} className="text-turmeric mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">{formatCurrency(calculateWeekBudget())}</p>
            <p className="text-sm text-muted-foreground">Budget Minggu</p>
          </div>
        </div>
      </div>
      {/* Weekly Calendar */}
      <div className="cultural-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Jadwal Makan Mingguan</h3>
        
        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-8 gap-4">
            {/* Header */}
            <div className="font-medium text-muted-foreground text-sm"></div>
            {days?.map((day) => (
              <div key={day?.key} className="text-center">
                <div className="font-semibold text-foreground">{day?.label}</div>
                <div className="text-sm text-muted-foreground">{day?.date}</div>
                <div className="text-xs text-success mt-1">
                  {formatCurrency(calculateDayBudget(currentWeekPlan?.[day?.key]))}
                </div>
              </div>
            ))}

            {/* Meal Rows */}
            {mealTypes?.map((mealType) => (
              <React.Fragment key={mealType?.key}>
                <div className="flex items-center space-x-2 py-2">
                  <Icon name={mealType?.icon} size={16} className={mealType?.color} />
                  <span className="text-sm font-medium text-foreground">{mealType?.label}</span>
                </div>
                {days?.map((day) => (
                  <div key={`${day?.key}-${mealType?.key}`}>
                    <MealCard 
                      meal={currentWeekPlan?.[day?.key]?.[mealType?.key]} 
                      mealType={mealType?.key}
                      dayKey={day?.key}
                    />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden">
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            {days?.map((day) => (
              <button
                key={day?.key}
                onClick={() => setSelectedDay(selectedDay === day?.key ? null : day?.key)}
                className={`flex-shrink-0 p-3 rounded-lg text-center transition-all duration-200 ${
                  selectedDay === day?.key
                    ? 'bg-primary text-primary-foreground shadow-cultural'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <div className="font-semibold text-sm">{day?.label}</div>
                <div className="text-xs opacity-80">{day?.date}</div>
                <div className="text-xs mt-1">
                  {formatCurrency(calculateDayBudget(currentWeekPlan?.[day?.key]))}
                </div>
              </button>
            ))}
          </div>

          {selectedDay && (
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">
                {days?.find(d => d?.key === selectedDay)?.fullLabel}
              </h4>
              {mealTypes?.map((mealType) => (
                <div key={mealType?.key}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name={mealType?.icon} size={16} className={mealType?.color} />
                    <span className="text-sm font-medium text-foreground">{mealType?.label}</span>
                  </div>
                  <MealCard 
                    meal={currentWeekPlan?.[selectedDay]?.[mealType?.key]} 
                    mealType={mealType?.key}
                    dayKey={selectedDay}
                  />
                </div>
              ))}
            </div>
          )}

          {!selectedDay && (
            <div className="text-center py-8">
              <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Pilih hari untuk melihat jadwal makan</p>
            </div>
          )}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="cultural-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" fullWidth iconName="Wand2" iconPosition="left">
            Auto Plan AI
          </Button>
          <Button variant="outline" fullWidth iconName="Copy" iconPosition="left">
            Salin Minggu Lalu
          </Button>
          <Button variant="outline" fullWidth iconName="ShoppingCart" iconPosition="left">
            Buat Daftar Belanja
          </Button>
          <Button variant="outline" fullWidth iconName="Share2" iconPosition="left">
            Bagikan Rencana
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyMealPlanner;