import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {  HashRouter } from "react-router-dom";
import { CartProvider } from "./Context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <CartProvider>
      <App />
    </CartProvider>
  </HashRouter>
);
