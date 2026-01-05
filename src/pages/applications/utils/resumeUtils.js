// Resume Utility Functions
import { RESUME_BASE_URL } from '../constants';

/**
 * Get complete resume URL with better path handling
 * @param {string} resumePath - Resume file path
 * @returns {string|null} Complete resume URL or null
 */
export const getResumeUrl = (resumePath) => {
  if (!resumePath) return null;

  // If the URL is already absolute (starts with http), use it as is
  if (resumePath.startsWith('http')) {
    return resumePath;
  }

  // If path starts with '/api/v1/uploads/', strip the '/api/v1/' part
  if (resumePath.startsWith('/api/v1/uploads/')) {
    const uploadsPath = resumePath.replace('/api/v1/', '');
    return `${RESUME_BASE_URL}/${uploadsPath}`;
  }

  // Handle paths with 'uploads/' prefix anywhere
  if (resumePath.includes('uploads/')) {
    const uploadsPath = resumePath.substring(resumePath.indexOf('uploads/'));
    return `${RESUME_BASE_URL}/${uploadsPath}`;
  }

  // Handle filename only (e.g., just the UUID-filename.pdf)
  if (
    !resumePath.includes('uploads/') &&
    !resumePath.includes('/') &&
    (resumePath.endsWith('.pdf') || resumePath.endsWith('.doc') || resumePath.endsWith('.docx'))
  ) {
    return `${RESUME_BASE_URL}/uploads/${resumePath}`;
  }

  // Fallback: Clean leading slash
  const cleanPath = resumePath.startsWith('/') ? resumePath.substring(1) : resumePath;
  return `${RESUME_BASE_URL}/${cleanPath}`;
};

/**
 * Determine file type from URL
 * @param {string} url - File URL
 * @returns {string} File type (pdf, word, image, unknown)
 */
export const getFileType = (url) => {
  if (!url) return 'unknown';

  const extension = url.split('.').pop()?.toLowerCase() || '';

  if (['pdf'].includes(extension)) return 'pdf';
  if (['doc', 'docx'].includes(extension)) return 'word';
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';

  return 'unknown';
};

/**
 * Download resume file
 * @param {string} resumePath - Resume file path
 * @param {string} candidateName - Candidate name for filename
 * @returns {Promise<void>}
 */
export const downloadResume = async (resumePath, candidateName) => {
  if (!resumePath) {
    throw new Error("No resume file available");
  }

  const resumeUrl = getResumeUrl(resumePath);

  // Create a filename based on the candidate's name and date
  const safeFileName = candidateName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const fileName = `${safeFileName}_resume_${new Date().toISOString().slice(0, 10)}.pdf`;

  // Fetch the file as a blob 
  const response = await fetch(resumeUrl);

  if (!response.ok) {
    throw new Error(`Failed to download resume: ${response.statusText}`);
  }

  const blob = await response.blob();

  // Create a URL for the blob
  const blobUrl = window.URL.createObjectURL(blob);

  // Create a temporary anchor element to trigger the download
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = fileName;

  // Append, click, and remove the download link
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  // Release the blob URL
  window.URL.revokeObjectURL(blobUrl);
};

