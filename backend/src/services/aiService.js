/**
 * AI Service for ingredient detection
 * This is a stub implementation that will be replaced with actual AI integration
 */

export async function scanImageForIngredients(imagePath) {
  // TODO: Integrate real AI call later (OpenAI Vision, custom model, etc.)
  
  // Mock implementation for development
  // In production, this would call an AI service
  const mockIngredients = [
    { name: 'milk', confidence: 0.88 },
    { name: 'eggs', confidence: 0.92 },
    { name: 'butter', confidence: 0.75 },
    { name: 'cheese', confidence: 0.68 }
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return random subset of mock ingredients
  const shuffled = mockIngredients.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 2);
}

