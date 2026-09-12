import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const { admin, user } = useSelector((state) => state.auth);

  if (!admin || admin.role !== "admin") {

    if (user) {
      return <Navigate to="/" />;
    }
    return <Navigate to="/login" />;
  }

  return children;
}

export default AdminRoute;