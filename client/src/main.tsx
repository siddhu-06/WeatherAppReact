import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import Material Icons
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
link.rel = "stylesheet";
document.head.appendChild(link);

// Import Google Fonts
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// Set page title
const title = document.createElement("title");
title.textContent = "Weather Forecast App";
document.head.appendChild(title);

createRoot(document.getElementById("root")!).render(<App />);
