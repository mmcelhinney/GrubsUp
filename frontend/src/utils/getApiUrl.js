// Get the API URL - use environment variable or detect from current location
export function getApiUrl() {
  // If VITE_API_URL is set, use it (but warn if it's absolute in dev)
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL;
    if (import.meta.env.DEV && url.startsWith('http')) {
      console.warn('⚠️  VITE_API_URL is set to absolute URL in dev mode. This will bypass the proxy!');
      console.warn('   Consider using relative URL "/api" to use Vite proxy.');
    }
    return url;
  }

  // In development, ALWAYS use relative URL to go through Vite proxy
  // This ensures it works from any device on the network
  if (import.meta.env.DEV) {
    // Use relative URL - Vite proxy will forward to backend
    return '/api';
  }

  // Production fallback - also relative
  return '/api';
}

// Get the base URL for image uploads
export function getImageUrl(path) {
  if (!path) return '';
  
  // If path already includes http, return as is
  if (path.startsWith('http')) {
    return path;
  }

  // Clean the path
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // In development, use relative path to go through Vite proxy
  // The proxy will forward /uploads to the backend
  if (import.meta.env.DEV) {
    return cleanPath;
  }

  // Production: use relative path
  return cleanPath;
}

