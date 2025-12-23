// src/components/dashboard/SuppliersMapWidget.jsx
// Dashboard widget showing suppliers on a small map

import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Alert,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { Marker, InfoWindow } from "@react-google-maps/api";

import MapContainer from "../maps/MapContainer";
import { calculateMapCenter, getDefaultZoom } from "../../utils/mapHelpers";

/**
 * Suppliers Map Widget - Compact map for dashboard
 * Shows up to 10 suppliers with locations
 */
const SuppliersMapWidget = () => {
  const navigate = useNavigate();
  const { suppliers } = useSelector((state) => state.suppliers);

  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Filter suppliers with locations (limit to 10 for widget)
  const suppliersWithLocation = suppliers
    .filter((s) => s.lat && s.lng)
    .slice(0, 10);

  const mapCenter = calculateMapCenter(suppliersWithLocation);
  const mapZoom = getDefaultZoom(suppliersWithLocation.length);

  const handleMarkerClick = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleViewFullMap = () => {
    navigate("/admin/suppliers/map");
  };

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MapIcon color="primary" />
            <Typography variant="h6">Supplier Locations</Typography>
          </Box>

          <Chip
            icon={<LocationOnIcon />}
            label={`${suppliersWithLocation.length} on map`}
            size="small"
            color="success"
            variant="outlined"
          />
        </Box>

        {/* Map Display */}
        {suppliersWithLocation.length > 0 ? (
          <>
            <Box sx={{ height: 300, borderRadius: 1, overflow: "hidden" }}>
              <MapContainer center={mapCenter} zoom={mapZoom}>
                {suppliersWithLocation.map((supplier) => (
                  <Marker
                    key={supplier.id}
                    position={{ lat: supplier.lat, lng: supplier.lng }}
                    title={supplier.name}
                    onClick={() => handleMarkerClick(supplier)}
                  />
                ))}

                {selectedSupplier && (
                  <InfoWindow
                    position={{
                      lat: selectedSupplier.lat,
                      lng: selectedSupplier.lng,
                    }}
                    onCloseClick={() => setSelectedSupplier(null)}
                  >
                    <Box sx={{ p: 1, minWidth: 200 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {selectedSupplier.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedSupplier.address}
                      </Typography>
                    </Box>
                  </InfoWindow>
                )}
              </MapContainer>
            </Box>

            {/* View Full Map Button */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<OpenInFullIcon />}
              onClick={handleViewFullMap}
              sx={{ mt: 2 }}
            >
              View Full Map ({suppliers.filter((s) => s.lat && s.lng).length}{" "}
              total locations)
            </Button>
          </>
        ) : (
          <Alert severity="info">
            <Typography variant="body2">
              No suppliers with location data yet. Add locations to see them on
              the map.
            </Typography>
            <Button
              size="small"
              variant="contained"
              sx={{ mt: 1 }}
              onClick={() => navigate("/admin/suppliers")}
            >
              Add Supplier Locations
            </Button>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SuppliersMapWidget;
