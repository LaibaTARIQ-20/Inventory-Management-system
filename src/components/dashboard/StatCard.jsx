// src/components/dashboard/StatCard.jsx
// REUSABLE: Statistics Card Component
// Can be used in ANY dashboard (admin, customer, analytics, etc.)

import { Paper, Box, Typography } from "@mui/material";

/**
 * Reusable Statistics Card Component
 *
 * @param {string} title - Card title (e.g., "Total Products")
 * @param {number|string} value - Main statistic value (e.g., 150)
 * @param {ReactNode} icon - Material-UI icon component
 * @param {string} bgColor - Background color (e.g., "#1976d2")
 * @param {Function} onClick - Optional click handler
 *
 * @example
 * <StatCard
 *   title="Total Products"
 *   value={150}
 *   icon={<InventoryIcon fontSize="inherit" />}
 *   bgColor="#1976d2"
 * />
 */
const StatCard = ({ title, value, icon, bgColor = "#1976d2", onClick }) => {
  return (
    <Paper
      elevation={3}
      onClick={onClick}
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: bgColor,
        color: "white",
        borderRadius: 2,
        height: "100%",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <Box>
        <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="h3" fontWeight="bold">
          {value}
        </Typography>
      </Box>
      <Box sx={{ fontSize: 50, opacity: 0.8 }}>{icon}</Box>
    </Paper>
  );
};

export default StatCard;
