// src/components/dashboard/InfoSection.jsx
// REUSABLE: Information Section Component
// Can display any list of items with status/stock/count

import { Paper, Box, Typography } from "@mui/material";

/**
 * Reusable Information Section Component
 * Displays a list of items with status indicators
 *
 * @param {string} title - Section title
 * @param {Array} items - Array of items to display (must have: id, name)
 * @param {string} emptyMessage - Message when no items
 * @param {string} color - Accent color for borders and badges
 * @param {Function} renderItem - Optional custom render function
 * @param {string} valueLabel - Label for value (e.g., "Stock", "Count")
 * @param {string} valueKey - Key to access value in item object (default: "stock")
 *
 * @example
 * <InfoSection
 *   title="Low Stock Products"
 *   items={products}
 *   emptyMessage="No low stock items"
 *   color="#ed6c02"
 *   valueLabel="Stock"
 *   valueKey="stock"
 * />
 */
const InfoSection = ({
  title,
  items = [],
  emptyMessage = "No items",
  color = "#1976d2",
  renderItem,
  valueLabel = "Stock",
  valueKey = "stock",
}) => {
  return (
    <Paper elevation={2} sx={{ p: 3, height: "100%", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
        {title}
      </Typography>

      {items.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            color: "text.secondary",
          }}
        >
          <Typography variant="body1">{emptyMessage}</Typography>
        </Box>
      ) : (
        <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
          {items.map((item) => {
            // Custom render if provided
            if (renderItem) {
              return renderItem(item, color);
            }

            // Default render
            return (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1.5,
                  mb: 1,
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                  borderLeft: `4px solid ${color}`,
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#e0e0e0",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <Typography variant="body1" fontWeight={500}>
                  {item.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    bgcolor: color,
                    color: "white",
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontWeight: 600,
                  }}
                >
                  {valueLabel}: {item[valueKey]}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

export default InfoSection;
