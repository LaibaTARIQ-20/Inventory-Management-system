// src/components/admin/ProductManagement/ProductTable.jsx

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Product Table Component
 * Displays products in a table with edit/delete actions
 *
 * @param {Object} props
 * @param {Array} props.products - Array of product objects
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 */
const ProductTable = ({ products, onEdit, onDelete }) => {
  // Empty state
  if (!products || products.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No products found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Add your first product to get started
        </Typography>
      </Paper>
    );
  }

  // Get stock status color
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Out of Stock", color: "error" };
    if (stock < 5) return { label: "Low Stock", color: "warning" };
    return { label: "In Stock", color: "success" };
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell>
              <strong>ID</strong>
            </TableCell>
            <TableCell>
              <strong>Name</strong>
            </TableCell>
            <TableCell>
              <strong>Category</strong>
            </TableCell>
            <TableCell>
              <strong>Supplier</strong>
            </TableCell>
            <TableCell>
              <strong>Price</strong>
            </TableCell>
            <TableCell>
              <strong>Stock</strong>
            </TableCell>
            <TableCell>
              <strong>Status</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Actions</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            return (
              <TableRow
                key={product.id}
                sx={{ "&:hover": { backgroundColor: "#fafafa" } }}
              >
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {product.name}
                    </Typography>
                    {product.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.description}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>{product.categoryName || "-"}</TableCell>
                <TableCell>{product.supplierName || "-"}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Chip
                    label={stockStatus.label}
                    color={stockStatus.color}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => onEdit(product)}
                    title="Edit product"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => onDelete(product)}
                    title="Delete product"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
