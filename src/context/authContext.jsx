import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (!storedUser || storedUser === "undefined") return null;
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid user in storage:", error);
      return null;
    }
  });

  // ✅ ADD TOKEN STATE
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem("token") || null;
  });

  const login = (data) => {
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
    setToken(data.token); // ✅ IMPORTANT
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setUser(null);
    setToken(null); // ✅ IMPORTANT
  };

  const isAuthenticated = !!token || !!sessionStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);