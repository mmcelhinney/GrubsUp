export default function IngredientList({ ingredients }) {
  if (!ingredients || ingredients.length === 0) {
    return (
      <div className="card">
        <p className="text-gray-500">No ingredients detected yet. Upload an image to get started!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Detected Ingredients</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="bg-orange-50 border border-orange-200 rounded-lg p-3"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-800 capitalize">
                {ingredient.name}
              </span>
              {ingredient.confidence && (
                <span className="text-xs text-gray-500">
                  {Math.round(ingredient.confidence * 100)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

