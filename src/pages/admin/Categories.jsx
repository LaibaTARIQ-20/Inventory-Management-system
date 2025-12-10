// src/pages/admin/Categories.jsx

import { useState } from "react";
import { Box, Paper } from "@mui/material";
import { toast } from "react-toastify";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/searchbar";
import CategoriesTable from "../../components/admin/CategoryManagement/CategoriesTable";
import AddCategoryModal from "../../components/admin/CategoryManagement/AddCategoryModal";
import EditCategoryModal from "../../components/admin/CategoryManagement/EditCategoryModal";
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";

// ===============================================
// MOCK DATA (Replace with Redux/Firebase later)
// ===============================================
const MOCK_CATEGORIES = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and accessories",
  },
  {
    id: 2,
    name: "Furniture",
    description: "Office and home furniture items",
  },
  {
    id: 3,
    name: "Stationery",
    description: "Office supplies and stationery products",
  },
  {
    id: 4,
    name: "Clothing",
    description: "Apparel and fashion items",
  },
];

function Categories() {
  // ===============================================
  // STATE MANAGEMENT
  // ===============================================
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Selected category for edit/delete
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ===============================================
  // FILTER CATEGORIES (Search)
  // ===============================================
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ===============================================
  // HANDLERS
  // ===============================================

  // Add Category
  const handleAddCategory = (newCategory) => {
    const categoryWithId = {
      ...newCategory,
      id: categories.length + 1, // Generate ID (Firebase will do this)
    };

    setCategories([...categories, categoryWithId]);
    toast.success("Category added successfully!");
  };

  // Edit Category
  const handleEditCategory = (updatedCategory) => {
    const updatedCategories = categories.map((category) =>
      category.id === updatedCategory.id ? updatedCategory : category
    );

    setCategories(updatedCategories);
    toast.success("Category updated successfully!");
  };

  // Delete Category
  const handleDeleteCategory = () => {
    const updatedCategories = categories.filter(
      (category) => category.id !== selectedCategory.id
    );

    setCategories(updatedCategories);
    setIsDeleteDialogOpen(false);
    setSelectedCategory(null);
    toast.success("Category deleted successfully!");
  };

  // Open Edit Modal
  const handleOpenEditModal = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  // Open Delete Dialog
  const handleOpenDeleteDialog = (category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  // ===============================================
  // RENDER
  // ===============================================
  return (
    <Box>
      {/* Page Header */}
      <PageHeader
        title="Categories"
        subtitle="Manage product categories"
        buttonText="Add Category"
        onButtonClick={() => setIsAddModalOpen(true)}
      />

      {/* Search Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search categories by name..."
          fullWidth
        />
      </Paper>

      {/* Categories Table */}
      <CategoriesTable
        categories={filteredCategories}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteDialog}
      />

      {/* Add Category Modal */}
      <AddCategoryModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCategory}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleEditCategory}
        category={selectedCategory}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message="Are you sure you want to delete"
        itemName={selectedCategory?.name}
      />
    </Box>
  );
}

export default Categories;
