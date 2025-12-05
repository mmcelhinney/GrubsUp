import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import IngredientList from '../components/IngredientList';
import useRecipeStore from '../store/recipeStore';
import api from '../utils/api';
import useAuthStore from '../store/authStore';
import { getImageUrl } from '../utils/getApiUrl';

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImagePath, setUploadedImagePath] = useState(null);
  const [scanning, setScanning] = useState(false);
  
  const { 
    detectedIngredients, 
    setDetectedIngredients, 
    setLoading,
    setError 
  } = useRecipeStore();
  
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleImageSelect = (file) => {
    setSelectedFile(file);
  };

  const handleImageUpload = async (file) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Upload image
      const uploadResponse = await api.post('/upload/fridge-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { filePath } = uploadResponse.data;
      setUploadedImagePath(filePath);

      // Scan image for ingredients
      setScanning(true);
      const scanResponse = await api.post('/ai/scan', {
        imagePath: filePath
      });

      const { ingredients } = scanResponse.data;
      setDetectedIngredients(ingredients);

      // Navigate to recipes page with ingredients
      if (ingredients.length > 0) {
        const ingredientNames = ingredients.map(i => i.name).join(',');
        navigate(`/recipes?ingredients=${encodeURIComponent(ingredientNames)}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.error || 'Failed to process image');
    } finally {
      setLoading(false);
      setScanning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isAuthenticated ? 'Welcome Back!' : 'Guest Mode'}
        </h1>
        <p className="text-gray-600">
          Upload a photo of your fridge to discover recipes you can make
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <ImageUploader
            onImageSelect={handleImageSelect}
            onImageUpload={handleImageUpload}
          />
          {scanning && (
            <div className="mt-4 card text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Scanning image for ingredients...</p>
            </div>
          )}
        </div>

        <div>
          <IngredientList ingredients={detectedIngredients} />
        </div>
      </div>

      {uploadedImagePath && (
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold mb-2">Uploaded Image</h3>
          <img
            src={getImageUrl(uploadedImagePath)}
            alt="Uploaded fridge"
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

