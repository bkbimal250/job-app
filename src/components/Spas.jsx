import React, { useState, useEffect, useCallback } from "react";
import { Search, Plus, Phone, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { getToken } from "../utils/getToken";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

const Spas = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [spas, setSpas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [spasPerPage] = useState(10);

  const fetchSpas = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/spas/spaall/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      setSpas(data);
      if (!data.length) setError("No spa data found");
    } catch (err) {
      console.error(err);
      setError("Unable to load spas data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpas();
  }, [fetchSpas]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const getFilterOptions = (field) => {
    const options = new Set();
    spas.forEach((spa) => spa.address?.[field] && options.add(spa.address[field]));
    return Array.from(options);
  };

  const getFilteredSpas = () =>
    spas.filter((spa) => {
      const nameMatch = spa.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const streetMatch = spa.address?.street?.toLowerCase().includes(searchTerm.toLowerCase());
      const stateMatch = stateFilter === "all" || spa.address?.state === stateFilter;
      const cityMatch = cityFilter === "all" || spa.address?.city === cityFilter;
      const phoneMatch = phoneFilter === "" || spa.phone?.includes(phoneFilter);
      return (nameMatch || streetMatch) && stateMatch && cityMatch && phoneMatch;
    });
    
  // Filtered spas with pagination
  const filteredSpas = getFilteredSpas();
  
  // Pagination calculation
  const indexOfLastSpa = currentPage * spasPerPage;
  const indexOfFirstSpa = indexOfLastSpa - spasPerPage;
  const currentSpas = filteredSpas.slice(indexOfFirstSpa, indexOfLastSpa);
  const totalPages = Math.ceil(filteredSpas.length / spasPerPage);

  // Page navigation
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, stateFilter, cityFilter, phoneFilter]);

  // Navigate to Add Spa page
  const handleAddSpa = () => {
    navigate('addSpa');
  };

  // Navigate to Edit Spa page
  const handleEditSpa = (spa) => {
    navigate(`/edit-spa/${spa._id}`);
  };

  const handleDeleteSpa = async (spa) => {
    if (window.confirm(`Are you sure you want to delete ${spa.name}?`)) {
      try {
        await axios.delete(`${BASE_URL}/spas/spa/${spa._id}`, {
          headers: { 
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json"
          }
        });
        
        // Refresh the spa list
        fetchSpas();
        setSuccessMessage("Spa has been deleted successfully!");
      } catch (err) {
        console.error("Delete failed:", err);
        
        // Set a more specific error message
        if (err.response) {
          setError(`Failed to delete spa: ${err.response.data?.message || err.response.statusText || 'Server error'} (Status: ${err.response.status})`);
        } else if (err.request) {
          setError("No response from server. Please check your connection.");
        } else {
          setError(`Delete operation failed: ${err.message}`);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-900">Spa Management</h1>
          <button
            onClick={handleAddSpa}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition duration-200 shadow-sm"
          >
            <Plus className="mr-2" size={20} />
            Add New Spa
          </button>
        </div>
        
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-lg flex items-center shadow-sm">
            <div className="mr-3 text-emerald-500 font-bold">✓</div>
            <div>{successMessage}</div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-lg flex items-center shadow-sm">
            <div className="mr-3 text-rose-500 font-bold">⚠</div>
            <div>{error}</div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg mb-6 border border-slate-200">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-indigo-400" size={20} />
                <input
                  type="text"
                  placeholder="Search spas..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">State</label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                >
                  <option value="all">All States</option>
                  {getFilterOptions("state").map((state, idx) => (
                    <option key={idx} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">City</label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                >
                  <option value="all">All Cities</option>
                  {getFilterOptions("city").map((city, idx) => (
                    <option key={idx} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                <Phone className="absolute left-3 top-8 text-indigo-400" size={20} />
                <input
                  type="text"
                  placeholder="Phone"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={phoneFilter}
                  onChange={(e) => setPhoneFilter(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">State</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">City</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Website</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                      <p className="text-slate-500">Loading spas...</p>
                    </td>
                  </tr>
                ) : currentSpas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10">
                      <div className="bg-indigo-50 rounded-full p-4 inline-flex mx-auto mb-4">
                        <Search className="text-indigo-400" size={24} />
                      </div>
                      <p className="text-slate-700 text-lg mb-2">No spas found</p>
                      <p className="text-slate-500">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  currentSpas.map((spa) => (
                    <tr key={spa._id} className="hover:bg-indigo-50 transition-colors">
                      <td className="px-4 py-3 text-indigo-800 font-medium">{spa.name}</td>
                      <td className="px-4 py-3 text-slate-700">{spa.address?.state || "-"}</td>
                      <td className="px-4 py-3 text-slate-700">{spa.address?.city || "-"}</td>
                      <td className="px-4 py-3">
                        {spa.website ? (
                          <a href={spa.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 hover:underline">
                            {spa.website.replace(/^https?:\/\//, '')}
                          </a>
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{spa.phone || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleEditSpa(spa)} 
                            className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-full transition shadow-sm"
                            title="Edit Spa"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteSpa(spa)} 
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-full transition shadow-sm"
                            title="Delete Spa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!isLoading && filteredSpas.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Showing <span className="font-medium text-indigo-700">{indexOfFirstSpa + 1}</span> to <span className="font-medium text-indigo-700">{Math.min(indexOfLastSpa, filteredSpas.length)}</span> of <span className="font-medium text-indigo-700">{filteredSpas.length}</span> spas
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-8 h-8 rounded-md transition ${
                      currentPage === 1 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-slate-300'
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {/* Page number buttons */}
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                      let pageNum;
                      
                      // Display logic for showing relevant page numbers
                      if (totalPages <= 5) {
                        // If 5 or fewer pages, show all
                        pageNum = idx + 1;
                      } else if (currentPage <= 3) {
                        // If on pages 1-3, show pages 1-5
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        // If on last 3 pages, show last 5 pages
                        pageNum = totalPages - 4 + idx;
                      } else {
                        // Otherwise show current page and 2 on each side
                        pageNum = currentPage - 2 + idx;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`flex items-center justify-center w-8 h-8 rounded-md transition ${
                            currentPage === pageNum
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-slate-700 hover:bg-indigo-50 border border-slate-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    {/* Show ellipsis if there are more pages */}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="flex items-center justify-center w-8 h-8 text-slate-500">...</span>
                    )}
                    
                    {/* Always show last page if there are more than 5 pages and we're not already showing it */}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <button
                        onClick={() => paginate(totalPages)}
                        className="flex items-center justify-center w-8 h-8 rounded-md transition bg-white text-slate-700 hover:bg-indigo-50 border border-slate-300"
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-8 h-8 rounded-md transition ${
                      currentPage === totalPages 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-slate-300'
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Spas;