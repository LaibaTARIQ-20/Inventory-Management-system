// src/components/common/ImageUpload.jsx

import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";

/**
 * Reusable Image Upload Component
 *
 * @param {Object} props
 * @param {string} props.imageUrl - Current image URL
 * @param {Function} props.onImageSelect - Called when image is selected
 * @param {Function} props.onImageRemove - Called when image is removed
 * @param {boolean} props.loading - Upload loading state
 * @param {string} props.error - Error message
 */
const ImageUpload = ({
  imageUrl,
  onImageSelect,
  onImageRemove,
  loading = false,
  error = "",
}) => {
  const [preview, setPreview] = useState(imageUrl || "");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
        return;
      }

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size too large. Maximum size is 5MB.");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Call parent callback
      onImageSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onImageRemove();
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="body2" gutterBottom fontWeight={500}>
        Product Image
      </Typography>

      {preview ? (
        /* Image Preview */
        <Box sx={{ position: "relative", width: "fit-content" }}>
          <Box
            component="img"
            src={preview}
            alt="Product preview"
            sx={{
              width: 200,
              height: 200,
              objectFit: "cover",
              borderRadius: 2,
              border: "1px solid #ddd",
            }}
          />
          {!loading && (
            <IconButton
              onClick={handleRemove}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "white",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(0,0,0,0.5)",
                borderRadius: 2,
              }}
            >
              <CircularProgress size={40} sx={{ color: "white" }} />
            </Box>
          )}
        </Box>
      ) : (
        /* Upload Button */
        <Box>
          <Button
            component="label"
            variant="outlined"
            startIcon={
              loading ? <CircularProgress size={20} /> : <CloudUploadIcon />
            }
            disabled={loading}
            sx={{ mb: 1 }}
          >
            {loading ? "Uploading..." : "Upload Image"}
            <input
              type="file"
              hidden
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
            />
          </Button>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 200,
              height: 200,
              border: "2px dashed #ddd",
              borderRadius: 2,
              bgcolor: "#f5f5f5",
            }}
          >
            <ImageIcon sx={{ fontSize: 60, color: "#ccc" }} />
          </Box>
        </Box>
      )}

      {error && (
        <Typography
          variant="caption"
          color="error"
          display="block"
          sx={{ mt: 1 }}
        >
          {error}
        </Typography>
      )}

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mt: 1 }}
      >
        Supported formats: JPEG, PNG, WebP (Max 5MB)
      </Typography>
    </Box>
  );
};

export default ImageUpload;
