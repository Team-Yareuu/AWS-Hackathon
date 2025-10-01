import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIAssistant = ({ isOpen, onClose, recipe }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Halo! Saya adalah asisten AI untuk resep ${recipe?.name || 'ini'}. Saya siap membantu Anda dengan pertanyaan tentang memasak, substitusi bahan, atau tips khusus. Apa yang ingin Anda tanyakan?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "Bagaimana cara mengganti bahan yang tidak ada?",
    "Tips agar masakan lebih gurih?",
    "Berapa lama bisa disimpan?",
    "Cara menyesuaikan untuk diet khusus?",
    "Teknik memasak yang benar?",
    "Variasi resep ini?"
  ];

  const handleSendMessage = async (message = inputMessage) => {
    if (!message?.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (question) => {
    const responses = {
      substitusi: `Untuk substitusi bahan dalam ${recipe?.name || 'resep ini'}, berikut beberapa alternatif:\n\n• Jika tidak ada santan, gunakan susu full cream + 1 sdm mentega\n• Ganti cabai merah dengan paprika + sedikit cabai bubuk\n• Daun jeruk bisa diganti dengan kulit jeruk nipis parut\n• Lengkuas dapat diganti dengan jahe (porsi lebih sedikit)\n\nApakah ada bahan khusus yang ingin Anda ganti?`,
      
      gurih: `Tips membuat ${recipe?.name || 'masakan ini'} lebih gurih:\n\n• Tumis bumbu hingga harum dan matang sempurna\n• Gunakan kaldu ayam/sapi sebagai pengganti air\n• Tambahkan sedikit terasi untuk umami alami\n• Masak dengan api sedang agar bumbu meresap\n• Koreksi rasa di akhir dengan garam dan gula\n\nJangan lupa mencicipi selama proses memasak!`,
      
      penyimpanan: `Cara menyimpan ${recipe?.name || 'masakan ini'}:\n\n• Di kulkas: 2-3 hari dalam wadah tertutup\n• Di freezer: hingga 1 bulan (bekukan dalam porsi kecil)\n• Panaskan kembali dengan api kecil, tambah sedikit air jika perlu\n• Jangan simpan terlalu lama di suhu ruang (max 2 jam)\n\nUntuk hasil terbaik, konsumsi dalam 24 jam setelah dimasak.`,
      
      diet: `Modifikasi untuk diet khusus:\n\n**Diet Rendah Garam:** Kurangi garam, tambah rempah dan herbs\n**Vegetarian:** Ganti protein hewani dengan tahu/tempe/jamur\n**Keto:** Kurangi bahan berkarbohidrat, tambah lemak sehat\n**Diabetes:** Ganti gula dengan stevia, kurangi santan\n\nSaya bisa memberikan panduan lebih detail untuk diet tertentu. Diet apa yang Anda jalani?`,
      
      teknik: `Teknik memasak yang benar untuk ${recipe?.name || 'resep ini'}:\n\n• Siapkan semua bahan sebelum mulai memasak\n• Panaskan wajan/panci dengan api sedang\n• Tumis bumbu halus hingga harum (3-5 menit)\n• Masukkan bahan sesuai urutan tingkat kematangan\n• Aduk perlahan agar tidak hancur\n• Tes rasa secara berkala\n\nIngat: kesabaran adalah kunci masakan yang lezat!`,
      
      variasi: `Variasi menarik dari ${recipe?.name || 'resep ini'}:\n\n• Versi pedas: tambah cabai rawit dan sambal\n• Versi manis: tambah sedikit gula merah\n• Versi kaya protein: tambah telur rebus atau ayam suwir\n• Versi sayuran: tambah wortel, buncis, atau kacang panjang\n• Versi praktis: gunakan bumbu instan berkualitas\n\nMau coba variasi yang mana?`
    };

    const lowerQuestion = question?.toLowerCase();
    
    if (lowerQuestion?.includes('ganti') || lowerQuestion?.includes('substitusi') || lowerQuestion?.includes('tidak ada')) {
      return responses?.substitusi;
    } else if (lowerQuestion?.includes('gurih') || lowerQuestion?.includes('enak') || lowerQuestion?.includes('sedap')) {
      return responses?.gurih;
    } else if (lowerQuestion?.includes('simpan') || lowerQuestion?.includes('tahan') || lowerQuestion?.includes('awet')) {
      return responses?.penyimpanan;
    } else if (lowerQuestion?.includes('diet') || lowerQuestion?.includes('sehat') || lowerQuestion?.includes('kalori')) {
      return responses?.diet;
    } else if (lowerQuestion?.includes('teknik') || lowerQuestion?.includes('cara') || lowerQuestion?.includes('memasak')) {
      return responses?.teknik;
    } else if (lowerQuestion?.includes('variasi') || lowerQuestion?.includes('modifikasi') || lowerQuestion?.includes('ubah')) {
      return responses?.variasi;
    } else {
      return `Terima kasih atas pertanyaan Anda tentang ${recipe?.name || 'resep ini'}. Saya akan membantu Anda dengan informasi yang relevan.\n\nUntuk mendapatkan jawaban yang lebih spesifik, Anda bisa menanyakan tentang:\n• Substitusi bahan\n• Tips memasak\n• Penyimpanan makanan\n• Modifikasi untuk diet khusus\n• Teknik memasak\n• Variasi resep\n\nApa yang ingin Anda ketahui lebih lanjut?`;
    }
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50">
      <div className="bg-background rounded-t-xl sm:rounded-xl w-full max-w-2xl h-[80vh] sm:h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Icon name="Bot" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Asisten AI Masak</h3>
              <p className="text-sm text-muted-foreground">Siap membantu Anda memasak</p>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages?.map((message) => (
            <div
              key={message?.id}
              className={`flex ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message?.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-3 rounded-2xl ${
                    message?.type === 'user' ?'bg-primary text-primary-foreground rounded-br-sm' :'bg-muted text-foreground rounded-bl-sm ai-chat-bubble'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {message?.content}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-3">
                  {formatTime(message?.timestamp)}
                </p>
              </div>
              
              {message?.type === 'ai' && (
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 order-0 flex-shrink-0">
                  <Icon name="Bot" size={16} className="text-primary" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <Icon name="Bot" size={16} className="text-primary" />
              </div>
              <div className="bg-muted p-3 rounded-2xl rounded-bl-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="p-4 border-t border-border">
          <div className="mb-3">
            <p className="text-sm font-medium text-foreground mb-2">Pertanyaan Cepat:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions?.slice(0, 3)?.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question)}
                  className="px-3 py-1 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-full text-xs transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e?.target?.value)}
                onKeyPress={(e) => e?.key === 'Enter' && handleSendMessage()}
                placeholder="Tanyakan sesuatu tentang resep ini..."
                className="w-full px-4 py-2 pr-12 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage?.trim()}
              >
                <Icon name="Send" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;