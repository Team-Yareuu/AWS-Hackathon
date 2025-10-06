import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    'Bagaimana cara mengganti bahan yang tidak ada?',
    'Tips agar masakan lebih gurih?',
    'Berapa lama bisa disimpan?',
    'Cara menyesuaikan untuk diet khusus?',
    'Teknik memasak yang benar?',
    'Variasi resep ini?'
  ];

  const handleSendMessage = async (message = inputMessage) => {
    if (!message?.trim()) return;

    const timestamp = new Date();
    const userMessage = {
      id: timestamp.getTime(),
      type: 'user',
      content: message.trim(),
      timestamp
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
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

      const response = await aiAPI.assistant(message, recipeContext);

      const aiTimestamp = new Date();
      const aiMessage = {
        id: aiTimestamp.getTime(),
        type: 'ai',
        content: response?.answer || 'Maaf, saya belum memiliki jawaban untuk itu.',
        timestamp: aiTimestamp
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Assistant API Error:', error);

      const errorTimestamp = new Date();
      const errorMessage = {
        id: errorTimestamp.getTime(),
        type: 'ai',
        content: 'Maaf, terjadi kesalahan saat menghubungi AI Assistant. Silakan coba lagi dan pastikan backend sedang berjalan.',
        timestamp: errorTimestamp
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = date => {
    if (!date) return '';
    const parsedDate = date instanceof Date ? date : new Date(date);
    return parsedDate.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-background sm:bg-background/95 border-none sm:border border-border shadow-none sm:shadow-2xl rounded-none sm:rounded-xl w-full max-w-none sm:max-w-2xl h-screen sm:h-[70vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/15 rounded-full flex items-center justify-center">
              <Icon name="Bot" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Asisten AI Masak</h3>
              <p className="text-sm text-muted-foreground">Sampaikan pertanyaan Anda tentang resep ini</p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-muted/30">
          {messages?.map(message => {
            const isUser = message?.type === 'user';
            const bubbleBase = isUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-card text-foreground border border-border rounded-bl-sm shadow-sm';

            return (
              <div key={message?.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-3`}>
                {!isUser && (
                  <div className="w-8 h-8 bg-primary/15 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Bot" size={16} className="text-primary" />
                  </div>
                )}

                <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'} space-y-1`}>
                  <div className={`p-3 rounded-2xl leading-relaxed text-sm ${bubbleBase}`}>
                    {isUser ? (
                      <p className="whitespace-pre-line">{message?.content}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none ai-markdown">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            ul: ({ children }) => (
                              <ul className="list-disc pl-5 space-y-1">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal pl-5 space-y-1">{children}</ol>
                            ),
                            li: ({ children }) => <li className="pl-1">{children}</li>,
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                className="text-primary underline underline-offset-2"
                                target="_blank"
                                rel="noreferrer"
                              >
                                {children}
                              </a>
                            ),
                            code: ({ children }) => (
                              <code className="rounded bg-primary/10 px-1 py-0.5 text-xs">{children}</code>
                            ),
                            pre: ({ children }) => (
                              <pre className="overflow-x-auto rounded-md bg-primary/10 p-3 text-xs">{children}</pre>
                            )
                          }}
                        >
                          {message?.content || ''}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground/80 px-1">
                    {formatTime(message?.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/15 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="Bot" size={16} className="text-primary" />
              </div>
              <div className="bg-card border border-border p-3 rounded-2xl rounded-bl-sm">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.12s' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.24s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="p-4 border-t border-border bg-card/70">
          <div className="mb-3">
            <p className="text-sm font-medium text-foreground mb-2">Pertanyaan cepat</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions?.slice(0, 4)?.map((question, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handleSendMessage(question)}
                  className="px-3 py-1.5 bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border/60 rounded-full text-xs transition-colors"
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
                onChange={event => setInputMessage(event?.target?.value)}
                onKeyDown={event => {
                  if (event?.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Tanyakan sesuatu tentang resep ini..."
                className="w-full px-4 py-2.5 pr-12 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-card"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
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
