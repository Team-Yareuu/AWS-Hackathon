
import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SearchInterface = ({ mode = 'search', hasSearched, onModeChange, onSearch, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isImageSearch, setIsImageSearch] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 'ai-1', role: 'ai', content: 'Selamat datang di chatbot AI resepku' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatProcessing, setIsChatProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const blurTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);
  const prevModeRef = useRef(mode);
  const lastInjectedQueryRef = useRef('');

  const searchSuggestions = [
    'Rendang dengan bumbu tradisional',
    'Masakan vegetarian untuk keluarga',
    'Resep dengan budget Rp 50.000',
    'Makanan penutup khas Jawa',
    'Sup ayam untuk orang sakit',
    'Camilan sehat untuk anak'
  ];

  const searchModes = [
    { value: 'search', label: 'Pencarian Cepat', icon: 'Search', description: 'Gunakan pencarian instan & rekomendasi cepat' },
    { value: 'chat', label: 'Chatbot AI', icon: 'MessageSquare', description: 'Diskusi interaktif dengan asisten AI' }
  ];

  const normalizedQuery = searchQuery?.trim()?.toLowerCase();
  const filteredSuggestions = normalizedQuery
    ? searchSuggestions.filter((suggestion) => suggestion.toLowerCase().includes(normalizedQuery))
    : [];

  const shouldShowSuggestions = mode === 'search' && isInputFocused && normalizedQuery;

  const handleInputFocus = () => {
    if (mode !== 'search') {
      return;
    }
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    if (mode !== 'search') {
      return;
    }
    blurTimeoutRef.current = setTimeout(() => {
      setIsInputFocused(false);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSearch = (query = searchQuery) => {
    if (mode !== 'search') {
      return;
    }
    if (query?.trim()) {
      onSearch?.(query.trim());
    }
  };

  const handleVoiceSearch = () => {
    if (mode !== 'search') {
      return;
    }
    setIsVoiceActive(true);
    setTimeout(() => {
      const voiceQuery = 'Resep nasi goreng kampung';
      setSearchQuery(voiceQuery);
      setIsVoiceActive(false);
      handleSearch(voiceQuery);
    }, 2000);
  };

  const handleImageUpload = (event) => {
    if (mode !== 'search') {
      return;
    }
    const file = event?.target?.files?.[0];
    if (file) {
      setIsImageSearch(true);
      setTimeout(() => {
        const recognizedIngredients = 'ayam, bawang merah, cabai, tomat';
        setSearchQuery(`Resep dengan bahan: ${recognizedIngredients}`);
        setIsImageSearch(false);
        handleSearch(`Resep dengan bahan: ${recognizedIngredients}`);
      }, 3000);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    setIsInputFocused(false);
  };

  const handleModeSelect = (nextMode) => {
    if (nextMode === mode) {
      return;
    }
    if (!hasSearched && nextMode === 'chat') {
      return;
    }
    onModeChange?.(nextMode);
  };

  const generateDummyResponse = (message) => {
    if (!message) {
      return 'Saya siap membantu. Ceritakan kebutuhan resep Anda.';
    }
    return `Berikut ide dari saya berdasarkan "${message}": coba kombinasikan bahan favorit Anda, lalu saya bantu susun langkah memasaknya.`;
  };

  const handleSendChatMessage = (message, options = {}) => {
    const { clearInput = message === undefined } = options;
    const source = message ?? chatInput;
    const trimmed = source?.trim();

    if (!trimmed || isChatProcessing) {
      return null;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed
    };

    setChatMessages((prev) => [...prev, userMessage]);

    if (clearInput) {
      setChatInput('');
    }

    setIsChatProcessing(true);

    setTimeout(() => {
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: generateDummyResponse(trimmed)
      };
      setChatMessages((prev) => [...prev, aiMessage]);
      setIsChatProcessing(false);
    }, 900);

    return trimmed;
  };

  const handleChatKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendChatMessage();
    }
  };

  useEffect(() => {
    if (mode === 'chat') {
      setIsVoiceActive(false);
      setIsImageSearch(false);
      setIsInputFocused(false);

      if (prevModeRef.current !== 'chat') {
        const trimmedQuery = searchQuery?.trim();
        if (trimmedQuery && trimmedQuery !== lastInjectedQueryRef.current) {
          const sent = handleSendChatMessage(trimmedQuery, { clearInput: false });
          if (sent) {
            lastInjectedQueryRef.current = sent;
          }
        }
      }
    } else if (prevModeRef.current === 'chat') {
      setIsChatProcessing(false);
    }

    prevModeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (!searchQuery?.trim()) {
      lastInjectedQueryRef.current = '';
    }
  }, [searchQuery]);

  const renderModeTabs = () => (
    <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Mode Pencarian
        </span>
        <div className="flex flex-col gap-2 sm:flex-row">
          {searchModes.map((modeOption) => {
            const isActive = modeOption.value === mode;
            return (
              <button
                key={modeOption.value}
                type="button"
                onClick={() => handleModeSelect(modeOption.value)}
                className={`flex-1 rounded-lg border px-4 py-3 text-left transition-colors ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon name={modeOption.icon} size={18} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {modeOption.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{modeOption.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-xl px-6 pt-6 pb-6 shadow-cultural border border-border ">
      {mode === 'search' ? (
        <>
          <div className="relative mb-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Cari resep, bahan, atau ceritakan keinginan Anda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyPress={(e) => e?.key === 'Enter' && handleSearch()}
                className="pr-32 text-base"
                disabled={isLoading || isVoiceActive || isImageSearch}
              />

              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName={isVoiceActive ? 'Square' : 'Mic'}
                  onClick={handleVoiceSearch}
                  disabled={isLoading || isImageSearch}
                  className={`touch-target ${isVoiceActive ? 'text-accent animate-pulse' : ''}`}
                  title="Pencarian suara"
                />

                <Button
                  variant="ghost"
                  size="sm"
                  iconName={isImageSearch ? 'Loader2' : 'Camera'}
                  onClick={() => fileInputRef?.current?.click()}
                  disabled={isLoading || isVoiceActive}
                  className={`touch-target ${isImageSearch ? 'text-accent animate-spin' : ''}`}
                  title="Cari dengan foto"
                />

                <Button
                  variant="default"
                  size="sm"
                  iconName="Search"
                  onClick={() => handleSearch()}
                  loading={isLoading}
                  disabled={!searchQuery?.trim() || isVoiceActive || isImageSearch}
                  className="touch-target"
                />
              </div>

              {shouldShowSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-2 z-20">
                  <div className="max-h-64 overflow-auto rounded-lg border border-border bg-card shadow-lg">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-foreground transition-colors duration-150 hover:bg-muted"
                        >
                          <Icon name="Search" size={16} className="text-muted-foreground" />
                          <span>{suggestion}</span>
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-sm text-muted-foreground">Tidak ada saran yang cocok.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {hasSearched && renderModeTabs()}

          {isVoiceActive && (
            <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center space-x-2 text-accent">
                <Icon name="Mic" size={16} className="animate-pulse" />
                <span className="text-sm font-medium">Mendengarkan... Silakan berbicara</span>
              </div>
            </div>
          )}

          {isImageSearch && (
            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center space-x-2 text-primary">
                <Icon name="Loader2" size={16} className="animate-spin" />
                <span className="text-sm font-medium">Menganalisis gambar... Mengenali bahan-bahan</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          {hasSearched && renderModeTabs()}


          <div className="rounded-xl border border-border bg-background/60 p-4">
            <div
              ref={chatContainerRef}
              className="max-h-72 overflow-y-auto space-y-3 pr-1"
            >
              {chatMessages.map((message) => {
                const isUser = message.role === 'user';
                return (
                  <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`relative max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                      }`}
                    >
                      {!isUser && (
                        <span className="mb-1 inline-flex items-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <Icon name="Sparkles" size={12} className="mr-1 text-accent" />
                          AI Chef
                        </span>
                      )}
                      <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                );
              })}

              {isChatProcessing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                    <Icon name="Loader2" size={14} className="animate-spin" />
                    <span>AI sedang menyiapkan rekomendasi...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-end gap-2">
              <textarea
                rows={2}
                value={chatInput}
                onChange={(event) => setChatInput(event?.target?.value)}
                onKeyDown={handleChatKeyDown}
                placeholder="Tulis pertanyaan atau ceritakan bahan yang kamu miliki..."
                className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isChatProcessing}
              />
              <Button
                variant="default"
                size="sm"
                iconName="Send"
                onClick={() => handleSendChatMessage()}
                loading={isChatProcessing}
                disabled={isChatProcessing || !chatInput?.trim()}
                className="touch-target"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;
