import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon.jsx';
import Image from '../../../components/AppImage.jsx';
import Button from '../../../components/ui/Button.jsx';
import { recipeAPI } from '../../../services/api.js';

const FeaturedRecipes = () => {
  const navigate = useNavigate();
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [_isLoading, setIsLoading] = useState(true);

  // Fetch recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const recipes = await recipeAPI.getAll(0, 6); // Get first 6 recipes
        
        // Transform API data to match component format
        const transformedRecipes = recipes.map((recipe, index) => ({
          id: recipe.id,
          title: recipe.name,
          description: recipe.shortDescription || recipe.description,
          image: recipe.image,
          region: recipe.region,
          cookingTime: recipe.cookingTimeMinutes 
            ? `${recipe.cookingTimeMinutes} menit` 
            : 'N/A',
          difficulty: recipe.difficulty || 'Sedang',
          budget: recipe.estimatedCost 
            ? `Rp ${recipe.estimatedCost.toLocaleString('id-ID')}` 
            : 'N/A',
          servings: recipe.servings || 2,
          rating: 4.5 + (Math.random() * 0.5), // Generate random rating 4.5-5.0
          reviews: Math.floor(50 + Math.random() * 100), // Generate random reviews 50-150
          tags: [recipe.difficulty, recipe.region, recipe.isTraditional ? 'Tradisional' : 'Modern'].filter(Boolean),
          isPopular: index === 0,
          isNew: recipe.isNew,
          isBudgetFriendly: recipe.estimatedCost && recipe.estimatedCost < 50000,
          isTraditional: recipe.isTraditional
        }));
        
        setFeaturedRecipes(transformedRecipes);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
        setFeaturedRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);


  const handleRecipeClick = (recipe) => {
    navigate(`/recipe-detail/${recipe?.id}`, { state: { recipeId: recipe?.id, recipe } });
  };

  const handleViewAll = () => {
    navigate('/ai-recipe-search');
  };

  const getBadgeInfo = (recipe) => {
    if (recipe?.isPopular) return { text: "Populer", color: "bg-accent text-white", icon: "TrendingUp" };
    if (recipe?.isNew) return { text: "Baru", color: "bg-success text-white", icon: "Sparkles" };
    if (recipe?.isTraditional) return { text: "Tradisional", color: "bg-primary text-white", icon: "Award" };
    if (recipe?.isBudgetFriendly) return { text: "Hemat", color: "bg-turmeric text-white", icon: "Wallet" };
    if (recipe?.isHealthy) return { text: "Sehat", color: "bg-pandan text-white", icon: "Heart" };
    if (recipe?.isSpicy) return { text: "Pedas", color: "bg-chili text-white", icon: "Flame" };
    return null;
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 text-primary mb-4">
            <Icon name="ChefHat" size={20} />
            <span className="text-sm font-medium uppercase tracking-wide">Resep Pilihan</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
            Resep Terpopuler Indonesia
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Koleksi resep autentik yang telah dipercaya ribuan keluarga Indonesia.
            Dari yang tradisional hingga modern, semua dengan panduan AI yang mudah diikuti.
          </p>
        </div>

        {/* Recipe Grid */}
        {featuredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="ChefHat" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat resep pilihan...</p>
          </div>
        ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredRecipes?.map((recipe) => {
            const badge = getBadgeInfo(recipe);

            return (
              <div
                key={recipe?.id}
                className="cultural-card cursor-pointer group"
                onClick={() => handleRecipeClick(recipe)}
              >
                {/* Recipe Image */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={recipe?.image}
                    alt={recipe?.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                  {/* Badge */}
                  {badge && (
                    <div className="absolute top-3 left-3">
                      <div className={`${badge?.color} px-2 py-1 rounded-full flex items-center space-x-1`}>
                        <Icon name={badge?.icon} size={12} />
                        <span className="text-xs font-medium">{badge?.text}</span>
                      </div>
                    </div>
                  )}

                  {/* Region */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                      <Icon name="MapPin" size={12} className="text-primary" />
                      <span className="text-xs font-medium text-primary">{recipe?.region}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                      <Icon name="Star" size={12} className="text-turmeric fill-current" />
                      <span className="text-xs font-medium text-foreground">{recipe?.rating}</span>
                      <span className="text-xs text-muted-foreground">({recipe?.reviews})</span>
                    </div>
                  </div>
                </div>
                {/* Recipe Info */}
                <div className="p-4 space-y-3">
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                      {recipe?.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {recipe?.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {recipe?.tags?.slice(0, 3)?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Recipe Stats */}
                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border text-center">
                    <div>
                      <Icon name="Clock" size={14} className="text-turmeric mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">{recipe?.cookingTime}</p>
                    </div>
                    <div>
                      <Icon name="BarChart3" size={14} className="text-accent mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">{recipe?.difficulty}</p>
                    </div>
                    <div>
                      <Icon name="Users" size={14} className="text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">{recipe?.servings} porsi</p>
                    </div>
                    <div>
                      <Icon name="Wallet" size={14} className="text-success mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">{recipe?.budget}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleViewAll}
            iconName="ArrowRight"
            iconPosition="right"
            className="bg-white shadow-cultural hover:shadow-cultural-lg"
          >
            Lihat Semua Resep
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRecipes;