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
  deleteFriendRequest,
} from "../services/Auth/AuthSlice";
import { toast, ToastContainer } from "react-toastify";
import socket from "../utils/socket";
import { Navigate, useNavigate } from "react-router";

const AllPeople = () => {
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
  
  const navigate = useNavigate();
  console.log(recReq);
  useEffect(() => {
    setFriendRequests(recReq);
  }, [dispatch, recReq]);

  // useEffect(()=>{
  //    setSentRequestCount(sentReq+1);
  // },[dispatch,sentReq]);

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
  const friendIds = Array.isArray(allFriends)
    ? allFriends.map((friend) => friend._id)
    : [];

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

  const handleDeleteReq = (requester) => {
    console.log(requester);
    dispatch(deleteFriendRequest({ requester, rejecter: user?._id }))
      .unwrap()
      .then(() => {
        toast.success("Friend Request Removed Successfully");
        dispatch(fetchAllFriendRequests(user?._id));
        dispatch(fetchSentRequests(user?._id));
      })
      .catch((error) => {
        if (error.message !== "Server Error") {
          toast.error(error.message);
        } else {
          toast.error("Friend Request Failed");
        }
      });
  };

  const handleRemoveFriendSuggestion = (suggestionId) => {
    const newSuggestions = suggestions.filter(
      (suggestion) => suggestion._id !== suggestionId
    );
    setSugg(newSuggestions);
  };

  useEffect(() => {
    friendRequests?.forEach((f) => {
      console.log(f);
    });
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 ">
        {/* Friend Requests Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
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
                    <h3   onClick={() => navigate(`/home/profiles/${friend._id}`)} className="hover:underline cursor-pointer font-semibold text- text-black">
                      {friend.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {friend.mutualFriends} mutual friends
                    </p>
                    <div className="space-y-2">
                      <button
                        className="w-full cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                        onClick={() => handleConfirmFriendRequest(friend._id)}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleDeleteReq(friend._id)}
                        className="w-full cursor-pointer bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                      >
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
                    alt={person?.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3
                    onClick={() => navigate(`/home/profiles/${person._id}`)} // Wrap in an arrow function
                    className="font-semibold cursor-pointer text-black hover:underline"
                  >
                    {person.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {person.mutualFriends} mutual friends
                  </p>
                  <div className="space-y-2">
                    {sentRequestsIds.includes(person._id) ? ( // Check if request is sent
                      <div>
                        <button
                          className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-md cursor-not-allowed"
                          disabled
                        >
                          Request Sent
                        </button>
                        <button
                          disabled
                          className="w-full mt-2  bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 cursor-not-allowed transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button
                          className="w-full cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                          onClick={() => handleSendFriendRequest(person._id)}
                        >
                          Add Friend
                        </button>
                        <button
                          onClick={() =>
                            handleRemoveFriendSuggestion(person._id)
                          }
                          className="w-full mt-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 cursor-pointer transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}
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

export default AllPeople;
