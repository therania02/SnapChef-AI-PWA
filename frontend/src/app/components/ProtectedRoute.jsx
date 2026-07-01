import { Navigate } from "react-router-dom";
import { useUser } from "../lib/userContext.jsx";

export function ProtectedRoute({ children }) {
  const { user } = useUser();

  if (!user || !user.id) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
