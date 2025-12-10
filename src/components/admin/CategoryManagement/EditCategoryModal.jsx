// src/components/admin/CategoryManagement/EditCategoryModal.jsx

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Box } from "@mui/material";
import { toast } from "react-toastify";

import ModalDialog from "../../common/ModalDialog";
import FormTextField from "../../common/FormTextField";
import FormSubmitButton from "../../common/FormSubmitButton";

/**
 * Edit Category Modal Component
 * Form to edit an existing category
 *
 * @param {Object} props
 * @param {boolean} props.open - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onSubmit - Submit handler
 * @param {Object} props.category - Category to edit
 */
const EditCategoryModal = ({ open, onClose, onSubmit, category }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // Pre-fill form when category changes
  useEffect(() => {
    if (category && open) {
      reset({
        name: category.name || "",
        description: category.description || "",
      });
    }
  }, [category, open, reset]);

  const handleFormSubmit = async (data) => {
    try {
      const categoryData = {
        ...data,
        id: category.id, // Keep the original ID
      };

      await onSubmit(categoryData);
      toast.success("Category updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update category");
      console.error("Update category error:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Validation rules
  const validationRules = {
    name: {
      required: "Category name is required",
      minLength: {
        value: 2,
        message: "Name must be at least 2 characters",
      },
      maxLength: {
        value: 50,
        message: "Name cannot exceed 50 characters",
      },
    },
    description: {
      maxLength: {
        value: 200,
        message: "Description cannot exceed 200 characters",
      },
    },
  };

  return (
    <ModalDialog
      open={open}
      onClose={handleClose}
      title="Edit Category"
      maxWidth="sm"
    >
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <FormTextField
          register={register}
          name="name"
          validation={validationRules.name}
          errors={errors}
          label="Category Name"
          autoFocus
        />

        <FormTextField
          register={register}
          name="description"
          validation={validationRules.description}
          errors={errors}
          label="Description (Optional)"
          multiline
          rows={3}
        />

        <FormSubmitButton
          isSubmitting={isSubmitting}
          label="Update Category"
          loadingLabel="Updating Category..."
        />
      </Box>
    </ModalDialog>
  );
};

export default EditCategoryModal;
