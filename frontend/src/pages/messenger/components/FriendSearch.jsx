import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; // Importing the cross (close) icon
import { useSelector } from 'react-redux';
import { selectUser } from '../../../services/Auth/AuthSlice';

const FriendSearch = ({ setActiveChat, setDrawerOpen }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search the users when the query changes, with debounce
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const debounceTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/users/searchUser?query=${query}`);
        setResults(res.data);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms delay for debouncing the search input

    // Cleanup the timeout if query changes again before the timeout finishes
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  // Handle selecting a user from the search results
  // const startConversation = (user) => {
  //   // const active .
  //   setActiveChat(user); // Set the active chat
  //   setQuery(''); // Clear the search field
  //   setResults([]); // Clear the search results
  //   setDrawerOpen(false); // Close the drawer
  // };
  

  //one-one..conversation starting..
  const currentUser = useSelector(selectUser);
  const startConversation = async (user) => {
    try {
      // Fetch or create the chat from the backend
      const response = await axios.post(`${API_URL}/api/chats/getOrCreateChat`, {
        userId: user._id, // The searched user's ID
        currentUserId: currentUser._id // The current user's ID
      });
  
      // Set the active chat to the fetched/created chat
      setActiveChat(response.data);
  
      // Clear search and close drawer
      setQuery('');
      setResults([]);
      setDrawerOpen(false);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  // Handle closing the search (clear query and results)
  const closeSearch = () => {
    setQuery(''); // Clear the search field
    setResults([]); // Clear the search results
    setDrawerOpen(false); // Close the drawer
  };

  return (
    <div className='z-50'>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Search Friends</h3>
        {/* Cross button to close the search */}
        <button 
          onClick={closeSearch} 
          className="text-gray-600 hover:text-gray-800 p-2 cursor-pointer rounded-full"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Update query state
        placeholder="Search by name or email..."
        className="border p-2 w-full mb-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
      />

      {/* Display search results */}
      {loading ? (
        <div className="text-blue-500 text-center mt-2">Searching...</div>
      ) : (
        <ul className="mt-4 max-h-96 overflow-y-scroll">
          {results.length > 0 ? (
            results.map((user) => (
              <li
                key={user._id}
                className="p-2 border-b cursor-pointer hover:bg-gray-100 transition-all rounded-md"
                onClick={() => startConversation(user)}
              >
                <div className="flex items-center">
                  <img
                    src={user.profilePicture || "default-avatar.png"}
                    alt={user.name}
                    className="inline-block w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No results found for "{query}"</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default FriendSearch;
