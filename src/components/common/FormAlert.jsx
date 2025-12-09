// src/components/common/FormAlert.jsx

import { Alert } from "@mui/material";

/**
 * Reusable Alert component for form messages
 *
 * @param {Object} props
 * @param {string} props.message - Alert message
 * @param {string} props.severity - Alert type (error, warning, info, success)
 * @param {Object} props.sx - Additional styles
 */
const FormAlert = ({ message, severity = "error", sx = {}, ...otherProps }) => {
  if (!message) return null;

  return (
    <Alert severity={severity} sx={{ mb: 2, ...sx }} {...otherProps}>
      {message}
    </Alert>
  );
};

export default FormAlert;
