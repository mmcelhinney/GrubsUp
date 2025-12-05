import prisma from '../utils/db.js';

export const getSuggestions = async (req, res, next) => {
  try {
    const { ingredients } = req.query;

    if (!ingredients) {
      return res.status(400).json({ error: 'ingredients query parameter is required' });
    }

    const ingredientList = ingredients.split(',').map(i => i.trim().toLowerCase());

    // Find recipes that contain at least one of the provided ingredients
    const recipes = await prisma.recipe.findMany({
      where: {
        ingredients: {
          some: {
            ingredient: {
              name: {
                in: ingredientList
              }
            }
          }
        }
      },
      include: {
        ingredients: {
          include: {
            ingredient: true
          }
        }
      }
    });

    // Sort by number of matching ingredients (descending)
    const recipesWithMatchCount = recipes.map(recipe => {
      const matchingIngredients = recipe.ingredients.filter(ri =>
        ingredientList.includes(ri.ingredient.name)
      );
      return {
        ...recipe,
        matchCount: matchingIngredients.length,
        matchingIngredients: matchingIngredients.map(ri => ri.ingredient.name)
      };
    }).sort((a, b) => b.matchCount - a.matchCount);

    res.json({
      recipes: recipesWithMatchCount,
      requestedIngredients: ingredientList
    });
  } catch (error) {
    next(error);
  }
};

export const saveRecipe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).json({ error: 'recipeId is required' });
    }

    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId }
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Check if already saved
    const existing = await prisma.userSavedRecipe.findUnique({
      where: {
        userId_recipeId: {
          userId: req.user.id,
          recipeId
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Recipe already saved' });
    }

    // Save recipe
    const savedRecipe = await prisma.userSavedRecipe.create({
      data: {
        userId: req.user.id,
        recipeId
      },
      include: {
        recipe: {
          include: {
            ingredients: {
              include: {
                ingredient: true
              }
            }
          }
        }
      }
    });

    res.json({
      message: 'Recipe saved successfully',
      savedRecipe
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedRecipes = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const savedRecipes = await prisma.userSavedRecipe.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        recipe: {
          include: {
            ingredients: {
              include: {
                ingredient: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      savedRecipes: savedRecipes.map(sr => sr.recipe)
    });
  } catch (error) {
    next(error);
  }
};

