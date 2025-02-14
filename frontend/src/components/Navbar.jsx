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
} from "react-icons/fa";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const profileImage = ""; // Replace with user's profile image URL if available

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
        <NavLink to="/home" className="hover:text-gray-300"><FaHome /></NavLink>
        <NavLink to="/home/videos" className="hover:text-gray-300"><FaVideo /></NavLink>
        <NavLink to="/friends" className="hover:text-gray-300"><FaUserFriends /></NavLink>
        <NavLink to="/games" className="hover:text-gray-300"><FaGamepad /></NavLink>
      </div>

      {/* Right: Notification, Messenger, Profile & Drawer (Drawer visible in MD and below) */}
      <div className="flex items-center space-x-6 text-2xl">
        <FaBell className="cursor-pointer hover:text-gray-300" />
        <FaFacebookMessenger className="cursor-pointer hover:text-gray-300" />
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="rounded-full w-10 h-10 cursor-pointer"
          />
        ) : (
          <FaUserCircle className="w-10 h-10 cursor-pointer" />
        )}
        {/* Drawer Icon (Visible in MD and Below, Hidden in LG and Above) */}
        <button onClick={() => setDrawerOpen(true)} className="text-3xl lg:hidden">
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
      className="fixed inset-0  bg-opacity-40 backdrop-blur-xs z-40"
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
          <FaTimes className="text-2xl cursor-pointer" onClick={() => setDrawerOpen(false)} />
        </div>

        {/* Drawer Content */}
        <div className="px-4 space-y-2 text-lg">
          <NavLink to="/profile" className="flex items-center space-x-2  hover:bg-gray-100 p-2 rounded">
            <FaUser className="text-blue-600" />
            <span className="text-black">Your Profiles</span>
            
          </NavLink>
          <NavLink to="/" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <FaHome className="text-blue-600" />
            <span  className="text-black" >Home</span>
          </NavLink>
          <NavLink to="/videos" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <FaVideo className="text-blue-600" />
            <span  className="text-black" >Videos</span>
          </NavLink>
          <NavLink to="/friends" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <FaUsers className="text-blue-600" />
            <span  className="text-black">Friends</span>
          </NavLink>
          <NavLink to="/groups" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <FaUsers className="text-blue-600" />
            <span  className="text-black" >Groups</span>
          </NavLink>
          <NavLink to="/marketplace" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <FaStore className="text-blue-600" />
            <span  className="text-black" >Marketplace</span>
          </NavLink>
          <NavLink to="/watch" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <FaTv className="text-blue-600" />
            <span  className="text-black" > Watch</span>
          </NavLink>
          <NavLink to="/memories" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <FaClock className="text-blue-600" />
            <span  className="text-black" >Memories</span>
          </NavLink>
          <NavLink to="/saved" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <FaBookmark className="text-blue-600" />
            <span  className="text-black" >Saved</span>
          </NavLink>
          <NavLink to="/pages" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <FaFlag className="text-blue-600" />
            <span  className="text-black" >Pages</span>
          </NavLink>
          <NavLink to="/events" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
            <FaCalendarAlt className="text-blue-600" />
            <span  className="text-black">Events</span>
          </NavLink>
        </div>
      </div>

      {/* Background Overlay for Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-opacity-100 backdrop-blur-xs z-20"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
