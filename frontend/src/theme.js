import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6", // Vibrant modern blue for dark mode
      dark: "#2563eb",
      light: "#60a5fa",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#94a3b8",
    },
    background: {
      default: "#0b0f17", // Deep midnight slate
      paper: "#151d2c", // Elevated surface container
    },
    text: {
      primary: "#f1f5f9", // Crisp near-white text
      secondary: "#94a3b8", // Subtle slate secondary text
      disabled: "#64748b",
    },
    divider: "#243248", // Soft dark border
    error: {
      main: "#f87171",
    },
    success: {
      main: "#34d399",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "sans-serif",
    ].join(","),
    h4: {
      fontWeight: 700,
      fontSize: "1.75rem",
      lineHeight: 1.25,
      color: "#f1f5f9",
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.375rem",
      lineHeight: 1.3,
      color: "#f1f5f9",
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.4,
      color: "#f1f5f9",
    },
    body1: {
      fontSize: "0.9375rem",
      lineHeight: 1.5,
      color: "#f1f5f9",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      color: "#94a3b8",
    },
    button: {
      fontWeight: 600,
      fontSize: "0.875rem",
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 6, // Modest, clean border radius
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          scrollbarColor: "#243248 #0b0f17",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            backgroundColor: "#243248",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#3b82f6",
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 600,
          transition: "all 0.15s ease-in-out",
        },
        containedPrimary: {
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#2563eb",
          },
        },
        outlined: {
          borderColor: "#334155",
          color: "#e2e8f0",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "#64748b",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: "#0d131f",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#28374d",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#475569",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3b82f6",
            borderWidth: "1.5px",
          },
        },
        input: {
          padding: "10px 14px",
          fontSize: "0.9375rem",
          color: "#f1f5f9",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          color: "#94a3b8",
          "&.Mui-focused": {
            color: "#3b82f6",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        outlined: {
          borderColor: "#243248",
          backgroundColor: "#151d2c",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.35)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#151d2c",
          color: "#f1f5f9",
          boxShadow: "none",
          borderBottom: "1px solid #243248",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#243248",
        },
      },
    },
  },
});

export default theme;
