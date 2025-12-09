// src/utils/validationRules.js

// ===============================================
// REUSABLE VALIDATION PATTERNS & RULES
// ===============================================
// Import and use across all forms
//
// USAGE:
// import { PATTERNS, RULES } from '../utils/validationRules';
//
// <TextField
//   {...register('email', RULES.email)}
// />
// ===============================================

// ===============================================
// REGEX PATTERNS
// ===============================================

export const PATTERNS = {
  // Email validation
  email: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Please enter a valid email address",
  },

  // Name validation (letters and spaces only)
  name: {
    value: /^[A-Za-z\s]{2,50}$/,
    message: "Name must be 2-50 characters, letters only",
  },

  // Username validation (letters, numbers, underscore)
  username: {
    value: /^[a-zA-Z0-9_]{3,20}$/,
    message: "Username: 3-20 characters, letters, numbers, underscore only",
  },

  // Phone number (10 digits)
  phone: {
    value: /^[0-9]{10}$/,
    message: "Phone number must be 10 digits",
  },

  // Phone with country code
  phoneWithCode: {
    value: /^\+?[0-9]{10,15}$/,
    message: "Invalid phone number format",
  },

  // Only numbers
  numbersOnly: {
    value: /^[0-9]+$/,
    message: "Only numbers are allowed",
  },

  // Only letters
  lettersOnly: {
    value: /^[A-Za-z]+$/,
    message: "Only letters are allowed",
  },

  // Alphanumeric
  alphanumeric: {
    value: /^[a-zA-Z0-9]+$/,
    message: "Only letters and numbers allowed",
  },

  // URL validation
  url: {
    value: /^https?:\/\/.+\..+/i,
    message: "Please enter a valid URL (http:// or https://)",
  },

  // Postal/ZIP code (5 digits)
  postalCode: {
    value: /^[0-9]{5}$/,
    message: "Postal code must be 5 digits",
  },

  // Strong password (uppercase, lowercase, number, 8+ chars)
  strongPassword: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    message:
      "Password must contain uppercase, lowercase, number, min 8 characters",
  },

  // Medium password (6+ characters)
  mediumPassword: {
    value: /^.{6,}$/,
    message: "Password must be at least 6 characters",
  },

  // Decimal number (price, quantity)
  decimal: {
    value: /^\d+(\.\d{1,2})?$/,
    message: "Please enter a valid number (max 2 decimals)",
  },

  // Date format (YYYY-MM-DD)
  date: {
    value: /^\d{4}-\d{2}-\d{2}$/,
    message: "Date must be in format YYYY-MM-DD",
  },
};

// ===============================================
// COMPLETE VALIDATION RULES (Ready to use)
// ===============================================

export const RULES = {
  // Email rules
  email: {
    required: "Email is required",
    pattern: PATTERNS.email,
  },

  // Required email (for login)
  emailRequired: {
    required: "Email is required",
    pattern: PATTERNS.email,
  },

  // Optional email
  emailOptional: {
    pattern: PATTERNS.email,
  },

  // Name rules
  name: {
    required: "Name is required",
    pattern: PATTERNS.name,
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters",
    },
    maxLength: {
      value: 50,
      message: "Name cannot exceed 50 characters",
    },
  },

  // Username rules
  username: {
    required: "Username is required",
    pattern: PATTERNS.username,
    minLength: {
      value: 3,
      message: "Username must be at least 3 characters",
    },
    maxLength: {
      value: 20,
      message: "Username cannot exceed 20 characters",
    },
  },

  // Password rules (medium strength)
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
  },

  // Strong password rules
  strongPassword: {
    required: "Password is required",
    pattern: PATTERNS.strongPassword,
  },

  // Phone number rules
  phone: {
    required: "Phone number is required",
    pattern: PATTERNS.phone,
  },

  // Optional phone
  phoneOptional: {
    pattern: PATTERNS.phone,
  },

  // Product name rules
  productName: {
    required: "Product name is required",
    minLength: {
      value: 2,
      message: "Product name must be at least 2 characters",
    },
    maxLength: {
      value: 100,
      message: "Product name cannot exceed 100 characters",
    },
  },

  // Price rules
  price: {
    required: "Price is required",
    validate: (value) => {
      const num = parseFloat(value);
      if (isNaN(num)) return "Must be a valid number";
      if (num <= 0) return "Price must be greater than 0";
      if (num > 999999) return "Price is too high";
      return true;
    },
  },

  // Stock/Quantity rules
  stock: {
    required: "Stock quantity is required",
    validate: (value) => {
      const num = parseInt(value);
      if (isNaN(num)) return "Must be a valid number";
      if (num < 0) return "Stock cannot be negative";
      if (num > 999999) return "Stock quantity is too high";
      return true;
    },
  },

  // Description rules
  description: {
    maxLength: {
      value: 500,
      message: "Description cannot exceed 500 characters",
    },
  },

  // Address rules
  address: {
    required: "Address is required",
    minLength: {
      value: 10,
      message: "Address must be at least 10 characters",
    },
    maxLength: {
      value: 200,
      message: "Address cannot exceed 200 characters",
    },
  },

  // Optional address
  addressOptional: {
    maxLength: {
      value: 200,
      message: "Address cannot exceed 200 characters",
    },
  },

  // Category selection
  category: {
    required: "Please select a category",
  },

  // Role selection
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

// ===============================================
// CUSTOM VALIDATION FUNCTIONS
// ===============================================

export const customValidations = {
  // Confirm password validation
  confirmPassword: (password) => ({
    required: "Please confirm your password",
    validate: (value) => {
      if (value !== password) {
        return "Passwords do not match";
      }
      return true;
    },
  }),

  // Age validation
  age: (minAge = 18, maxAge = 100) => ({
    required: "Age is required",
    validate: (value) => {
      const age = parseInt(value);
      if (isNaN(age)) return "Must be a valid number";
      if (age < minAge) return `Must be at least ${minAge} years old`;
      if (age > maxAge) return `Age cannot exceed ${maxAge}`;
      return true;
    },
  }),

  // Date not in future
  pastDate: () => ({
    required: "Date is required",
    validate: (value) => {
      const selectedDate = new Date(value);
      const today = new Date();
      if (selectedDate > today) {
        return "Date cannot be in the future";
      }
      return true;
    },
  }),

  // Date not in past
  futureDate: () => ({
    required: "Date is required",
    validate: (value) => {
      const selectedDate = new Date(value);
      const today = new Date();
      if (selectedDate < today) {
        return "Date cannot be in the past";
      }
      return true;
    },
  }),

  // Min/Max value
  numberRange: (min, max) => ({
    required: "Value is required",
    validate: (value) => {
      const num = parseFloat(value);
      if (isNaN(num)) return "Must be a valid number";
      if (num < min) return `Must be at least ${min}`;
      if (num > max) return `Cannot exceed ${max}`;
      return true;
    },
  }),

  // File size validation (for image upload)
  fileSize: (maxSizeMB = 5) => ({
    validate: (files) => {
      if (!files || files.length === 0) return true;
      const file = files[0];
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        return `File size must be less than ${maxSizeMB}MB`;
      }
      return true;
    },
  }),

  // File type validation
  fileType: (allowedTypes = ["image/jpeg", "image/png", "image/jpg"]) => ({
    validate: (files) => {
      if (!files || files.length === 0) return true;
      const file = files[0];
      if (!allowedTypes.includes(file.type)) {
        return `Only ${allowedTypes.join(", ")} files are allowed`;
      }
      return true;
    },
  }),
};
export default {
  PATTERNS,
  RULES,
  customValidations,
};
