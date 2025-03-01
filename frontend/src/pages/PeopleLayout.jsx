import React, { useEffect, useState } from "react";
import { Users, Home, Gift, List, Settings, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  selectUser,
  sendFriendRequest,
  confirmFriendRequest,
  fetchAllFriendRequests,
  fetchSentRequests,
  fetchAllFriendsById,
  selectAllFriends,
  selectAllSentReq,
  selectAllReceiveReq,
} from "../services/Auth/AuthSlice";
import { toast, ToastContainer } from "react-toastify";
import socket from "../utils/socket";
import { NavLink, Outlet } from "react-router";

const  PeopleLayout = () => {
//   const dispatch = useDispatch();
//   const [sugg, setSugg] = useState([]);

//  // Track sent friend requests
//   const [error, setError] = useState(null);
//   const user = useSelector(selectUser);
//   const [sentRequestCount, setSentRequestCount] = useState(0);
  



//   const sentReq = useSelector(selectAllSentReq) || [];
//   const [sentRequests, setSentRequests] = useState(sentReq);

//   const recReq = useSelector(selectAllReceiveReq) || [];
//   const [friendRequests, setFriendRequests] = useState(recReq);

//   useEffect(() => {
//     dispatch(fetchAllUsers())
//       .unwrap()
//       .then((data) => {
//         setSugg(data);
//         setError(null);
//       })
//       .catch((error) => {
//         setError(error.message);
//         console.error("Failed to fetch users:", error);
//       });
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(fetchAllFriendRequests(user?._id))
//       .unwrap()
//       .then((data) => {
//         console.log(data);
//         setFriendRequests(data);
//         setError(null);
//       })
//       .catch((error) => {
//         setError(error.message);
//         console.error("Failed to fetch users:", error);
//       });
//   }, [dispatch, user?._id]);

//   useEffect(() => {
//     if (user?._id) {
//       dispatch(fetchSentRequests(user._id))
//         .unwrap()
//         .then((data) => {
//           setSentRequests(data);
//           setError(null);
//         })
//         .catch((error) => {
//           setError(error.message);
//           console.error("Failed to fetch sent requests:", error);
//         });
//     }
//   }, [dispatch, user?._id, sentRequestCount]);

//   useEffect(() => {
//     if (user?._id) {
//       dispatch(fetchAllFriendsById(user._id));

//     }
//   }, [dispatch, user?._id]);

//   // Extract the IDs of users in the friendRequests array
//   const friendRequestIds = friendRequests?.map((request) => request._id);
//   const sentRequestsIds = sentRequests?.map((request) => request._id);
  
//   const allFriends = useSelector(selectAllFriends) || []; // Ensure it's an array

//   // Convert to an array of IDs safely
//   const friendIds = Array.isArray(allFriends) ? allFriends.map(friend => friend._id) : [];
  
//   //excluding..
//   // 1. The current user
//   // 2. Users who are in the friendRequests array
//   // 3. Users who are already friends
//   const suggestions = sugg?.filter(
//     (suggestion) =>
//       suggestion._id !== user?._id &&
//       !friendRequestIds.includes(suggestion._id) &&
//       !friendIds.includes(suggestion._id)
//   );

//   const handleSendFriendRequest = (receiverId) => {
//     dispatch(sendFriendRequest({ senderId: user._id, receiverId }))
//       .unwrap()
//       .then(() => {
//         toast.success("Friend Request Sent!");
//         // Add the receiverId to the sentRequests list
//         setSentRequests((prev) => [...prev, receiverId]);
//         // Increment the counter to trigger useEffect
//         setSentRequestCount((prev) => prev + 1);

//         const notification = {
//           message: `${user?.name} sent you a friend request`,
//           senderId: user?._id,
//           receivers: [receiverId],
//           type: "friendRequest",
//           targetId: "friendRequest", // Replace with actual post ID
//         };

//         socket.emit("sendNotification", notification);
//       })
//       .catch((error) => {
//         if (error.message !== "Server Error") {
//           toast.error(error.message);
//         } else {
//           toast.error("Friend Request Failed");
//         }
//       });
//   };

//   const handleConfirmFriendRequest = (receiverId) => {
//     dispatch(confirmFriendRequest({ receiverId, senderId: user?._id }))
//       .unwrap()
//       .then(() => {
//         alert("Friend request confirmed successfully");
//         dispatch(fetchAllFriendsById(user?._id));
//         dispatch(fetchAllFriendRequests(user?._id))
//         .unwrap()
//         .then((data) => {
//           console.log(data);
//           setFriendRequests(data);
//           setError(null);
//         })
//         .catch((error) => {
//           setError(error.message);
//           console.error("Failed to fetch users:", error);
//         });
//       })
//       .catch((error) => {
//         alert("Failed to confirm friend request: " + error.message);
//       });
//   };

  const sidebarItems = [
    { icon: <Home size={20} />, label: "All", to:"/home/peoples" },
    { icon: <Users size={20} />, label: "Friend Requests", to:"/home/peoples/frndReq", hasMore: true },
    { icon: <Users size={20} />, label: "Suggestions",to:"/home/peoples/frndSugg", hasMore: true },
    { icon: <Users size={20} />, label: "All friends", to:"/home/peoples/allFriends", hasMore: true },
    { icon: <Gift size={20} />, label: "Birthdays" },
    { icon: <List size={20} />, label: "Custom Lists", hasMore: true },
  ];

//   useEffect(() => {
//     friendRequests?.forEach((f) => {
//       console.log(f);
//     });
//   }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Sidebar */}
      <div className="w-[280px] lg:w-[360px] bg-white p-4 shadow-sm hidden md:block h-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Friends</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings size={20} />
          </button>
        </div>
        <nav>
          {sidebarItems.map((item, index) => (
            <NavLink to={item.to}
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer mb-1"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              {item.hasMore && <ChevronRight size={20} />}
            </NavLink>
          ))}
        </nav>
      </div>





     <div className="flex-1 p-4 md:p-8 overflow-y-auto">
       <Outlet></Outlet>
     </div>

    </div>
  );
};

export default PeopleLayout;
