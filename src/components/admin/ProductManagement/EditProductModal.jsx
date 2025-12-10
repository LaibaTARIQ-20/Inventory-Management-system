// src/components/admin/ProductManagement/EditProductModal.jsx

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Box } from "@mui/material";
import { toast } from "react-toastify";

import ModalDialog from "../../common/ModalDialog";
import FormTextField from "../../common/FormTextField";
import FormSelectField from "../../common/FormSelectField";
import FormSubmitButton from "../../common/FormSubmitButton";

/**
 * Edit Product Modal Component
 * Form to edit an existing product
 *
 * @param {Object} props
 * @param {boolean} props.open - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onSubmit - Submit handler
 * @param {Object} props.product - Product to edit
 * @param {Array} props.categories - Array of categories
 * @param {Array} props.suppliers - Array of suppliers
 */
const EditProductModal = ({
  open,
  onClose,
  onSubmit,
  product,
  categories = [],
  suppliers = [],
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // Pre-fill form when product changes
  useEffect(() => {
    if (product && open) {
      reset({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        categoryId: product.categoryId || "",
        supplierId: product.supplierId || "",
      });
    }
  }, [product, open, reset]);

  const handleFormSubmit = async (data) => {
    try {
      const productData = {
        ...data,
        id: product.id, // Keep the original ID
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
      };

      await onSubmit(productData);
      toast.success("Product updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update product");
      console.error("Update product error:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Validation rules (same as AddProduct)
  const validationRules = {
    name: {
      required: "Product name is required",
      minLength: {
        value: 2,
        message: "Name must be at least 2 characters",
      },
      maxLength: {
        value: 100,
        message: "Name cannot exceed 100 characters",
      },
    },
    description: {
      maxLength: {
        value: 500,
        message: "Description cannot exceed 500 characters",
      },
    },
    price: {
      required: "Price is required",
      validate: (value) => {
        const num = parseFloat(value);
        if (isNaN(num)) return "Must be a valid number";
        if (num <= 0) return "Price must be greater than 0";
        if (num > 999999) return "Price is too high";
        return true;
      },
    },
    stock: {
      required: "Stock is required",
      validate: (value) => {
        const num = parseInt(value);
        if (isNaN(num)) return "Must be a valid number";
        if (num < 0) return "Stock cannot be negative";
        if (num > 999999) return "Stock is too high";
        return true;
      },
    },
    categoryId: {
      required: "Please select a category",
    },
    supplierId: {
      required: "Please select a supplier",
    },
  };

  return (
    <ModalDialog
      open={open}
      onClose={handleClose}
      title="Edit Product"
      maxWidth="md"
    >
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <FormTextField
          register={register}
          name="name"
          validation={validationRules.name}
          errors={errors}
          label="Product Name"
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

        <Box sx={{ display: "flex", gap: 2 }}>
          <FormTextField
            register={register}
            name="price"
            validation={validationRules.price}
            errors={errors}
            label="Price ($)"
            type="number"
            fullWidth
          />

          <FormTextField
            register={register}
            name="stock"
            validation={validationRules.stock}
            errors={errors}
            label="Stock Quantity"
            type="number"
            fullWidth
          />
        </Box>

        <FormSelectField
          register={register}
          name="categoryId"
          validation={validationRules.categoryId}
          errors={errors}
          label="Category"
          options={categories.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))}
        />

        <FormSelectField
          register={register}
          name="supplierId"
          validation={validationRules.supplierId}
          errors={errors}
          label="Supplier"
          options={suppliers.map((sup) => ({
            value: sup.id,
            label: sup.name,
          }))}
        />

        <FormSubmitButton
          isSubmitting={isSubmitting}
          label="Update Product"
          loadingLabel="Updating Product..."
        />
      </Box>
    </ModalDialog>
  );
};

export default EditProductModal;
