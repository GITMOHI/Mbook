import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socket from "../../../utils/socket";


const ConversationList = ({ user, setActiveChat }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?._id) {
        console.error("User ID is missing.");
        return;
      }
    
      setLoading(true);
      setError(null);
    
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem("accessToken");
    
        if (!token) {
          throw new Error("No access token found. Please log in.");
        }
    
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
    
        // Use POST instead of GET
        const response = await axios.get(`${API_URL}/api/chats/getChatList/${user._id}`,config);
        console.log(response.data); 
        if (!response.data) {
          throw new Error("No data received from the server.");
        }
    
        setConversations(response.data.conversations || []); // Ensure conversations is always an array
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError(err.response?.data?.error || err.message || "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // // Listen for new messages to update the conversation list
    // socket.on('receiveMessage', (messageData) => {
    //   updateConversationWithNewMessage(messageData);
    // });


    socket.on('newMessage', (messageData) => {
      console.log('New message received:', messageData);
      updateConversationWithNewMessage(messageData.message);
    });

    // Listen for new chats
    socket.on('newChat', (chatData) => {
      setConversations(prev => [chatData, ...prev]);
    });

    // Listen for group updates
    socket.on('groupUpdated', (updatedGroup) => {
      setConversations(prev => 
        prev.map(chat => chat._id === updatedGroup._id ? updatedGroup : chat)
      );
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('newChat');
      socket.off('groupUpdated');
    };
  }, [user]);

  const updateConversationWithNewMessage = (messageData) => {
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv._id === messageData.chatId) {
          // Update the conversation with the new message
          return {
            ...conv,
            lastMessage: messageData.message,
            lastMessageTime: messageData.timestamp,
            unreadCount: conv.unreadCount ? conv.unreadCount + 1 : 1
          };
        }
        return conv;
      });
    });
  };

  // Sort conversations by the last message time
  const sortedConversations = [...conversations].sort((a, b) => {
    return new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
        <button 
          onClick={() => window.location.reload()} 
          className="block mx-auto mt-2 text-blue-500 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (sortedConversations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No conversations yet</p>
        <p className="text-sm mt-2">Search for friends to start chatting</p>
      </div>
    );
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    
    // Same day
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Within the last week
    const differenceInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (differenceInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Older messages
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-150px)]">
      <div className="space-y-2">
        {sortedConversations?.map((chat) => {
          // console.log(chat);
          // Determine if it's a group chat
          const isGroup = chat?.isGroupChat;
          
          // For one-to-one chats, find the other participant
          const chatPartner = !isGroup ? 
            chat.participants?.find(p => p._id !== user._id) : null;
          
          // Determine the display name and avatar initial
          const displayName = isGroup ? chat.groupName : chatPartner?.name || 'Unknown User';
          const initial = displayName.charAt(0).toUpperCase();
          
          // Check if this is the user's message
          const isUserLastMessage = chat.lastMessageSender === user._id;
          
          return (
            <div
              key={chat._id}
              className="flex items-center p-3 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors duration-200"
              onClick={() => setActiveChat(chat)}
            >
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full ${
                isGroup 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                  : 'bg-gradient-to-r from-purple-400 to-indigo-500'
              } flex items-center justify-center text-white font-bold mr-3`}>
                {initial}
              </div>
              
              {/* Chat info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{displayName}</h3>
                  <span className="text-xs text-gray-500">
                    {formatTime(chat.lastMessageTime)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 truncate">
                    {isUserLastMessage && 'You: '}
                    {chat.lastMessage || 'Start a conversation'}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;