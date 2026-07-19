import {  useState } from "react";
import { AuthContext } from "./AuthContextCore";

export const AuthProvider = ({ children }) => {
  // Initialize states with values from localStorage to survive page refreshes
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // Expect userData to contain { user, token } from your backend sign-in response
  const login = (authPayload) => {
    const { user, token } = authPayload;

    setUser(user);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Provide both user and token to the frontend hooks
  const value = {
    user,
    token,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

