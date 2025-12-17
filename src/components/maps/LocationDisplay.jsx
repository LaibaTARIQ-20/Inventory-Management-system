// src/components/maps/LocationDisplay.jsx

import { Marker } from "@react-google-maps/api";
import { Box, Button, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MapContainer from "./MapContainer";

/**
 * Location Display Component
 * Display a single location on map (read-only, no interaction)
 *
 * @param {Object} props
 * @param {Object} props.initialLocation - Location to display {lat, lng}
 * @param {string} props.title - Location title (e.g., supplier name)
 * @param {string} props.height - Map height (default: 400px)
 * @param {number} props.zoom - Zoom level (default: 15)
 */
const LocationDisplay = ({
  initialLocation,
  title = "Location",
  height = "400px",
  zoom = 15,
}) => {
  // No location provided
  if (!initialLocation || !initialLocation.lat || !initialLocation.lng) {
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
          📍 No location data available
        </Typography>
      </Box>
    );
  }

  // Open in Google Maps
  const handleOpenInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${initialLocation.lat},${initialLocation.lng}`;
    window.open(url, "_blank");
  };

  return (
    <Box>
      <MapContainer
        center={initialLocation}
        zoom={zoom}
        containerStyle={{ height }}
      >
        <Marker position={initialLocation} title={title} />
      </MapContainer>

      {/* Action Button */}
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<OpenInNewIcon />}
          onClick={handleOpenInGoogleMaps}
        >
          Open in Google Maps
        </Button>
      </Box>
    </Box>
  );
};

export default LocationDisplay;
