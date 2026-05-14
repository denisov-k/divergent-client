import React from "react";
import ReactDOM from "react-dom/client";

import NativePreviewRoot from "@/app/web/NativePreviewRoot";
import Config from "@/services/Config";
import "./i18n";
import "./index.css";

if (typeof globalThis.global === "undefined") {
  globalThis.global = globalThis;
}

Config.init().then(() => {
  const root = document.getElementById("root");
  if (!root) throw new Error("Root element not found");

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <NativePreviewRoot />
    </React.StrictMode>
  );
});
