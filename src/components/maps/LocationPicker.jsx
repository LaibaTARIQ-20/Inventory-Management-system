// src/components/maps/LocationPicker.jsx
// COMPLETELY FIXED: No redirects, coordinates field is disabled

import { useState } from "react";
import { Marker, Autocomplete } from "@react-google-maps/api";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  Paper,
  Chip,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import MapContainer from "./MapContainer";

/**
 * Enhanced Location Picker Component
 * FIXED: Coordinates field won't redirect, all buttons work properly
 */
const LocationPicker = ({
  initialLocation = null,
  onLocationSelect,
  onAddressChange,
  label = "Select Location",
  required = false,
}) => {
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || { lat: 33.0354, lng: 73.7239 }
  );
  const [address, setAddress] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Reverse Geocoding
   */
  const getAddressFromCoords = async (lat, lng) => {
    try {
      setLoading(true);
      setError("");

      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat, lng };

      geocoder.geocode({ location: latlng }, (results, status) => {
        setLoading(false);

        if (status === "OK" && results[0]) {
          const fullAddress = results[0].formatted_address;
          setAddress(fullAddress);

          if (onAddressChange) {
            onAddressChange(fullAddress);
          }
        } else {
          setError("Unable to fetch address. Please enter manually.");
        }
      });
    } catch (err) {
      setLoading(false);
      setError("Error fetching address");
      console.error("Geocoding error:", err);
    }
  };

  /**
   * Handle Map Click
   */
  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    const location = { lat, lng };
    setSelectedLocation(location);

    if (onLocationSelect) {
      onLocationSelect(location);
    }

    await getAddressFromCoords(lat, lng);
  };

  /**
   * Get Current Location - FIXED
   */
  const handleGetCurrentLocation = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const location = { lat, lng };

          setSelectedLocation(location);

          if (onLocationSelect) {
            onLocationSelect(location);
          }

          await getAddressFromCoords(lat, lng);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
          alert("Could not get your current location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  /**
   * Toggle Map - FIXED
   */
  const handleToggleMap = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMap(!showMap);
  };

  /**
   * Handle Place Search
   */
  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const location = { lat, lng };

        setSelectedLocation(location);

        if (onLocationSelect) {
          onLocationSelect(location);
        }

        setAddress(place.formatted_address || "");
        if (onAddressChange) {
          onAddressChange(place.formatted_address || "");
        }

        setError("");
      }
    }
  };

  return (
    <Box sx={{ my: 2 }}>
      {/* Label */}
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{ mb: 1, fontWeight: 600 }}
      >
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </Typography>

      {/* Coordinates Display - FIXED: Disabled instead of readOnly */}
      <Box sx={{ mb: 1 }}>
        {selectedLocation.lat && selectedLocation.lng ? (
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f5f5f5",
              borderRadius: 1,
              border: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <LocationOnIcon color="primary" fontSize="small" />
            <Typography variant="body2" fontWeight={500}>
              Lat: {selectedLocation.lat.toFixed(4)}, Lng:{" "}
              {selectedLocation.lng.toFixed(4)}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f9f9f9",
              borderRadius: 1,
              border: "1px dashed #ccc",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Click "Show Map" to select location
            </Typography>
          </Box>
        )}
      </Box>

      {/* Address Display */}
      {address && (
        <Alert
          severity="success"
          sx={{ mb: 1 }}
          action={
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setAddress("");
                if (onAddressChange) {
                  onAddressChange("");
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <Typography variant="body2">
            <strong>✅ Address:</strong> {address}
          </Typography>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert
          severity="warning"
          sx={{ mb: 1 }}
          onClose={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setError("");
          }}
        >
          {error}
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        <Button
          type="button"
          size="small"
          variant={showMap ? "contained" : "outlined"}
          onClick={handleToggleMap}
        >
          {showMap ? "Hide Map" : "Show Map"}
        </Button>
        <Button
          type="button"
          size="small"
          variant="outlined"
          startIcon={<MyLocationIcon />}
          onClick={handleGetCurrentLocation}
          disabled={loading}
        >
          {loading ? "Getting Location..." : "Use Current Location"}
        </Button>
      </Box>

      {/* Map Display */}
      {showMap && (
        <Paper
          elevation={3}
          sx={{
            border: "2px solid #1976d2",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* Search Bar */}
          <Box
            sx={{
              p: 2,
              bgcolor: "white",
              borderBottom: "2px solid #e0e0e0",
            }}
          >
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <TextField
                fullWidth
                size="small"
                placeholder="🔍 Search location (e.g., Jhelum, Pakistan)..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "primary.main" }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#f9f9f9",
                  },
                }}
              />
            </Autocomplete>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1 }}
            >
              💡 Click anywhere on the map to select location, or search above
            </Typography>
          </Box>

          {/* Map */}
          <MapContainer
            center={selectedLocation}
            zoom={13}
            onClick={handleMapClick}
            containerStyle={{ height: 400 }}
          >
            {selectedLocation.lat && selectedLocation.lng && (
              <Marker
                position={selectedLocation}
                animation={window.google.maps.Animation.DROP}
              />
            )}
          </MapContainer>

          {/* Loading Indicator */}
          {loading && (
            <Box
              sx={{
                p: 2,
                textAlign: "center",
                bgcolor: "#e3f2fd",
                borderTop: "2px solid #1976d2",
              }}
            >
              <Typography variant="body2" color="primary" fontWeight={600}>
                ⏳ Fetching address...
              </Typography>
            </Box>
          )}

          {/* Footer */}
          <Box
            sx={{
              p: 1.5,
              textAlign: "center",
              bgcolor: "#f5f5f5",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Chip
              icon={<LocationOnIcon fontSize="small" />}
              label={`Lat: ${selectedLocation.lat.toFixed(
                4
              )}, Lng: ${selectedLocation.lng.toFixed(4)}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default LocationPicker;
