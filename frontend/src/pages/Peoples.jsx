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

const Peoples = () => {
  const dispatch = useDispatch();
  const [sugg, setSugg] = useState([]);

 // Track sent friend requests
  const [error, setError] = useState(null);
  const user = useSelector(selectUser);
  const [sentRequestCount, setSentRequestCount] = useState(0);
  



  const sentReq = useSelector(selectAllSentReq) || [];
  const [sentRequests, setSentRequests] = useState(sentReq);

  const recReq = useSelector(selectAllReceiveReq) || [];
  const [friendRequests, setFriendRequests] = useState(recReq);

  useEffect(() => {
    dispatch(fetchAllUsers())
      .unwrap()
      .then((data) => {
        setSugg(data);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
        console.error("Failed to fetch users:", error);
      });
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllFriendRequests(user?._id))
      .unwrap()
      .then((data) => {
        console.log(data);
        setFriendRequests(data);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
        console.error("Failed to fetch users:", error);
      });
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchSentRequests(user._id))
        .unwrap()
        .then((data) => {
          setSentRequests(data);
          setError(null);
        })
        .catch((error) => {
          setError(error.message);
          console.error("Failed to fetch sent requests:", error);
        });
    }
  }, [dispatch, user?._id, sentRequestCount]);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchAllFriendsById(user._id));

    }
  }, [dispatch, user?._id]);

  // Extract the IDs of users in the friendRequests array
  const friendRequestIds = friendRequests?.map((request) => request._id);
  const sentRequestsIds = sentRequests?.map((request) => request._id);
  
  const allFriends = useSelector(selectAllFriends) || []; // Ensure it's an array

  // Convert to an array of IDs safely
  const friendIds = Array.isArray(allFriends) ? allFriends.map(friend => friend._id) : [];
  
  //excluding..
  // 1. The current user
  // 2. Users who are in the friendRequests array
  // 3. Users who are already friends
  const suggestions = sugg?.filter(
    (suggestion) =>
      suggestion._id !== user?._id &&
      !friendRequestIds.includes(suggestion._id) &&
      !friendIds.includes(suggestion._id)
  );

  const handleSendFriendRequest = (receiverId) => {
    dispatch(sendFriendRequest({ senderId: user._id, receiverId }))
      .unwrap()
      .then(() => {
        toast.success("Friend Request Sent!");
        // Add the receiverId to the sentRequests list
        setSentRequests((prev) => [...prev, receiverId]);
        // Increment the counter to trigger useEffect
        setSentRequestCount((prev) => prev + 1);

        const notification = {
          message: `${user?.name} sent you a friend request`,
          senderId: user?._id,
          receivers: [receiverId],
          type: "friendRequest",
          targetId: "friendRequest", // Replace with actual post ID
        };

        socket.emit("sendNotification", notification);
      })
      .catch((error) => {
        if (error.message !== "Server Error") {
          toast.error(error.message);
        } else {
          toast.error("Friend Request Failed");
        }
      });
  };

  const handleConfirmFriendRequest = (receiverId) => {
    dispatch(confirmFriendRequest({ receiverId, senderId: user?._id }))
      .unwrap()
      .then(() => {
        alert("Friend request confirmed successfully");
        dispatch(fetchAllFriendsById(user?._id));
        dispatch(fetchAllFriendRequests(user?._id))
        .unwrap()
        .then((data) => {
          console.log(data);
          setFriendRequests(data);
          setError(null);
        })
        .catch((error) => {
          setError(error.message);
          console.error("Failed to fetch users:", error);
        });
      })
      .catch((error) => {
        alert("Failed to confirm friend request: " + error.message);
      });
  };

  const sidebarItems = [
    { icon: <Home size={20} />, label: "Home" },
    { icon: <Users size={20} />, label: "Friend Requests", hasMore: true },
    { icon: <Users size={20} />, label: "Suggestions", hasMore: true },
    { icon: <Users size={20} />, label: "All friends", hasMore: true },
    { icon: <Gift size={20} />, label: "Birthdays" },
    { icon: <List size={20} />, label: "Custom Lists", hasMore: true },
  ];

  useEffect(() => {
    friendRequests?.forEach((f) => {
      console.log(f);
    });
  }, []);

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
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 cursor-pointer mb-1"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              {item.hasMore && <ChevronRight size={20} />}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Friend Requests Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Friend Requestssssssssss</h2>
          {friendRequests && friendRequests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {friendRequests.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <div className="aspect-w-1 aspect-h-1">
                    <img
                      src={friend.profilePicture}
                      alt="loading.."
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold  text-black">
                     
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {friend.mutualFriends} mutual friendss
                    </p>
                    <div className="space-y-2">
                      <button
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                        onClick={() => handleConfirmFriendRequest(friend._id)}
                      >
                        Confirm
                      </button>
                      <button className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="text-6xl animate-bounce">😔</div>
              <p className="mt-4 text-lg font-medium">No friend requests yet</p>
            </div>
          )}
        </section>

        {/* People You May Know Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">People you may know</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {suggestions?.map((person) => (
              <div
                key={person._id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={person?.profilePicture}
                    alt="loading.."
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-black">
                    {person.email}88
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {person.mutualFriends} mutual friends
                  </p>
                  <div className="space-y-2">
                    {sentRequestsIds.includes(person._id) ? ( // Check if request is sent
                      <button
                        className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-md cursor-not-allowed"
                        disabled
                      >
                        Request Sent
                      </button>
                    ) : (
                      <button
                        className="w-full cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                        onClick={() => handleSendFriendRequest(person._id)}
                      >
                        Add Friend
                      </button>
                    )}
                    <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 cursor-pointer transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Peoples;
