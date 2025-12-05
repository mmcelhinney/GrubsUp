import { useRef, useState } from 'react';

export default function ImageUploader({ onImageSelect, onImageUpload }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      if (onImageSelect) {
        onImageSelect(file);
      }
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) return;

    setUploading(true);
    try {
      if (onImageUpload) {
        await onImageUpload(file);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Upload Fridge Image</h3>
      
      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          capture="environment"
        />

        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="btn btn-primary flex-1"
              >
                {uploading ? 'Uploading...' : 'Upload & Scan'}
              </button>
              <button
                onClick={() => {
                  setPreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="btn btn-secondary"
              >
                Change
              </button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="space-y-4">
              <div className="text-6xl">📸</div>
              <div>
                <p className="text-gray-600 mb-2">
                  Take a photo or upload an image of your fridge
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPEG, PNG, WebP (max 10MB)
                </p>
              </div>
              <button
                onClick={handleCameraClick}
                className="btn btn-primary"
              >
                Choose Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

