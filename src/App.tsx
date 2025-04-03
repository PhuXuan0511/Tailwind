import React from "react";
import { AuthProvider } from "~/lib/useAuth"; // Import AuthProvider
import { Router } from "~/components/router/Router";

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;