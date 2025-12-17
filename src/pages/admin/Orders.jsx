// src/pages/admin/Orders.jsx

import { Box, Paper, Typography } from "@mui/material";
import PageHeader from "../../components/common/PageHeader";

function Orders() {
  return (
    <Box>
      <PageHeader
        title="Orders"
        subtitle="Manage customer orders"
        showButton={false}
      />

      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Orders management coming soon
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This feature will be implemented next week
        </Typography>
      </Paper>
    </Box>
  );
}

export default Orders;
