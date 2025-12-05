import { useRef, useState } from 'react';

// Detect if device is mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
};

export default function ImageUploader({ onImageSelect, onImageUpload }) {
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
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

    setSelectedFile(file);
    if (onImageSelect) {
      onImageSelect(file);
    }
  };

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      if (onImageUpload) {
        await onImageUpload(selectedFile);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setSelectedFile(null);
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4"> Upload a photo of your fridge to discover recipes you can make</h3>
      
      <div className="space-y-4">
        {/* Camera input - opens camera on mobile */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* File picker input - for choosing from gallery/storage */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="btn btn-primary flex-1"
              >
                {uploading ? 'Uploading...' : 'Upload & Scan'}
              </button>
              <button
                onClick={handleReset}
                className="btn btn-secondary"
              >
                Change Image
              </button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="space-y-6">
              <div className="text-6xl">📸</div>
              <div>
                <p className="text-gray-700 font-medium mb-1">
                  {isMobile() 
                    ? 'Take a photo of your fridge' 
                    : 'Upload an image of your fridge'}
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPEG, PNG, WebP (max 10MB)
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {isMobile() && (
                  <button
                    onClick={handleTakePhoto}
                    className="btn btn-primary flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">📷</span>
                    <span>Take Photo</span>
                  </button>
                )}
                <button
                  onClick={handleChooseFile}
                  className={`btn ${isMobile() ? 'btn-outline' : 'btn-primary'} flex items-center justify-center gap-2`}
                >
                  <span className="text-xl">🖼️</span>
                  <span>{isMobile() ? 'Choose from Gallery' : 'Choose Image'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

