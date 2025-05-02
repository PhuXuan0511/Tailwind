import { Router } from "~/components/router/Router";
import { useEffect } from "react";
import { useAuth } from "~/lib/useAuth";

function Main() {
  const { user, role, loading } = useAuth();

  useEffect(() => {
    console.log("Main component initialized");
    console.log("User:", user);
    console.log("Role:", role);
  }, [user, role]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <Router />
    </main>
  );
}

export default Main;
