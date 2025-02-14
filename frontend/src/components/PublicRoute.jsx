import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../services/Auth/AuthSlice";

const PublicRoute = ({ children }) => {
  const user = useSelector(selectUser);

  return user ? <Navigate to="/home" replace /> : children;
};

export default PublicRoute;
