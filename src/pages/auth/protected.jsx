import { useState, useEffect } from "preact/hooks";
import { Home } from "../Home/index";
import { Login } from "./login";

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    setIsAuthenticated(loggedInStatus === "true");
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true); //
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div>
      {isAuthenticated ? (
        // @ts-ignore
        <Home onLogin={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}
