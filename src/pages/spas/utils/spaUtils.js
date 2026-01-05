// Spa Utility Functions

/**
 * Get spa display name
 * @param {Object} spa - Spa object
 * @returns {string} Display name
 */
export const getSpaDisplayName = (spa) => {
  if (!spa) return 'Unknown Spa';
  return spa.name || 'Unnamed Spa';
};

/**
 * Get spa location string
 * @param {Object} spa - Spa object
 * @returns {string} Location string
 */
export const getSpaLocation = (spa) => {
  if (!spa || !spa.address) return 'N/A';
  const { city, state } = spa.address;
  if (city && state) return `${city}, ${state}`;
  if (city) return city;
  if (state) return state;
  return 'N/A';
};

/**
 * Format website URL for display
 * @param {string} website - Website URL
 * @returns {string} Formatted website
 */
export const formatWebsite = (website) => {
  if (!website) return null;
  return website.replace(/^https?:\/\//, '');
};

/**
 * Filter spas by search term and filters
 * @param {Array} spas - Array of spas
 * @param {string} searchTerm - Search term
 * @param {string} stateFilter - State filter
 * @param {string} cityFilter - City filter
 * @param {string} phoneFilter - Phone filter
 * @returns {Array} Filtered spas
 */
export const filterSpas = (spas, searchTerm, stateFilter, cityFilter, phoneFilter) => {
  if (!Array.isArray(spas)) return [];

  const lowerSearch = searchTerm.toLowerCase();
  
  return spas.filter((spa) => {
    const nameMatch = spa.name?.toLowerCase().includes(lowerSearch);
    const streetMatch = spa.address?.street?.toLowerCase().includes(lowerSearch);
    const stateMatch = stateFilter === 'all' || spa.address?.state === stateFilter;
    const cityMatch = cityFilter === 'all' || spa.address?.city === cityFilter;
    const phoneMatch = !phoneFilter || spa.phone?.includes(phoneFilter);
    
    return (nameMatch || streetMatch) && stateMatch && cityMatch && phoneMatch;
  });
};

/**
 * Sort spas alphabetically by name
 * @param {Array} spas - Array of spas
 * @returns {Array} Sorted spas
 */
export const sortSpasByName = (spas) => {
  if (!Array.isArray(spas)) return [];
  
  return [...spas].sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });
};

/**
 * Get unique filter options from spas
 * @param {Array} spas - Array of spas
 * @param {string} field - Field to extract (state, city)
 * @returns {Array} Sorted unique options
 */
export const getFilterOptions = (spas, field) => {
  if (!Array.isArray(spas)) return [];
  
  const options = new Set();
  spas.forEach((spa) => {
    const value = spa.address?.[field];
    if (value) options.add(value);
  });
  
  return Array.from(options).sort((a, b) => a.localeCompare(b));
};

