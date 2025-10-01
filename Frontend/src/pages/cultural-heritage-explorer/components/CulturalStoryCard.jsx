import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CulturalStoryCard = ({ story, onClick, featured = false }) => {
  const formatReadTime = (minutes) => {
    return `${minutes} menit baca`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (featured) {
    return (
      <div
        className="cultural-card overflow-hidden cursor-pointer group"
        onClick={() => onClick(story)}
      >
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 overflow-hidden">
            <Image
              src={story?.image}
              alt={story?.title}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Featured Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
              <Icon name="Star" size={14} />
              <span>Unggulan</span>
            </span>
          </div>

          {/* Story Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                {story?.region}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                {story?.category}
              </span>
            </div>
            
            <h3 className="text-xl font-bold mb-2 line-clamp-2">
              {story?.title}
            </h3>
            
            <p className="text-sm opacity-90 mb-3 line-clamp-2">
              {story?.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} />
                  <span>{formatReadTime(story?.readTime)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={14} />
                  <span>{formatDate(story?.publishedDate)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 text-sm">
                <Icon name="Heart" size={14} />
                <span>{story?.likes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="cultural-card p-4 cursor-pointer group"
      onClick={() => onClick(story)}
    >
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 overflow-hidden rounded-lg">
            <Image
              src={story?.image}
              alt={story?.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {story?.region}
            </span>
            <span className="text-xs bg-turmeric/10 text-turmeric px-2 py-1 rounded-full">
              {story?.category}
            </span>
          </div>
          
          <h4 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {story?.title}
          </h4>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {story?.excerpt}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>{formatReadTime(story?.readTime)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Eye" size={12} />
                <span>{story?.views}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Icon name="Heart" size={12} />
              <span>{story?.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalStoryCard;