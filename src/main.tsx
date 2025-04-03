import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "~/components/root/App";
import { AuthProvider } from "~/lib/useAuth"; // Import AuthProvider

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
