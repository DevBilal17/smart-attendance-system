import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ allowedRoles }) => {
  const role = localStorage.getItem("role");

  if (!role) return <Navigate to="/login" />;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;