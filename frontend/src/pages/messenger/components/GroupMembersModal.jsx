import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaUserPlus, FaUserMinus } from 'react-icons/fa';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const GroupMembersModal = ({ chat, isAdmin, currentUser, onClose, setActiveChat }) => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Set the initial members from the chat object
    setMembers(chat.participants || []);
  }, [chat]);

  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(`${API_URL}/api/users/searchUser?query=${searchTerm}`, config);
      
      // Filter out users already in the group
      const filteredResults = res.data.filter(
        user => !members.some(member => member._id === user._id)
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchUsers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const addToGroup = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(
        `${API_URL}/api/chats/group/${chat._id}/add`,
        { userId },
        config
      );

      // Update the active chat with new participant information
      setActiveChat(res.data);
      setMembers(res.data.participants);
      
      // Clear search results and term
      setSearchResults([]);
      setSearchTerm('');
      
      // Emit socket event to update other clients
      socket.emit('updateGroup', res.data);
    } catch (error) {
      console.error("Error adding user to group:", error);
    }
  };

  const removeFromGroup = async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(
        `${API_URL}/api/chats/group/${chat._id}/remove`,
        { userId },
        config
      );

      // Update the active chat with new participant information
      setActiveChat(res.data);
      setMembers(res.data.participants);
      
      // Emit socket event to update other clients
      socket.emit('updateGroup', res.data);
    } catch (error) {
      console.error("Error removing user from group:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Group Members</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          {isAdmin && (
            <div className="mb-4">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Add Members
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              
              {loading && <p className="text-sm text-gray-500 mt-1">Searching...</p>}
              
              {searchResults.length > 0 && (
                <div className="mt-2 max-h-32 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between py-2 border-b border-gray-100"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold mr-2">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">{user.name}</span>
                      </div>
                      <button
                        onClick={() => addToGroup(user._id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaUserPlus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Current Members ({members.length})
            </h4>
            <div className="max-h-60 overflow-y-auto">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold mr-2">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-medium">{member.name}</span>
                      {member._id === chat.admin && (
                        <span className="ml-2 text-xs text-gray-500">(Admin)</span>
                      )}
                    </div>
                  </div>
                  {isAdmin && member._id !== currentUser._id && member._id !== chat.admin && (
                    <button
                      onClick={() => removeFromGroup(member._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaUserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-gray-50 text-right rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupMembersModal;