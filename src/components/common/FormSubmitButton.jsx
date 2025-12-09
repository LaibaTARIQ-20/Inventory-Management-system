// src/components/common/FormSubmitButton.jsx

import { Button, CircularProgress } from "@mui/material";

/**
 * Reusable Submit Button with loading state
 *
 * @param {Object} props
 * @param {boolean} props.isSubmitting - Loading state
 * @param {string} props.label - Button text when not submitting
 * @param {string} props.loadingLabel - Button text while submitting
 * @param {boolean} props.fullWidth - Full width (default: true)
 * @param {string} props.variant - Button variant (default: "contained")
 * @param {string} props.size - Button size (default: "large")
 */
const FormSubmitButton = ({
  isSubmitting,
  label = "Submit",
  loadingLabel = "Submitting...",
  fullWidth = true,
  variant = "contained",
  size = "large",
  sx = {},
  ...otherProps
}) => {
  return (
    <Button
      type="submit"
      fullWidth={fullWidth}
      variant={variant}
      size={size}
      disabled={isSubmitting}
      sx={{ mt: 3, mb: 2, ...sx }}
      {...otherProps}
    >
      {isSubmitting ? (
        <>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  );
};

export default FormSubmitButton;
