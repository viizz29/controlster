import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store.ts";
import { BASE_NAME, MOCK_API_ON } from "@/config.ts";
import { AuthProvider } from "@/context/auth-provider.tsx";
import { LocalStorageProvider } from "@/providers/local-storage-provider.tsx";
import { SocketProvider } from "@/providers/socket-provider.tsx";

const queryClient = new QueryClient();

// console.log({xxx: import.meta.env})

if (MOCK_API_ON) {
  const { worker } = await import("./mocks/browser");
  await worker.start({
    onUnhandledRequest: "bypass", // don't break unknown APIs
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocalStorageProvider>
        <AuthProvider>
          <SocketProvider>
            <BrowserRouter basename={BASE_NAME}>
              <Provider store={store}>
                <App />
              </Provider>
            </BrowserRouter>
          </SocketProvider>
        </AuthProvider>
      </LocalStorageProvider>
    </QueryClientProvider>
  </StrictMode>,
);
