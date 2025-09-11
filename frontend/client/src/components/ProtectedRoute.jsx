// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // assuming you store JWT in localStorage

  if (!token) {
    return <Navigate to="/login" replace />; // redirect if not logged in
  }

  return children; // show the protected page if logged in
};

export default ProtectedRoute;
