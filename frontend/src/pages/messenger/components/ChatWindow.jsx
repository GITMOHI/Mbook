import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import {
  FaPaperPlane,
  FaSmile,
  FaPaperclip,
  FaEllipsisV,
  FaUserPlus,
} from "react-icons/fa";
import GroupMembersModal from "./GroupMembersModal";
import socket from "../../../utils/socket";

// const socket = io('http://localhost:5000');

const ChatWindow = ({ activeChat, user, setActiveChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showGroupMembersModal, setShowGroupMembersModal] = useState(false);
  const messagesEndRef = useRef(null);
  const optionsRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Get chat details
  const isGroup = activeChat?.isGroupChat;
  const groupName = activeChat?.groupName;
  const isAdmin = isGroup ? activeChat?.admin === user._id : false;

  // For one-to-one chats, get the partner details

  const chatPartner =
    (!isGroup && activeChat?.participants?.find((p) => p._id !== user._id)) ||
    {};

  // console.log(activeChat);
  // console.log(chatPartner)

  // Handle clicks outside the options menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch messages and set up socket listeners
  useEffect(() => {
    if (!activeChat?._id) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get(
          `${API_URL}/api/chats/${activeChat._id}/messages`,
          config
        );
        setMessages(Array.isArray(res.data) ? res.data : []);

        // Mark messages as read
        if (activeChat.unreadCount > 0) {
          await axios.put(
            `${API_URL}/api/chat/${activeChat._id}/markAsRead`,
            {},
            config
          );
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    setNewMessage(""); // Clear input when changing chats
    socket.emit("joinChat", activeChat._id);
    console.log(`Joined room: ${activeChat._id}`);

    // Listen for typing indicators
    const typingHandler = (data) => {
      if (data.chatId === activeChat._id && data.userId !== user._id) {
        setIsTyping(true);
        // Clear typing indicator after 3 seconds of inactivity
        setTimeout(() => setIsTyping(false), 3000);
      }
    };

    // Listen for group member changes
    const groupUpdateHandler = (updatedGroup) => {
      if (activeChat._id === updatedGroup._id) {
        // Update the active chat with new participant informatsocketn
        setActiveChat(updatedGroup);
      }
    };

    //  socket.on('newMessage', (messageData) => {
    //   console.log(messageData)
    //    console.log('New message received:88',messageData);
    //   //  setMessages((prev) => [...prev, messageData.message]);

    //   //  if (messageData.chatId === activeChat._id) {
    //   //   setMessages((prev) => [...prev, messageData.message]);
    //   // }
    //  });

    // Listen for incoming messages
    const messageHandler = (messageData) => {
       console.log("called")
      if (messageData.chatId === activeChat._id) {
        console.log("New message received:", messageData.message);
        setMessages((prev) => [...prev, messageData.message]); // Add only the message object
      }
    };

    socket.on("newMessage", messageHandler);
    socket.on("userTyping", typingHandler);
    socket.on("groupUpdated", groupUpdateHandler);

    return () => {
      socket.off('newMessage', messageHandler);
      socket.off("userTyping", typingHandler);
      socket.off("groupUpdated", groupUpdateHandler);
      socket.emit("leaveChat", activeChat._id);
    };
  }, [activeChat, user._id, API_URL, setActiveChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavsocketr: "smooth" });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (activeChat?._id) {
      socket.emit("typing", { chatId: activeChat._id, userId: user._id });
    }
  };

  const shouldShowDate = (currentMessage, index, messages) => {
    // If messages array is undefined or empty, return false
    if (!messages || messages.length === 0) {
      return false;
    }

    // If it's the first message, always show the date separator
    if (index === 0) {
      return true;
    }

    // Get the previous message
    const previousMessage = messages[index - 1];

    // If currentMessage or previousMessage is undefined, return false
    if (!currentMessage || !previousMessage) {
      return false;
    }

    // Get the timestamps of the current and previous messages
    const currentTimestamp = currentMessage.timestamp;
    const previousTimestamp = previousMessage.timestamp;

    // If timestamps are missing or invalid, return false
    if (!currentTimestamp || !previousTimestamp) {
      return false;
    }

    // Get the dates of the current and previous messages
    const currentDate = new Date(currentTimestamp).toDateString();
    const previousDate = new Date(previousTimestamp).toDateString();

    // Show the date separator if the dates are different
    return currentDate !== previousDate;
  };

  const formatTime = (timestamp) => {
    // Handle invalid or missing timestamps
    if (!timestamp) {
      return "";
    }

    // Parse the timestamp
    const date = new Date(timestamp);

    // If the date is invalid, return an empty string
    if (isNaN(date.getTime())) {
      return "";
    }

    const now = new Date();

    // Check if the timestamp is today
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // Check if the timestamp is yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // Check if the timestamp is within the last 7 days
    const differenceInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (differenceInDays < 7) {
      return `${date.toLocaleDateString([], {
        weekday: "long",
      })} at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // For older timestamps, display the full date and time
    return `${date.toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    })} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !activeChat?._id) return;

    const messageData = {
      chatId: activeChat._id,
      sender: user._id,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    // Optimistically add message to UI
    // setMessages((prev) => [...prev, messageData]);
    setNewMessage("");

    const token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const endpoint = isGroup
        ? `${API_URL}/api/chats/sendGroupMessage`
        : `${API_URL}/api/chats/sendOneToOneMessage`;
      await axios.post(endpoint, messageData, config);
      socket.emit("sendMessage", messageData);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.filter((msg) => msg !== messageData));
    }
  };

  // If there's no active chat, show a fallback UI
  if (!activeChat) {
    return (
      <div className="flex flex-col h-full w-2/3 bg-white rounded-lg shadow-lg overflow-hidden items-center justify-center">
        <p className="text-gray-500 text-lg">
          Select a chat to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-2/3 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center px-6 py-3 bg-white border-b border-gray-200">
        {isGroup ? (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
            {groupName ? groupName.charAt(0).toUpperCase() : "G"}
          </div>
        ) : chatPartner?.profilePicture ? (
          <img
            src={chatPartner.profilePicture}
            alt={chatPartner.name}
            className="w-10 h-10 rounded-full mr-3"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold mr-3">
            {chatPartner?.name ? chatPartner.name.charAt(0).toUpperCase() : "?"}
          </div>
        )}

        <div className="flex-1">
          <h2 className="font-semibold text-gray-800">
            {isGroup ? groupName : chatPartner?.name}
          </h2>
          <div className="text-xs text-gray-500">
            {isGroup ? (
              <span>{activeChat.participants?.length || 0} members</span>
            ) : isTyping ? (
              <span className="text-gray-600">Typing...</span>
            ) : (
              <span>
                {chatPartner?.status === "online" ? "Online" : "Offline"}
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          {isGroup && isAdmin && (
            <button
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
              onClick={() => setShowGroupMembersModal(true)}
            >
              <FaUserPlus className="w-5 h-5" />
            </button>
          )}
          <div className="relative" ref={optionsRef}>
            <button
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
              onClick={() => setShowOptions(!showOptions)}
            >
              <FaEllipsisV className="w-5 h-5" />
            </button>

            {/* Options dropdown */}
            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu">
                  {isGroup && (
                    <button
                      onClick={() => setShowGroupMembersModal(true)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      {isAdmin ? "Manage Members" : "View Members"}
                    </button>
                  )}
                  <button
                    onClick={clearChat}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Clear Chat
                  </button>
                  {isGroup && isAdmin && (
                    <button
                      onClick={deleteGroup}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Delete Group
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Group Members Modal */}
      {showGroupMembersModal && (
        <GroupMembersModal
          chat={activeChat}
          isAdmin={isAdmin}
          currentUser={user}
          onClose={() => setShowGroupMembersModal(false)}
          setActiveChat={setActiveChat}
        />
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg
              className="w-16 h-16 mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p>No messages yet</p>
            <p className="text-sm mt-2">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isOwnMessage = msg.sender === user._id;
              const showDateSeparator = shouldShowDate(msg, index);
              const sender =
                isGroup && !isOwnMessage
                  ? activeChat?.participants?.find(
                      (p) => p._id === msg.senderId
                    ) || {}
                  : null;

              return (
                <React.Fragment key={msg._id || index}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <div className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600">
                        {new Date(msg.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  <div
                    className={`flex ${
                      isOwnMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isOwnMessage && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mr-2">
                        {isGroup ? (
                          sender?.name ? (
                            sender.name.charAt(0).toUpperCase()
                          ) : (
                            "?"
                          )
                        ) : // (chatPartner?.name ? chatPartner.name.charAt(0).toUpperCase() : '?')
                        chatPartner?.profilePicture ? (
                          <img
                            src={chatPartner.profilePicture}
                            alt={chatPartner.name || "User"}
                            className="w-16 rounded-full"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                            {chatPartner?.name
                              ? chatPartner.name.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {isGroup && !isOwnMessage && (
                        <div
                          className={`text-xs font-medium mb-1 ${
                            isOwnMessage ? "text-blue-200" : "text-gray-600"
                          }`}
                        >
                          {sender?.name || "Unknown User"}
                        </div>
                      )}
                      <div>{msg.text}</div>
                      <div
                        className={`text-xs mt-1 ${
                          isOwnMessage ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}
      <form
        onSubmit={sendMessage}
        className="px-4 py-3 bg-white border-t border-gray-200"
      >
        <div className="flex items-center">
          <button
            type="button"
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
          >
            <FaPaperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 mx-3">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type a message..."
              className="w-full py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <button
            type="button"
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 mr-2"
          >
            <FaSmile className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`p-2 rounded-full ${
              newMessage.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
