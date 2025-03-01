import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  markAsRead,
  selectNotifications,
} from "../services/Notification/NotificationSlice";
import { fetchAllFriendRequests, selectUser } from "../services/Auth/AuthSlice";

const Notifications = () => {
  const notifications = useSelector(selectNotifications) || [];
  console.log(notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser) || [];


  const handleClick = (notification) => {
    dispatch(markAsRead(notification?._id));
    dispatch(fetchAllFriendRequests(user?._id))

    // Redirect based on notification type
    switch (notification.type) {
      case "post":
        navigate(`/post/${notification.targetId}`);
        break;
      case "friendRequest":
        navigate(`/home/peoples`);
        break;
      case "requestAccepted":
        navigate(`/home/peoples/allFriends`);
        break;
      default:
        break;
    }
  };

  const markAllAsRead = (e) => {
    e.stopPropagation();
    notifications.forEach((notification) => {
      if (!notification.read) {
        dispatch(markAsRead(notification.id));
      }
    });
  };

  // Format timestamp to Facebook style
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now - notificationTime;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;

    return notificationTime.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  // Get first letter for avatar placeholder
  const getInitial = (message) => {
    return message.charAt(0).toUpperCase();
  };

  return (
    <div className="border-2 border-gray-300 absolute right-4 top-16 w-80 bg-white shadow-xl rounded-lg overflow-hidden z-50 transform origin-top-right transition-all duration-200 ease-out">
      {/* Facebook-style blue header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-base">Notifications</span>
        {notifications?.some((note) => !note.read) && (
          <span
            onClick={markAllAsRead}
            className="text-xs cursor-pointer opacity-90 hover:underline"
          >
            Mark all as read
          </span>
        )}
      </div>

      {/* Scrollable notifications list */}
      <div className="max-h-96 overflow-y-auto">
        {notifications?.length === 0 ? (
          <div className=" p-4 text-sm text-gray-500">No new notifications</div>
        ) : (
          <div className=" \max-h-96 overflow-y-auto">
            {[...notifications]
              .slice(-15) // Get the last 15 notifications (most recent ones)
              .reverse() // Reverse them so the oldest of the 15 is at the top
              .map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleClick(note)}
                  className={`hover:bg-slate-300  bg-slate-200 flex items-start px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors duration-150 ${
                    note.read
                      ? "hover:bg-gray-50"
                      : "bg-blue-50 hover:bg-blue-100"
                  } group`}
                >
                  {/* Profile icon/avatar */}
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <img src={note?.senderId?.profilePicture} className="w-10 h-10 rounded-full" alt="" />
                    </div>
                  </div>

                  {/* Notification content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 mb-1 leading-snug line-clamp-2">
                      {note.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(note.timestamp)}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!note.read && (
                    <div className="ml-2 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5"></div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
