import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const primaryNavItems = [
    { path: '/homepage', label: 'Beranda', icon: 'Home' },
    { path: '/ai-recipe-search', label: 'Cari Resep AI', icon: 'Search' },
    { path: '/cultural-heritage-explorer', label: 'Warisan Budaya', icon: 'BookOpen' },
    { path: '/smart-shopping-assistant', label: 'Belanja Pintar', icon: 'ShoppingCart' },
    { path: '/personal-kitchen-dashboard', label: 'Dapur Saya', icon: 'ChefHat' }
  ];

  const isActivePath = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-cultural border-b border-border ${className}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigation('/homepage')}>
              <div className="relative">
             
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg text-primary">AI Resepku</span>
                <span className="text-xs text-muted-foreground font-accent">Warisan Rasa Indonesia</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {primaryNavItems?.slice(0, 4)?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-cultural ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-cultural'
                    : 'text-foreground hover:bg-muted hover:text-primary'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            ))}
            
            {/* More Menu for Secondary Items */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-all duration-200 ease-cultural">
                <Icon name="MoreHorizontal" size={16} />
                <span>Lainnya</span>
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-cultural-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-cultural">
                <div className="py-2">
                  {primaryNavItems?.slice(4)?.map((item) => (
                    <button
                      key={item?.path}
                      onClick={() => handleNavigation(item?.path)}
                      className={`flex items-center space-x-3 w-full px-4 py-2 text-sm transition-colors duration-150 ${
                        isActivePath(item?.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-popover-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button variant="ghost" size="sm" iconName="Bell" className="relative">
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></span>
            </Button>
            
            <Button variant="outline" size="sm" iconName="User">
              Profil
            </Button>
            
            <Button variant="default" size="sm" iconName="Plus" iconPosition="left">
              Tambah Resep
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              iconName={isMobileMenuOpen ? "X" : "Menu"}
              onClick={toggleMobileMenu}
              className="touch-target"
            />
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="px-4 py-4 space-y-2">
            {/* Primary Navigation */}
            <div className="space-y-1">
              {primaryNavItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-cultural touch-target ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground shadow-cultural'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </button>
              ))}
            </div>
            {/* Mobile User Actions */}
            <div className="pt-4 border-t border-border space-y-2">
              <Button variant="outline" fullWidth iconName="User" iconPosition="left">
                Profil Saya
              </Button>
              <Button variant="default" fullWidth iconName="Plus" iconPosition="left">
                Tambah Resep
              </Button>
            </div>

            {/* Cultural Trust Signal */}
            <div className="pt-4 border-t border-border">
              <div className="trust-signal justify-center">
                <Icon name="Shield" size={16} className="text-success" />
                <span>Resep Asli Indonesia</span>
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <span>10,000+ Keluarga</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
