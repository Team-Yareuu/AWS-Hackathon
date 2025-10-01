import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import FeaturedRecipes from './components/FeaturedRecipes';
import CulturalStories from './components/CulturalStories';
import BudgetFriendlySection from './components/BudgetFriendlySection';
import AIFeaturesShowcase from './components/AIFeaturesShowcase';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';

const Homepage = () => {
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI Resepku - Temukan Resep Indonesia Autentik dengan AI</title>
        <meta name="description" content="Platform kuliner AI pertama di Indonesia yang menggabungkan teknologi modern dengan kearifan tradisional. Temukan resep autentik, hemat budget, dan jelajahi warisan budaya kuliner Indonesia." />
        <meta name="keywords" content="resep indonesia, AI kuliner, masakan tradisional, budget hemat, warisan budaya, resep autentik" />
        <meta property="og:title" content="AI Resepku - Warisan Rasa Indonesia dengan Teknologi AI" />
        <meta property="og:description" content="Jelajahi ribuan resep autentik Indonesia dengan bantuan AI. Hemat budget, pelajari budaya, dan masak dengan percaya diri." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://airesepku.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Resepku - Resep Indonesia dengan AI" />
        <meta name="twitter:description" content="Platform kuliner AI untuk keluarga Indonesia. Temukan resep, hemat budget, jelajahi budaya." />
        <link rel="canonical" href="https://airesepku.com" />
      </Helmet>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <HeroSection />
        {/* AI Features Showcase */}
        <AIFeaturesShowcase />

        {/* Featured Recipes */}
        <FeaturedRecipes />

        {/* Budget Friendly Section */}
        <BudgetFriendlySection />
        
        {/* Cultural Stories */}
        <CulturalStories />


        {/* Testimonials */}
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;