import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FestivalCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date()?.getMonth());
  const [selectedFestival, setSelectedFestival] = useState(null);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const festivals = [
    {
      id: 'nyepi',
      name: 'Hari Raya Nyepi',
      month: 2,
      date: '22 Maret 2024',
      region: 'Bali',
      description: `Hari raya Hindu Bali yang dirayakan dengan keheningan.\nHidangan khusus disiapkan sehari sebelumnya.\nTradisi kuliner yang unik dan penuh makna spiritual.`,
      dishes: [
        { name: 'Lawar', description: 'Salad tradisional Bali dengan daging dan sayuran' },
        { name: 'Bebek Betutu', description: 'Bebek bumbu khas yang dipanggang dalam sekam' },
        { name: 'Sate Lilit', description: 'Sate ikan cincang dengan bumbu khas Bali' }
      ],
      traditions: ['Tidak memasak pada hari H', 'Persiapan makanan sehari sebelumnya', 'Hidangan vegetarian'],
      color: 'bg-yellow-500'
    },
    {
      id: 'ramadan',
      name: 'Bulan Ramadan',
      month: 3,
      date: 'Maret - April 2024',
      region: 'Seluruh Indonesia',
      description: `Bulan suci umat Islam dengan tradisi buka puasa.\nBerbagai hidangan khas untuk berbuka dan sahur.\nTradisi kuliner yang kaya dan beragam di setiap daerah.`,
      dishes: [
        { name: 'Kolak', description: 'Minuman manis dengan pisang dan ubi dalam santan' },
        { name: 'Ketupat', description: 'Nasi yang dibungkus daun kelapa muda' },
        { name: 'Opor Ayam', description: 'Ayam dalam kuah santan dengan bumbu kuning' }
      ],
      traditions: ['Takjil untuk berbuka', 'Sahur sebelum subuh', 'Hidangan berkuah'],
      color: 'bg-green-500'
    },
    {
      id: 'lebaran',
      name: 'Hari Raya Idul Fitri',
      month: 4,
      date: '10-11 April 2024',
      region: 'Seluruh Indonesia',
      description: `Perayaan terbesar umat Islam Indonesia.\nHidangan khas yang wajib ada di setiap rumah.\nTradisi saling mengunjungi dengan sajian istimewa.`,
      dishes: [
        { name: 'Rendang', description: 'Daging sapi dalam bumbu rempah kental' },
        { name: 'Lontong Sayur', description: 'Lontong dengan sayur labu dan santan' },
        { name: 'Nastar', description: 'Kue kering dengan isian selai nanas' }
      ],
      traditions: ['Open house', 'Kue kering wajib', 'Hidangan daging'],
      color: 'bg-emerald-500'
    },
    {
      id: 'waisak',
      name: 'Hari Raya Waisak',
      month: 4,
      date: '23 Mei 2024',
      region: 'Jawa Tengah',
      description: `Perayaan kelahiran Buddha Gautama.\nHidangan vegetarian sebagai bentuk kasih sayang.\nTradisi kuliner yang menekankan kesederhanaan.`,
      dishes: [
        { name: 'Tahu Isi', description: 'Tahu goreng dengan isian sayuran' },
        { name: 'Gado-gado', description: 'Salad sayuran dengan bumbu kacang' },
        { name: 'Es Cendol', description: 'Minuman segar dengan cendol dan santan' }
      ],
      traditions: ['Makanan vegetarian', 'Tidak membunuh hewan', 'Berbagi dengan sesama'],
      color: 'bg-orange-500'
    },
    {
      id: 'independence',
      name: 'Hari Kemerdekaan RI',
      month: 7,
      date: '17 Agustus 2024',
      region: 'Seluruh Indonesia',
      description: `Perayaan kemerdekaan Indonesia yang meriah.\nHidangan tradisional dari berbagai daerah.\nLomba masak dan festival kuliner nusantara.`,
      dishes: [
        { name: 'Nasi Tumpeng', description: 'Nasi kuning berbentuk kerucut dengan lauk' },
        { name: 'Gudeg', description: 'Nangka muda dalam bumbu manis khas Yogya' },
        { name: 'Soto Betawi', description: 'Soto khas Jakarta dengan santan dan daging' }
      ],
      traditions: ['Nasi tumpeng wajib', 'Lomba masak', 'Festival kuliner'],
      color: 'bg-red-500'
    },
    {
      id: 'christmas',
      name: 'Hari Raya Natal',
      month: 11,
      date: '25 Desember 2024',
      region: 'Seluruh Indonesia',
      description: `Perayaan kelahiran Yesus Kristus.\nHidangan khas Natal dengan sentuhan Indonesia.\nTradisi berkumpul keluarga dengan makanan istimewa.`,
      dishes: [
        { name: 'Babi Guling', description: 'Babi panggang khas Bali dan Batak' },
        { name: 'Kue Nastar', description: 'Kue kering dengan isian nanas' },
        { name: 'Sup Buntut', description: 'Sup ekor sapi dengan sayuran' }
      ],
      traditions: ['Makan bersama keluarga', 'Kue kering', 'Hidangan daging'],
      color: 'bg-red-600'
    }
  ];

  const currentMonthFestivals = festivals?.filter(festival => festival?.month === selectedMonth);

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Kalender Kuliner Indonesia
        </h3>
        <p className="text-muted-foreground">
          Jelajahi hidangan tradisional setiap perayaan
        </p>
      </div>
      {/* Month Navigation */}
      <div className="flex overflow-x-auto pb-4 mb-8 space-x-2">
        {months?.map((month, index) => (
          <button
            key={index}
            onClick={() => setSelectedMonth(index)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedMonth === index
                ? 'bg-primary text-primary-foreground shadow-cultural'
                : 'bg-muted text-muted-foreground hover:bg-primary/10'
            }`}
          >
            {month}
          </button>
        ))}
      </div>
      {/* Current Month Display */}
      <div className="bg-gradient-to-r from-primary/5 to-turmeric/5 rounded-xl p-6 mb-8 border border-primary/10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold text-foreground">
            {months?.[selectedMonth]} 2024
          </h4>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={16} />
            <span>{currentMonthFestivals?.length} Perayaan</span>
          </div>
        </div>

        {currentMonthFestivals?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Tidak ada perayaan khusus di bulan ini
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {currentMonthFestivals?.map((festival) => (
              <div
                key={festival?.id}
                className={`cultural-card p-4 cursor-pointer transition-all duration-300 ${
                  selectedFestival?.id === festival?.id
                    ? 'shadow-cultural-lg border-2 border-primary/20'
                    : 'hover:shadow-cultural'
                }`}
                onClick={() => setSelectedFestival(festival)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-3 h-3 rounded-full ${festival?.color} mt-2`}></div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-foreground mb-1">
                      {festival?.name}
                    </h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      {festival?.date} • {festival?.region}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {festival?.description?.split('\n')?.[0]}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {festival?.dishes?.slice(0, 2)?.map((dish, index) => (
                        <span
                          key={index}
                          className="text-xs bg-turmeric/10 text-turmeric px-2 py-1 rounded-full"
                        >
                          {dish?.name}
                        </span>
                      ))}
                      {festival?.dishes?.length > 2 && (
                        <span className="text-xs text-muted-foreground px-2 py-1">
                          +{festival?.dishes?.length - 2} lainnya
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Festival Details Modal */}
      {selectedFestival && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {selectedFestival?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedFestival?.date} • {selectedFestival?.region}
                </p>
              </div>
              <button
                onClick={() => setSelectedFestival(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-muted-foreground mb-6 whitespace-pre-line">
                {selectedFestival?.description}
              </p>

              {/* Traditional Dishes */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="ChefHat" size={20} className="mr-2" />
                  Hidangan Tradisional
                </h4>
                <div className="space-y-3">
                  {selectedFestival?.dishes?.map((dish, index) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-4">
                      <h5 className="font-medium text-foreground mb-1">
                        {dish?.name}
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {dish?.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cultural Traditions */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Icon name="Heart" size={20} className="mr-2" />
                  Tradisi Kuliner
                </h4>
                <div className="grid gap-2">
                  {selectedFestival?.traditions?.map((tradition, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon name="Check" size={16} className="text-success" />
                      <span className="text-sm text-foreground">{tradition}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Icon name="BookOpen" size={16} />
                  <span>Lihat Resep</span>
                </button>
                <button className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Icon name="Share2" size={16} />
                  <span>Bagikan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FestivalCalendar;