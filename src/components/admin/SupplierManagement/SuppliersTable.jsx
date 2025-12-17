// src/components/admin/SupplierManagement/SuppliersTable.jsx
// FIXED: Changed supplier.location to supplier.lat && supplier.lng

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import MapIcon from "@mui/icons-material/Map";

// Reusable Components
import ModalDialog from "../../common/ModalDialog";
import LocationDisplay from "../../maps/LocationDisplay";

const SuppliersTable = ({ suppliers, onEdit, onDelete }) => {
  const [viewLocationOpen, setViewLocationOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const handleViewLocation = (supplier) => {
    setSelectedSupplier(supplier);
    setViewLocationOpen(true);
  };

  const handleCloseLocationView = () => {
    setViewLocationOpen(false);
    setSelectedSupplier(null);
  };

  if (!suppliers || suppliers.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          bgcolor: "grey.50",
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No suppliers found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Add your first supplier to get started
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier, index) => (
              <TableRow
                key={supplier.id}
                sx={{
                  "&:hover": { bgcolor: "action.hover" },
                  cursor: "pointer",
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {supplier.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <EmailIcon sx={{ fontSize: 16, color: "primary.main" }} />
                      <Typography variant="body2">{supplier.email}</Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <PhoneIcon sx={{ fontSize: 16, color: "success.main" }} />
                      <Typography variant="body2">{supplier.phone}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 200 }}>
                    {supplier.address}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}
                  >
                    {/* View Location - ✅ FIXED: Check lat && lng instead of location */}
                    {supplier.lat && supplier.lng && (
                      <Tooltip title="View Location">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleViewLocation(supplier)}
                        >
                          <MapIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* Edit */}
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(supplier)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    {/* Delete */}
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(supplier.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Location Modal - ✅ FIXED: Pass initialLocation correctly */}
      <ModalDialog
        open={viewLocationOpen}
        onClose={handleCloseLocationView}
        title={
          selectedSupplier ? `${selectedSupplier.name} - Location` : "Location"
        }
        maxWidth="md"
      >
        {selectedSupplier && selectedSupplier.lat && selectedSupplier.lng && (
          <LocationDisplay
            initialLocation={{
              lat: selectedSupplier.lat,
              lng: selectedSupplier.lng,
            }}
            title={selectedSupplier.name}
            height="400px"
            zoom={15}
          />
        )}
      </ModalDialog>
    </>
  );
};

export default SuppliersTable;
