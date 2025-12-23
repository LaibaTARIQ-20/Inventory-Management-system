// src/components/admin/UserManagement/AddUserModal.jsx

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
 * AddUserModal Component
 * Modal dialog for adding new users with form validation
 */
const AddUserModal = ({ open, onClose, onSubmit, loading, error }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "customer",
      address: "",
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset(); // Clear form on success
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
      aria-labelledby="add-user-dialog-title"
    >
      <DialogTitle id="add-user-dialog-title">Add New User</DialogTitle>

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

            {/* Email Field */}
            <FormTextField
              register={register}
              name="email"
              label="User Email"
              type="email"
              validation={VALIDATION_RULES.email}
              errors={errors}
              autoComplete="email"
            />

            {/* Password Field */}
            <FormTextField
              register={register}
              name="password"
              label="Password"
              type="password"
              validation={VALIDATION_RULES.password}
              errors={errors}
              autoComplete="new-password"
            />

            {/* Role Select */}
            <FormSelectField
              register={register}
              name="role"
              label="Select Role"
              options={ROLE_OPTIONS}
              validation={VALIDATION_RULES.role}
              errors={errors}
              defaultValue="customer"
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
            label="Add User"
            loadingLabel="Adding..."
            fullWidth={false}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddUserModal;
