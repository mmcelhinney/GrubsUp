import { useState } from 'react';
import api from '../utils/api';
import useRecipeStore from '../store/recipeStore';
import useAuthStore from '../store/authStore';

export default function RecipeCard({ recipe }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { addSavedRecipe } = useRecipeStore();
  const { isAuthenticated } = useAuthStore();

  const handleSave = async () => {
    if (!isAuthenticated) {
      alert('Please login to save recipes');
      return;
    }

    setSaving(true);
    try {
      await api.post('/recipes/save', { recipeId: recipe.id });
      setSaved(true);
      addSavedRecipe(recipe);
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe');
    } finally {
      setSaving(false);
    }
  };

  const ingredients = recipe.ingredients?.map(ri => ri.ingredient?.name || ri) || [];

  return (
    <div className="card hover:shadow-lg transition-shadow">
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <h3 className="text-xl font-semibold mb-2">{recipe.name}</h3>
      
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Ingredients:</h4>
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
            >
              {ingredient}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Instructions:</h4>
        <p className="text-gray-600 text-sm whitespace-pre-line">
          {recipe.instructions}
        </p>
      </div>

      {isAuthenticated && (
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={`btn w-full ${
            saved ? 'btn-secondary' : 'btn-primary'
          }`}
        >
          {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save Recipe'}
        </button>
      )}
    </div>
  );
}

