import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import theme from "./theme";

// Entry point of our React application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Provides our custom dark theme to all Material UI components */}
    <ThemeProvider theme={theme}>
      {/* CssBaseline resets browser styles and sets default background color */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
