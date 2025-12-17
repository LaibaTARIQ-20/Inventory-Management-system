// src/services/imageService.js - LOCAL STORAGE VERSION (FREE!)

// ===============================================
// CONVERT IMAGE TO BASE64
// ===============================================
// No Firebase Storage needed - completely FREE!
// Stores image as base64 string in Firestore
// ===============================================

export const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // Validate file
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      reject(
        new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.")
      );
      return;
    }

    // Check file size (max 1MB for base64 - keep it reasonable)
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      reject(new Error("File size too large. Maximum size is 1MB."));
      return;
    }

    // Convert to base64
    const reader = new FileReader();

    reader.onload = () => {
      resolve({
        success: true,
        base64: reader.result, // This is the base64 string with data:image/jpeg;base64,
      });
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
};

// ===============================================
// COMPRESS IMAGE BEFORE CONVERSION
// ===============================================
// Reduces file size for better performance
// IMPORTANT: This is exported as NAMED export
// ===============================================

export const compressImage = (
  file,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.8
) => {
  return new Promise((resolve, reject) => {
    // Validate file first
    const validation = validateImageFile(file);
    if (!validation.valid) {
      reject(new Error(validation.error));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Create canvas
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions (maintain aspect ratio)
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw image
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                success: true,
                base64: reader.result,
                originalSize: file.size,
                compressedSize: blob.size,
              });
            };
            reader.onerror = () => {
              reject(new Error("Failed to read compressed image"));
            };
            reader.readAsDataURL(blob);
          },
          "image/jpeg",
          quality // 0.8 = 80% quality
        );
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
};

// ===============================================
// VALIDATE IMAGE FILE
// ===============================================
export const validateImageFile = (file) => {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 1 * 1024 * 1024; // 1MB

  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only JPEG, PNG, and WebP are allowed.",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size too large. Maximum size is 1MB.",
    };
  }

  return { valid: true };
};

// ===============================================
// FORMAT FILE SIZE (Utility)
// ===============================================
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// ===============================================
// EXPORT AS DEFAULT (Optional - for backward compatibility)
// ===============================================
export default {
  convertImageToBase64,
  compressImage,
  validateImageFile,
  formatFileSize,
};
