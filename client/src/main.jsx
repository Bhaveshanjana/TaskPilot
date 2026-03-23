import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { OrganizationProvider } from "./context/OrganizationContext.jsx";
import { ThemeProvider } from "./context/ThemeProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <OrganizationProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </OrganizationProvider>
    </BrowserRouter>
  </StrictMode>,
);
