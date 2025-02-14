import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../services/Auth/AuthSlice";

const ProtectedRoute = ({ children }) => {
  const user = useSelector(selectUser);
  const isLoading = user === undefined; // Adjust based on your Redux state

  if (isLoading) {
    return <div>Loading...</div>; // Prevents redirecting before Redux is ready
  }

  return user ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
