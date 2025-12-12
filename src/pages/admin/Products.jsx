// src/pages/admin/Products.jsx - CONNECTED TO FIREBASE

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
} from "@mui/material";
import { toast } from "react-toastify";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import ProductTable from "../../components/admin/ProductManagement/ProductTable";
import AddProductModal from "../../components/admin/ProductManagement/AddProductModal";
import EditProductModal from "../../components/admin/ProductManagement/EditProductModal";
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";

// Redux actions
import {
  setProducts,
  addProduct as addProductAction,
  updateProduct as updateProductAction,
  deleteProduct as deleteProductAction,
  setLoading,
  setError,
} from "../../redux/slices/productSlice";

// Firebase service
import {
  fetchProducts,
  addProduct as addProductToFirebase,
  updateProduct as updateProductInFirebase,
  deleteProduct as deleteProductFromFirebase,
  enrichProductWithNames,
} from "../../services/productService";

// ===============================================
// MOCK DATA FOR CATEGORIES & SUPPLIERS
// (Will be replaced when we connect those too)
// ===============================================
const MOCK_CATEGORIES = [
  { id: "cat1", name: "Electronics" },
  { id: "cat2", name: "Furniture" },
  { id: "cat3", name: "Stationery" },
];

const MOCK_SUPPLIERS = [
  { id: "sup1", name: "Tech Suppliers Inc" },
  { id: "sup2", name: "Office Supplies Co" },
];

function Products() {
  const dispatch = useDispatch();

  // ===============================================
  // REDUX STATE
  // ===============================================
  // Get products from Redux store (not local state!)
  const { products, loading } = useSelector((state) => state.products);

  // ===============================================
  // LOCAL STATE (UI only)
  // ===============================================
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Selected product for edit/delete
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ===============================================
  // FETCH PRODUCTS ON MOUNT
  // ===============================================
  // This runs once when component loads
  // Fetches all products from Firebase
  // ===============================================
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      dispatch(setLoading(true));

      const result = await fetchProducts();

      if (result.success) {
        // Enrich products with category and supplier names
        const enrichedProducts = await Promise.all(
          result.products.map((product) =>
            enrichProductWithNames(product, MOCK_CATEGORIES, MOCK_SUPPLIERS)
          )
        );

        dispatch(setProducts(enrichedProducts));
      } else {
        dispatch(setError(result.error));
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ===============================================
  // FILTER PRODUCTS (Client-side)
  // ===============================================
  // Filter happens in browser after fetching from Firebase
  // For large datasets, consider server-side filtering
  // ===============================================
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !categoryFilter || product.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // ===============================================
  // CRUD HANDLERS (Connected to Firebase)
  // ===============================================

  // ADD PRODUCT
  const handleAddProduct = async (productData) => {
    try {
      // Add to Firebase
      const result = await addProductToFirebase(productData);

      if (result.success) {
        // Enrich with names
        const enrichedProduct = await enrichProductWithNames(
          result.product,
          MOCK_CATEGORIES,
          MOCK_SUPPLIERS
        );

        // Update Redux
        dispatch(addProductAction(enrichedProduct));
        toast.success("Product added successfully!");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

  // EDIT PRODUCT
  const handleEditProduct = async (updatedProduct) => {
    try {
      const { id, ...productData } = updatedProduct;

      // Update in Firebase
      const result = await updateProductInFirebase(id, productData);

      if (result.success) {
        // Enrich with names
        const enrichedProduct = await enrichProductWithNames(
          result.product,
          MOCK_CATEGORIES,
          MOCK_SUPPLIERS
        );

        // Update Redux
        dispatch(updateProductAction(enrichedProduct));
        toast.success("Product updated successfully!");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  // DELETE PRODUCT
  const handleDeleteProduct = async () => {
    try {
      setDeleteLoading(true);

      // Delete from Firebase
      const result = await deleteProductFromFirebase(selectedProduct.id);

      if (result.success) {
        // Update Redux
        dispatch(deleteProductAction(selectedProduct.id));
        toast.success("Product deleted successfully!");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Open Delete Dialog
  const handleOpenDeleteDialog = (product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // ===============================================
  // RENDER
  // ===============================================
  return (
    <Box>
      {/* Page Header */}
      <PageHeader
        title="Products"
        subtitle="Manage your product inventory"
        buttonText="Add Product"
        onButtonClick={() => setIsAddModalOpen(true)}
      />

      {/* Filters Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name..."
            fullWidth
          />

          {/* Category Filter */}
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel size="small">Filter by Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Filter by Category"
              size="small"
            >
              <MenuItem value="">All Categories</MenuItem>
              {MOCK_CATEGORIES.map((category) => (
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
        /* Products Table */
        <ProductTable
          products={filteredProducts}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteDialog}
        />
      )}

      {/* Add Product Modal */}
      <AddProductModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
        categories={MOCK_CATEGORIES}
        suppliers={MOCK_SUPPLIERS}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleEditProduct}
        product={selectedProduct}
        categories={MOCK_CATEGORIES}
        suppliers={MOCK_SUPPLIERS}
      />

      {/* Delete Confirmation Dialog */}
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
        loading={deleteLoading}
      />
    </Box>
  );
}

export default Products;

// ===============================================
// KEY CHANGES FROM MOCK VERSION:
// ===============================================
// 1. ✅ Uses Redux instead of useState for products
// 2. ✅ Fetches from Firebase on mount (useEffect)
// 3. ✅ Add/Edit/Delete call Firebase first, then update Redux
// 4. ✅ Shows loading spinner while fetching
// 5. ✅ Toast notifications for all operations
// 6. ✅ Error handling for all Firebase operations
// 7. ✅ Enriches products with category/supplier names
// ===============================================

// ===============================================
// TESTING CHECKLIST:
// ===============================================
// ✅ Page loads and fetches products from Firebase
// ✅ Add product → saves to Firebase → appears in table
// ✅ Edit product → updates in Firebase → changes reflect
// ✅ Delete product → removes from Firebase → disappears
// ✅ Refresh page → products persist (data in Firebase)
// ✅ Search works with Firebase data
// ✅ Category filter works with Firebase data
// ===============================================
