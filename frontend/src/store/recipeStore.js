import { create } from 'zustand';

const useRecipeStore = create((set) => ({
  detectedIngredients: [],
  suggestedRecipes: [],
  savedRecipes: [],
  isLoading: false,
  error: null,

  setDetectedIngredients: (ingredients) => {
    set({ detectedIngredients: ingredients });
  },

  setSuggestedRecipes: (recipes) => {
    set({ suggestedRecipes: recipes });
  },

  setSavedRecipes: (recipes) => {
    set({ savedRecipes: recipes });
  },

  addSavedRecipe: (recipe) => {
    set((state) => ({
      savedRecipes: [...state.savedRecipes, recipe]
    }));
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      detectedIngredients: [],
      suggestedRecipes: [],
      isLoading: false,
      error: null
    });
  }
}));

export default useRecipeStore;

