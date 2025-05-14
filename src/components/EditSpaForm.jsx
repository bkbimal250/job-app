import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/getToken";
import { useParams } from "react-router-dom";
import { 
  Upload, MapPin, Clock, Mail, Phone, Globe, ImagePlus, Map, Compass,
  AlertCircle, CheckCircle, Loader, X, Star, MessageSquare
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const ADDRESS_FIELDS = [
  { key: "state" },
  { key: "city"  },
  { key: "district" },
  { key: "pincode" }
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
  
  const [formData, setFormData] = useState({...INITIAL_FORM_DATA});
  const [formErrors, setFormErrors] = useState({ ...INITIAL_FORM_ERRORS });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
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
        
        console.log(response.data);
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

  // Logo upload handler (simulated)
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const error = validateFile(file);
    if (error) {
      setError(error);
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    // Simulated upload - in a real app, this would be an actual API call
    try {
      // Simulate upload progress
      const simulatedUpload = new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          setUploadProgress(prev => ({ ...prev, logo: progress }));
          if (progress >= 100) {
            clearInterval(interval);
            resolve(`/api/placeholder/logo/${file.name}`);
          }
        }, 200);
      });
      
      const logoUrl = await simulatedUpload;
      
      setFormData(prev => ({
        ...prev,
        logo: logoUrl,
      }));
      
      setSuccessMessage("Logo uploaded successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Logo upload failed");
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(prev => ({ ...prev, logo: 0 })), 1000);
    }
  };

  // Gallery image upload handler (simulated)
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsLoading(true);
    setError("");
    
    const newImages = [];
    const failedUploads = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        failedUploads.push({ name: file.name, error: validationError });
        continue;
      }
      
      // Simulate upload progress
      const uploadId = `gallery_${i}`;
      try {
        const simulatedUpload = new Promise((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 20;
            setUploadProgress(prev => ({ ...prev, [uploadId]: progress }));
            if (progress >= 100) {
              clearInterval(interval);
              resolve(`/api/placeholder/gallery/${file.name}`);
            }
          }, 200);
        });
        
        const imageUrl = await simulatedUpload;
        newImages.push(imageUrl);
      } catch (err) {
        failedUploads.push({ 
          name: file.name, 
          error: "Upload failed" 
        });
      } finally {
        // Clear progress for this file
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[uploadId];
          return newProgress;
        });
      }
    }
    
    // Update gallery with successfully uploaded images
    if (newImages.length > 0) {
      setFormData(prev => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), ...newImages],
      }));
      
      setSuccessMessage(`${newImages.length} image(s) uploaded successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
    
    // Show errors for failed uploads
    if (failedUploads.length > 0) {
      setError(`Failed to upload ${failedUploads.length} image(s): ${failedUploads.map(f => f.name).join(", ")}`);
    }
    
    setIsLoading(false);
  };

  // Remove image from gallery
  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, i) => i !== index),
    }));
  };

  // Form validation
  const validateForm = () => {
    const errors = { ...INITIAL_FORM_ERRORS };
    let isValid = true;
    
    // Basic validation
    if (!formData.name?.trim()) {
      errors.name = "Spa name is required";
      isValid = false;
    }
    
    if (!formData.phone?.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s+/g, ''))) {
      errors.phone = "Invalid phone number format";
      isValid = false;
    }
    
    if (!formData.email?.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }
    
    // Website validation (optional)
    if (formData.website?.trim() && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.website)) {
      errors.website = "Invalid website URL";
      isValid = false;
    }
    
    // Full address validation
    if (!formData.fullAddress?.trim()) {
      errors.fullAddress = "Full address is required";
      isValid = false;
    }
    
    ADDRESS_FIELDS.forEach(field => {
      if (field.required && !formData.address?.[field.key]?.trim()) {
        errors.address[field.key] = `${field.key.charAt(0).toUpperCase() + field.key.slice(1)} is required`;
        isValid = false;
      }
    });
    
    // Coordinates validation
    if (formData.geolocation?.coordinates[0] === null) {
      errors.geolocation.coordinates[0] = "Longitude is required";
      isValid = false;
    } else if (isNaN(parseFloat(formData.geolocation?.coordinates[0]))) {
      errors.geolocation.coordinates[0] = "Longitude must be a valid number";
      isValid = false;
    }
    
    if (formData.geolocation?.coordinates[1] === null) {
      errors.geolocation.coordinates[1] = "Latitude is required";
      isValid = false;
    } else if (isNaN(parseFloat(formData.geolocation?.coordinates[1]))) {
      errors.geolocation.coordinates[1] = "Latitude must be a valid number";
      isValid = false;
    }
    
    // Hours validation
    if (!formData.openingHours?.trim()) {
      errors.openingHours = "Opening hours are required";
      isValid = false;
    }
    
    if (!formData.closingHours?.trim()) {
      errors.closingHours = "Closing hours are required";
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
   
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // Format coordinates as numbers
      const longitude = parseFloat(formData.geolocation?.coordinates[0] || 0);
      const latitude = parseFloat(formData.geolocation?.coordinates[1] || 0);
      
      // Create payload to match backend structure
      const payload = {
        ...formData,
        address: {
          city: formData.address?.city || "",
          state: formData.address?.state || "",
          district: formData.address?.district || "",
          pincode: formData.address?.pincode || ""
        },
        geolocation: {
          type: "Point",
          coordinates: [longitude, latitude]
        }
      };
      
      // Get authentication token
      const token = getToken();
      
      // Send update request using PUT method
      const response = await axios.put(`${BASE_URL}/spas/spa/${effectiveSpaId}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Success handling
      setSuccessMessage("Spa updated successfully!");
      
      // Call success callback with updated data
      if (onSuccess) {
        onSuccess(response.data || formData);
      }
      
    } catch (err) {
      console.error("Form update error:", err);
      
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
          <div className="h-4 bg-gray-200 rounded w-full max-w-2xl mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 max-w-2xl mx-auto"></div>
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

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Basic Info Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Phone className="mr-2 h-5 w-5 text-blue-500" />
            Basic Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <InputField 
                label="Spa Name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                error={formErrors.name}
              />
            </div>
            <div>
              <InputField 
                label="Phone" 
                name="phone" 
                type="tel" 
                value={formData.phone} 
                icon={<Phone size={18} />} 
                onChange={handleChange} 
                required 
                error={formErrors.phone}
                placeholder="+91 9876543210"
              />
            </div>
            <div>
              <InputField 
                label="Email" 
                name="email" 
                type="email" 
                value={formData.email} 
                icon={<Mail size={18} />} 
                onChange={handleChange} 
                required 
                error={formErrors.email}
                placeholder="spa@example.com"
              />
            </div>
            <div>
              <InputField 
                label="Website" 
                name="website" 
                type="url" 
                value={formData.website} 
                icon={<Globe size={18} />} 
                onChange={handleChange} 
                error={formErrors.website}
                placeholder="https://www.example.com"
              />
            </div>
          </div>
        </div>

        {/* Reviews fields */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Star className="mr-2 h-5 w-5 text-yellow-500" />
            Rating & Reviews
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <InputField
                label="Rating (0-5)"
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
                placeholder="e.g. 4.5"
                icon={<Star size={18} />}
              />
            </div>
            <div>
              <InputField
                label="Number of Reviews"
                name="reviews"
                type="number"
                min="0"
                value={formData.reviews}
                onChange={handleChange}
                placeholder="e.g. 175"
                icon={<MessageSquare size={18} />}
              />
            </div>
          </div>
        </div>  

        {/* Address Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-red-500" />
            Address
          </h3>
          <div>
            <InputField 
              label="Full Address" 
              name="fullAddress" 
              value={formData.fullAddress} 
              icon={<MapPin size={18} />} 
              onChange={handleChange} 
              required 
              error={formErrors.fullAddress}
              placeholder="Complete address with landmarks"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {ADDRESS_FIELDS.map((field, index) => (
              <div key={`address-field-${index}-${field.key}`}>
                <InputField
                  label={field.key.charAt(0).toUpperCase() + field.key.slice(1)}
                  name={`address.${field.key}`}
                  value={formData.address?.[field.key]}
                  onChange={handleChange}
                  required={field.required}
                  error={formErrors.address?.[field.key]}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Location Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Map className="mr-2 h-5 w-5 text-green-500" />
            Location Details
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <InputField 
                label="Longitude" 
                type="number" 
                step="any" 
                value={formData.geolocation?.coordinates?.[0] === null ? "" : formData.geolocation?.coordinates?.[0]} 
                onChange={(e) => handleCoordinatesChange(0, e.target.value)} 
                placeholder="e.g. 76.2455"
                required 
                error={formErrors.geolocation?.coordinates?.[0]}
              />
            </div>
            <div>
              <InputField 
                label="Latitude" 
                type="number" 
                step="any" 
                value={formData.geolocation?.coordinates?.[1] === null ? "" : formData.geolocation?.coordinates?.[1]} 
                onChange={(e) => handleCoordinatesChange(1, e.target.value)} 
                placeholder="e.g. 9.9674"
                required 
                error={formErrors.geolocation?.coordinates?.[1]}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <InputField 
                label="Google Map Link" 
                name="googleMap" 
                value={formData.googleMap} 
                icon={<Map size={18} />} 
                onChange={handleChange} 
                placeholder="https://goo.gl/maps/example"
              />
            </div>
            <div>
              <InputField 
                label="Directions" 
                name="direction" 
                value={formData.direction} 
                icon={<Compass size={18} />} 
                onChange={handleChange} 
                placeholder="Landmark directions to find the spa"
              />
            </div>
          </div>
        </div>

        {/* Timings and Logo */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-amber-500" />
            Operating Hours & Branding
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <InputField 
                label="Opening Hours" 
                name="openingHours" 
                value={formData.openingHours} 
                icon={<Clock size={18} />} 
                onChange={handleChange} 
                placeholder="e.g. 09:30 AM"
              />
            </div>
            <div>
              <InputField 
                label="Closing Hours" 
                name="closingHours" 
                value={formData.closingHours} 
                icon={<Clock size={18} />} 
                onChange={handleChange} 
                placeholder="e.g. 08:30 PM"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">Logo Image</label>
            <div className="flex items-stretch">
              <div className="flex-grow">
                {formData.logo ? (
                  <div className="relative p-1 border rounded-l-md bg-gray-50 flex items-center">
                    <img src={formData.logo} alt="Logo" className="h-10 w-auto mr-2" />
                    <span className="text-sm text-gray-500 truncate">{formData.logo.split('/').pop()}</span>
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logo: "" }))}
                      className="ml-auto bg-red-50 text-red-500 p-1 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-grow cursor-pointer">
                    <div className="relative overflow-hidden rounded-l-md border border-gray-300 bg-white px-3 py-2 w-full flex items-center">
                      <Upload size={18} className="text-gray-400 mr-2" />
                      <span className="text-gray-500">Choose a logo image...</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleLogoUpload} 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>
                  </label>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  const fileInput = document.createElement('input');
                  fileInput.type = 'file';
                  fileInput.accept = 'image/*';
                  fileInput.onchange = handleLogoUpload;
                  fileInput.click();
                }}
                disabled={isLoading}
                className={`px-4 bg-blue-500 text-white rounded-r-md flex items-center ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                }`}
              >
                {uploadProgress.logo > 0 && uploadProgress.logo < 100 ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    <span>{uploadProgress.logo}%</span>
                  </>
                ) : (
                  <ImagePlus size={18} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ImagePlus className="mr-2 h-5 w-5 text-purple-500" />
            Gallery Images
          </h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleGalleryUpload}
              className="hidden"
              id="gallery-upload"
            />
            <label htmlFor="gallery-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Click to upload gallery images or drag and drop
              </p>
              <p className="text-xs text-gray-400">
                JPEG, PNG, GIF, WEBP up to 5MB each
              </p>
            </label>
          </div>
          
          {/* Gallery Preview */}
          {formData.galleryImages?.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">Gallery Preview</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.galleryImages.map((img, index) => (
                  <div key={`gallery-img-${index}`} className="relative group">
                    <img 
                      src={img} 
                      alt={`Gallery ${index + 1}`} 
                      className="h-32 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Upload Progress Indicators */}
          {Object.entries(uploadProgress).filter(([key]) => key.startsWith('gallery_')).length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Uploading Images...</h4>
              {Object.entries(uploadProgress)
                .filter(([key]) => key.startsWith('gallery_'))
                .map(([key, progress]) => (
                  <div key={key} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs text-gray-500">{progress}%</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Active Status */}
        <div>
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
        </div>

        {/* Form Controls */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/spa"; // Redirect to spa route
            }}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
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