import API from '../api/config/axios';

export function constructImageUrl(imagePath) {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (typeof imagePath === 'string' && (imagePath.startsWith("http://") || imagePath.startsWith("https://"))) {
    return imagePath;
  }
  
  // Get base URL from API instance
  const baseURL = API.defaults.baseURL || '';
  
  // If baseURL is not available, return null
  if (!baseURL) {
    return null;
  }
  
  // Remove /api/v1 from baseURL if present
  const urlBase = baseURL.replace("/api/v1", "").replace(/\/$/, "");
  
  // Ensure imagePath starts with /
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  
  return `${urlBase}${cleanPath}`;
} 