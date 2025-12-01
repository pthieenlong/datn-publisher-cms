import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/assets/global.scss";
import { AppRouter } from "./app/router";
import { Providers } from "./app/providers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
    <AppRouter />
    </Providers>
  </StrictMode>
);
