import { createContext, useContext, useState, useEffect } from "react";

/**
 * AuthContext
 * Provides user info, login, logout, and authentication state
 * to the entire React app.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevent flash of unauthenticated content

  // ── On mount: restore user from localStorage ─────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem("userInfo");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
      localStorage.removeItem("userInfo");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login: save user (includes token) to state + localStorage
   * @param {Object} userData - { _id, name, email, role, token }
   */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };

  /**
   * Logout: clear user state and localStorage
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
  };

  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to consume AuthContext.
 * Usage: const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

export default AuthContext;
