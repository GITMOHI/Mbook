import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllFriendsById,
  selectAllFriends,
  selectUser,
} from "../services/Auth/AuthSlice";

const AllFriends = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchAllFriendsById(user._id));
    }
  }, [dispatch, user?._id]);

  const allFriends = useSelector(selectAllFriends) || [];

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">All Friends</h2>

      {allFriends.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {allFriends.map((friend) => (
            <div
              key={friend._id}
              className="bg-white shadow-md rounded-xl overflow-hidden transition-transform hover:scale-105 cursor-pointer"
              onClick={() => navigate(`/profile/${friend._id}`)}
            >
              <img
                src={friend.profilePicture || "/default-avatar.png"}
                alt={friend.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {friend.name}
                </h3>
                <p className="text-sm text-gray-500">15 mutual friends</p>
                <button
                  className="mt-3 cursor-pointer w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents navigation when clicking the button
                    navigate(`/chat/${friend._id}`);
                  }}
                >
                  Visit Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="text-6xl animate-bounce">😔</div>
          <p className="mt-4 text-lg font-medium">You have no friends yet</p>
        </div>
      )}
    </div>
  );
};

export default AllFriends;
