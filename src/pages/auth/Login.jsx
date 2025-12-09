/* eslint-disable no-unused-vars */
// src/pages/auth/Login.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Box, Card, CardContent, Typography, Container } from "@mui/material";
import { toast } from "react-toastify";

import { loginUser } from "../../services/authService";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../redux/slices/authSlice";

// Import reusable form components
import FormTextField from "../../components/common/FormTextField";
import FormSubmitButton from "../../components/common/FormSubmitButton";
import FormAlert from "../../components/common/FormAlert";
import { VALIDATION_RULES } from "../../constants/formConstants";

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

            <FormAlert message={error} severity="error" />

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormTextField
                register={register}
                name="email"
                validation={VALIDATION_RULES.email}
                errors={errors}
                label="Email Address"
                type="email"
                autoComplete="email"
                autoFocus
              />

              <FormTextField
                register={register}
                name="password"
                validation={VALIDATION_RULES.password}
                errors={errors}
                label="Password"
                type="password"
                autoComplete="current-password"
              />

              <FormSubmitButton
                isSubmitting={isSubmitting}
                label="Login"
                loadingLabel="Logging in..."
              />

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
