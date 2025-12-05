import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleRecipes = [
  {
    name: 'Scrambled Eggs',
    instructions: `1. Crack 2-3 eggs into a bowl
2. Add a splash of milk and whisk
3. Heat butter in a pan over medium heat
4. Pour in eggs and stir gently
5. Cook until eggs are set but still creamy
6. Season with salt and pepper`,
    imageUrl: null,
    ingredients: ['eggs', 'milk', 'butter']
  },
  {
    name: 'Pancakes',
    instructions: `1. Mix 1 cup flour, 2 tbsp sugar, 2 tsp baking powder, and 1/2 tsp salt
2. In another bowl, whisk 1 cup milk, 1 egg, and 2 tbsp melted butter
3. Combine wet and dry ingredients
4. Cook on a griddle over medium heat
5. Flip when bubbles form on top
6. Serve with syrup or fruit`,
    imageUrl: null,
    ingredients: ['milk', 'eggs', 'butter', 'flour']
  },
  {
    name: 'Grilled Cheese Sandwich',
    instructions: `1. Butter one side of each bread slice
2. Place cheese between bread slices
3. Cook in a pan over medium heat
4. Flip when golden brown
5. Cook until cheese is melted`,
    imageUrl: null,
    ingredients: ['cheese', 'butter', 'bread']
  },
  {
    name: 'Mac and Cheese',
    instructions: `1. Cook pasta according to package directions
2. Melt butter in a saucepan
3. Add flour and whisk to make a roux
4. Gradually add milk, stirring constantly
5. Add shredded cheese and stir until melted
6. Mix with cooked pasta
7. Season with salt and pepper`,
    imageUrl: null,
    ingredients: ['cheese', 'milk', 'butter', 'pasta']
  },
  {
    name: 'French Toast',
    instructions: `1. Whisk 2 eggs, 1/2 cup milk, and 1 tsp vanilla
2. Dip bread slices in the mixture
3. Cook in a buttered pan over medium heat
4. Flip when golden brown
5. Serve with syrup or powdered sugar`,
    imageUrl: null,
    ingredients: ['eggs', 'milk', 'butter', 'bread']
  },
  {
    name: 'Omelette',
    instructions: `1. Beat 2-3 eggs with a splash of milk
2. Heat butter in a non-stick pan
3. Pour in eggs and let set slightly
4. Add fillings (cheese, vegetables)
5. Fold in half when eggs are set
6. Serve hot`,
    imageUrl: null,
    ingredients: ['eggs', 'milk', 'butter', 'cheese']
  }
];

async function seedRecipes() {
  try {
    console.log('🌱 Seeding recipes...');

    for (const recipeData of sampleRecipes) {
      // Check if recipe already exists
      const existing = await prisma.recipe.findFirst({
        where: { name: recipeData.name }
      });

      if (existing) {
        console.log(`⏭️  Recipe "${recipeData.name}" already exists, skipping...`);
        continue;
      }

      // Create or find ingredients
      const ingredientIds = [];
      for (const ingredientName of recipeData.ingredients) {
        let ingredient = await prisma.ingredient.findUnique({
          where: { name: ingredientName.toLowerCase() }
        });

        if (!ingredient) {
          ingredient = await prisma.ingredient.create({
            data: { name: ingredientName.toLowerCase() }
          });
        }

        ingredientIds.push(ingredient.id);
      }

      // Create recipe
      const recipe = await prisma.recipe.create({
        data: {
          name: recipeData.name,
          instructions: recipeData.instructions,
          imageUrl: recipeData.imageUrl,
          ingredients: {
            create: ingredientIds.map(ingredientId => ({
              ingredient: {
                connect: { id: ingredientId }
              }
            }))
          }
        }
      });

      console.log(`✅ Created recipe: ${recipe.name}`);
    }

    console.log('✨ Seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding recipes:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedRecipes();

