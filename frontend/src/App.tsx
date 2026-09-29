import { useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

type View = "register" | "login" | "dashboard";

function App() {
  const sessionExists =
    localStorage.getItem("snail_session") === "true";

  const userExists =
    localStorage.getItem("snail_user") !== null;

  const [view, setView] = useState<View>(
    sessionExists
      ? "dashboard"
      : userExists
        ? "login"
        : "register"
  );

  if (view === "dashboard") {
    return (
      <Dashboard
        onLogout={() => setView("login")}
      />
    );
  }

  if (view === "login") {
    return (
      <Login
        onLogin={() => setView("dashboard")}
        onGoToRegister={() => setView("register")}
      />
    );
  }

  return (
    <Register
      onRegister={() => setView("dashboard")}
      onGoToLogin={() => setView("login")}
    />
  );
}

export default App;