import { useEffect, useState } from "preact/hooks";

export function Home({ onLogout }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    } else {
      onLogout(); // Redirect to login if not logged in
    }
  }, []);

  if (!isLoggedIn) return null; // Prevent rendering if not logged in

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button
        onClick={() => {
          localStorage.removeItem("isLoggedIn"); // Log out user
          onLogout(); // Redirect to login
        }}
      >
        Logout
      </button>
    </div>
  );
}
