// src/constants/formConstants.js

/**
 * Common validation patterns for form fields
 */
export const VALIDATION_PATTERNS = {
  email: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Please enter a valid email address",
  },
  name: {
    value: /^[A-Za-z\s]{2,50}$/,
    message: "Name must be 2-50 characters, letters only",
  },
  password: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
    message: "Password must contain uppercase, lowercase, and number",
  },
  phone: {
    value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
    message: "Please enter a valid phone number",
  },
  alphanumeric: {
    value: /^[a-zA-Z0-9]+$/,
    message: "Only letters and numbers are allowed",
  },
};

/**
 * Common validation rules
 */
export const VALIDATION_RULES = {
  required: (fieldName) => ({
    required: `${fieldName} is required`,
  }),

  email: {
    required: "Email is required",
    pattern: VALIDATION_PATTERNS.email,
  },

  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
    pattern: VALIDATION_PATTERNS.password,
  },

  name: {
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
  },

  confirmPassword: (password) => ({
    required: "Please confirm your password",
    validate: (value) => value === password || "Passwords do not match",
  }),

  address: {
    maxLength: {
      value: 200,
      message: "Address cannot exceed 200 characters",
    },
  },

  role: {
    required: "Please select a role",
    validate: (value) => {
      if (!["admin", "customer"].includes(value)) {
        return "Invalid role selected";
      }
      return true;
    },
  },
};

/**
 * Role options for select fields
 */
export const ROLE_OPTIONS = [
  { value: "customer", label: "Customer" },
  { value: "admin", label: "Admin" },
];
