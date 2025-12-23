// src/components/admin/OrderManagement/UpdateOrderStatusModal.jsx

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Box,
} from "@mui/material";
import FormSelectField from "../../common/FormSelectField";
import FormSubmitButton from "../../common/FormSubmitButton";
import { ORDER_STATUS_OPTIONS } from "../../../constants/formConstants";

/**
 * UpdateOrderStatusModal Component
 * Modal for updating order status with React Hook Form
 */
const UpdateOrderStatusModal = ({
  open,
  onClose,
  onSubmit,
  order,
  loading,
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      status: order?.status || "pending",
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(order.id, data.status);
      reset();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="update-status-dialog"
    >
      <DialogTitle id="update-status-dialog">Update Order Status</DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <FormSelectField
              register={register}
              name="status"
              label="Order Status"
              options={ORDER_STATUS_OPTIONS}
              validation={{ required: "Status is required" }}
              errors={errors}
              defaultValue={order?.status}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <FormSubmitButton
            isSubmitting={loading || isSubmitting}
            label="Update Status"
            loadingLabel="Updating..."
            fullWidth={false}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateOrderStatusModal;
