import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardStats = () => {
  const stats = [
    {
      id: 1,
      title: "Resep Tersimpan",
      value: "47",
      change: "+3 minggu ini",
      icon: "BookOpen",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      id: 2,
      title: "Resep Dicoba",
      value: "23",
      change: "+5 bulan ini",
      icon: "ChefHat",
      color: "text-turmeric",
      bgColor: "bg-turmeric/10"
    },
    {
      id: 3,
      title: "Budget Hemat",
      value: "Rp 450.000",
      change: "dari target bulanan",
      icon: "PiggyBank",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      id: 4,
      title: "Streak Memasak",
      value: "12 hari",
      change: "rekor terbaik!",
      icon: "Flame",
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats?.map((stat) => (
        <div key={stat?.id} className="cultural-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat?.bgColor}`}>
              <Icon name={stat?.icon} size={24} className={stat?.color} />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
              <p className="text-sm text-muted-foreground">{stat?.change}</p>
            </div>
          </div>
          <h3 className="font-semibold text-foreground">{stat?.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;