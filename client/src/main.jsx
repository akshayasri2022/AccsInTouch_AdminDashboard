import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// ✅ import logo from assets (stays in src/assets)
import favicon from "./assets/LOGO.png";

// ✅ set favicon dynamically
const setFavicon = () => {
  let link = document.querySelector("link[rel='icon']");

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.type = "image/png";
  link.href = favicon; // Vite will turn this into the final built URL
};

setFavicon();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
