import "./index.css";
import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import DataProvider from "./context/DataProvider.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <DataProvider>
    <App />
  </DataProvider>
);
