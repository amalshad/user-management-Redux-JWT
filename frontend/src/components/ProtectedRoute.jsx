import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user, admin } = useSelector((state) => state.auth);

  if (!user && !admin) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;