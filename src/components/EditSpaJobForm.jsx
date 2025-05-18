import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Check, AlertCircle, Briefcase, DollarSign, MapPin, Users, 
  Phone, MessageSquare, ArrowLeft, Calendar, Award, 
  Settings, FileText, Building, Save
} from "lucide-react";
import { getToken } from "../utils/getToken";
import axios from "axios";

// Get base URL from environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditSpaJobForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get job ID from URL params
  
  const [formData, setFormData] = useState({
    title: "",
    salary: "",
    location: "",
    city: "",
    state: "",
    category: "",
    experience: "",
    description: "",
    hrWhatsapp: "",
    hrPhone: "",
    gender: "Any",
    isNewJob: true,
    vacancies: 1,
    requirements: "",
    spa: "",
  });

  const [spas, setSpas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(1);

  // Create axios instance with authentication
  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    }
  });

  // Fetch initial data including the job to edit
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Use Promise.all to fetch all required data in parallel
        const [jobResponse, spasResponse, enumsResponse] = await Promise.all([
          api.get(`/spajobs/${id}`),
          api.get("/spas/spaall/"),
          api.get("/enums")
        ]);
        
        // Process job data - make sure spa is properly formatted as ID
        const jobData = jobResponse.data;
        
        // Handle the spa field which might be an object or an ID
        if (jobData.spa && typeof jobData.spa === 'object' && jobData.spa._id) {
          jobData.spa = jobData.spa._id;
        }
        
        // Handle category which might be an object or a string
        if (jobData.category && typeof jobData.category === 'object' && jobData.category.name) {
          jobData.category = jobData.category.name;
        }
        
        setFormData(jobData);
        setSpas(spasResponse.data);
        setCategories(enumsResponse.data.categories);
        setGenders(enumsResponse.data.genders);
        
        console.log("Job data loaded:", jobData);
        console.log("Spas loaded:", spasResponse.data);
        console.log("Enums loaded:", enumsResponse.data);
        
      } catch (err) {
        console.error("Error fetching initial data:", err);
        
        // More specific error messages based on error type
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (err.response.status === 404) {
            setError(`Job with ID ${id} not found. It may have been deleted.`);
          } else if (err.response.status === 401 || err.response.status === 403) {
            setError("You don't have permission to edit this job. Please log in again.");
          } else {
            setError(`Server error: ${err.response.data.message || err.message}`);
          }
        } else if (err.request) {
          // The request was made but no response was received
          setError("Network error. Please check your connection and try again.");
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setError("No job ID provided");
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.put(`/spajobs/${id}`, formData);
      
      setSuccessMessage("Job updated successfully!");
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/jobs");
      }, 3000);
      
    } catch (err) {
      console.error("Error updating job:", err);
      
      // More specific error messages
      if (err.response) {
        const errorMessage = err.response.data.message || "Server responded with an error";
        setError(`Update failed: ${errorMessage}`);
      } else if (err.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate("/jobs");
  };

  const goToSection = (sectionNumber) => {
    setActiveSection(sectionNumber);
  };

  const nextSection = () => {
    setActiveSection(prev => Math.min(prev + 1, 4));
  };

  const prevSection = () => {
    setActiveSection(prev => Math.max(prev - 1, 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Loading Job Data</h3>
          <p className="text-gray-500">Getting the job details ready for editing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header with Back Button */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <button 
              onClick={handleGoBack} 
              className="mb-4 sm:mb-0 flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Jobs List
            </button>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
            <Briefcase className="mr-3 text-blue-600 h-6 w-6 sm:h-7 sm:w-7" />
            Edit Spa Job: {formData.title || "Loading..."}
          </h2>
        </div>
        
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 flex items-start">
              <div className="bg-red-100 rounded-full p-2 mr-3 flex-shrink-0">
                <AlertCircle className="text-red-500 h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-red-800 mb-1">There was a problem</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 flex items-start">
              <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                <Check className="text-green-500 h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-green-800 mb-1">Success!</h3>
                <p className="text-green-700 text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="hidden sm:flex justify-between items-center mb-6 bg-white rounded-xl shadow-md p-4">
          <div 
            className={`flex flex-col items-center cursor-pointer ${activeSection >= 1 ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => goToSection(1)}
          >
            <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${activeSection >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} mb-2`}>
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Job Details</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-4 ${activeSection >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          
          <div 
            className={`flex flex-col items-center cursor-pointer ${activeSection >= 2 ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => goToSection(2)}
          >
            <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${activeSection >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} mb-2`}>
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Location</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-4 ${activeSection >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          
          <div 
            className={`flex flex-col items-center cursor-pointer ${activeSection >= 3 ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => goToSection(3)}
          >
            <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${activeSection >= 3 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} mb-2`}>
              <Building className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Spa & Contact</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-4 ${activeSection >= 4 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          
          <div 
            className={`flex flex-col items-center cursor-pointer ${activeSection >= 4 ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => goToSection(4)}
          >
            <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${activeSection >= 4 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} mb-2`}>
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Description</span>
          </div>
        </div>
        
        {/* Mobile Progress Indicator */}
        <div className="sm:hidden mb-4 bg-white rounded-xl p-3 shadow-md">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Step {activeSection} of 4</h4>
          <div className="flex h-2 overflow-hidden bg-gray-200 rounded">
            <div 
              className="bg-blue-600 transition-all duration-300" 
              style={{ width: `${(activeSection / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          {/* Job Details Section */}
          <div className={`transition-all duration-300 ${activeSection === 1 ? 'block' : 'hidden'}`}>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Briefcase className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Job Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="e.g. Massage Therapist" 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="text-gray-500 h-5 w-5" />
                    </div>
                    <input 
                      name="salary" 
                      value={formData.salary} 
                      onChange={handleChange} 
                      placeholder="e.g. ₹50,000 - ₹70,000" 
                      required 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Settings className="text-gray-500 h-5 w-5" />
                    </div>
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange} 
                      required 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Required</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Award className="text-gray-500 h-5 w-5" />
                    </div>
                    <input 
                      name="experience" 
                      value={formData.experience} 
                      onChange={handleChange} 
                      placeholder="e.g. 2-3 years" 
                      required 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender Preference</label>
                  <div className="relative">
                    <select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                    >
                      <option value="Any">Any</option>
                      {genders.map((g, idx) => (
                        <option key={idx} value={g}>{g}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Vacancies</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="text-gray-500 h-5 w-5" />
                    </div>
                    <input 
                      name="vacancies" 
                      type="number" 
                      min="1"
                      value={formData.vacancies} 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <div className="mt-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="isNewJob" 
                        checked={formData.isNewJob} 
                        onChange={handleChange}
                        className="sr-only peer" 
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-gray-700">Highlight as New Job</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={nextSection}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center"
              >
                Next: Location
                <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Location Section */}
          <div className={`transition-all duration-300 ${activeSection === 2 ? 'block' : 'hidden'}`}>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <MapPin className="h-6 w-6 text-green-700" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Location Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="e.g. Downtown" 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    placeholder="e.g. New York" 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange} 
                    placeholder="e.g. NY" 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                type="button" 
                onClick={prevSection}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg shadow-sm transition-colors flex items-center"
              >
                <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              <button 
                type="button" 
                onClick={nextSection}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center"
              >
                Next: Spa & Contact
                <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Spa & Contact Section */}
          <div className={`transition-all duration-300 ${activeSection === 3 ? 'block' : 'hidden'}`}>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <Building className="h-6 w-6 text-purple-700" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Spa & Contact Information</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Spa</label>
                  <div className="relative">
                    <select 
                      name="spa" 
                      value={formData.spa} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                    >
                      <option value="">Select Spa</option>
                      {spas.map((spa) => (
                        <option key={spa._id} value={spa._id}>{spa.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">HR Phone</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="text-gray-500 h-5 w-5" />
                      </div>
                      <input 
                        name="hrPhone" 
                        value={formData.hrPhone} 
                        onChange={handleChange} 
                        placeholder="e.g. +1 (555) 123-4567" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">HR WhatsApp</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MessageSquare className="text-gray-500 h-5 w-5" />
                      </div>
                      <input 
                        name="hrWhatsapp" 
                        value={formData.hrWhatsapp} 
                        onChange={handleChange} 
                        placeholder="e.g. +1 (555) 123-4567" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                type="button" 
                onClick={prevSection}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg shadow-sm transition-colors flex items-center"
              >
                <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              <button 
                type="button" 
                onClick={nextSection}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center"
              >
                Next: Description
                <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Description Section */}
          <div className={`transition-all duration-300 ${activeSection === 4 ? 'block' : 'hidden'}`}>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md mb-6">
              <div className="flex items-center mb-6">
                <div className="bg-amber-100 p-3 rounded-lg mr-4">
                  <FileText className="h-6 w-6 text-amber-700" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Job Description & Requirements</h3>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                  <div className="relative">
                    <textarea 
                      name="requirements" 
                      value={formData.requirements} 
                      onChange={handleChange} 
                      placeholder="List all job requirements here..." 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                      rows="3"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Describe qualifications, skills, and experience required for this position.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                  <div className="relative">
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange} 
                      placeholder="Provide a detailed job description..." 
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                      rows="5"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Include responsibilities, daily activities, and any other important details about the role.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Final Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button 
                type="button" 
                onClick={prevSection}
                className="order-2 sm:order-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center"
              >
                <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              
              <div className="order-1 sm:order-2 flex flex-col sm:flex-row gap-3">
                <button 
                  type="button"
                  onClick={handleGoBack}
                  className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center"
                >
                  Cancel
                </button>
                
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center disabled:bg-blue-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSpaJobForm;