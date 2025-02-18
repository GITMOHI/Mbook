// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FaSearch,
//   FaHome,
//   FaVideo,
//   FaUserFriends,
//   FaGamepad,
//   FaBell,
//   FaFacebookMessenger,
//   FaBars,
//   FaTimes,
//   FaUserCircle,
//   FaUser,
//   FaUsers,
//   FaStore,
//   FaTv,
//   FaClock,
//   FaBookmark,
//   FaFlag,
//   FaCalendarAlt,
//   FaSearchengin,
// } from "react-icons/fa";
// import { FiSettings } from "react-icons/fi";
// import { MdLogout } from "react-icons/md";
// import { GrHelpBook } from "react-icons/gr";
// import { RxAvatar } from "react-icons/rx";
// import { useDispatch } from "react-redux";
// import { logoutUserAsync } from "../services/Auth/AuthSlice";

// const Navbar = () => {
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
//   const [messengerDrawerOpen, setMessengerDrawerOpen] = useState(false);
//   const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
//   const profileImage = ""; // Replace with user's profile image URL if available

//   // Handle Drawer Toggles
//   const handleDrawerToggle = (type) => {
//     if (type === "notification") {
//       setNotificationDrawerOpen((prev) => !prev);
//       setMessengerDrawerOpen(false);
//       setProfileDrawerOpen(false);
//     } else if (type === "messenger") {
//       setMessengerDrawerOpen((prev) => !prev);
//       setNotificationDrawerOpen(false);
//       setProfileDrawerOpen(false);
//     } else if (type === "profile") {
//       setProfileDrawerOpen((prev) => !prev);
//       setNotificationDrawerOpen(false);
//       setMessengerDrawerOpen(false);
//     }
//   };

//   // Close all drawers
//   const closeAllDrawers = () => {
//     setNotificationDrawerOpen(false);
//     setMessengerDrawerOpen(false);
//     setProfileDrawerOpen(false);
//   };

//   const dispatch = useDispatch();
//   const handleLogOut = (e) => {
//     e.preventDefault();
//     console.log("clicked log out");
//     dispatch(logoutUserAsync());

//   }

//   return (
//     <div className="bg-blue-600 text-white p-4 flex items-center justify-between relative">
//       {/* Left: Logo & Search */}
//       <div className="flex items-center space-x-4">
//         <h1 className="text-2xl font-bold">Mbook</h1>
//         {/* Full Search Bar on Large Screens, Icon on Tablet/Mobile */}
//         <div className="hidden lg:block">
//           <input
//             type="text"
//             className="p-2 rounded-full w-64 bg-white text-black placeholder-gray-500 focus:outline-none px-4"
//             placeholder="Search..."
//           />
//         </div>
//         <FaSearch
//           className="text-xl cursor-pointer lg:hidden"
//           onClick={() => setSearchOpen(true)}
//         />
//       </div>

//       {/* Middle: Navigation Links (Only on Large Screens) */}
//       <div className="hidden lg:flex space-x-6 text-2xl">
//         <NavLink to="/home" className="hover:text-gray-300">
//           <FaHome />
//         </NavLink>
//         <NavLink to="/home/videos" className="hover:text-gray-300">
//           <FaVideo />
//         </NavLink>
//         <NavLink to="/friends" className="hover:text-gray-300">
//           <FaUserFriends />
//         </NavLink>
//         <NavLink to="/games" className="hover:text-gray-300">
//           <FaGamepad />
//         </NavLink>
//       </div>

//       {/* Right: Notification, Messenger, Profile & Drawer (Drawer visible in MD and below) */}
//       <div className="flex items-center space-x-6 text-2xl">
//         <FaBell
//           className="cursor-pointer hover:text-gray-300"
//           onClick={() => handleDrawerToggle("notification")}
//         />
//         <FaFacebookMessenger
//           className="cursor-pointer hover:text-gray-300"
//           onClick={() => handleDrawerToggle("messenger")}
//         />
//         {profileImage ? (
//           <img
//             src={profileImage}
//             alt="Profile"
//             className="rounded-full w-10 h-10 cursor-pointer"
//             onClick={() => handleDrawerToggle("profile")}
//           />
//         ) : (
//           <FaUserCircle
//             className="w-10 h-10 cursor-pointer"
//             onClick={() => handleDrawerToggle("profile")}
//           />
//         )}
//         {/* Drawer Icon (Visible in MD and Below, Hidden in LG and Above) */}
//         <button onClick={() => setDrawerOpen(true)} className="text-3xl lg:hidden">
//           <FaBars />
//         </button>
//       </div>

//       {/* Search Popup (Only on Tablet & Mobile) */}
//       {searchOpen && (
//         <>
//           {/* Search Popup Modal */}
//           <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-white shadow-xl rounded-lg w-96 p-6 z-50 transition-all duration-300 ease-in-out">
//             <input
//               type="text"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-500"
//               placeholder="Search..."
//             />
//             <button
//               className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition duration-200"
//               onClick={() => setSearchOpen(false)}
//             >
//               X
//             </button>
//           </div>

//           {/* Background Overlay (with blurred effect) */}
//           <div
//             className="fixed inset-0 bg-opacity-40 backdrop-blur-xs z-40"
//             onClick={() => setSearchOpen(false)}
//           ></div>
//         </>
//       )}

//       {/* Drawer Menu (Only for Tablet & Mobile) */}
//       <div
//         className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
//           drawerOpen ? "translate-x-0" : "-translate-x-full"
//         } transition-transform duration-300 ease-in-out z-50`}
//       >
//         {/* Close Button */}
//         <div className="p-4 flex justify-end">
//           <FaTimes className="text-2xl cursor-pointer" onClick={() => setDrawerOpen(false)} />
//         </div>

//         {/* Drawer Content */}
//         <div className="px-4 space-y-2 text-lg">
//           <NavLink to="/profile" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
//             <FaUser className="text-blue-600" />
//             <span className="text-black">Your Profile</span>
//           </NavLink>
//           <NavLink to="/" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
//             <FaHome className="text-blue-600" />
//             <span className="text-black">Home</span>
//           </NavLink>
//           <NavLink to="/videos" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
//             <FaVideo className="text-blue-600" />
//             <span className="text-black">Videos</span>
//           </NavLink>
//           <NavLink to="/friends" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
//             <FaUsers className="text-blue-600" />
//             <span className="text-black">Friends</span>
//           </NavLink>
//           <NavLink to="/groups" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
//             <FaUsers className="text-blue-600" />
//             <span className="text-black">Groups</span>
//           </NavLink>
//           <NavLink to="/marketplace" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
//             <FaStore className="text-blue-600" />
//             <span className="text-black">Marketplace</span>
//           </NavLink>
//           <NavLink to="/watch" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
//             <FaTv className="text-blue-600" />
//             <span className="text-black">Watch</span>
//           </NavLink>
//           <NavLink to="/memories" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
//             <FaClock className="text-blue-600" />
//             <span className="text-black">Memories</span>
//           </NavLink>
//           <NavLink to="/saved" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
//             <FaBookmark className="text-blue-600" />
//             <span className="text-black">Saved</span>
//           </NavLink>
//           <NavLink to="/pages" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
//             <FaFlag className="text-blue-600" />
//             <span className="text-black">Pages</span>
//           </NavLink>
//           <NavLink to="/events" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
//             <FaCalendarAlt className="text-blue-600" />
//             <span className="text-black">Events</span>
//           </NavLink>
//         </div>
//       </div>

//       {/* Notification Drawer */}
//       {notificationDrawerOpen && (
//         <div
//           className="fixed top-16 right-0 w-80 bg-white h-full shadow-lg z-50 transform transition-transform duration-300"
//         >
//           <div className="px-4 space-y-2">
//             <p className="flex items-center space-x-2 hover:bg-slate-200 p-2">
//               <FaBell className="text-blue-600" />
//               <span className="text-black">Notification 1</span>
//             </p>
//             <p className="flex items-center space-x-2 hover:bg-slate-200 p-2">
//               <FaBell className="text-blue-600" />
//               <span className="text-black">Notification 2</span>
//             </p>
//             {/* Add more notifications here */}
//           </div>
//         </div>
//       )}

