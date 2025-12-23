// src/pages/admin/Products.jsx
// ✅ REFACTORED: Using thunks instead of manual dispatch

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import { toast } from "react-toastify";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import ProductTable from "../../components/admin/ProductManagement/ProductTable";
import AddProductModal from "../../components/admin/ProductManagement/AddProductModal";
import EditProductModal from "../../components/admin/ProductManagement/EditProductModal";
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";

// ✅ Import thunks (not manual actions!)
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../redux/slices/productSlice";

import { fetchCategories } from "../../redux/slices/categorySlice";
import { fetchSuppliers } from "../../redux/slices/supplierSlice";

function Products() {
  const dispatch = useDispatch();

  // ✅ Read from Redux store
  const { products, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { suppliers } = useSelector((state) => state.suppliers);

  // Local UI state only
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ✅ CORRECT: Just dispatch thunks, no try-catch!
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchSuppliers());
  }, [dispatch]);

  // ✅ CORRECT: Filter in component (client-side)
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !categoryFilter || product.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // ===============================================
  // CRUD HANDLERS - CLEAN & SIMPLE!
  // ===============================================

  // ✅ CORRECT: Just dispatch, use .unwrap() for toast
  const handleAddProduct = async (productData) => {
    try {
      await dispatch(addProduct(productData)).unwrap();
      setIsAddModalOpen(false);
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleEditProduct = async (updatedProduct) => {
    try {
      const { id, ...data } = updatedProduct;
      await dispatch(updateProduct({ id, data })).unwrap();
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      toast.success("Product updated successfully!");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await dispatch(deleteProduct(selectedProduct.id)).unwrap();
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error(error);
    }
  };

  // Modal handlers
  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteDialog = (product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // ===============================================
  // RENDER
  // ===============================================
  return (
    <Box>
      <PageHeader
        title="Products"
        subtitle="Manage your product inventory"
        buttonText="Add Product"
        onButtonClick={() => setIsAddModalOpen(true)}
      />

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name..."
            fullWidth
          />

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel size="small">Filter by Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Filter by Category"
              size="small"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteDialog}
        />
      )}

      {/* Modals */}
      <AddProductModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
        categories={categories}
        suppliers={suppliers}
      />
      <EditProductModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleEditProduct}
        product={selectedProduct}
        categories={categories}
        suppliers={suppliers}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message="Are you sure you want to delete"
        itemName={selectedProduct?.name}
      />
    </Box>
  );
}

export default Products;
