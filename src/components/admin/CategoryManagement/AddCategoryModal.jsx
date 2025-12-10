// src/components/admin/CategoryManagement/AddCategoryModal.jsx

import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { toast } from "react-toastify";

import ModalDialog from "../../common/ModalDialog";
import FormTextField from "../../common/FormTextField";
import FormSubmitButton from "../../common/FormSubmitButton";

/**
 * Add Category Modal Component
 * Form to add a new category
 *
 * @param {Object} props
 * @param {boolean} props.open - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onSubmit - Submit handler
 */
const AddCategoryModal = ({ open, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      toast.success("Category added successfully!");
      reset();
      onClose();
    } catch (error) {
      toast.error("Failed to add category");
      console.error("Add category error:", error);
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
      title="Add New Category"
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
          label="Add Category"
          loadingLabel="Adding Category..."
        />
      </Box>
    </ModalDialog>
  );
};

export default AddCategoryModal;
