// src/components/admin/ProductManagement/AddProductModal.jsx

import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { toast } from "react-toastify";

import ModalDialog from "../../common/ModalDialog";
import FormTextField from "../../common/FormTextField";
import FormSelectField from "../../common/FormSelectField";
import FormSubmitButton from "../../common/FormSubmitButton";

/**
 * Add Product Modal Component
 * Form to add a new product
 *
 * @param {Object} props
 * @param {boolean} props.open - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onSubmit - Submit handler
 * @param {Array} props.categories - Array of categories
 * @param {Array} props.suppliers - Array of suppliers
 */
const AddProductModal = ({
  open,
  onClose,
  onSubmit,
  categories = [],
  suppliers = [],
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
      supplierId: "",
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      // Convert string to numbers
      const productData = {
        ...data,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
      };

      await onSubmit(productData);
      toast.success("Product added successfully!");
      reset();
      onClose();
    } catch (error) {
      toast.error("Failed to add product");
      console.error("Add product error:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Validation rules
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
      title="Add New Product"
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
          label="Add Product"
          loadingLabel="Adding Product..."
        />
      </Box>
    </ModalDialog>
  );
};

export default AddProductModal;
