// src/constants/formConstants.js

// ===============================================
// EMAIL PATTERN
// ===============================================
const EMAIL_PATTERN = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: "Please enter a valid email address",
};

// ===============================================
// NAME PATTERN
// ===============================================
const NAME_PATTERN = {
  value: /^[A-Za-z\s]{2,50}$/,
  message: "Name must be 2-50 characters, letters only",
};

// ===============================================
// VALIDATION RULES FOR FORMS
// ===============================================
export const VALIDATION_RULES = {
  // Email validation
  email: {
    required: "Email is required",
    pattern: EMAIL_PATTERN,
  },

  // Password validation
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
  },

  // Confirm password (needs password value passed)
  confirmPassword: (passwordValue) => ({
    required: "Please confirm your password",
    validate: (value) => {
      if (value !== passwordValue) {
        return "Passwords do not match";
      }
      return true;
    },
  }),

  // Name validation
  name: {
    required: "Name is required",
    pattern: NAME_PATTERN,
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters",
    },
    maxLength: {
      value: 50,
      message: "Name cannot exceed 50 characters",
    },
  },

  // Address validation
  address: {
    maxLength: {
      value: 200,
      message: "Address cannot exceed 200 characters",
    },
  },

  // Role validation
  role: {
    required: "Please select a role",
    validate: (value) => {
      if (!["admin", "customer"].includes(value)) {
        return "Invalid role selected";
      }
      return true;
    },
  },

  // Product name validation
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

  // Price validation
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

  // Stock validation
  stock: {
    required: "Stock is required",
    validate: (value) => {
      const num = parseInt(value);
      if (isNaN(num)) return "Must be a valid number";
      if (num < 0) return "Stock cannot be negative";
      if (num > 999999) return "Stock is too high";
      return true;
    },
  },

  // Category validation
  category: {
    required: "Please select a category",
  },

  // Supplier validation
  supplier: {
    required: "Please select a supplier",
  },

  // Description validation (optional)
  description: {
    maxLength: {
      value: 500,
      message: "Description cannot exceed 500 characters",
    },
  },

  // Phone validation
  phone: {
    required: "Phone number is required",
    pattern: {
      value: /^[0-9]{10}$/,
      message: "Phone number must be 10 digits",
    },
  },

  // Optional phone
  phoneOptional: {
    pattern: {
      value: /^[0-9]{10}$/,
      message: "Phone number must be 10 digits",
    },
  },
};

// ===============================================
// DROPDOWN OPTIONS
// ===============================================
export const ROLE_OPTIONS = [
  { value: "customer", label: "Customer" },
  { value: "admin", label: "Admin" },
];

export const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// ===============================================
// EXPORT ALL
// ===============================================
export default {
  VALIDATION_RULES,
  ROLE_OPTIONS,
  ORDER_STATUS_OPTIONS,
};
