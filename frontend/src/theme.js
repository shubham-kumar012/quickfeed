import { createTheme } from "@mui/material/styles";

// Theme configuration: sets up our dark color palette, fonts, and component styles
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3B82F6", // Primary blue accent
      dark: "#2563EB", // Blue hover color
      light: "#60A5FA", // Soft blue
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#A7B1C2", // Secondary text / icon color
    },
    background: {
      default: "#0B0F17", // Main page background
      paper: "#111827", // Cards and container surface background
    },
    text: {
      primary: "#F5F7FA", // White text
      secondary: "#A7B1C2", // Muted secondary text
      disabled: "#7F8A9D", // Placeholder text
    },
    divider: "#253247", // Card borders and dividers
    error: {
      main: "#EF4444",
    },
    success: {
      main: "#22C55E",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "system-ui",
      "sans-serif",
    ].join(","),
    h4: {
      fontWeight: 700,
      fontSize: "1.625rem",
      lineHeight: 1.25,
      color: "#F5F7FA",
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 700,
      fontSize: "1.375rem",
      lineHeight: 1.3,
      color: "#F5F7FA",
      letterSpacing: "-0.015em",
    },
    h6: {
      fontWeight: 650,
      fontSize: "1.1875rem",
      lineHeight: 1.35,
      color: "#F5F7FA",
      letterSpacing: "-0.01em",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 600,
      color: "#F5F7FA",
      lineHeight: 1.4,
    },
    subtitle2: {
      fontSize: "0.75rem",
      fontWeight: 600,
      color: "#7F8A9D",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
    body1: {
      fontSize: "1.03125rem",
      lineHeight: 1.55,
      color: "#F5F7FA",
    },
    body2: {
      fontSize: "0.90625rem",
      lineHeight: 1.5,
      color: "#A7B1C2",
    },
    caption: {
      fontSize: "0.8125rem",
      lineHeight: 1.4,
      color: "#7F8A9D",
    },
    button: {
      fontWeight: 600,
      fontSize: "0.875rem",
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    // Custom slim scrollbars for dark mode
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          scrollbarColor: "#253247 #0B0F17",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            backgroundColor: "#253247",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#3B82F6",
          },
        },
      },
    },
    // Paper card styling
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#111827",
        },
        outlined: {
          borderColor: "#253247",
          backgroundColor: "#111827",
          borderRadius: 14,
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.25)",
        },
      },
    },
    // Buttons styling
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          fontWeight: 600,
          transition: "all 150ms ease-in-out",
        },
        containedPrimary: {
          backgroundColor: "#3B82F6",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#2563EB",
          },
          "&.Mui-disabled": {
            backgroundColor: "#1A2537",
            color: "#7F8A9D",
          },
        },
        outlined: {
          borderColor: "#253247",
          backgroundColor: "transparent",
          color: "#F5F7FA",
          "&:hover": {
            backgroundColor: "#1A2537",
            borderColor: "#31405A",
          },
        },
      },
    },
    // Default size and full width for all text fields
    MuiTextField: {
      defaultProps: {
        size: "small",
        fullWidth: true,
      },
    },
    // Outlined input fields styling
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "#151E2E",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#253247",
            transition: "border-color 150ms ease-in-out",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#31405A",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3B82F6",
            borderWidth: "1.5px",
          },
        },
        input: {
          color: "#F5F7FA",
          fontSize: "0.9375rem",
          "&::placeholder": {
            color: "#7F8A9D",
            opacity: 1,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          color: "#A7B1C2",
          "&.Mui-focused": {
            color: "#3B82F6",
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#253247",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 150ms ease-in-out",
        },
      },
    },
  },
});

export default theme;