//       {/* Messenger Drawer */}
//       {messengerDrawerOpen && (
//         <div
//           className="fixed top-16 right-0 w-80 bg-white h-full shadow-lg z-50 transform transition-transform duration-300"
//         >
//           <div className="px-4 space-y-2">
//             {/* Example 1: Message */}
//             <p className="flex items-center space-x-2 hover:bg-slate-200 p-2">
//               <img
//                 src="https://via.placeholder.com/40"
//                 alt="User Avatar"
//                 className="rounded-full"
//               />
//               <div className="flex flex-col">
//                 <span className="font-medium text-black">John Doe</span>
//                 <span className="text-sm text-gray-500">Hey, how's it going?</span>
//               </div>
//             </p>
//             {/* Example 2: Message */}
//             <p className="flex items-center space-x-2 hover:bg-slate-200 p-2">
//               <img
//                 src="https://via.placeholder.com/40"
//                 alt="User Avatar"
//                 className="rounded-full"
//               />
//               <div className="flex flex-col">
//                 <span className="font-medium text-black">Jane Smith</span>
//                 <span className="text-sm text-gray-500">Let's catch up soon!</span>
//               </div>
//             </p>
//             {/* Add more messages here */}
//           </div>
//         </div>
//       )}

//       {/* Profile Drawer */}
//       {profileDrawerOpen && (
//         <div
//           className="fixed top-18 pb-9 right-0 w-96 bg-slate-300 h-auto shadow-2xl mr-5 z-50  transform transition-transform duration-300"
//         >
//           <div className="px-4 space-y-2">
//             <p className="flex items-center space-x-2 hover:bg-slate-200 p-2">
//               <RxAvatar className="text-blue-600 text-3xl" />
//               <span className="text-black">UserName </span>
//             </p>
//             <p className="flex items-center space-x-2 hover:bg-slate-200 p-2">
//               <FiSettings className="text-blue-600" />
//               <span className="text-black">Settings</span>
//             </p>
//             <p className="flex items-center space-x-2 hover:bg-slate-200 p-2">
//               <FaUserCircle className="text-blue-600" />
//               <span className="text-black">Settings</span>
//             </p>
//             <p className="flex items-center space-x-2 hover:bg-slate-200 p-2">
//               <GrHelpBook className="text-blue-600" />
//               <span className="text-black">Help & Support</span>
//             </p>
//             <button onClick={handleLogOut} className="flex items-center space-x-2 hover:bg-slate-200 p-2">
//               <MdLogout className="text-blue-600" />
//               <span className="text-black">Logout</span>
//             </button>
//             {/* Add more profile options here */}
//           </div>
//         </div>
//       )}

