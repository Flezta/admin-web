import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/context/use-auth";
import { hasAnyRole, type RoleKey } from "../constants/roles";

interface ProtectedRouteProps {
  allowedRoles?: RoleKey[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.disabled) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles && !hasAnyRole(user, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
