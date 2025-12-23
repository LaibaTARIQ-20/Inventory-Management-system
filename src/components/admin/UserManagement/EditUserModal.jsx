// src/components/admin/UserManagement/EditUserModal.jsx

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Box,
} from "@mui/material";
import FormTextField from "../../common/FormTextField";
import FormSelectField from "../../common/FormSelectField";
import FormSubmitButton from "../../common/FormSubmitButton";
import {
  VALIDATION_RULES,
  ROLE_OPTIONS,
} from "../../../constants/formConstants";

/**
 * EditUserModal Component
 * Modal dialog for editing existing users
 */
const EditUserModal = ({ open, onClose, onSubmit, user, loading, error }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "customer",
      address: "",
    },
  });

  // Populate form when user changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "customer",
        address: user.address || "",
      });
    }
  }, [user, reset]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(user.id, data);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="edit-user-dialog-title"
    >
      <DialogTitle id="edit-user-dialog-title">Edit User</DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Name Field */}
            <FormTextField
              register={register}
              name="name"
              label="User Name"
              validation={VALIDATION_RULES.name}
              errors={errors}
              autoFocus
              autoComplete="name"
            />

            {/* Email Field (Read-only) */}
            <FormTextField
              register={register}
              name="email"
              label="User Email"
              type="email"
              validation={VALIDATION_RULES.email}
              errors={errors}
              autoComplete="email"
              disabled
              helperText="Email cannot be changed"
            />

            {/* Role Select */}
            <FormSelectField
              register={register}
              name="role"
              label="Select Role"
              options={ROLE_OPTIONS}
              validation={VALIDATION_RULES.role}
              errors={errors}
            />

            {/* Address Field */}
            <FormTextField
              register={register}
              name="address"
              label="User Address (Optional)"
              multiline
              rows={3}
              validation={VALIDATION_RULES.address}
              errors={errors}
              autoComplete="street-address"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <FormSubmitButton
            isSubmitting={loading || isSubmitting}
            label="Update User"
            loadingLabel="Updating..."
            fullWidth={false}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditUserModal;
