// src/components/common/FormTextField.jsx

import { TextField } from "@mui/material";

/**
 * Reusable TextField component integrated with react-hook-form
 *
 * @param {Object} props
 * @param {Function} props.register - react-hook-form register function
 * @param {string} props.name - Field name for registration
 * @param {Object} props.validation - Validation rules object
 * @param {Object} props.errors - Form errors object
 * @param {string} props.label - Field label
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {boolean} props.multiline - Enable multiline input
 * @param {number} props.rows - Number of rows for multiline
 * @param {boolean} props.autoFocus - Auto focus on mount
 * @param {string} props.autoComplete - Autocomplete attribute
 * @param {boolean} props.fullWidth - Full width (default: true)
 * @param {string} props.margin - Margin spacing (default: "normal")
 */
const FormTextField = ({
  register,
  name,
  validation = {},
  errors = {},
  label,
  type = "text",
  multiline = false,
  rows,
  autoFocus = false,
  autoComplete,
  fullWidth = true,
  margin = "normal",
  ...otherProps
}) => {
  return (
    <TextField
      {...register(name, validation)}
      label={label}
      type={type}
      fullWidth={fullWidth}
      margin={margin}
      error={!!errors[name]}
      helperText={errors[name]?.message}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      multiline={multiline}
      rows={rows}
      {...otherProps}
    />
  );
};

export default FormTextField;
