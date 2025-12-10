// src/pages/admin/Products.jsx

import { useState } from "react";
import {
  Box,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { toast } from "react-toastify";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/searchbar";
import ProductTable from "../../components/admin/ProductManagement/ProductTable";
import AddProductModal from "../../components/admin/ProductManagement/AddProductModal";
import EditProductModal from "../../components/admin/ProductManagement/EditProductModal";
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";

// ===============================================
// MOCK DATA (Replace with Redux/Firebase later)
// ===============================================
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with USB receiver",
    categoryId: "cat1",
    categoryName: "Electronics",
    supplierId: "sup1",
    supplierName: "Tech Suppliers Inc",
    price: 25.99,
    stock: 50,
  },
  {
    id: 2,
    name: "Laptop Stand",
    description: "Adjustable aluminum laptop stand",
    categoryId: "cat1",
    categoryName: "Electronics",
    supplierId: "sup2",
    supplierName: "Office Supplies Co",
    price: 45.5,
    stock: 30,
  },
  {
    id: 3,
    name: "USB-C Cable",
    description: "6ft USB-C charging cable",
    categoryId: "cat1",
    categoryName: "Electronics",
    supplierId: "sup1",
    supplierName: "Tech Suppliers Inc",
    price: 12.99,
    stock: 100,
  },
  {
    id: 4,
    name: "Desk Lamp",
    description: "LED desk lamp with adjustable brightness",
    categoryId: "cat2",
    categoryName: "Furniture",
    supplierId: "sup2",
    supplierName: "Office Supplies Co",
    price: 35.0,
    stock: 3, // Low stock
  },
  {
    id: 5,
    name: "Notebook",
    description: "A5 ruled notebook 200 pages",
    categoryId: "cat3",
    categoryName: "Stationery",
    supplierId: "sup2",
    supplierName: "Office Supplies Co",
    price: 5.99,
    stock: 0, // Out of stock
  },
];

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
  // ===============================================
  // STATE MANAGEMENT
  // ===============================================
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Selected product for edit/delete
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ===============================================
  // FILTER PRODUCTS (Search + Category)
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
  // HANDLERS
  // ===============================================

  // Add Product
  const handleAddProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: products.length + 1, // Generate ID (Firebase will do this)
      categoryName: MOCK_CATEGORIES.find((c) => c.id === newProduct.categoryId)
        ?.name,
      supplierName: MOCK_SUPPLIERS.find((s) => s.id === newProduct.supplierId)
        ?.name,
    };

    setProducts([...products, productWithId]);
    toast.success("Product added successfully!");
  };

  // Edit Product
  const handleEditProduct = (updatedProduct) => {
    const updatedProducts = products.map((product) =>
      product.id === updatedProduct.id
        ? {
            ...updatedProduct,
            categoryName: MOCK_CATEGORIES.find(
              (c) => c.id === updatedProduct.categoryId
            )?.name,
            supplierName: MOCK_SUPPLIERS.find(
              (s) => s.id === updatedProduct.supplierId
            )?.name,
          }
        : product
    );

    setProducts(updatedProducts);
    toast.success("Product updated successfully!");
  };

  // Delete Product
  const handleDeleteProduct = () => {
    const updatedProducts = products.filter(
      (product) => product.id !== selectedProduct.id
    );

    setProducts(updatedProducts);
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
    toast.success("Product deleted successfully!");
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

      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
      />

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
      />
    </Box>
  );
}

export default Products;

// ===============================================
// NOTES FOR NEXT STEP (Firebase Integration)
// ===============================================
//
// When connecting to Firebase:
// 1. Replace MOCK_PRODUCTS with Redux state
// 2. Fetch products from Firestore on mount
// 3. Add/Edit/Delete will call Firebase functions
// 4. Update Redux state after Firebase operations
//
// Example:
// const products = useSelector(state => state.products.products);
// const dispatch = useDispatch();
//
// useEffect(() => {
//   fetchProductsFromFirebase();
// }, []);
//
// const handleAddProduct = async (data) => {
//   const newProduct = await addProductToFirebase(data);
//   dispatch(addProduct(newProduct));
// };
// ===============================================
