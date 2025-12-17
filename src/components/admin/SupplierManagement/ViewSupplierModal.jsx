// src/components/admin/SupplierManagement/ViewSupplierModal.jsx

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  Chip,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeIcon from "@mui/icons-material/Home";

import LocationDisplay from "../../maps/LocationDisplay";

/**
 * View Supplier Modal Component
 * Display all supplier information including map location
 */
const ViewSupplierModal = ({ open, onClose, supplier }) => {
  if (!supplier) return null;

  const hasLocation = supplier.lat && supplier.lng;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          {supplier.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supplier Details
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {/* Basic Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            📋 Basic Information
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {/* Email */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon color="primary" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{supplier.email}</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Phone */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon color="success" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">{supplier.phone}</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <HomeIcon color="info" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">{supplier.address}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Location on Map */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              📍 Location on Map
            </Typography>
            {hasLocation ? (
              <Chip
                icon={<LocationOnIcon />}
                label="Location Available"
                size="small"
                color="success"
                variant="outlined"
              />
            ) : (
              <Chip
                label="No Location Data"
                size="small"
                color="default"
                variant="outlined"
              />
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />

          {hasLocation ? (
            <LocationDisplay
              initialLocation={{ lat: supplier.lat, lng: supplier.lng }}
              title={supplier.name}
              height="300px"
            />
          ) : (
            <Box
              sx={{
                height: 200,
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
                📍 No location data available for this supplier
              </Typography>
            </Box>
          )}
        </Box>

        {/* Coordinates (if available) */}
        {hasLocation && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Coordinates: {supplier.lat.toFixed(6)}, {supplier.lng.toFixed(6)}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewSupplierModal;
