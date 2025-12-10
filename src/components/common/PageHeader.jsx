// src/components/common/PageHeader.jsx

import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

/**
 * Reusable Page Header with Title and Action Button
 *
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Optional subtitle
 * @param {string} props.buttonText - Action button text
 * @param {Function} props.onButtonClick - Button click handler
 * @param {boolean} props.showButton - Show/hide button (default: true)
 * @param {Object} props.buttonIcon - Custom button icon
 */
const PageHeader = ({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  showButton = true,
  buttonIcon = <AddIcon />,
  ...otherProps
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
      {...otherProps}
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>

      {showButton && buttonText && (
        <Button
          variant="contained"
          startIcon={buttonIcon}
          onClick={onButtonClick}
          sx={{ height: "fit-content" }}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;
