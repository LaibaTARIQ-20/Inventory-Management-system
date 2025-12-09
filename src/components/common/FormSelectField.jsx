// src/components/common/FormSelectField.jsx

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

/**
 * Reusable Select Field component integrated with react-hook-form
 *
 * @param {Object} props
 * @param {Function} props.register - react-hook-form register function
 * @param {string} props.name - Field name for registration
 * @param {Object} props.validation - Validation rules object
 * @param {Object} props.errors - Form errors object
 * @param {string} props.label - Field label
 * @param {Array} props.options - Array of options [{value, label}]
 * @param {any} props.defaultValue - Default selected value
 * @param {boolean} props.fullWidth - Full width (default: true)
 * @param {string} props.margin - Margin spacing (default: "normal")
 */
const FormSelectField = ({
  register,
  name,
  validation = {},
  errors = {},
  label,
  options = [],
  defaultValue,
  fullWidth = true,
  margin = "normal",
  ...otherProps
}) => {
  return (
    <FormControl
      fullWidth={fullWidth}
      margin={margin}
      error={!!errors[name]}
      {...otherProps}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        {...register(name, validation)}
        label={label}
        defaultValue={defaultValue}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {errors[name] && <FormHelperText>{errors[name].message}</FormHelperText>}
    </FormControl>
  );
};

export default FormSelectField;
