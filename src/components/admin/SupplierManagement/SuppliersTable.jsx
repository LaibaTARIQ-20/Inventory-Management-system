// src/components/admin/SupplierManagement/SuppliersTable.jsx

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

/**
 * Suppliers Table Component
 * Displays suppliers in a table with edit/delete actions
 *
 * @param {Object} props
 * @param {Array} props.suppliers - Array of supplier objects
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 */
const SuppliersTable = ({ suppliers, onEdit, onDelete }) => {
  // Empty state
  if (!suppliers || suppliers.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No suppliers found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Add your first supplier to track product sources
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ width: "5%" }}>
              <strong>ID</strong>
            </TableCell>
            <TableCell sx={{ width: "20%" }}>
              <strong>Name</strong>
            </TableCell>
            <TableCell sx={{ width: "20%" }}>
              <strong>Contact</strong>
            </TableCell>
            <TableCell sx={{ width: "35%" }}>
              <strong>Address</strong>
            </TableCell>
            <TableCell align="center" sx={{ width: "10%" }}>
              <strong>Actions</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow
              key={supplier.id}
              sx={{ "&:hover": { backgroundColor: "#fafafa" } }}
            >
              <TableCell>{supplier.id}</TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {supplier.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 0.5,
                    }}
                  >
                    <EmailIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {supplier.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {supplier.phone}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {supplier.address || "-"}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => onEdit(supplier)}
                  title="Edit supplier"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => onDelete(supplier)}
                  title="Delete supplier"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SuppliersTable;
