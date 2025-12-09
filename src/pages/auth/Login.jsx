/* eslint-disable no-unused-vars */
// src/pages/auth/Login.jsx

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
} from "@mui/material";
import { toast } from "react-toastify";

import { loginUser } from "../../services/authService";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../redux/slices/authSlice";

// ===============================================
// VALIDATION PATTERNS (Regex)
// ===============================================
const VALIDATION_PATTERNS = {
  email: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Please enter a valid email address",
  },
};

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      setError("");
      dispatch(loginStart());

      const result = await loginUser(data.email, data.password);

      if (result.success) {
        dispatch(loginSuccess(result.user));
        toast.success("Login successful!");

        if (result.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/customer/products");
        }
      } else {
        dispatch(loginFailure(result.error));
        setError(result.error);
        toast.error(result.error);
      }
    } catch (err) {
      const errorMsg = "An unexpected error occurred";
      dispatch(loginFailure(errorMsg));
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
              Login to your account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                autoFocus
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
                autoComplete="current-password"
              />

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
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{ textDecoration: "none", color: "#1976d2" }}
                  >
                    Register here
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

export default Login;
