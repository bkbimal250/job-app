import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { getToken } from "../utils/getToken";
import { 
  MapPin, Clock, Mail, Phone, Globe, ChevronLeft, Star, Share2, Edit,
  User, Calendar, Map, Compass, MessageSquare, Loader, AlertCircle,
  CheckCircle, MapPinIcon, ImageIcon
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Image gallery component
const ImageGallery = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
          <p>No gallery images available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {/* Main image */}
      <div className="relative h-80 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
        <img 
          src={images[activeIndex]} 
          alt={`Spa gallery image ${activeIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
          }}
        />
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={`thumb-${index}`}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border-2 ${
                index === activeIndex ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <img 
                src={img} 
                alt={`Thumbnail ${index + 1}`} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Information card component
const InfoCard = ({ title, children, icon, className = "" }) => (
  <div className={`bg-white p-5 rounded-lg shadow-sm ${className}`}>
    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
      {icon && <span className="mr-2 text-blue-600">{icon}</span>}
      {title}
    </h3>
    {children}
  </div>
);

const SpaView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [spa, setSpa] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Fetch spa data
  useEffect(() => {
    const fetchSpaData = async () => {
      if (!id) {
        setError("No spa ID provided");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const token = getToken();
        
        if (!token) {
          setError("Authorization token not found. Please log in again.");
          setIsLoading(false);
          return;
        }
        
        // Fetch all spas and find the one we need
        const response = await axios.get(`${BASE_URL}/spas/spaall/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Process response data
        let allSpas = [];
        if (Array.isArray(response.data)) {
          allSpas = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          allSpas = response.data.data;
        }
        
        // Find the spa with matching ID
        const foundSpa = allSpas.find(spa => spa._id === id);
        
        if (foundSpa) {
          setSpa(foundSpa);
        } else {
          setError(`Spa with ID ${id} not found`);
        }
      } catch (err) {
        console.error("Error fetching spa data:", err);
        setError("Failed to load spa data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpaData();
  }, [id]);
  
  // Handle share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: spa.name,
        text: `Check out ${spa.name}`,
        url: window.location.href
      })
      .catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          setSuccessMessage("Link copied to clipboard!");
          setTimeout(() => setSuccessMessage(""), 3000);
        })
        .catch(err => {
          console.error('Failed to copy link:', err);
          setError("Failed to copy link to clipboard");
          setTimeout(() => setError(""), 3000);
        });
    }
  };
  
  // Format address
  const formatAddress = (spa) => {
    if (!spa) return "";
    
    const addressParts = [];
    
    if (spa.fullAddress) {
      addressParts.push(spa.fullAddress);
    }
    
    if (spa.address) {
      const detailParts = [];
      
      if (spa.address.district) detailParts.push(spa.address.district);
      if (spa.address.city) detailParts.push(spa.address.city);
      if (spa.address.state) detailParts.push(spa.address.state);
      if (spa.address.pincode) detailParts.push(spa.address.pincode);
      
      if (detailParts.length > 0) {
        addressParts.push(detailParts.join(", "));
      }
    }
    
    return addressParts.join("<br/>");
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Loader className="h-8 w-8 animate-spin mx-auto text-blue-500 mb-4" />
        <p className="text-gray-600">Loading spa information...</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <h2 className="text-lg font-medium text-red-800">Error Loading Spa</h2>
          </div>
          <p className="mt-2 text-red-700">{error}</p>
          <button
            onClick={() => navigate("/spas")}
            className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Spas
          </button>
        </div>
      </div>
    );
  }
  
  // No spa found
  if (!spa) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-yellow-500 mr-3" />
            <h2 className="text-lg font-medium text-yellow-800">Spa Not Found</h2>
          </div>
          <p className="mt-2 text-yellow-700">The spa you are looking for could not be found.</p>
          <button
            onClick={() => navigate("/spas")}
            className="mt-4 inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Spas
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Success message */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-md flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-green-500" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Navigation and action buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <button
              onClick={() => navigate("/spas")}
              className="inline-flex items-center mr-4 text-blue-600 hover:text-blue-800"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to All Spas
            </button>
            
            {/* Spa status indicator */}
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              spa.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {spa.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
            
            <Link
              to={`/spas/edit/${spa._id}`}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left column - Spa details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Header section with logo and name */}
              <div className="p-6 flex items-center">
                {spa.logo ? (
                  <div className="w-20 h-20 rounded-md overflow-hidden border border-gray-200 flex-shrink-0 mr-4">
                    <img 
                      src={spa.logo} 
                      alt={`${spa.name} logo`} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Logo';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0 mr-4 border border-gray-200">
                    <span className="text-2xl font-bold text-gray-400">
                      {spa.name?.charAt(0) || "S"}
                    </span>
                  </div>
                )}
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{spa.name}</h1>
                  
                  {/* Rating display */}
                  {spa.rating > 0 && (
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(spa.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : i < spa.rating 
                                  ? 'text-yellow-400 fill-current opacity-50' 
                                  : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {spa.rating.toFixed(1)} ({spa.reviews} {spa.reviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Gallery section */}
              <div className="px-6 pb-6">
                <ImageGallery images={spa.galleryImages || []} />
              </div>
            </div>
            
            {/* Description and hours */}
            <InfoCard title="About this Spa" icon={<User size={20} />}>
              <div className="space-y-4">
                {/* Opening hours */}
                {(spa.openingHours || spa.closingHours) && (
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-700">Hours</h4>
                      <p className="text-gray-600">
                        {spa.openingHours && spa.closingHours
                          ? `${spa.openingHours} - ${spa.closingHours}`
                          : spa.openingHours 
                            ? `Opens: ${spa.openingHours}` 
                            : `Closes: ${spa.closingHours}`
                        }
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Contact information */}
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-700">Contact</h4>
                    <p className="text-gray-600">{spa.phone}</p>
                    {spa.email && <p className="text-gray-600">{spa.email}</p>}
                  </div>
                </div>
                
                {/* Website if available */}
                {spa.website && (
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-700">Website</h4>
                      <a 
                        href={spa.website.startsWith('http') ? spa.website : `https://${spa.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {spa.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </InfoCard>
            
            {/* Directions and map */}
            {(spa.direction || spa.googleMap || (spa.geolocation?.coordinates?.[0] && spa.geolocation?.coordinates?.[1])) && (
              <InfoCard title="Location & Directions" icon={<MapPinIcon size={20} />}>
                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-700">Address</h4>
                      <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: formatAddress(spa) }}></p>
                    </div>
                  </div>
                  
                  {/* Directions */}
                  {spa.direction && (
                    <div className="flex items-start">
                      <Compass className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-700">How to reach</h4>
                        <p className="text-gray-600">{spa.direction}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Google Maps Link */}
                  {spa.googleMap && (
                    <div className="flex items-start">
                      <Map className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-700">View on Maps</h4>
                        <a 
                          href={spa.googleMap} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Open in Google Maps
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Coordinates */}
                  {spa.geolocation?.coordinates?.[0] && spa.geolocation?.coordinates?.[1] && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Map Location</h4>
                      <div className="bg-gray-100 rounded-lg overflow-hidden h-64 relative">
                        <iframe
                          title={`${spa.name} location map`}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          src={`https://maps.google.com/maps?q=${spa.geolocation.coordinates[1]},${spa.geolocation.coordinates[0]}&z=15&output=embed`}
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              </InfoCard>
            )}
          </div>
          
          {/* Right column - Additional info */}
          <div className="space-y-6">
            {/* Last updated info */}
            <InfoCard title="Listing Details" icon={<Calendar size={20} />}>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ID:</span>
                  <span className="text-gray-900 font-medium">{spa._id.slice(-8)}</span>
                </div>
                {spa.createdAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-900">
                      {new Date(spa.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {spa.updatedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-gray-900">
                      {new Date(spa.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </InfoCard>
            
            {/* Stats card */}
            <InfoCard title="Performance Stats" icon={<MessageSquare size={20} />} className="bg-blue-50">
              <div className="space-y-4">
                {/* Rating display */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(spa.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : i < spa.rating 
                                ? 'text-yellow-400 fill-current opacity-50' 
                                : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{spa.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                {/* Reviews count */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-medium">{spa.reviews}</span>
                </div>
                
                {/* Placeholder for more stats */}
                <div className="text-center text-sm text-gray-500 pt-2 border-t border-blue-100">
                  More statistics will appear here as available
                </div>
              </div>
            </InfoCard>
            
            {/* Action buttons for mobile */}
            <div className="md:hidden flex flex-col space-y-3">
              <Link
                to={`/spas/edit/${spa._id}`}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Spa
              </Link>
              
              <button
                onClick={handleShare}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaView;