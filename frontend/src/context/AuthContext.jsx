// ============================================================
// context/AuthContext.jsx — Global Authentication State
// ============================================================
// React Context lets us share state (user info, login status)
// across the entire app WITHOUT prop drilling.
//
// Instead of Redux, we use Context API + useReducer (simple).
// Any component can call useAuth() to get: user, login, logout, etc.
//
// How it works:
//   1. AuthProvider wraps the whole app (in App.jsx)
//   2. It stores the logged-in user in state
//   3. Components call useAuth() to access user data and auth functions
// ============================================================

import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

// Step 1: Create the context object
const AuthContext = createContext(null);

// Step 2: Create the Provider component that wraps the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // stores logged-in user info
  const [loading, setLoading] = useState(true); // true while we're checking localStorage

  // On app load, check if there's already a token saved in localStorage
  // If yes, fetch the user's profile to restore the session
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/auth/me")
        .then((res) => setUser(res.data.user))
        .catch(() => {
          // Token expired or invalid — clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Called after successful login/register
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Called on logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Step 3: Custom hook so any component can easily use this context
// Usage: const { user, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
