import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {

  const { user, admin } = useSelector((state) => state.auth);

  if (user) {
    return <Navigate to="/" />;
  }

  if (admin) {
    return <Navigate to="/" />;
  }

  return children;

}

export default PublicRoute;