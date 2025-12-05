import { scanImageForIngredients } from '../services/aiService.js';
import prisma from '../utils/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const scanImage = async (req, res, next) => {
  try {
    const { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({ error: 'imagePath is required' });
    }

    // Construct full path
    const fullPath = path.join(__dirname, '../../uploads', path.basename(imagePath));

    // Scan image for ingredients
    const detectedIngredients = await scanImageForIngredients(fullPath);

    // Save ingredients to database if user is authenticated
    if (req.user) {
      // Find or create image record
      const image = await prisma.image.findFirst({
        where: {
          filePath: path.basename(imagePath),
          userId: req.user.id
        }
      });

      if (image) {
        // Clear existing ingredients for this image
        await prisma.imageIngredient.deleteMany({
          where: { imageId: image.id }
        });

        // Create ingredient records
        for (const ingredient of detectedIngredients) {
          // Find or create ingredient
          let ingredientRecord = await prisma.ingredient.findUnique({
            where: { name: ingredient.name.toLowerCase() }
          });

          if (!ingredientRecord) {
            ingredientRecord = await prisma.ingredient.create({
              data: { name: ingredient.name.toLowerCase() }
            });
          }

          // Link ingredient to image
          await prisma.imageIngredient.create({
            data: {
              imageId: image.id,
              ingredientId: ingredientRecord.id,
              confidence: ingredient.confidence
            }
          });
        }
      }
    }

    res.json({
      ingredients: detectedIngredients
    });
  } catch (error) {
    next(error);
  }
};

