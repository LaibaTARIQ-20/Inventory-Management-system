// src/components/common/MapContainer.jsx

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Box, CircularProgress, Alert } from "@mui/material";

/**
 * Reusable Google Maps Container
 *
 * @param {Object} center - Map center {lat, lng}
 * @param {number} zoom - Zoom level (1-20)
 * @param {Function} onClick - Click handler
 * @param {React.ReactNode} children - Map markers/overlays
 * @param {Object} containerStyle - Custom container styles
 */
const MapContainer = ({
  center = { lat: 33.0354, lng: 73.7239 }, // Jhelum, Pakistan default
  zoom = 12,
  onClick,
  children,
  containerStyle = { width: "100%", height: "400px" },
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  if (loadError) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error loading Google Maps. Please check your API key.
      </Alert>
    );
  }

  if (!isLoaded) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          ...containerStyle,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onClick={onClick}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {children}
    </GoogleMap>
  );
};

export default MapContainer;
