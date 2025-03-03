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
import ProfilePage from "../pages/ProfilePage";
import Peoples from "../pages/Peoples";
import PeopleLayout from "../pages/PeopleLayout";
import AllPeople from "../pages/AllPeople";
import FriendRequests from "../pages/FriendRequests";
import Suggestions from "../pages/Suggestions";
import AllFriends from "../pages/AllFriends";
import ProfilePageView from "../pages/ProfilePageView";
import ProfileRedirect from "../components/ProfileRedirect";


// const routes = createBrowserRouter([
//   {
//     path: "/",
//     element:  <PublicRoute><LandingPage /></PublicRoute>
//   },
//   {
//     path: "/home",
//     element: <ProtectedRoute><Layout /></ProtectedRoute>,
//     children: [
//       { path: "", element: <HomePage /> },
//       { path: "videos", element: <VideoPage /> },
//       { path: "peoples", element: <Peoples /> },
//       { path:"profile", element: <ProfilePage />}
//     ],
//   },
//   {
//     path: "/signup",
//     element: <PublicRoute><SignUpPage></SignUpPage></PublicRoute>,
//   },
//   {
//     path: "/login",
//     element:<PublicRoute><LoginPage /></PublicRoute>,
//   },
//   {
//     path: "*",
//     element: <Navigate to="/" />,
//   },
// ]);

// export default routes;






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
      { 
        path: "peoples",
        element: <PeopleLayout />,
        children: [
          { index: true, element: <AllPeople /> }, // Default to Friend Requests
          { path: "frndReq", element: <FriendRequests /> },
          { path: "frndSugg", element: <Suggestions /> },
          { path: "allFriends", element: <AllFriends /> },
    
        ]
      
      },
      { path:"profile", element: <ProfilePage />},
      {
        path: "profiles/:id",
        element: <ProfilePageView></ProfilePageView>
      },
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
