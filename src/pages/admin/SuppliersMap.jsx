/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/admin/SuppliersMap.jsx
// Display all supplier locations on a single map with clickable pins

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { Marker, InfoWindow } from "@react-google-maps/api";

import MapContainer from "../../components/maps/MapContainer";
import PageHeader from "../../components/common/PageHeader";

/**
 * Suppliers Map Page
 * Displays all supplier locations on a single interactive map
 */
const SuppliersMap = () => {
  const navigate = useNavigate();
  const { suppliers, loading } = useSelector((state) => state.suppliers);

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 33.0354, lng: 73.7239 }); // Default: Jhelum, Pakistan

  // Filter suppliers that have location data
  const suppliersWithLocation = suppliers.filter(
    (supplier) => supplier.lat && supplier.lng
  );

  // Calculate map center based on all supplier locations
  useEffect(() => {
    if (suppliersWithLocation.length > 0) {
      const avgLat =
        suppliersWithLocation.reduce((sum, s) => sum + s.lat, 0) /
        suppliersWithLocation.length;
      const avgLng =
        suppliersWithLocation.reduce((sum, s) => sum + s.lng, 0) /
        suppliersWithLocation.length;

      setMapCenter({ lat: avgLat, lng: avgLng });
    }
  }, [suppliersWithLocation.length]);

  const handleMarkerClick = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleInfoWindowClose = () => {
    setSelectedSupplier(null);
  };

  const handleViewSupplierDetails = (supplierId) => {
    navigate(`/admin/suppliers?view=${supplierId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <PageHeader
        title="Suppliers Map"
        subtitle="View all supplier locations on the map"
        buttonText="Back to Suppliers"
        buttonIcon={<ArrowBackIcon />}
        onButtonClick={() => navigate("/admin/suppliers")}
      />

      {/* Statistics Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <MapIcon color="primary" fontSize="large" />
              <Box>
                <Typography variant="h6">
                  {suppliersWithLocation.length} Suppliers on Map
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Out of {suppliers.length} total suppliers
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                icon={<LocationOnIcon />}
                label={`${suppliersWithLocation.length} Locations`}
                color="success"
                variant="outlined"
              />
              <Chip
                label={`${
                  suppliers.length - suppliersWithLocation.length
                } Without Location`}
                color="default"
                variant="outlined"
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Map Display */}
      {suppliersWithLocation.length > 0 ? (
        <Paper sx={{ p: 2, height: "calc(100vh - 300px)", minHeight: 500 }}>
          <MapContainer
            center={mapCenter}
            zoom={10}
            containerStyle={{ height: "100%", borderRadius: "8px" }}
          >
            {/* Render markers for each supplier */}
            {suppliersWithLocation.map((supplier) => (
              <Marker
                key={supplier.id}
                position={{ lat: supplier.lat, lng: supplier.lng }}
                title={supplier.name}
                onClick={() => handleMarkerClick(supplier)}
                animation={
                  selectedSupplier?.id === supplier.id
                    ? window.google.maps.Animation.BOUNCE
                    : null
                }
              />
            ))}

            {/* Info Window for selected supplier */}
            {selectedSupplier && (
              <InfoWindow
                position={{
                  lat: selectedSupplier.lat,
                  lng: selectedSupplier.lng,
                }}
                onCloseClick={handleInfoWindowClose}
              >
                <Box sx={{ p: 1, minWidth: 250 }}>
                  {/* Supplier Name */}
                  <Typography variant="h6" gutterBottom>
                    {selectedSupplier.name}
                  </Typography>

                  {/* Email */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <EmailIcon fontSize="small" color="primary" />
                    <Typography variant="body2">
                      {selectedSupplier.email}
                    </Typography>
                  </Box>

                  {/* Phone */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <PhoneIcon fontSize="small" color="success" />
                    <Typography variant="body2">
                      {selectedSupplier.phone}
                    </Typography>
                  </Box>

                  {/* Address */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {selectedSupplier.address}
                  </Typography>

                  {/* Actions */}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() =>
                        handleViewSupplierDetails(selectedSupplier.id)
                      }
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps?q=${selectedSupplier.lat},${selectedSupplier.lng}`,
                          "_blank"
                        )
                      }
                    >
                      Open in Maps
                    </Button>
                  </Box>
                </Box>
              </InfoWindow>
            )}
          </MapContainer>
        </Paper>
      ) : (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            No Suppliers with Location Data
          </Typography>
          <Typography variant="body2">
            Add location information to your suppliers to see them on the map.
            Go to the Suppliers page and edit each supplier to add their
            location.
          </Typography>
          <Button
            variant="contained"
            size="small"
            sx={{ mt: 2 }}
            onClick={() => navigate("/admin/suppliers")}
          >
            Go to Suppliers
          </Button>
        </Alert>
      )}
    </Box>
  );
};

export default SuppliersMap;
