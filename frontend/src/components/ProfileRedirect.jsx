import { useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../services/Auth/AuthSlice";
import ProfilePageView from "../pages/ProfilePageView";
import ProfilePage from "../pages/ProfilePage";

const ProfileRedirect = () => {
  const { id } = useParams();
  const user = useSelector(selectUser);

  if (user && user._id === id) {
    return <Navigate to="/home/profile" replace />;
  }

  return <ProfilePageView />;
};

export default ProfileRedirect;
