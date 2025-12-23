// src/components/dashboard/QuickStatsCard.jsx
// REUSABLE: Quick Stats Card Component
// Displays multiple statistics in a single card

import { Paper, Box, Typography } from "@mui/material";

/**
 * Reusable Quick Stats Card Component
 * Displays multiple stat items in one card
 *
 * @param {string} title - Card title
 * @param {Array} stats - Array of stat objects { label, value, color }
 *
 * @example
 * <QuickStatsCard
 *   title="Quick Stats"
 *   stats={[
 *     { label: "Total Categories", value: 5, color: "#1976d2" },
 *     { label: "Total Suppliers", value: 10, color: "#9c27b0" },
 *   ]}
 * />
 */
const QuickStatsCard = ({ title = "Quick Stats", stats = [] }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
        {title}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
        {stats.map((stat, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              bgcolor: stat.bgColor || "#f5f5f5",
              borderRadius: 2,
              borderLeft: `4px solid ${stat.color || "#1976d2"}`,
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {stat.label}
            </Typography>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ color: stat.color || "primary.main" }}
            >
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default QuickStatsCard;
