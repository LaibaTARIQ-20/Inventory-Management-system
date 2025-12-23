// src/pages/admin/Categories.jsx
// UPDATED: Using async thunks properly

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Paper, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import CategoriesTable from "../../components/admin/CategoryManagement/CategoriesTable";
import AddCategoryModal from "../../components/admin/CategoryManagement/AddCategoryModal";
import EditCategoryModal from "../../components/admin/CategoryManagement/EditCategoryModal";
import DeleteConfirmDialog from "../../components/common/DeleteConfirmDialog";

// Redux async thunks
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  clearError,
} from "../../redux/slices/categorySlice";

function Categories() {
  const dispatch = useDispatch();

  // Redux state
  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );

  // Local state
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Selected category
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Filter categories
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // CRUD Handlers using async thunks
  const handleAddCategory = async (categoryData) => {
    try {
      await dispatch(addCategory(categoryData)).unwrap();
      toast.success("Category added successfully!");
      setIsAddModalOpen(false);
    } catch (error) {
      toast.error(error || "Failed to add category");
    }
  };

  const handleEditCategory = async (updatedCategory) => {
    try {
      const { id, ...categoryData } = updatedCategory;
      await dispatch(updateCategory({ id, data: categoryData })).unwrap();
      toast.success("Category updated successfully!");
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      toast.error(error || "Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      setDeleteLoading(true);
      await dispatch(deleteCategory(selectedCategory.id)).unwrap();
      toast.success("Category deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      toast.error(error || "Failed to delete category");
    } finally {
      setDeleteLoading(false);
    }
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

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        /* Categories Table */
        <CategoriesTable
          categories={filteredCategories}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteDialog}
        />
      )}

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
        loading={deleteLoading}
      />
    </Box>
  );
}

export default Categories;
