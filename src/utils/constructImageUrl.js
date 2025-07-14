const BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BASE_URL;

export function constructImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const urlBase = BASE_URL.replace("/api/v1", "");
  return `${urlBase}${imagePath}`;
} 