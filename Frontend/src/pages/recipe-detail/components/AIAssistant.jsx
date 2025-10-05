import { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon.jsx';
import Button from '../../../components/ui/Button.jsx';
import { aiAPI } from '../../../services/api.js';

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

    try {
      // Create recipe context for the AI
      const recipeContext = JSON.stringify({
        name: recipe?.name,
        ingredients: recipe?.ingredients,
        steps: recipe?.cookingSteps,
        description: recipe?.description,
        estimatedCost: recipe?.estimatedCost,
        cookingTime: recipe?.cookingTime,
        servings: recipe?.servings,
        difficulty: recipe?.difficulty
      });
      
      // Call real AWS Bedrock API
      const response = await aiAPI.assistant(message, recipeContext);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.answer,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('❌ AI Assistant API Error:', error);
      
      // Show error message to user
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: '⚠️ Maaf, terjadi kesalahan saat menghubungi AI Assistant. Silakan coba lagi atau pastikan backend server sedang berjalan.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
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
                  type="button"
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