// src/components/admin/ProductManagement/EditProductModal.jsx

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { toast } from "react-toastify";

import ModalDialog from "../../common/ModalDialog";
import FormTextField from "../../common/FormTextField";
import FormSelectField from "../../common/FormSelectField";
import FormSubmitButton from "../../common/FormSubmitButton";
import ImageUpload from "../../common/ImageUpload";

import { compressImage } from "../../../services/imageService";

/**
 * Edit Product Modal Component WITH IMAGE UPLOAD
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

  // Image state
  const [selectedImage, setSelectedImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

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

      // Set existing image
      setSelectedImage(product.imageUrl || "");
      setImagePreview(product.imageUrl || "");
    }
  }, [product, open, reset]);

  const handleImageSelect = async (file) => {
    try {
      setImageUploading(true);

      const result = await compressImage(file);

      if (result.success) {
        setSelectedImage(result.base64);
        setImagePreview(result.base64);
        toast.success("Image loaded successfully!");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error(error.message || "Failed to process image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage("");
    setImagePreview("");
  };

  const handleFormSubmit = async (data) => {
    try {
      const productData = {
        ...data,
        id: product.id,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        imageUrl: selectedImage, // Include updated/existing image
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
    setSelectedImage("");
    setImagePreview("");
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
        {/* IMAGE UPLOAD COMPONENT */}
        <ImageUpload
          imageUrl={imagePreview}
          onImageSelect={handleImageSelect}
          onImageRemove={handleImageRemove}
          loading={imageUploading}
        />

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
          isSubmitting={isSubmitting || imageUploading}
          label="Update Product"
          loadingLabel="Updating Product..."
        />
      </Box>
    </ModalDialog>
  );
};

export default EditProductModal;
