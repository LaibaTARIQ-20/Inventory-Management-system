// src/components/admin/SupplierManagement/AddSupplierModal.jsx

import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { toast } from "react-toastify";

import ModalDialog from "../../common/ModalDialog";
import FormTextField from "../../common/FormTextField";
import FormSubmitButton from "../../common/FormSubmitButton";

/**
 * Add Supplier Modal Component
 * Form to add a new supplier
 *
 * @param {Object} props
 * @param {boolean} props.open - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onSubmit - Submit handler
 */
const AddSupplierModal = ({ open, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      toast.success("Supplier added successfully!");
      reset();
      onClose();
    } catch (error) {
      toast.error("Failed to add supplier");
      console.error("Add supplier error:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Validation rules
  const validationRules = {
    name: {
      required: "Supplier name is required",
      minLength: {
        value: 2,
        message: "Name must be at least 2 characters",
      },
      maxLength: {
        value: 100,
        message: "Name cannot exceed 100 characters",
      },
    },
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Please enter a valid email address",
      },
    },
    phone: {
      required: "Phone number is required",
      pattern: {
        value: /^[0-9]{10}$/,
        message: "Phone number must be 10 digits",
      },
    },
    address: {
      required: "Address is required",
      minLength: {
        value: 10,
        message: "Address must be at least 10 characters",
      },
      maxLength: {
        value: 200,
        message: "Address cannot exceed 200 characters",
      },
    },
  };

  return (
    <ModalDialog
      open={open}
      onClose={handleClose}
      title="Add New Supplier"
      maxWidth="sm"
    >
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <FormTextField
          register={register}
          name="name"
          validation={validationRules.name}
          errors={errors}
          label="Supplier Name"
          autoFocus
        />

        <FormTextField
          register={register}
          name="email"
          validation={validationRules.email}
          errors={errors}
          label="Email Address"
          type="email"
          autoComplete="email"
        />

        <FormTextField
          register={register}
          name="phone"
          validation={validationRules.phone}
          errors={errors}
          label="Phone Number"
          type="tel"
          placeholder="1234567890"
        />

        <FormTextField
          register={register}
          name="address"
          validation={validationRules.address}
          errors={errors}
          label="Address"
          multiline
          rows={3}
        />

        <FormSubmitButton
          isSubmitting={isSubmitting}
          label="Add Supplier"
          loadingLabel="Adding Supplier..."
        />
      </Box>
    </ModalDialog>
  );
};

export default AddSupplierModal;
