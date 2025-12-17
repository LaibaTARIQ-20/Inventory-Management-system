// src/components/maps/MultipleMarkers.jsx

import { Marker, InfoWindow } from "@react-google-maps/api";
import { useState, useMemo } from "react";
import { Box, Typography, Button } from "@mui/material";
import MapContainer from "./MapContainer";

/**
 * Multiple Markers - Display multiple locations on one map
 *
 * @param {Object} props
 * @param {Array} props.locations - Array of {id, lat, lng, name, ...}
 * @param {string} props.height - Map height (default: 500px)
 * @param {Function} props.onMarkerClick - Callback when marker clicked
 */
const MultipleMarkers = ({
  locations = [],
  height = "500px",
  onMarkerClick,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Calculate map center from all locations
  const mapCenter = useMemo(() => {
    if (locations.length === 0) {
      return { lat: 33.6844, lng: 73.0479 }; // Default: Islamabad
    }

    const avgLat =
      locations.reduce((sum, loc) => sum + (loc.lat || 0), 0) /
      locations.length;
    const avgLng =
      locations.reduce((sum, loc) => sum + (loc.lng || 0), 0) /
      locations.length;

    return { lat: avgLat, lng: avgLng };
  }, [locations]);

  // Handle marker click
  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    if (onMarkerClick) {
      onMarkerClick(location);
    }
  };

  // If no locations
  if (locations.length === 0) {
    return (
      <Box
        sx={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.100",
          borderRadius: 1,
          border: "1px dashed",
          borderColor: "grey.400",
        }}
      >
        <Typography color="text.secondary">
          📍 No locations to display
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          📍 Showing {locations.length} location
          {locations.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      <MapContainer
        center={mapCenter}
        zoom={locations.length === 1 ? 15 : 11}
        containerStyle={{ height }}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => handleMarkerClick(location)}
            title={location.name}
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <Box sx={{ minWidth: 250, maxWidth: 300 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {selectedLocation.name}
              </Typography>

              {selectedLocation.address && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  📍 {selectedLocation.address}
                </Typography>
              )}

              {selectedLocation.phone && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  📞 {selectedLocation.phone}
                </Typography>
              )}

              {selectedLocation.email && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  ✉️ {selectedLocation.email}
                </Typography>
              )}

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Coordinates: {selectedLocation.lat.toFixed(4)},{" "}
                {selectedLocation.lng.toFixed(4)}
              </Typography>
            </Box>
          </InfoWindow>
        )}
      </MapContainer>
    </Box>
  );
};

export default MultipleMarkers;
