import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../services/Auth/AuthSlice';
import { FaSearch, FaPlus } from 'react-icons/fa';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import FriendSearch from './FriendSearch';
import CreateGroupModal from './CreateGroupModal';

const MessengerHome = () => {
  const user = useSelector(selectUser);
  const [activeChat, setActiveChat] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCreateGroup = () => {
    setShowCreateGroup(true);
  };

  return (
    <div className="flex h-screen">
      {/* Chat list side */}
      <div className="relative w-1/3 bg-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Conversations</h2>
          <div className="flex space-x-2">
            {/* Create Group Button */}
            <button
              onClick={handleCreateGroup}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-200 focus:outline-none"
              title="Create Group"
            >
              <FaPlus size={20} />
            </button>
            
            {/* Search Icon */}
            <button
              onClick={toggleDrawer}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-200 focus:outline-none"
              title="Search Users"
            >
              <FaSearch size={20} />
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <ConversationList user={user} setActiveChat={setActiveChat} />
      </div>

      {/* Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 backdrop-blur-sm  bg-opacity-50 ${drawerOpen ? 'block' : 'hidden'}`}
        onClick={toggleDrawer}
      ></div>
      
      {/* Drawer for Search */}
      <div
        className={`fixed left-0 top-0 w-96 h-full bg-white shadow-lg transform transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        } z-50`}
      >
        <div className="p-4">
          <FriendSearch setActiveChat={setActiveChat} setDrawerOpen={setDrawerOpen} />
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal 
          onClose={() => setShowCreateGroup(false)} 
          user={user}
          setActiveChat={setActiveChat}
        />
      )}

      {/* Main Chat Window */}
      <ChatWindow activeChat={activeChat} user={user} setActiveChat={setActiveChat} />
    </div>
  );
};

export default MessengerHome;