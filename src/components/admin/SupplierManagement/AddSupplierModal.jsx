// src/components/admin/SupplierManagement/AddSupplierModal.jsx
// ✅ COMPLETELY FIXED VERSION

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Divider, Typography } from "@mui/material";
import { toast } from "react-toastify";

// Common Components
import ModalDialog from "../../common/ModalDialog";
import FormTextField from "../../common/FormTextField";
import FormSubmitButton from "../../common/FormSubmitButton";

// ✅ CORRECT: Import LocationPicker from maps folder
import LocationPicker from "../../maps/LocationPicker";

// Validation Rules
import { VALIDATION_RULES } from "../../../constants/formConstants";

/**
 * Add Supplier Modal Component WITH MAP
 * Form to add a new supplier with location selection
 */
const AddSupplierModal = ({ open, onClose, onSubmit }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

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
      // Combine form data with location
      const supplierData = {
        ...data,
        lat: selectedLocation?.lat || null,
        lng: selectedLocation?.lng || null,
      };

      // Show warning if no location selected
      if (!selectedLocation) {
        const confirmWithoutLocation = window.confirm(
          "No location selected. Do you want to add supplier without map location?"
        );
        if (!confirmWithoutLocation) {
          return;
        }
      }

      await onSubmit(supplierData);
      toast.success("Supplier added successfully!");
      reset();
      setSelectedLocation(null);
      onClose();
    } catch (error) {
      toast.error("Failed to add supplier");
      console.error("Add supplier error:", error);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedLocation(null);
    onClose();
  };

  return (
    <ModalDialog
      open={open}
      onClose={handleClose}
      title="Add New Supplier"
      maxWidth="md"
    >
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Basic Information */}
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Basic Information
        </Typography>

        <FormTextField
          register={register}
          name="name"
          validation={VALIDATION_RULES.name}
          errors={errors}
          label="Supplier Name"
          autoFocus
        />

        <FormTextField
          register={register}
          name="email"
          validation={VALIDATION_RULES.email}
          errors={errors}
          label="Email Address"
          type="email"
          autoComplete="email"
        />

        <FormTextField
          register={register}
          name="phone"
          validation={VALIDATION_RULES.phone}
          errors={errors}
          label="Phone Number"
          type="tel"
          placeholder="1234567890"
        />

        <FormTextField
          register={register}
          name="address"
          validation={VALIDATION_RULES.address}
          errors={errors}
          label="Address"
          multiline
          rows={2}
        />

        <Divider sx={{ my: 3 }} />

        {/* Location Selection */}
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Supplier Location (Optional)
        </Typography>

        <LocationPicker
          initialLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
          label="Click on map to select supplier location"
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
