import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { can } from "../utils/permissions";

export default function PrivateRoute({ children, requiredPermission }) {
  const { isLoggedIn, permissions } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !can(permissions, requiredPermission)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
