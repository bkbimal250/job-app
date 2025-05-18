import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/getToken";
import { useParams } from "react-router-dom";
import { 
  Upload, MapPin, Clock, Mail, Phone, Globe, ImagePlus, Map, Compass,
  AlertCircle, CheckCircle, Loader, X, Star, MessageSquare
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ADDRESS_FIELDS = [
  { key: "state", required: true },
  { key: "city", required: true },
  { key: "district", required: true },
  { key: "pincode", required: true }
];

const INITIAL_FORM_DATA = {
  name: "",
  address: { state: "", city: "", district: "", pincode: "" },
  fullAddress: "",
  phone: "",
  email: "",
  website: "",
  logo: "",
  openingHours: "",
  closingHours: "",
  rating: 0,
  reviews: 0,
  geolocation: {
    type: "Point",
    coordinates: [null, null] // [longitude, latitude]
  },
  googleMap: "",
  direction: "",
  isActive: true,
  galleryImages: [],
};

const INITIAL_FORM_ERRORS = {
  name: "",
  phone: "",
  email: "",
  website: "",
  fullAddress: "",
  address: { state: "", city: "", district: "", pincode: "" },
  openingHours: "",
  closingHours: "",
  geolocation: { coordinates: ["", ""] },
};

// Simplified InputField component
const InputField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  placeholder = "", 
  required = false, 
  error = "", 
  icon = null 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border rounded-md ${
          icon ? 'pl-10' : ''
        } ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        }`}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const EditSpaForm = ({ spaId, onSuccess }) => {
  const { id } = useParams(); // Get ID from URL if available
  const effectiveSpaId = spaId || id; // Use provided ID or URL parameter
  
  const [formData, setFormData] = useState({ ...INITIAL_FORM_DATA });
  const [formErrors, setFormErrors] = useState({ ...INITIAL_FORM_ERRORS });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add these new states for file handling
  const [logoFile, setLogoFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [spa, setSpa] = useState(null);
  
  // Fetch spa data from API
  useEffect(() => {
    const fetchSpaData = async () => {
      if (!effectiveSpaId) {
        setError("No spa ID provided");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch all spas and find the one we need
        const response = await axios.get(`${BASE_URL}/spas/spaall/`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        
        // Process response data
        let allSpas = [];
        if (Array.isArray(response.data)) {
          allSpas = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          allSpas = response.data.data;
        }
        
        // Find the spa with matching ID
        const foundSpa = allSpas.find(spa => spa._id === effectiveSpaId);
        
        if (foundSpa) {
          setSpa(foundSpa);
          
          // Initialize form with the found spa data
          const initialData = {
            ...INITIAL_FORM_DATA, // Start with default data
            ...foundSpa, // Overlay with spa data
            address: {
              ...INITIAL_FORM_DATA.address, // Default address structure
              ...(foundSpa.address || {}) // Overlay with spa address if available
            },
            geolocation: {
              type: "Point",
              coordinates: [
                foundSpa.geolocation?.coordinates?.[0] ?? null,
                foundSpa.geolocation?.coordinates?.[1] ?? null
              ]
            },
            galleryImages: foundSpa.galleryImages || [],
            rating: foundSpa.rating || 0,
            reviews: foundSpa.reviews || 0,
            isActive: foundSpa.isActive !== undefined ? foundSpa.isActive : true
          };
          
          setFormData(initialData);
        } else {
          setError(`Spa with ID ${effectiveSpaId} not found`);
        }
      } catch (err) {
        console.error("Error fetching spa data:", err);
        setError("Failed to load spa data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpaData();
  }, [effectiveSpaId]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke all preview URLs to prevent memory leaks
      if (formData.logo && formData.logo.startsWith('blob:')) {
        URL.revokeObjectURL(formData.logo);
      }
      
      formData.galleryImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  // Input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear error for the field being changed
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormErrors(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: ""
        }
      }));
    } else {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Update form data
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  // Coordinate change handler
  const handleCoordinatesChange = (index, value) => {
    const numValue = value === "" ? null : parseFloat(value);
    
    // Clear error for the coordinates
    setFormErrors(prev => {
      const updatedCoordErrors = [...prev.geolocation.coordinates];
      updatedCoordErrors[index] = "";
      return {
        ...prev,
        geolocation: { 
          ...prev.geolocation, 
          coordinates: updatedCoordErrors 
        }
      };
    });

    // Update form data
    setFormData(prev => {
      const updatedCoords = [...(prev.geolocation?.coordinates || [null, null])];
      updatedCoords[index] = numValue;
      return {
        ...prev,
        geolocation: { 
          ...(prev.geolocation || { type: "Point" }), 
          coordinates: updatedCoords 
        }
      };
    });
  };

  // Validate file
  const validateFile = (file) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp','image/JPG'];
    
    if (file.size > MAX_SIZE) {
      return `File "${file.name}" exceeds 5MB size limit`;
    }
    
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `File "${file.name}" must be a valid image (JPEG, PNG, GIF, WebP)`;
    }
    
    return null;
  };

  // Logo upload handler
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    // Store the actual file for later upload
    setLogoFile(file);
    
    // Set a preview URL for display
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      logo: previewUrl, // This is just for display, not for sending to server
    }));
    
    setSuccessMessage("Logo ready for upload");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Gallery image upload handler
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const validFiles = [];
    const failedUploads = [];
    const previewUrls = [];
    
    // Process each file
    files.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        failedUploads.push({ name: file.name, error: validationError });
      } else {
        validFiles.push(file);
        previewUrls.push(URL.createObjectURL(file));
      }
    });
    
    // Store the actual files for later upload
    setGalleryFiles(prev => [...prev, ...validFiles]);
    
    // Set preview URLs for display
    setFormData(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, ...previewUrls], // These are just for display
    }));
    
    if (validFiles.length > 0) {
      setSuccessMessage(`${validFiles.length} image(s) ready for upload`);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
    
    if (failedUploads.length > 0) {
      setError(`${failedUploads.length} invalid file(s): ${failedUploads.map(f => f.name).join(", ")}`);
    }
  };

  // Remove image from gallery
  const removeGalleryImage = (index) => {
    // Check if the image is a preview URL (blob) or an original URL
    const imageUrl = formData.galleryImages[index];
    
    // Remove from previews in form data
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
    
    // If it's a blob URL (new file), remove from galleryFiles array and revoke URL
    if (imageUrl.startsWith('blob:')) {
      // Find the index in galleryFiles by comparing preview URLs
      const fileIndex = galleryFiles.findIndex((_, i) => {
        const preview = URL.createObjectURL(galleryFiles[i]);
        URL.revokeObjectURL(preview); // Clean up
        return preview === imageUrl;
      });
      
      if (fileIndex !== -1) {
        setGalleryFiles(prev => prev.filter((_, i) => i !== fileIndex));
      }
      
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(imageUrl);
    }
  };

  // Basic form validation
  const validateForm = () => {
    const errors = { ...INITIAL_FORM_ERRORS };
    let isValid = true;
    
    if (!formData.name?.trim()) {
      errors.name = "Spa name is required";
      isValid = false;
    }
    
    if (!formData.phone?.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    }
    
    if (!formData.email?.trim()) {
      errors.email = "Email is required";
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if spa ID is available
    if (!effectiveSpaId) {
      setError("Cannot update spa: missing spa ID");
      return;
    }
    
    // Validate form
    if (!validateForm()) {
      setError("Please fix the errors in the form before submitting");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // Create FormData object for multipart/form-data submission
      const formDataObj = new FormData();
      
      // Add all the basic text fields
      formDataObj.append('name', formData.name);
      formDataObj.append('fullAddress', formData.fullAddress);
      formDataObj.append('phone', formData.phone);
      formDataObj.append('email', formData.email);
      formDataObj.append('website', formData.website || '');
      formDataObj.append('rating', formData.rating);
      formDataObj.append('reviews', formData.reviews);
      formDataObj.append('openingHours', formData.openingHours);
      formDataObj.append('closingHours', formData.closingHours);
      formDataObj.append('isActive', formData.isActive.toString());
      formDataObj.append('googleMap', formData.googleMap || '');
      formDataObj.append('direction', formData.direction || '');
      
      // Add nested address fields DIRECTLY
      formDataObj.append('address[city]', formData.address.city);
      formDataObj.append('address[state]', formData.address.state);
      formDataObj.append('address[district]', formData.address.district);
      formDataObj.append('address[pincode]', formData.address.pincode);
      
      // Add geolocation fields DIRECTLY
      formDataObj.append('geolocation[type]', 'Point');
      
      const longitude = parseFloat(formData.geolocation.coordinates[0]);
      const latitude = parseFloat(formData.geolocation.coordinates[1]);
      
      formDataObj.append('geolocation[coordinates][0]', longitude);
      formDataObj.append('geolocation[coordinates][1]', latitude);
      
      // Add logo file if it exists
      if (logoFile) {
        formDataObj.append('logo', logoFile);
      }
      
      // Add gallery files if they exist
      if (galleryFiles.length > 0) {
        galleryFiles.forEach(file => {
          formDataObj.append('galleryImages', file);
        });
      }
      
      // Get authentication token
      const token = getToken();
      
      // Send data to the API using axios with authorization
      const response = await axios.put(`${BASE_URL}/spas/spa/${effectiveSpaId}`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Handle success
      setSuccessMessage("Spa has been updated successfully!");
      alert("Your spa has been updated successfully!");

      // Call success callback with the updated spa data
      if (onSuccess) {
        onSuccess(response.data);
      }
      
    } catch (err) {
      console.error("Form submission error:", err);
      // Handle Axios error response
      if (err.response) {
        const errorMessage = err.response.data.message || err.response.data.error || 'Failed to update spa';
        setError(errorMessage);
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError(err.message || "Failed to update spa. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mx-auto mb-2"></div>
        </div>
        <p className="mt-6 text-gray-500">Loading spa data...</p>
      </div>
    );
  }

  // If no spa found after loading
  if (!spa && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
            <h2 className="text-lg font-medium">Spa Not Found</h2>
          </div>
          <p className="mt-2">
            {error || `The spa with ID ${effectiveSpaId} could not be found. Please check the ID and try again.`}
          </p>
          <button
            onClick={() => {
              if (onSuccess) onSuccess(null); // Cancel operation
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container bg-gray-200 mx-auto px-4 py-8">
      {/* Status Messages */}
      {error && (
        <div className="mx-auto max-w-4xl mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="mx-auto max-w-4xl mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-green-500" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 space-y-8">
        <h1 className="text-2xl font-bold text-center">Edit Spa: {formData.name}</h1>

        {/* Basic Info Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <InputField 
              label="Spa Name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              error={formErrors.name}
            />
            <InputField 
              label="Phone" 
              name="phone" 
              type="tel" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
              error={formErrors.phone}
            />
            <InputField 
              label="Email" 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              error={formErrors.email}
            />
            <InputField 
              label="Website" 
              name="website" 
              type="url" 
              value={formData.website} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Address Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Address & Location</h3>
          <div className="mb-4">
            <InputField 
              label="Full Address" 
              name="fullAddress" 
              value={formData.fullAddress} 
              onChange={handleChange} 
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {ADDRESS_FIELDS.map((field, index) => (
              <InputField
                key={`address-${field.key}`}
                label={field.key.charAt(0).toUpperCase() + field.key.slice(1)}
                name={`address.${field.key}`}
                value={formData.address?.[field.key]}
                onChange={handleChange}
                required={field.required}
                error={formErrors.address?.[field.key]}
              />
            ))}
          </div>
        </div>

        {/* Coordinates Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Coordinates & Operating Hours</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <InputField 
              label="Longitude" 
              type="number" 
              step="any" 
              value={formData.geolocation?.coordinates?.[0] === null ? "" : formData.geolocation?.coordinates?.[0]} 
              onChange={(e) => handleCoordinatesChange(0, e.target.value)} 
            />
            <InputField 
              label="Latitude" 
              type="number" 
              step="any" 
              value={formData.geolocation?.coordinates?.[1] === null ? "" : formData.geolocation?.coordinates?.[1]} 
              onChange={(e) => handleCoordinatesChange(1, e.target.value)} 
            />
            <InputField 
              label="Opening Hours" 
              name="openingHours" 
              value={formData.openingHours} 
              onChange={handleChange} 
            />
            <InputField 
              label="Closing Hours" 
              name="closingHours" 
              value={formData.closingHours} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Logo Upload Section - Enhanced Design */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Spa Logo</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            {formData.logo ? (
              <div className="flex items-center">
                <div className="h-16 w-16 bg-white border border-gray-200 rounded-md p-1 flex-shrink-0 mr-4">
                  <img 
                    src={formData.logo} 
                    alt="Logo Preview" 
                    className="h-full w-full object-contain" 
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-medium text-gray-700">Logo Image</h4>
                  <p className="text-xs text-gray-500 mt-1">Click remove to change the logo</p>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    if (formData.logo.startsWith('blob:')) URL.revokeObjectURL(formData.logo);
                    setFormData(prev => ({ ...prev, logo: "" }));
                    setLogoFile(null);
                  }}
                  className="p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                <ImagePlus className="h-12 w-12 text-gray-400 mb-3" />
                <div className="text-center">
                  <label className="cursor-pointer">
                    <span className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block">
                      Choose Logo Image
                    </span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleLogoUpload} 
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Images Section - Enhanced Design */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Gallery Images</h3>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            {/* Upload control */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
              <label htmlFor="gallery-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Upload Gallery Images
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  JPEG, PNG, GIF, WEBP up to 5MB each
                </p>
                <span className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block">
                  Select Images
                </span>
                <input
                  id="gallery-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            {/* Gallery Preview */}
            {formData.galleryImages?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3 text-gray-700 flex items-center">
                  Gallery Preview ({formData.galleryImages.length} images)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.galleryImages.map((img, index) => (
                    <div 
                      key={`gallery-img-${index}`} 
                      className="relative group overflow-hidden rounded-lg border border-gray-200"
                    >
                      <div className="aspect-w-1 aspect-h-1">
                        <img 
                          src={img} 
                          alt={`Gallery ${index + 1}`} 
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            id="is-active"
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="is-active" className="ml-2 block text-sm text-gray-700">
            Spa is currently active and in business
          </label>
        </div>

        {/* Form Controls */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/spa"; // Redirect to spa route
            }}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Updating...
              </>
            ) : (
              'Update Spa'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSpaForm;