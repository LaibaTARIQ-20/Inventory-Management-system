// src/components/maps/LocationPicker.jsx
// ✅ CORRECT: In maps folder with MapContainer

import { useState } from "react";
import { Marker } from "@react-google-maps/api";
import { Box, TextField, Button, Typography } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";

// ✅ CORRECT: MapContainer is in SAME folder (maps/)
import MapContainer from "./MapContainer";

/**
 * Location Picker Component - Select location on map
 *
 * @param {Object} initialLocation - Initial location {lat, lng}
 * @param {Function} onLocationSelect - Called when location changes
 * @param {string} label - Field label
 * @param {boolean} required - Is field required?
 */
const LocationPicker = ({
  initialLocation = null,
  onLocationSelect,
  label = "Select Location",
  required = false,
}) => {
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || { lat: 33.0354, lng: 73.7239 }
  );

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    const location = { lat, lng };
    setSelectedLocation(location);

    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const location = { lat, lng };

          setSelectedLocation(location);

          if (onLocationSelect) {
            onLocationSelect(location);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Could not get your current location. Please select manually on the map."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </Typography>

      {/* Location Display */}
      <TextField
        fullWidth
        value={
          selectedLocation.lat && selectedLocation.lng
            ? `Lat: ${selectedLocation.lat.toFixed(
                4
              )}, Lng: ${selectedLocation.lng.toFixed(4)}`
            : "Click map to select location"
        }
        placeholder="Click map to select location"
        InputProps={{
          readOnly: true,
        }}
        onClick={() => setShowMap(!showMap)}
        sx={{ mb: 1, cursor: "pointer" }}
      />

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? "Hide Map" : "Show Map"}
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<MyLocationIcon />}
          onClick={handleGetCurrentLocation}
        >
          Use Current Location
        </Button>
      </Box>

      {/* Map Display */}
      {showMap && (
        <Box sx={{ border: "1px solid #ddd", borderRadius: 1 }}>
          <MapContainer
            center={selectedLocation}
            zoom={13}
            onClick={handleMapClick}
          >
            {selectedLocation.lat && selectedLocation.lng && (
              <Marker position={selectedLocation} />
            )}
          </MapContainer>
        </Box>
      )}
    </Box>
  );
};

export default LocationPicker;
