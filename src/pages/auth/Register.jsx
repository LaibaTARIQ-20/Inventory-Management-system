/* eslint-disable no-unused-vars */
// src/pages/auth/Register.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { toast } from "react-toastify";

import { registerUser } from "../../services/authService";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../../redux/slices/authSlice";

// ===============================================
// VALIDATION PATTERNS
// ===============================================
const VALIDATION_PATTERNS = {
  email: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Please enter a valid email address",
  },
  name: {
    value: /^[A-Za-z\s]{2,50}$/,
    message: "Name must be 2-50 characters, letters only",
  },
};

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      role: "customer",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setError("");
      dispatch(registerStart());

      const result = await registerUser(data.email, data.password, {
        name: data.name,
        address: data.address || "",
        role: data.role,
      });

      if (result.success) {
        dispatch(registerSuccess(result.user));
        toast.success("Registration successful!");

        if (result.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/customer/products");
        }
      } else {
        dispatch(registerFailure(result.error));
        setError(result.error);
        toast.error(result.error);
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred";
      dispatch(registerFailure(errorMsg));
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Card sx={{ width: "100%", boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Inventory MS
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              align="center"
              color="text.secondary"
            >
              Create your account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                {...register("name", {
                  required: "Name is required",
                  pattern: VALIDATION_PATTERNS.name,
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Name cannot exceed 50 characters",
                  },
                })}
                label="Full Name"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
                autoFocus
              />

              <TextField
                {...register("email", {
                  required: "Email is required",
                  pattern: VALIDATION_PATTERNS.email,
                })}
                label="Email Address"
                type="email"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
              />

              <TextField
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
                    message:
                      "Password must contain uppercase, lowercase, and number",
                  },
                })}
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete="new-password"
              />

              <TextField
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => {
                    // Custom validation: must match password
                    if (value !== password) {
                      return "Passwords do not match";
                    }
                    return true;
                  },
                })}
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                autoComplete="new-password"
              />

              <TextField
                {...register("address", {
                  maxLength: {
                    value: 200,
                    message: "Address cannot exceed 200 characters",
                  },
                })}
                label="Address (Optional)"
                fullWidth
                margin="normal"
                error={!!errors.address}
                helperText={errors.address?.message}
                multiline
                rows={2}
              />

              <FormControl fullWidth margin="normal" error={!!errors.role}>
                <InputLabel>Register as</InputLabel>
                <Select
                  {...register("role", {
                    required: "Please select a role",
                    validate: (value) => {
                      // Custom validation for select
                      if (!["admin", "customer"].includes(value)) {
                        return "Invalid role selected";
                      }
                      return true;
                    },
                  })}
                  label="Register as"
                  defaultValue="customer"
                >
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
                {errors.role && (
                  <FormHelperText>{errors.role.message}</FormHelperText>
                )}
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2 }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Creating account...
                  </>
                ) : (
                  "Register"
                )}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{ textDecoration: "none", color: "#1976d2" }}
                  >
                    Login here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Register;
