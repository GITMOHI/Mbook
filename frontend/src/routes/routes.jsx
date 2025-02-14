import { createBrowserRouter, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
import Layout from "../pages/Layout";
import VideoPage from "../pages/VideoPage";
import SignUpPage from "../pages/SignUpPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../components/ProtectedRoute";
import { selectUser } from "../services/Auth/AuthSlice";
import { useSelector } from "react-redux";
import PublicRoute from "../components/PublicRoute";


const routes = createBrowserRouter([
  {
    path: "/",
    element:  <PublicRoute><LandingPage /></PublicRoute>
  },
  {
    path: "/home",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { path: "", element: <HomePage /> },
      { path: "videos", element: <VideoPage /> },
    ],
  },
  {
    path: "/signup",
    element: <PublicRoute><SignUpPage></SignUpPage></PublicRoute>,
  },
  {
    path: "/login",
    element:<PublicRoute><LoginPage /></PublicRoute>,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export default routes;
