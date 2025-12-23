// src/utils/mapHelpers.js
// Reusable Map Utility Functions
// Following the principle: Write once, use everywhere! ✨

/**
 * Calculate the center point of multiple locations
 * Used to auto-center the map based on all markers
 *
 * @param {Array} locations - Array of objects with lat and lng properties
 * @returns {Object} - { lat, lng } center coordinates
 *
 * @example
 * const suppliers = [
 *   { lat: 33.5, lng: 73.2 },
 *   { lat: 33.8, lng: 73.5 }
 * ];
 * const center = calculateMapCenter(suppliers);
 * // Returns: { lat: 33.65, lng: 73.35 }
 */
export const calculateMapCenter = (locations) => {
  if (!locations || locations.length === 0) {
    // Default: Jhelum, Pakistan
    return { lat: 33.0354, lng: 73.7239 };
  }

  // Filter out locations without valid coordinates
  const validLocations = locations.filter(
    (loc) => loc.lat != null && loc.lng != null
  );

  if (validLocations.length === 0) {
    return { lat: 33.0354, lng: 73.7239 };
  }

  // Calculate average latitude and longitude
  const avgLat =
    validLocations.reduce((sum, loc) => sum + loc.lat, 0) /
    validLocations.length;
  const avgLng =
    validLocations.reduce((sum, loc) => sum + loc.lng, 0) /
    validLocations.length;

  return { lat: avgLat, lng: avgLng };
};

/**
 * Calculate map bounds to fit all markers
 * Useful for auto-zoom to show all locations
 *
 * @param {Array} locations - Array of objects with lat and lng properties
 * @returns {Object} - { north, south, east, west } bounds
 */
export const calculateMapBounds = (locations) => {
  if (!locations || locations.length === 0) {
    return null;
  }

  const validLocations = locations.filter(
    (loc) => loc.lat != null && loc.lng != null
  );

  if (validLocations.length === 0) {
    return null;
  }

  const lats = validLocations.map((loc) => loc.lat);
  const lngs = validLocations.map((loc) => loc.lng);

  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
  };
};

/**
 * Calculate distance between two coordinates (in kilometers)
 * Uses Haversine formula
 *
 * @param {Object} point1 - { lat, lng }
 * @param {Object} point2 - { lat, lng }
 * @returns {number} - Distance in kilometers
 *
 * @example
 * const distance = calculateDistance(
 *   { lat: 33.0354, lng: 73.7239 },
 *   { lat: 33.5, lng: 73.8 }
 * );
 * console.log(distance); // ~53.4 km
 */
export const calculateDistance = (point1, point2) => {
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) *
      Math.cos(toRadians(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal
};

/**
 * Convert degrees to radians
 * Helper function for distance calculation
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Format coordinates for display
 *
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} decimals - Number of decimal places (default: 4)
 * @returns {string} - Formatted coordinates
 *
 * @example
 * formatCoordinates(33.0354, 73.7239);
 * // Returns: "33.0354, 73.7239"
 */
export const formatCoordinates = (lat, lng, decimals = 4) => {
  if (lat == null || lng == null) {
    return "No coordinates";
  }

  return `${lat.toFixed(decimals)}, ${lng.toFixed(decimals)}`;
};

/**
 * Generate Google Maps URL for a location
 *
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} - Google Maps URL
 */
export const getGoogleMapsUrl = (lat, lng) => {
  return `https://www.google.com/maps?q=${lat},${lng}`;
};

/**
 * Generate Google Maps directions URL between two points
 *
 * @param {Object} origin - { lat, lng }
 * @param {Object} destination - { lat, lng }
 * @returns {string} - Google Maps directions URL
 */
export const getDirectionsUrl = (origin, destination) => {
  return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`;
};

/**
 * Check if coordinates are valid
 *
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} - True if valid coordinates
 */
export const isValidCoordinates = (lat, lng) => {
  return (
    lat != null &&
    lng != null &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

/**
 * Filter locations by radius (find locations within X km of a point)
 *
 * @param {Array} locations - Array of objects with lat and lng
 * @param {Object} center - { lat, lng } center point
 * @param {number} radiusKm - Radius in kilometers
 * @returns {Array} - Filtered locations within radius
 *
 * @example
 * const nearby = filterLocationsByRadius(
 *   suppliers,
 *   { lat: 33.0354, lng: 73.7239 },
 *   50 // 50 km radius
 * );
 */
export const filterLocationsByRadius = (locations, center, radiusKm) => {
  return locations.filter((location) => {
    const distance = calculateDistance(center, {
      lat: location.lat,
      lng: location.lng,
    });
    return distance <= radiusKm;
  });
};

/**
 * Get default map center for Pakistan (Jhelum)
 * Fallback location when no data is available
 */
export const getDefaultCenter = () => {
  return { lat: 33.0354, lng: 73.7239 }; // Jhelum, Pakistan
};

/**
 * Get default map zoom level based on number of locations
 *
 * @param {number} count - Number of locations
 * @returns {number} - Appropriate zoom level
 */
export const getDefaultZoom = (count) => {
  if (count === 0) return 12; // City level
  if (count === 1) return 15; // Street level
  if (count <= 5) return 12; // City level
  if (count <= 20) return 10; // Region level
  return 8; // Province level
};

/**
 * Parse address string from location object
 * Handles different address formats
 *
 * @param {Object} location - Location object with address field
 * @returns {string} - Formatted address
 */
export const parseAddress = (location) => {
  if (!location) return "No address";

  if (typeof location.address === "string") {
    return location.address;
  }

  // Handle structured address
  if (location.street || location.city || location.country) {
    const parts = [
      location.street,
      location.city,
      location.state,
      location.country,
    ].filter(Boolean);
    return parts.join(", ");
  }

  return "No address";
};

/**
 * Export all helpers as default object
 * Allows: import mapHelpers from '../../utils/mapHelpers';
 */
export default {
  calculateMapCenter,
  calculateMapBounds,
  calculateDistance,
  formatCoordinates,
  getGoogleMapsUrl,
  getDirectionsUrl,
  isValidCoordinates,
  filterLocationsByRadius,
  getDefaultCenter,
  getDefaultZoom,
  parseAddress,
};