//       {/* Background Overlay for Drawers */}
//       {(notificationDrawerOpen || messengerDrawerOpen || profileDrawerOpen) && (
//         <div
//           className="fixed inset-0 bg-opacity-50 z-40"
//           onClick={closeAllDrawers}
//         ></div>
//       )}
//     </div>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaSearch,
  FaHome,
  FaVideo,
  FaUserFriends,
  FaGamepad,
  FaBell,
  FaFacebookMessenger,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaUser,
  FaUsers,
  FaStore,
  FaTv,
  FaClock,
  FaBookmark,
  FaFlag,
  FaCalendarAlt,
  FaSearchengin,
} from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { GrHelpBook } from "react-icons/gr";
import { RxAvatar } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserAsync, selectUser } from "../services/Auth/AuthSlice";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [messengerDrawerOpen, setMessengerDrawerOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const profileImage = ""; // Replace with user's profile image URL if available

  const user = useSelector(selectUser);

  // Handle Drawer Toggles
  const handleDrawerToggle = (type) => {
    if (type === "notification") {
      setNotificationDrawerOpen((prev) => !prev);
      setMessengerDrawerOpen(false);
      setProfileDrawerOpen(false);
    } else if (type === "messenger") {
      setMessengerDrawerOpen((prev) => !prev);
      setNotificationDrawerOpen(false);
      setProfileDrawerOpen(false);
    } else if (type === "profile") {
      setProfileDrawerOpen((prev) => !prev);
      setNotificationDrawerOpen(false);
      setMessengerDrawerOpen(false);
    }
  };

  // Close all drawers
  const closeAllDrawers = () => {
    setNotificationDrawerOpen(false);
    setMessengerDrawerOpen(false);
    setProfileDrawerOpen(false);
  };

  const dispatch = useDispatch();
  const handleLogOut = (e) => {
    e.preventDefault();
    console.log("clicked log out");
    dispatch(logoutUserAsync());
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex items-center justify-between relative">
      {/* Left: Logo & Search */}
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">Mbook</h1>
        {/* Full Search Bar on Large Screens, Icon on Tablet/Mobile */}
        <div className="hidden lg:block">
          <input
            type="text"
            className="p-2 rounded-full w-64 bg-white text-black placeholder-gray-500 focus:outline-none px-4"
            placeholder="Search..."
          />
        </div>
        <FaSearch
          className="text-xl cursor-pointer lg:hidden"
          onClick={() => setSearchOpen(true)}
        />
      </div>

      {/* Middle: Navigation Links (Only on Large Screens) */}
      <div className="hidden lg:flex space-x-6 text-2xl">
        <NavLink to="/home" className="hover:text-gray-300">
          <FaHome />
        </NavLink>
        <NavLink to="/home/videos" className="hover:text-gray-300">
          <FaVideo />
        </NavLink>
        <NavLink to="/friends" className="hover:text-gray-300">
          <FaUserFriends />
        </NavLink>
        <NavLink to="/games" className="hover:text-gray-300">
          <FaGamepad />
        </NavLink>
      </div>

      {/* Right: Notification, Messenger, Profile & Drawer (Drawer visible in MD and below) */}
      <div className="flex items-center space-x-6 text-2xl">
        <FaBell
          className="cursor-pointer hover:text-gray-300"
          onClick={() => handleDrawerToggle("notification")}
        />
        <FaFacebookMessenger
          className="cursor-pointer hover:text-gray-300"
          onClick={() => handleDrawerToggle("messenger")}
        />
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="rounded-full w-10 h-10 cursor-pointer"
            onClick={() => handleDrawerToggle("profile")}
          />
        ) : (
          <FaUserCircle
            className="w-10 h-10 cursor-pointer"
            onClick={() => handleDrawerToggle("profile")}
          />
        )}
        {/* Drawer Icon (Visible in MD and Below, Hidden in LG and Above) */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="text-3xl lg:hidden"
        >
          <FaBars />
        </button>
      </div>

      {/* Search Popup (Only on Tablet & Mobile) */}
      {searchOpen && (
        <>
          {/* Search Popup Modal */}
          <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-white shadow-xl rounded-lg w-96 p-6 z-50 transition-all duration-300 ease-in-out">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-500"
              placeholder="Search..."
            />
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition duration-200"
              onClick={() => setSearchOpen(false)}
            >
              X
            </button>
          </div>

          {/* Background Overlay (with blurred effect) */}
          <div
            className="fixed inset-0 bg-opacity-40 backdrop-blur-xs z-40"
            onClick={() => setSearchOpen(false)}
          ></div>
        </>
      )}

      {/* Drawer Menu (Only for Tablet & Mobile) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        {/* Close Button */}
        <div className="p-4 flex justify-end">
          <FaTimes
            className="text-2xl cursor-pointer"
            onClick={() => setDrawerOpen(false)}
          />
        </div>

        {/* Drawer Content */}
        <div className="px-4 space-y-2 text-lg">
          <NavLink
            to="/profile"
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
          >
            <FaUser className="text-blue-600" />
            <span className="text-black">Your Profile</span>
          </NavLink>
          <NavLink
            to="/"
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
          >
            <FaHome className="text-blue-600" />
            <span className="text-black">Home</span>
          </NavLink>
          <NavLink
            to="/videos"
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
          >
            <FaVideo className="text-blue-600" />
            <span className="text-black">Videos</span>
          </NavLink>
          <NavLink
            to="/friends"
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
          >
            <FaUsers className="text-blue-600" />
            <span className="text-black">Friends</span>
          </NavLink>
          <NavLink
            to="/groups"
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
          >
            <FaUsers className="text-blue-600" />
            <span className="text-black">Groups</span>
          </NavLink>
          <NavLink
            to="/marketplace"
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
          >
            <FaStore className="text-blue-600" />
            <span className="text-black">Marketplace</span>
          </NavLink>
          <NavLink
            to="/watch"
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
          >
            <FaTv className="text-blue-600" />
            <span className="text-black">Watch</span>
          </NavLink>
          <NavLink
            to="/memories"
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
          >
            <FaClock className="text-blue-600" />
            <span className="text-black">Memories</span>
          </NavLink>
          <NavLink
            to="/saved"
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
          >
            <FaBookmark className="text-blue-600" />
            <span className="text-black">Saved</span>
          </NavLink>
          <NavLink
            to="/pages"
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
          >
            <FaFlag className="text-blue-600" />
            <span className="text-black">Pages</span>
          </NavLink>
          <NavLink
            to="/events"
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
          >
            <FaCalendarAlt className="text-blue-600" />
            <span className="text-black">Events</span>
          </NavLink>
        </div>
      </div>

      {/* Notification Drawer */}
      {notificationDrawerOpen && (
        <div className="fixed top-16 right-0 w-80 bg-white h-full shadow-lg z-50 transform transition-transform duration-300">
          <div className="px-4 space-y-2">
            <p className="flex items-center space-x-2 hover:bg-slate-200 p-2">
              <FaBell className="text-blue-600" />
              <span className="text-black">Notification 1</span>
            </p>
            <p className="flex items-center space-x-2 hover:bg-slate-200 p-2">
              <FaBell className="text-blue-600" />
              <span className="text-black">Notification 2</span>
            </p>
            {/* Add more notifications here */}
          </div>
        </div>
      )}

      {/* Messenger Drawer */}
      {messengerDrawerOpen && (
        <div className="fixed top-16 right-0 w-80 bg-white h-full shadow-lg z-50 transform transition-transform duration-300">
          <div className="px-4 space-y-2">
            {/* Example 1: Message */}
            <p className="flex items-center space-x-2 hover:bg-slate-200 p-2">
              <img
                src="https://via.placeholder.com/40"
                alt="User Avatar"
                className="rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-medium text-black">John Doe</span>
                <span className="text-sm text-gray-500">
                  Hey, how's it going?
                </span>
              </div>
            </p>
            {/* Example 2: Message */}
            <p className="flex items-center space-x-2 hover:bg-slate-200 p-2">
              <img
                src="https://via.placeholder.com/40"
                alt="User Avatar"
                className="rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-medium text-black">Jane Smith</span>
                <span className="text-sm text-gray-500">
                  Let's catch up soon!
                </span>
              </div>
            </p>
            {/* Add more messages here */}
          </div>
        </div>
      )}

      {/* Profile Drawer */}
      {profileDrawerOpen && (
        <div className="right-12 pb-5  shadow-gray-400 shadow-2xl transform transition-transform duration-300 fixed top-18 z-50 bg-white rounded-lg w-80">
          <div className="px-4 space-y-2">
            {/* User Section */}
            <div className="relative z-30 bg-white p-2 rounded-lg">
              <NavLink to="profile" className="flex cursor-pointer items-center space-x-2 hover:bg-slate-200 p-2 rounded-md">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <RxAvatar className="text-blue-600 text-3xl" />
                )}
                <span className="text-black font-semibold">{user?.name}</span>
              </NavLink>

              {/* Pages Section */}
              <div className="max-h-40 overflow-y-auto bg-gray-200 rounded-md p-2">
                <p className="text-gray-700 font-medium mb-2">Your Pages</p>
                <p className="flex items-center  text-black space-x-2 hover:bg-slate-200 p-2 rounded-md">
                  📄 Page 1
                </p>
                <p className="flex items-center text-black space-x-2 hover:bg-slate-200 p-2 rounded-md">
                  📄 Page 2
                </p>
                <p className="flex items-center text-black space-x-2 hover:bg-slate-200 p-2 rounded-md">
                  📄 Page 3
                </p>
              </div>
            </div>

            {/* Menu Options */}
            <p className="flex items-center space-x-2 hover:bg-slate-200 p-2 rounded-md">
              <FiSettings className="text-blue-600" />
              <span className="text-black">Settings</span>
            </p>
            <p className="flex items-center space-x-2 hover:bg-slate-200 p-2 rounded-md">
              <FaUserCircle className="text-blue-600" />
              <span className="text-black">Profile</span>
            </p>
            <p className="flex items-center space-x-2 hover:bg-slate-200 p-2 rounded-md">
              <GrHelpBook className="text-blue-600" />
              <span className="text-black">Help & Support</span>
            </p>
            <button
              onClick={handleLogOut}
              className="flex items-center cursor-pointer space-x-2 hover:bg-slate-200 p-2 rounded-md w-full text-left"
            >
              <MdLogout className="text-blue-600" />
              <span className="text-black">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Background Overlay for Drawers */}
      {(notificationDrawerOpen || messengerDrawerOpen || profileDrawerOpen) && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40"
          onClick={closeAllDrawers}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
