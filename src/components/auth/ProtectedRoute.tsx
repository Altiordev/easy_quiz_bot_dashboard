import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const token: string | null = localStorage.getItem("chat_id");
  return !!token;
};

const ProtectedRoute: React.FC = () => {
  const isAuth: boolean = useAuth();

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
