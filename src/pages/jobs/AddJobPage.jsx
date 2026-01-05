import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Check, AlertCircle, Briefcase, DollarSign, MapPin, Users, 
  Phone, MessageSquare, ArrowLeft, Calendar, Award, 
  Settings, FileText, Building, PlusCircle, Search, ChevronDown
} from "lucide-react";
import spaService from "../../api/services/spa.service";
import jobService from "../../api/services/job.service";
import API from "../../api/config/axios";
import { endpoints } from "../../api/config/endpoints";

// Searchable Spa Selector Component
const SearchableSpaSelector = ({ spas, value, onChange, required = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSpas, setFilteredSpas] = useState(spas);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Get selected spa name
  const selectedSpa = spas.find(spa => spa._id === value);
  const selectedSpaName = selectedSpa ? selectedSpa.name : '';

  // Filter spas based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSpas(spas);
    } else {
      const filtered = spas.filter(spa =>
        spa.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSpas(filtered);
    }
  }, [searchTerm, spas]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  const handleSelectSpa = (spa) => {
    onChange(spa._id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSpas.length === 1) {
        handleSelectSpa(filteredSpas[0]);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Spa {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Main selector button */}
      <div 
        onClick={handleToggleDropdown}
        className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer flex items-center justify-between ${
          isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''
        }`}
      >
        <div className="flex items-center flex-1 min-w-0">
          <Building className="text-gray-500 h-5 w-5 mr-3 flex-shrink-0" />
          <span className={`truncate ${selectedSpaName ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedSpaName || 'Search and select spa...'}
          </span>
        </div>
        <ChevronDown 
          className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ml-2 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search input */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search spas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredSpas.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500">
                <Building className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No spas found</p>
                {searchTerm && (
                  <p className="text-xs text-gray-400 mt-1">
                    Try adjusting your search term
                  </p>
                )}
              </div>
            ) : (
              filteredSpas.map((spa) => (
                <div
                  key={spa._id}
                  onClick={() => handleSelectSpa(spa)}
                  className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between hover:bg-blue-50 ${
                    value === spa._id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <Building className={`h-4 w-4 mr-3 flex-shrink-0 ${
                      value === spa._id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <span className="truncate font-medium">{spa.name}</span>
                  </div>
                  {value === spa._id && (
                    <Check className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer with count */}
          {filteredSpas.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
              {searchTerm ? (
                <>Showing {filteredSpas.length} of {spas.length} spas</>
              ) : (
                <>{spas.length} spas available</>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AddJobPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    salary: "",
    location: "",
    city: "",
    state: "",
    category: "",
    experience: "",
    description: "",
    hrWhatsapp: "8422855035",
    hrPhone: "8422855035",
    gender: "",
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

  // Fetch spa list and enums
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch spas using spaService
        const spasData = await spaService.getAllSpas();
        const spasArray = Array.isArray(spasData) ? spasData : [];
        setSpas(spasArray);
        
        // Fetch enum values using API
        const enumsResponse = await API.get(endpoints.categories.list);
        const enumsData = enumsResponse.data;
        setCategories(enumsData.categories || []);
        setGenders(enumsData.genders || []);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Failed to load form data. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSpaChange = (spaId) => {
    setFormData((prev) => ({
      ...prev,
      spa: spaId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create job using jobService
      await jobService.createJob(formData);
      
      setSuccessMessage("Job added successfully!");
      
      // Reset form
      setFormData({
        title: "",
        salary: "",
        location: "",
        city: "",
        state: "",
        category: "",
        experience: "",
        description: "",
        hrWhatsapp: "8422855035",
        hrPhone: "8422855035",
        gender: "",
        isNewJob: true,
        vacancies: 1,
        requirements: "",
        spa: "",
      });
      
      // Auto-hide success message after 3 seconds, then navigate back
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/jobs");
      }, 3000);
      
    } catch (err) {
      console.error("Error submitting job:", err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to submit job. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnotherSubmission = () => {
    setFormData({
      title: "",
      salary: "",
      location: "",
      city: "",
      state: "",
      category: "",
      experience: "",
      description: "",
      hrWhatsapp: "8422855035",
      hrPhone: "8422855035",
      gender: "",
      isNewJob: true,
      vacancies: 1,
      requirements: "",
      spa: "",
    });
    setSuccessMessage("");
    setError(null);
    setActiveSection(1);
    window.scrollTo(0, 0);
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
          <h3 className="text-xl font-medium text-gray-700 mb-2">Loading Form Data</h3>
          <p className="text-gray-500">Getting everything ready for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-600 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8 flex justify-between items-center">
          <div>
            <button 
              onClick={handleGoBack} 
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium text-lg"
            >
              <ArrowLeft className="mr-3 h-6 w-6" />
              Back to Spa Management
            </button>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 flex items-center">
            <Briefcase className="mr-4 text-blue-600 h-8 w-8" />
            Add New Spa Job
          </h2>
        </div>
        
        {/* Alert Messages */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 flex items-start">
              <div className="bg-red-100 rounded-full p-3 mr-4 flex-shrink-0">
                <AlertCircle className="text-red-500 h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-red-800 mb-2 text-lg">There was a problem</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 flex items-start">
              <div className="bg-green-100 rounded-full p-3 mr-4 flex-shrink-0">
                <Check className="text-green-500 h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-green-800 mb-2 text-lg">Success!</h3>
                <p className="text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8 bg-white rounded-xl shadow-md p-6">
          <div 
            className={`flex flex-col items-center cursor-pointer ${activeSection >= 1 ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => goToSection(1)}
          >
            <div className={`rounded-full h-12 w-12 flex items-center justify-center border-2 ${activeSection >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} mb-3`}>
              <Briefcase className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Job Details</span>
          </div>
          
          <div className={`flex-1 h-1 mx-6 rounded ${activeSection >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          
          <div 
            className={`flex flex-col items-center cursor-pointer ${activeSection >= 2 ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => goToSection(2)}
          >
            <div className={`rounded-full h-12 w-12 flex items-center justify-center border-2 ${activeSection >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} mb-3`}>
              <MapPin className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Location</span>
          </div>
          
          <div className={`flex-1 h-1 mx-6 rounded ${activeSection >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          
          <div 
            className={`flex flex-col items-center cursor-pointer ${activeSection >= 3 ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => goToSection(3)}
          >
            <div className={`rounded-full h-12 w-12 flex items-center justify-center border-2 ${activeSection >= 3 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} mb-3`}>
              <Building className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Spa & Contact</span>
          </div>
          
          <div className={`flex-1 h-1 mx-6 rounded ${activeSection >= 4 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          
          <div 
            className={`flex flex-col items-center cursor-pointer ${activeSection >= 4 ? 'text-blue-600' : 'text-gray-400'}`}
            onClick={() => goToSection(4)}
          >
            <div className={`rounded-full h-12 w-12 flex items-center justify-center border-2 ${activeSection >= 4 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} mb-3`}>
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Description</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          {/* Job Details Section */}
          <div className={`transition-all duration-300 ${activeSection === 1 ? 'block' : 'hidden'}`}>
            <div className="bg-white p-10 rounded-xl shadow-md mb-8">
              <div className="flex items-center mb-8">
                <div className="bg-blue-100 p-4 rounded-lg mr-6">
                  <Briefcase className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">Job Details</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="e.g. Massage Therapist" 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
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
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Settings className="text-gray-500 h-5 w-5" />
                    </div>
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange} 
                      required 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none text-lg"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Required</label>
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
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender Preference</label>
                  <div className="relative">
                    <select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none text-lg"
                    >
                      <option value="Any">Select Gender</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Vacancies</label>
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
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg" 
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="mt-4">
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
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center text-lg"
              >
                Next: Location
                <svg className="ml-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Location Section */}
          <div className={`transition-all duration-300 ${activeSection === 2 ? 'block' : 'hidden'}`}>
            <div className="bg-white p-10 rounded-xl shadow-md mb-8">
              <div className="flex items-center mb-8">
                <div className="bg-green-100 p-4 rounded-lg mr-6">
                  <MapPin className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">Location Details</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="e.g. Navi Mumbai" 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area City</label>
                  <input 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    placeholder="e.g. Vashi" 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange} 
                    placeholder="e.g. Maharashtra" 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg" 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                type="button" 
                onClick={prevSection}
                className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg shadow-sm transition-colors flex items-center text-lg"
              >
                <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              <button 
                type="button" 
                onClick={nextSection}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center text-lg"
              >
                Next: Spa & Contact
                <svg className="ml-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Spa & Contact Section */}
          <div className={`transition-all duration-300 ${activeSection === 3 ? 'block' : 'hidden'}`}>
            <div className="bg-white p-10 rounded-xl shadow-md mb-8">
              <div className="flex items-center mb-8">
                <div className="bg-purple-100 p-4 rounded-lg mr-6">
                  <Building className="h-8 w-8 text-purple-700" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">Spa & Contact Information</h3>
              </div>
              
              <div className="space-y-8">
                {/* Searchable Spa Selector */}
                <SearchableSpaSelector
                  spas={spas}
                  value={formData.spa}
                  onChange={handleSpaChange}
                  required={true}
                />
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">HR Phone</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="text-gray-500 h-5 w-5" />
                      </div>
                      <input 
                        name="hrPhone" 
                        value={formData.hrPhone} 
                        onChange={handleChange} 
                        placeholder="Enter HR phone number" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">HR WhatsApp</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MessageSquare className="text-gray-500 h-5 w-5" />
                      </div>
                      <input 
                        name="hrWhatsapp" 
                        value={formData.hrWhatsapp} 
                        onChange={handleChange} 
                        placeholder="Enter WhatsApp number" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg" 
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
                className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg shadow-sm transition-colors flex items-center text-lg"
              >
                <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              <button 
                type="button" 
                onClick={nextSection}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center text-lg"
              >
                Next: Description
                <svg className="ml-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Description Section */}
          <div className={`transition-all duration-300 ${activeSection === 4 ? 'block' : 'hidden'}`}>
            <div className="bg-white p-10 rounded-xl shadow-md mb-8">
              <div className="flex items-center mb-8">
                <div className="bg-amber-100 p-4 rounded-lg mr-6">
                  <FileText className="h-8 w-8 text-amber-700" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">Job Description & Requirements</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                  <div className="relative">
                    <textarea 
                      name="requirements" 
                      value={formData.requirements} 
                      onChange={handleChange} 
                      placeholder="List all job requirements here..." 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg" 
                      rows="4"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Describe qualifications, skills, and experience required for this position.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                  <div className="relative">
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange} 
                      placeholder="Provide a detailed job description..." 
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg" 
                      rows="6"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Include responsibilities, daily activities, and any other important details about the role.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Final Action Buttons */}
            <div className="flex justify-between gap-6">
              <button 
                type="button" 
                onClick={prevSection}
                className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg shadow-sm transition-colors flex items-center text-lg"
              >
                <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
              </button>
              
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={handleGoBack}
                  className="px-8 py-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm transition-colors flex items-center text-lg"
                >
                  Cancel
                </button>
                
                {successMessage && (
                  <button 
                    type="button"
                    onClick={handleAnotherSubmission}
                    className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center text-lg"
                  >
                    <PlusCircle className="mr-3 h-6 w-6" />
                    Add Another Job
                  </button>
                )}
                
                <button 
                  type="submit" 
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center disabled:bg-blue-400 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Job
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

export default AddJobPage;