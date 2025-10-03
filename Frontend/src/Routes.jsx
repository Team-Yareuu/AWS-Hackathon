import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import RecipeDetail from './pages/recipe-detail';
import AIRecipeSearchPage from './pages/ai-recipe-search';
import CulturalHeritageExplorer from './pages/cultural-heritage-explorer';
import SmartShoppingAssistant from './pages/smart-shopping-assistant';
import PersonalKitchenDashboard from './pages/personal-kitchen-dashboard';
import Homepage from './pages/homepage';
import APITestPage from './pages/api-test';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Homepage />} />
        <Route path="/recipe-detail/:id" element={<RecipeDetail />} />
        <Route path="/ai-recipe-search" element={<AIRecipeSearchPage />} />
        <Route path="/cultural-heritage-explorer" element={<CulturalHeritageExplorer />} />
        <Route path="/smart-shopping-assistant" element={<SmartShoppingAssistant />} />
        <Route path="/personal-kitchen-dashboard" element={<PersonalKitchenDashboard />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/api-test" element={<APITestPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
