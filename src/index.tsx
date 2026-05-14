import React from "react";
import ReactDOM from "react-dom/client";

import AppRoot from "./App.tsx";
import "./index.css";
import Config from "./services/Config";
import "./i18n";

if (typeof globalThis.global === "undefined") {
  globalThis.global = globalThis;
}

Config.init().then(() => {
  const root = document.getElementById("root");
  if (!root) throw new Error("Root element not found");

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <AppRoot />
    </React.StrictMode>
  );
});
