import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "~/components/root/App";
import { AuthProvider } from "~/lib/useAuth";
import { setupFirebase } from "~/lib/firebase"; // Import setupFirebase

// Initialize Firebase
setupFirebase();

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
