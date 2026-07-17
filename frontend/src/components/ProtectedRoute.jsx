import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../api";

const ProtectedRoute = ({ children }) => {
  const auth = isAuthenticated();

  // Eğer token yoksa doğrudan giriş sayfasına yönlendir (Redirect)
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  // Yetkiliyse sayfayı göster
  return children;
};

export default ProtectedRoute;
