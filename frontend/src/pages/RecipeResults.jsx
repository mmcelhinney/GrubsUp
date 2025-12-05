import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import useRecipeStore from '../store/recipeStore';
import api from '../utils/api';

export default function RecipeResults() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const { suggestedRecipes, setSuggestedRecipes, setError } = useRecipeStore();

  useEffect(() => {
    const fetchRecipes = async () => {
      const ingredients = searchParams.get('ingredients');
      
      if (!ingredients) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/recipes/suggestions?ingredients=${encodeURIComponent(ingredients)}`);
        setSuggestedRecipes(response.data.recipes || []);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError(error.response?.data?.error || 'Failed to fetch recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchParams, setSuggestedRecipes, setError]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe suggestions...</p>
        </div>
      </div>
    );
  }

  if (suggestedRecipes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4">No Recipes Found</h2>
          <p className="text-gray-600 mb-4">
            We couldn't find any recipes matching your ingredients.
          </p>
          <a href="/dashboard" className="btn btn-primary">
            Try Again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Recipe Suggestions
        </h1>
        <p className="text-gray-600">
          Found {suggestedRecipes.length} recipe{suggestedRecipes.length !== 1 ? 's' : ''} for you
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestedRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

