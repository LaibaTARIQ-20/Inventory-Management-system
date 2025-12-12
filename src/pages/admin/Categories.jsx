// src/pages/admin/Categories.jsx - CONNECTED TO FIREBASE

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

// Redux actions
import {
  setCategories,
  addCategory as addCategoryAction,
  updateCategory as updateCategoryAction,
  deleteCategory as deleteCategoryAction,
  setCategoryLoading,
  setCategoryError,
} from "../../redux/slices/categorySlice";

// Firebase service
import {
  fetchCategories,
  addCategory as addCategoryToFirebase,
  updateCategory as updateCategoryInFirebase,
  deleteCategory as deleteCategoryFromFirebase,
} from "../../services/categoryService";

function Categories() {
  const dispatch = useDispatch();

  // Redux state
  const { categories, loading } = useSelector((state) => state.categories);

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
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      dispatch(setCategoryLoading(true));

      const result = await fetchCategories();

      if (result.success) {
        dispatch(setCategories(result.categories));
      } else {
        dispatch(setCategoryError(result.error));
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      dispatch(setCategoryLoading(false));
    }
  };

  // Filter categories
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // CRUD Handlers
  const handleAddCategory = async (categoryData) => {
    try {
      const result = await addCategoryToFirebase(categoryData);

      if (result.success) {
        dispatch(addCategoryAction(result.category));
        toast.success("Category added successfully!");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    }
  };

  const handleEditCategory = async (updatedCategory) => {
    try {
      const { id, ...categoryData } = updatedCategory;

      const result = await updateCategoryInFirebase(id, categoryData);

      if (result.success) {
        dispatch(updateCategoryAction(result.category));
        toast.success("Category updated successfully!");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      setDeleteLoading(true);

      const result = await deleteCategoryFromFirebase(selectedCategory.id);

      if (result.success) {
        dispatch(deleteCategoryAction(selectedCategory.id));
        toast.success("Category deleted successfully!");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
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
