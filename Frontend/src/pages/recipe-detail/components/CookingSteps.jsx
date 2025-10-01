import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CookingSteps = ({ steps, onAIHelp }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showTimer, setShowTimer] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const toggleStepComplete = (stepIndex) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted?.has(stepIndex)) {
      newCompleted?.delete(stepIndex);
    } else {
      newCompleted?.add(stepIndex);
    }
    setCompletedSteps(newCompleted);
  };

  const startTimer = (minutes) => {
    setTimer(minutes * 60);
    setIsTimerActive(true);
    setShowTimer(true);
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerActive(false);
          // Could add notification here
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'mudah': return 'text-success bg-success/10';
      case 'sedang': return 'text-warning bg-warning/10';
      case 'sulit': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-bold text-foreground flex items-center">
          <Icon name="ChefHat" size={24} className="text-primary mr-3" />
          Langkah Memasak
        </h3>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground">
            {completedSteps?.size}/{steps?.length} selesai
          </span>
          <Button
            variant="outline"
            size="sm"
            iconName="MessageCircle"
            onClick={() => onAIHelp('general')}
          >
            Bantuan AI
          </Button>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${(completedSteps?.size / steps?.length) * 100}%` }}
          />
        </div>
      </div>
      {/* Timer Display */}
      {showTimer && (
        <div className="mb-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Timer" size={20} className="text-accent" />
              <span className="font-semibold text-accent">Timer Aktif</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-2xl font-mono font-bold ${
                timer <= 60 ? 'text-error' : 'text-accent'
              }`}>
                {formatTime(timer)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setShowTimer(false)}
              />
            </div>
          </div>
        </div>
      )}
      {/* Steps Navigation */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {steps?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold transition-all ${
                completedSteps?.has(index)
                  ? 'bg-success border-success text-white'
                  : currentStep === index
                  ? 'border-primary text-primary bg-primary/10' :'border-muted-foreground text-muted-foreground hover:border-primary'
              }`}
            >
              {completedSteps?.has(index) ? (
                <Icon name="Check" size={16} />
              ) : (
                index + 1
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Current Step Display */}
      <div className="space-y-6">
        {steps?.map((step, index) => (
          <div
            key={index}
            className={`transition-all duration-300 ${
              currentStep === index ? 'block' : 'hidden'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg ${
                completedSteps?.has(index)
                  ? 'bg-success border-success text-white' :'border-primary text-primary bg-primary/10'
              }`}>
                {completedSteps?.has(index) ? (
                  <Icon name="Check" size={20} />
                ) : (
                  index + 1
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h4 className="text-lg font-semibold text-foreground">
                    {step?.title}
                  </h4>
                  
                  {step?.difficulty && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(step?.difficulty)}`}>
                      {step?.difficulty}
                    </span>
                  )}
                  
                  {step?.duration && (
                    <span className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                      {step?.duration}
                    </span>
                  )}
                </div>

                <div className="prose prose-sm max-w-none mb-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {step?.description}
                  </p>
                </div>

                {/* Step Image */}
                {step?.image && (
                  <div className="mb-4">
                    <div className="relative h-48 sm:h-56 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={step?.image}
                        alt={`Langkah ${index + 1}: ${step?.title}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Step Tips */}
                {step?.tips && step?.tips?.length > 0 && (
                  <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-start space-x-2">
                      <Icon name="Lightbulb" size={16} className="text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-primary text-sm mb-1">Tips:</p>
                        <ul className="space-y-1">
                          {step?.tips?.map((tip, tipIndex) => (
                            <li key={tipIndex} className="text-sm text-muted-foreground">
                              • {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant={completedSteps?.has(index) ? "success" : "default"}
                    onClick={() => toggleStepComplete(index)}
                    iconName={completedSteps?.has(index) ? "Check" : "Circle"}
                    iconPosition="left"
                  >
                    {completedSteps?.has(index) ? 'Selesai' : 'Tandai Selesai'}
                  </Button>

                  {step?.duration && !completedSteps?.has(index) && (
                    <Button
                      variant="outline"
                      onClick={() => startTimer(parseInt(step?.duration))}
                      iconName="Timer"
                      iconPosition="left"
                    >
                      Timer {step?.duration}
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    onClick={() => onAIHelp(index)}
                    iconName="HelpCircle"
                    iconPosition="left"
                  >
                    Bantuan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Navigation Controls */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Sebelumnya
          </Button>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Langkah {currentStep + 1} dari {steps?.length}
            </span>
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.min(steps?.length - 1, currentStep + 1))}
            disabled={currentStep === steps?.length - 1}
            iconName="ChevronRight"
            iconPosition="right"
          >
            Selanjutnya
          </Button>
        </div>
      </div>
      {/* Completion Celebration */}
      {completedSteps?.size === steps?.length && (
        <div className="mt-6 p-6 bg-success/5 rounded-lg border border-success/20 text-center">
          <Icon name="PartyPopper" size={48} className="text-success mx-auto mb-3" />
          <h4 className="text-xl font-bold text-success mb-2">Selamat!</h4>
          <p className="text-muted-foreground mb-4">
            Anda telah menyelesaikan semua langkah memasak. Selamat menikmati hidangan Anda!
          </p>
          <Button variant="success" iconName="Camera" iconPosition="left">
            Foto & Bagikan Hasil
          </Button>
        </div>
      )}
    </div>
  );
};

export default CookingSteps;