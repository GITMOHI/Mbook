import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux"; 
import store from "./store";
import App from "./App"; // ✅ Use App directly

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App /> {/* ✅ This ensures App.js is running */}
    </Provider>
  </StrictMode>
);
