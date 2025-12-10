// src/components/common/ModalDialog.jsx

import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Reusable Modal Dialog Component
 *
 * @param {Object} props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Dialog title
 * @param {ReactNode} props.children - Dialog content
 * @param {string} props.maxWidth - Max width (xs, sm, md, lg, xl)
 * @param {boolean} props.fullWidth - Full width
 */
const ModalDialog = ({
  open,
  onClose,
  title,
  children,
  maxWidth = "sm",
  fullWidth = true,
  ...otherProps
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      {...otherProps}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
};

export default ModalDialog;
