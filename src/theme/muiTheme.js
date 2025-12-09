// src/theme/muiTheme.js
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blue (default MUI blue)
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#fff",
    },
    secondary: {
      main: "#dc004e", // Pink/Red
      light: "#f50057",
      dark: "#c51162",
      contrastText: "#fff",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    info: {
      main: "#2196f3",
    },
    success: {
      main: "#4caf50",
    },
    background: {
      default: "#f5f5f5", // Page background
      paper: "#ffffff", // Card background
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
  },

  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),

    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
    },
    button: {
      textTransform: "none", // Don't uppercase buttons
      fontWeight: 500,
    },
  },

  spacing: 8,

  shape: {
    borderRadius: 8,
  },

  components: {
    // Button customization
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Remove uppercase
          borderRadius: 8,
          padding: "8px 16px",
          fontWeight: 500,
        },
        contained: {
          boxShadow: "none", // Remove shadow
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          },
        },
      },
      defaultProps: {
        disableElevation: true, // Flat buttons by default
      },
    },

    // Card customization
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      },
    },

    // TextField customization
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "medium",
      },
    },

    // Table customization
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: "#f5f5f5",
        },
      },
    },

    // Drawer customization (Sidebar)
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1e293b", // Dark sidebar
          color: "#fff",
        },
      },
    },
  },
});
