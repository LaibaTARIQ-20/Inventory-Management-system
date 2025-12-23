// src/pages/customer/Profile.jsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Snackbar,
  Divider,
  Grid,
  Avatar,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

// Components
import FormTextField from "../../components/common/FormTextField";
import FormSubmitButton from "../../components/common/FormSubmitButton";
import PageHeader from "../../components/common/PageHeader";

// Redux
import { updateUser } from "../../redux/slices/userSlice";
import { VALIDATION_RULES } from "../../constants/formConstants";

/**
 * Profile Page
 * View and edit user profile information
 * Works for both Admin and Customer
 */
const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      address: user?.address || "",
    },
  });

  // ===============================================
  // UPDATE PROFILE HANDLER
  // ===============================================
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await dispatch(
        updateUser({
          id: user.uid,
          data: {
            name: data.name,
            address: data.address,
          },
        })
      ).unwrap();

      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      setErrorMessage(error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // ===============================================
  // CANCEL EDITING
  // ===============================================
  const handleCancel = () => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
      address: user?.address || "",
    });
    setIsEditing(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Page Header */}
      <PageHeader
        title="My Profile"
        subtitle="Manage your account information"
      />

      <Card>
        <CardContent>
          {/* Profile Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "primary.main",
                  fontSize: "2rem",
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
              </Avatar>
              <Box>
                <Typography variant="h5">{user?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.role === "admin" ? "Administrator" : "Customer"}
                </Typography>
              </Box>
            </Box>
            {!isEditing && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Profile Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Name Field */}
              <Grid item xs={12} sm={6}>
                <FormTextField
                  register={register}
                  name="name"
                  label="Full Name"
                  validation={VALIDATION_RULES.name}
                  errors={errors}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>

              {/* Email Field (Read-only) */}
              <Grid item xs={12} sm={6}>
                <FormTextField
                  register={register}
                  name="email"
                  label="Email Address"
                  type="email"
                  disabled
                  fullWidth
                  helperText="Email cannot be changed"
                />
              </Grid>

              {/* Role Field (Read-only) */}
              <Grid item xs={12} sm={6}>
                <FormTextField
                  register={register}
                  name="role"
                  label="Account Type"
                  value={user?.role === "admin" ? "Administrator" : "Customer"}
                  disabled
                  fullWidth
                />
              </Grid>

              {/* Phone Field (Optional) */}
              <Grid item xs={12} sm={6}>
                <FormTextField
                  register={register}
                  name="phone"
                  label="Phone Number (Optional)"
                  validation={VALIDATION_RULES.phoneOptional}
                  errors={errors}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>

              {/* Address Field */}
              <Grid item xs={12}>
                <FormTextField
                  register={register}
                  name="address"
                  label="Address (Optional)"
                  multiline
                  rows={3}
                  validation={VALIDATION_RULES.address}
                  errors={errors}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>

              {/* Action Buttons */}
              {isEditing && (
                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <FormSubmitButton
                      isSubmitting={loading}
                      label="Save Changes"
                      loadingLabel="Saving..."
                      startIcon={<SaveIcon />}
                      fullWidth={false}
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          </form>

          <Divider sx={{ my: 4 }} />

          {/* Account Info */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Account Created
                </Typography>
                <Typography variant="body1">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body1">
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString()
                    : "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccessMessage("")}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
