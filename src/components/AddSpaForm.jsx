import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/getToken";
import { 
  Upload, MapPin, Clock, Mail, Phone, Globe, ImagePlus, Map, Compass,
  AlertCircle, CheckCircle, Loader, X, Star, MessageSquare, Building, 
  FileImage, Info, ChevronDown, Briefcase
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

// Enhanced InputField component with better styling
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
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2.5 ${icon ? 'pl-10' : ''} 
        border rounded-lg shadow-sm transition-all duration-200
        focus:ring-2 focus:ring-offset-0 focus:outline-none
        ${error ? 'border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-500' 
             : 'border-gray-300 focus:ring-blue-100 focus:border-blue-500'}`}
      />
    </div>
    {error && (
      <p className="mt-1.5 text-sm text-red-600 flex items-start">
        <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
        <span>{error}</span>
      </p>
    )}
  </div>
);

// Section container component for consistent styling
const FormSection = ({ icon, title, children, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-bold mb-5 flex items-center pb-3 border-b border-gray-100">
        <span className={`p-2 rounded-lg mr-3 ${colorClasses[color]}`}>
          {icon}
        </span>
        {title}
      </h3>
      <div className="space-y-5">
        {children}
      </div>
    </div>
  );
};

const AddSpaForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ ...INITIAL_FORM_DATA });
  const [formErrors, setFormErrors] = useState({ ...INITIAL_FORM_ERRORS });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  
  // Reset form to initial state
  const resetForm = () => {
    setFormData({ ...INITIAL_FORM_DATA });
    setFormErrors({ ...INITIAL_FORM_ERRORS });
    setError("");
    setSuccessMessage("");
    setUploadProgress({});
    setLogoFile(null);
    setGalleryFiles([]);
  };

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
      const updatedCoords = [...prev.geolocation.coordinates];
      updatedCoords[index] = numValue;
      return {
        ...prev,
        geolocation: { 
          ...prev.geolocation, 
          coordinates: updatedCoords 
        }
      };
    });
  };

  // Validate file 
  const validateFile = (file) => {
    const MAX_SIZE = 10 * 1024 * 1024; // 5MB
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
    // Remove from previews
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
    
    // Remove from actual files
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Cleanup function for preview URLs when component unmounts
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

  // Form validation
  const validateForm = () => {
    const errors = { ...INITIAL_FORM_ERRORS };
    let isValid = true;
    
    // Basic validation
    if (!formData.name.trim()) {
      errors.name = "Spa name is required";
      isValid = false;
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s+/g, ''))) {
      errors.phone = "Invalid phone number format";
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }
    
    // Website validation (optional)
    if (formData.website.trim() && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.website)) {
      errors.website = "Invalid website URL";
      isValid = false;
    }
    
    // Full address validation
    if (!formData.fullAddress.trim()) {
      errors.fullAddress = "Full address is required";
      isValid = false;
    }
    
    ADDRESS_FIELDS.forEach(field => {
      if (field.required && !formData.address[field.key].trim()) {
        errors.address[field.key] = `${field.key.charAt(0).toUpperCase() + field.key.slice(1)} is required`;
        isValid = false;
      }
    });
    
    // Coordinates validation
    if (formData.geolocation.coordinates[0] === null) {
      errors.geolocation.coordinates[0] = "Longitude is required";
      isValid = false;
    } else if (isNaN(parseFloat(formData.geolocation.coordinates[0]))) {
      errors.geolocation.coordinates[0] = "Longitude must be a valid number";
      isValid = false;
    }
    
    if (formData.geolocation.coordinates[1] === null) {
      errors.geolocation.coordinates[1] = "Latitude is required";
      isValid = false;
    } else if (isNaN(parseFloat(formData.geolocation.coordinates[1]))) {
      errors.geolocation.coordinates[1] = "Latitude must be a valid number";
      isValid = false;
    }
    
    // Hours validation
    if (!formData.openingHours.trim()) {
      errors.openingHours = "Opening hours are required";
      isValid = false;
    }
    
    if (!formData.closingHours.trim()) {
      errors.closingHours = "Closing hours are required";
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      
      // Add nested address fields DIRECTLY - no JSON stringify
      formDataObj.append('address[city]', formData.address.city);
      formDataObj.append('address[state]', formData.address.state);
      formDataObj.append('address[district]', formData.address.district);
      formDataObj.append('address[pincode]', formData.address.pincode);
      
      // Add geolocation fields DIRECTLY - no JSON stringify
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
      
      // Log what we're sending (for debugging)
      console.log("Form data keys being sent:");
      for (let pair of formDataObj.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      // Send data to the API using axios with authorization
      const response = await axios.post(`${BASE_URL}/spas/spa`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Log the response from the server
      console.log("Server response:", response.data);
      
      // Handle success
      setSuccessMessage("Your spa has been added successfully!");
      
      // Show a more prominent alert
      alert("Your spa has been added successfully!");

      // Call success callback with the new spa data
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      // Reset form
      resetForm();
      
    } catch (err) {
      console.error("Form submission error:", err);
      // Handle Axios error response
      if (err.response) {
        // The request was made and the server responded with a status code outside of 2xx
        const errorMessage = err.response.data.message || err.response.data.error || 'Failed to add spa';
        setError(errorMessage);
        
        // Log more detailed error information
        console.error("Server error response:", err.response.data);
        console.error("Status code:", err.response.status);
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        setError(err.message || "Failed to add spa. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-400 py-8 px-4">
      <div className="container max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-center flex-col text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Building className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Spa</h1>
            <p className="text-gray-500 max-w-lg">
              Fill in the details below to add a new spa to your management system.
              Fields marked with an asterisk (*) are required.
            </p>

            
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start animate-fadeIn">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-800 mb-1">Error</h4>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start animate-fadeIn">
            <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-800 mb-1">Success</h4>
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Info Section */}
          <FormSection 
            icon={<Briefcase className="h-5 w-5" />} 
            title="Basic Information" 
            color="blue"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <InputField 
                  label="Spa Name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  error={formErrors.name}
                  icon={<Building size={18} />}
                  placeholder="Enter spa name"
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

            <div className="mt-6 pt-3 border-t border-gray-100">
              <h4 className="text-md font-medium mb-3 flex items-center text-gray-700">
                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                Rating & Reviews
              </h4>
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
          </FormSection>

          {/* Address Section */}
          <FormSection 
            icon={<MapPin className="h-5 w-5" />} 
            title="Address Information" 
            color="red"
          >
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
                    value={formData.address[field.key]}
                    onChange={handleChange}
                    required={field.required}
                    error={formErrors.address[field.key]}
                  />
                </div>
              ))}
            </div>
          </FormSection>

          {/* Location Details */}
          <FormSection 
            icon={<Map className="h-5 w-5" />} 
            title="Location Details" 
            color="green"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <InputField 
                  label="Longitude" 
                  type="number" 
                  step="any" 
                  value={formData.geolocation.coordinates[0] === null ? "" : formData.geolocation.coordinates[0]} 
                  onChange={(e) => handleCoordinatesChange(0, e.target.value)} 
                  placeholder="e.g. 76.2455"
                  required 
                  error={formErrors.geolocation.coordinates[0]}
                  icon={<Compass size={18} />}
                />
              </div>
              <div>
                <InputField 
                  label="Latitude" 
                  type="number" 
                  step="any" 
                  value={formData.geolocation.coordinates[1] === null ? "" : formData.geolocation.coordinates[1]} 
                  onChange={(e) => handleCoordinatesChange(1, e.target.value)} 
                  placeholder="e.g. 9.9674"
                  required 
                  error={formErrors.geolocation.coordinates[1]}
                  icon={<Compass size={18} />}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg mt-3 mb-4 flex items-start">
              <Info className="text-blue-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                You can find longitude and latitude coordinates by right-clicking on a location in Google Maps and selecting "What's here?".
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
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
          </FormSection>

          {/* Hours and Branding */}
          <FormSection 
            icon={<Clock className="h-5 w-5" />} 
            title="Operating Hours & Logo" 
            color="amber"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <InputField 
                  label="Opening Hours" 
                  name="openingHours" 
                  value={formData.openingHours} 
                  icon={<Clock size={18} />} 
                  onChange={handleChange} 
                  placeholder="e.g. 09:30 AM"
                  required 
                  error={formErrors.openingHours}
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
                  required 
                  error={formErrors.closingHours}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Spa Logo</label>
              {formData.logo ? (
                <div className="relative overflow-hidden rounded-lg border border-gray-200 p-3 bg-gray-50">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-md bg-white shadow-sm p-1 mr-4 flex-shrink-0 border border-gray-100">
                      <img 
                        src={formData.logo} 
                        alt="Logo Preview" 
                        className="h-full w-full object-contain" 
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-gray-700">Logo uploaded successfully</p>
                      <p className="text-xs text-gray-500 mt-1">Click remove to change the logo</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, logo: "" }));
                        setLogoFile(null);
                      }}
                      className="ml-2 p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-1">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex justify-center">
                    <div className="text-center cursor-pointer" onClick={() => {
                      const fileInput = document.createElement('input');
                      fileInput.type = 'file';
                      fileInput.accept = 'image/*';
                      fileInput.onchange = handleLogoUpload;
                      fileInput.click();
                    }}>
                      <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
                        <ImagePlus className="h-12 w-12" />
                      </div>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload a logo</span>
                          <input type="file" className="sr-only" accept="image/*" onChange={handleLogoUpload} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FormSection>

          {/* Gallery Images */}
          <FormSection 
            icon={<FileImage className="h-5 w-5" />} 
            title="Gallery Images" 
            color="purple"
          >
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-all hover:bg-gray-50">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryUpload}
                className="hidden"
                id="gallery-upload"
              />
              <label htmlFor="gallery-upload" className="cursor-pointer">
                <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                  <Upload className="h-16 w-16" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">Upload Gallery Images</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Click to upload or drag and drop your spa gallery photos
                </p>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  JPEG, PNG, GIF, WEBP up to 5MB each
                </span>
              </label>
            </div>
            
            {/* Gallery Preview */}
            {formData.galleryImages.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-medium mb-3 flex items-center text-gray-700">
                  <FileImage className="mr-2 h-4 w-4 text-purple-500" />
                  Gallery Preview ({formData.galleryImages.length} images)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.galleryImages.map((img, index) => (
                    <div key={`gallery-img-${index}`} className="relative group overflow-hidden rounded-lg border border-gray-200">
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
            
            {/* Upload Progress Indicators */}
            {Object.entries(uploadProgress).filter(([key]) => key.startsWith('gallery_')).length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium flex items-center text-gray-700">
                  <Loader className="animate-spin mr-2 h-4 w-4 text-blue-500" />
                  Uploading Images...
                </h4>
                {Object.entries(uploadProgress)
                  .filter(([key]) => key.startsWith('gallery_'))
                  .map(([key, progress]) => (
                    <div key={key} className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500 w-10 text-right">{progress}%</span>
                    </div>
                  ))}
              </div>
            )}
          </FormSection>

          {/* Active Status */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="relative inline-block w-10 mr-3 align-middle select-none">
                <input 
                  id="is-active" 
                  type="checkbox" 
                  name="isActive" 
                  checked={formData.isActive} 
                  onChange={handleChange}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-blue-600"
                />
                <label 
                  htmlFor="is-active" 
                  className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer checked:bg-blue-600"
                  style={{ 
                    backgroundColor: formData.isActive ? '#2563eb' : '#d1d5db',
                    transition: 'background-color 0.2s ease'
                  }}
                ></label>
              </div>
              <label htmlFor="is-active" className="text-sm font-medium text-gray-700 cursor-pointer">
                Spa is currently active and in business
              </label>
            </div>
          </div>

          {/* Form Controls */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors shadow-sm"
            >
              Reset Form
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center justify-center min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Add Spa
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Add some CSS for animations */}
   <style>
  {`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out forwards;
    }
  `}
</style>


    </div>
  );
};

export default AddSpaForm;