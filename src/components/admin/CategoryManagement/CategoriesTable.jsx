// src/components/admin/CategoryManagement/CategoriesTable.jsx

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

/**
 * Categories Table Component
 * Displays categories in a table with edit/delete actions
 *
 * @param {Object} props
 * @param {Array} props.categories - Array of category objects
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 */
const CategoriesTable = ({ categories, onEdit, onDelete }) => {
  // Empty state
  if (!categories || categories.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No categories found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Add your first category to organize products
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ width: "10%" }}>
              <strong>ID</strong>
            </TableCell>
            <TableCell sx={{ width: "25%" }}>
              <strong>Name</strong>
            </TableCell>
            <TableCell sx={{ width: "50%" }}>
              <strong>Description</strong>
            </TableCell>
            <TableCell align="center" sx={{ width: "15%" }}>
              <strong>Actions</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow
              key={category.id}
              sx={{ "&:hover": { backgroundColor: "#fafafa" } }}
            >
              <TableCell>{category.id}</TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {category.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {category.description || "-"}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => onEdit(category)}
                  title="Edit category"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => onDelete(category)}
                  title="Delete category"
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

export default CategoriesTable;
