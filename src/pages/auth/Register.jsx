/* eslint-disable no-unused-vars */
// src/pages/auth/Register.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Box, Card, CardContent, Typography, Container } from "@mui/material";
import { toast } from "react-toastify";

import { registerUser } from "../../services/authService";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../../redux/slices/authSlice";

// Import reusable form components
import FormTextField from "../../components/common/FormTextField";
import FormSelectField from "../../components/common/FormSelectField";
import FormSubmitButton from "../../components/common/FormSubmitButton";
import FormAlert from "../../components/common/FormAlert";
import { VALIDATION_RULES, ROLE_OPTIONS } from "../../constants/formConstants";

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

            <FormAlert message={error} severity="error" />

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormTextField
                register={register}
                name="name"
                validation={VALIDATION_RULES.name}
                errors={errors}
                label="Full Name"
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
                name="password"
                validation={VALIDATION_RULES.password}
                errors={errors}
                label="Password"
                type="password"
                autoComplete="new-password"
              />

              <FormTextField
                register={register}
                name="confirmPassword"
                validation={VALIDATION_RULES.confirmPassword(password)}
                errors={errors}
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
              />

              <FormTextField
                register={register}
                name="address"
                validation={VALIDATION_RULES.address}
                errors={errors}
                label="Address (Optional)"
                multiline
                rows={2}
              />

              <FormSelectField
                register={register}
                name="role"
                validation={VALIDATION_RULES.role}
                errors={errors}
                label="Register as"
                options={ROLE_OPTIONS}
                defaultValue="customer"
              />

              <FormSubmitButton
                isSubmitting={isSubmitting}
                label="Register"
                loadingLabel="Creating account..."
              />

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
