// src/pages/admin/SuppliersMapView.jsx
// NEW PAGE - All Suppliers on One Map

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import MultipleMarkers from "../../components/maps/MultipleMarkers";
import PageHeader from "../../components/common/PageHeader";
import { fetchSuppliers } from "../../services/supplierService";
import { setSuppliers } from "../../redux/slices/supplierSlice";

/**
 * Suppliers Map View Page
 * Display all suppliers on a single map
 */
const SuppliersMapView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const suppliers = useSelector((state) => state.suppliers.suppliers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    const result = await fetchSuppliers();
    if (result.success) {
      dispatch(setSuppliers(result.suppliers));
    }
    setLoading(false);
  };

  // Filter suppliers with valid locations
  const suppliersWithLocation = suppliers.filter(
    (supplier) => supplier.lat && supplier.lng
  );

  // Prepare data for map
  const mapLocations = suppliersWithLocation.map((supplier) => ({
    id: supplier.id,
    lat: supplier.lat,
    lng: supplier.lng,
    name: supplier.name,
    address: supplier.address,
    phone: supplier.phone,
    email: supplier.email,
  }));

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/suppliers")}
          variant="outlined"
        >
          Back to Suppliers
        </Button>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Suppliers Map View
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {suppliersWithLocation.length} suppliers with locations
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardContent>
          {suppliersWithLocation.length === 0 ? (
            <Alert severity="info">
              No suppliers with locations found. Add locations to suppliers to
              see them on the map.
            </Alert>
          ) : (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Click on any marker to see supplier details
                </Typography>
              </Box>
              <MultipleMarkers locations={mapLocations} height="600px" />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SuppliersMapView;
