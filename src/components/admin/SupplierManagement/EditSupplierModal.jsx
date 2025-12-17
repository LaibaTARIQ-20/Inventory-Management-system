/* eslint-disable react-hooks/set-state-in-effect */
// src/components/admin/SupplierManagement/EditSupplierModal.jsx
// ✅ COMPLETELY FIXED VERSION

import { useState, useEffect } from "react";
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
 * Edit Supplier Modal Component WITH MAP
 * Form to edit an existing supplier with location update
 */
const EditSupplierModal = ({ open, onClose, onSubmit, supplier }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // Pre-fill form when supplier changes
  useEffect(() => {
    if (supplier && open) {
      reset({
        name: supplier.name || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
      });
    }
  }, [supplier, open, reset]);

  // Set location when supplier changes (separate effect to avoid setState in effect warning)
  useEffect(() => {
    if (supplier?.lat && supplier?.lng && open) {
      setSelectedLocation({
        lat: supplier.lat,
        lng: supplier.lng,
      });
    } else if (open) {
      setSelectedLocation(null);
    }
  }, [supplier?.lat, supplier?.lng, open]);

  const handleFormSubmit = async (data) => {
    try {
      // Combine form data with location
      const supplierData = {
        ...data,
        id: supplier.id,
        lat: selectedLocation?.lat || null,
        lng: selectedLocation?.lng || null,
      };

      await onSubmit(supplierData);
      toast.success("Supplier updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update supplier");
      console.error("Update supplier error:", error);
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
      title="Edit Supplier"
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

        {/* Location Update */}
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Update Supplier Location
        </Typography>

        <LocationPicker
          initialLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
          label="Click on map to update supplier location"
        />

        <FormSubmitButton
          isSubmitting={isSubmitting}
          label="Update Supplier"
          loadingLabel="Updating Supplier..."
        />
      </Box>
    </ModalDialog>
  );
};

export default EditSupplierModal;
