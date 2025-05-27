import { ZRouter } from "@zthun/fashion-boutique";
import React from "react";
import { createRoot } from "react-dom/client";
import { ZRomulatorApp } from "./app/app";

const container = createRoot(document.getElementById("zthunworks-romulator")!);

container.render(
  <React.StrictMode>
    <ZRouter>
      <ZRomulatorApp />
    </ZRouter>
  </React.StrictMode>,
);
