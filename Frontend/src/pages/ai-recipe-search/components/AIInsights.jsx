import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import insightsDataset from '../../../data/aiInsightsDataset.json';

const INSIGHT_TEMPLATES = Array.isArray(insightsDataset) ? insightsDataset : [];
const DEFAULT_INSIGHT_TEMPLATE =
  INSIGHT_TEMPLATES.find((item) => item?.id === 'vegetarian') || INSIGHT_TEMPLATES[0] || {};

const AIInsights = ({ searchQuery, results, filters }) => {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getSearchIntent = (query) => {
    const intents = {
      rendang: 'Mencari resep tradisional Sumatera',
      vegetarian: 'Mencari alternatif protein nabati',
      cepat: 'Mencari solusi memasak praktis',
      sehat: 'Fokus pada nutrisi dan kesehatan',
      budget: 'Mengutamakan efisiensi biaya',
      default: 'Eksplorasi kuliner Indonesia'
    };

    for (const [key, intent] of Object.entries(intents)) {
      if (query?.toLowerCase()?.includes(key)) {
        return intent;
      }
    }

    return intents?.default;
  };

  const getCulturalRegion = (query) => {
    const regions = {
      rendang: 'Sumatera Barat',
      gudeg: 'Yogyakarta',
      soto: 'Jawa Tengah',
      'gado-gado': 'Betawi',
      default: 'Nusantara'
    };

    for (const [key, region] of Object.entries(regions)) {
      if (query?.toLowerCase()?.includes(key)) {
        return region;
      }
    }

    return regions?.default;
  };

  const findInsightTemplate = (query) => {
    if (!query) {
      return DEFAULT_INSIGHT_TEMPLATE;
    }

    const normalizedQuery = query.toLowerCase();

    return (
      INSIGHT_TEMPLATES?.find((template) =>
        template?.matchTerms?.some((term) => normalizedQuery.includes(term?.toLowerCase()))
      ) || DEFAULT_INSIGHT_TEMPLATE
    );
  };

  const computeBudgetStats = (recipes = []) => {
    const costs = recipes
      ?.map((recipe) => Number(recipe?.estimatedCost))
      ?.filter((value) => Number.isFinite(value));

    if (!costs?.length) {
      return null;
    }

    const total = costs?.reduce((acc, value) => acc + value, 0);

    return {
      avgCost: Math.round(total / costs.length),
      costRange: {
        min: Math.min(...costs),
        max: Math.max(...costs)
      }
    };
  };

  const computeConfidence = (baseConfidence = DEFAULT_INSIGHT_TEMPLATE?.searchAnalysis?.confidence || 85, recipes = []) => {
    if (!recipes?.length) {
      return Math.max(50, baseConfidence - 10);
    }

    const culturalDiversity = new Set(
      recipes?.map((recipe) => recipe?.cultural)?.filter(Boolean)
    )?.size;

    const diversityBonus = Math.min(6, culturalDiversity * 2);
    const volumeBonus = Math.min(6, recipes.length);

    return Math.min(100, baseConfidence + diversityBonus + volumeBonus);
  };

  const countAppliedFilters = (appliedFilters) => {
    if (!appliedFilters) {
      return 0;
    }

    return Object.values(appliedFilters)?.reduce((acc, value) => {
      if (!value) {
        return acc;
      }

      if (Array.isArray(value)) {
        return acc + value.length;
      }

      if (typeof value === 'object') {
        return (
          acc +
          Object.values(value)?.reduce((count, item) => (item ? count + 1 : count), 0)
        );
      }

      return acc + 1;
    }, 0);
  };

  const buildSuggestions = (templateSuggestions = []) => {
    const suggestions = [...templateSuggestions];
    const filterCount = countAppliedFilters(filters);

    if (filterCount > 0) {
      suggestions.push(
        `Filter aktif (${filterCount}) bisa disesuaikan untuk hasil yang lebih presisi`
      );
    } else if (results?.length > 3) {
      suggestions.push('Gunakan filter tingkat kesulitan untuk mempersempit rekomendasi');
    }

    return suggestions?.slice(0, 3);
  };

  const generateInsights = () => {
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      const template = findInsightTemplate(searchQuery);
      const budgetStats = computeBudgetStats(results);
      const resolvedInsights = {
        searchAnalysis: {
          intent: template?.searchAnalysis?.intent || getSearchIntent(searchQuery),
          confidence: computeConfidence(template?.searchAnalysis?.confidence, results),
          suggestions: buildSuggestions(template?.searchAnalysis?.suggestions)
        },
        nutritionalTrends: {
          avgCalories: template?.nutritionalTrends?.avgCalories || 0,
          healthScore: template?.nutritionalTrends?.healthScore || 0,
          commonIngredients: template?.nutritionalTrends?.commonIngredients || []
        },
        budgetAnalysis: {
          avgCost: budgetStats?.avgCost ?? template?.budgetAnalysis?.avgCost ?? 0,
          costRange: {
            min: budgetStats?.costRange?.min ?? template?.budgetAnalysis?.costRange?.min ?? 0,
            max: budgetStats?.costRange?.max ?? template?.budgetAnalysis?.costRange?.max ?? 0
          },
          budgetTips: template?.budgetAnalysis?.budgetTips || []
        },
        culturalContext: {
          region: template?.culturalContext?.region || getCulturalRegion(searchQuery),
          tradition: template?.culturalContext?.tradition || '',
          modernAdaptation: template?.culturalContext?.modernAdaptation || ''
        },
        personalizedRecommendations: template?.personalizedRecommendations || []
      };

      setInsights(resolvedInsights);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timeoutId);
  };

  useEffect(() => {
    if (searchQuery && results?.length > 0) {
      return generateInsights();
    }

    setInsights(null);
    setIsLoading(false);

    return undefined;
  }, [searchQuery, results, filters]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    })?.format(amount ?? 0);
  };

  if (!searchQuery || !results?.length) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/10">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Brain" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
        </div>

        <div className="flex items-center space-x-3">
          <Icon name="Loader2" size={20} className="animate-spin text-primary" />
          <span className="text-muted-foreground">Menganalisis hasil pencarian...</span>
        </div>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Brain" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Zap" size={16} className="text-accent" />
          <span>Confidence: {insights?.searchAnalysis?.confidence}%</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Analysis */}
        <div className="space-y-4">
          <div className="bg-background/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Target" size={16} className="text-primary" />
              <h4 className="font-medium text-foreground">Analisis Pencarian</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{insights?.searchAnalysis?.intent}</p>

            <div className="space-y-2">
              <h5 className="text-xs font-medium text-foreground">Saran AI:</h5>
              {insights?.searchAnalysis?.suggestions?.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Icon name="ArrowRight" size={12} className="text-accent mt-0.5" />
                  <span className="text-xs text-muted-foreground">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Context */}
          <div className="bg-background/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="MapPin" size={16} className="text-turmeric" />
              <h4 className="font-medium text-foreground">Konteks Budaya</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-foreground">Asal Daerah: </span>
                <span className="text-muted-foreground">{insights?.culturalContext?.region}</span>
              </div>
              <p className="text-muted-foreground">{insights?.culturalContext?.tradition}</p>
            </div>
          </div>
        </div>

        {/* Nutritional & Budget Analysis */}
        <div className="space-y-4">
          <div className="bg-background/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="DollarSign" size={16} className="text-success" />
              <h4 className="font-medium text-foreground">Analisis Budget</h4>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg font-semibold text-success">
                  {formatCurrency(insights?.budgetAnalysis?.avgCost)}
                </div>
                <div className="text-xs text-muted-foreground">Rata-rata Biaya</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">
                  {formatCurrency(insights?.budgetAnalysis?.costRange?.min)} - {formatCurrency(insights?.budgetAnalysis?.costRange?.max)}
                </div>
                <div className="text-xs text-muted-foreground">Rentang Harga</div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-medium text-foreground">Tips Hemat:</h5>
              {insights?.budgetAnalysis?.budgetTips?.slice(0, 2)?.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Icon name="Lightbulb" size={12} className="text-warning mt-0.5" />
                  <span className="text-xs text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nutritional Trends */}
          <div className="bg-background/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Activity" size={16} className="text-pandan" />
              <h4 className="font-medium text-foreground">Tren Nutrisi</h4>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg font-semibold text-pandan">
                  {insights?.nutritionalTrends?.avgCalories}
                </div>
                <div className="text-xs text-muted-foreground">Kalori Rata-rata</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-pandan">
                  {insights?.nutritionalTrends?.healthScore}/100
                </div>
                <div className="text-xs text-muted-foreground">Skor Kesehatan</div>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-medium text-foreground mb-2">Bahan Umum:</h5>
              <div className="flex flex-wrap gap-1">
                {insights?.nutritionalTrends?.commonIngredients?.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-pandan/10 text-pandan rounded-full text-xs"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Personalized Recommendations */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Sparkles" size={16} className="text-accent" />
          <h4 className="font-medium text-foreground">Rekomendasi Personal</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {insights?.personalizedRecommendations?.map((recommendation, index) => (
            <div
              key={index}
              className="p-3 bg-background/50 rounded-lg border border-accent/10 hover:border-accent/20 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-start space-x-2">
                <Icon name="ArrowRight" size={14} className="text-accent mt-0.5" />
                <span className="text-sm text-muted-foreground">{recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          iconName="RefreshCw"
          iconPosition="left"
          onClick={generateInsights}
        >
          Refresh Insights
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconName="Share2"
          iconPosition="left"
        >
          Bagikan Analisis
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconName="BookOpen"
          iconPosition="left"
        >
          Pelajari Lebih Lanjut
        </Button>
      </div>
    </div>
  );
};

export default AIInsights;
