import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const CulturalStory = ({ story }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-gradient-to-br from-turmeric/5 to-cinnamon/5 rounded-xl p-6 border border-turmeric/20">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-turmeric/20 rounded-full flex items-center justify-center">
            <Icon name="BookOpen" size={24} className="text-turmeric" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-heading font-bold text-foreground mb-2">
            Cerita Warisan Budaya
          </h3>
          
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {isExpanded ? story?.fullStory : story?.shortStory}
            </p>
          </div>

          <button
            onClick={toggleExpanded}
            className="inline-flex items-center space-x-2 mt-4 text-turmeric hover:text-turmeric/80 transition-colors text-sm font-medium"
          >
            <span>{isExpanded ? 'Baca Lebih Sedikit' : 'Baca Selengkapnya'}</span>
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
            />
          </button>
        </div>
      </div>
      {/* Regional Variations */}
      {story?.regionalVariations && (
        <div className="mt-6 pt-6 border-t border-turmeric/20">
          <h4 className="font-semibold text-foreground mb-4 flex items-center">
            <Icon name="MapPin" size={18} className="text-cinnamon mr-2" />
            Variasi Regional
          </h4>
          
          <div className="space-y-3">
            {story?.regionalVariations?.map((variation, index) => (
              <div key={index} className="bg-background/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-foreground">{variation?.region}</span>
                  <span className="px-2 py-1 bg-cinnamon/20 text-cinnamon text-xs rounded-full">
                    {variation?.province}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">{variation?.difference}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturalStory;