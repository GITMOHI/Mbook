
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import { FaUser, FaUsers, FaStore, FaTv, FaClock, FaBookmark, FaFlag, FaCalendarAlt } from 'react-icons/fa';

// import { toast, ToastContainer } from 'react-toastify';

const Layout = () => {
      



    return (
        <div className="flex flex-col h-screen">
            {/* Navbar */}
            <Navbar />



            {/* Main Content Section */}
            <div className="flex flex-1 bg-gray-200">
                {/* Left Sidebar (Visible only on Desktop) */}
                <div className="w-2/6 bg-white p-4 overflow-y-auto hidden lg:block">
                    <div className="mb-4">
                        <a href="/profile" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                            <FaUser className="text-blue-600" />
                            <span>Your Profile</span>
                        </a>
                    </div>
                    <div className="space-y-2">
                        <a href="/friends" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                            <FaUsers className="text-blue-600" />
                            <span>Friends</span>
                        </a>
                        <a href="/groups" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                            <FaUsers className="text-blue-600" />
                            <span>Groups</span>
                        </a>
                        <a href="/marketplace" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                            <FaStore className="text-blue-600" />
                            <span>Marketplace</span>
                        </a>
                        <a href="/watch" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                            <FaTv className="text-blue-600" />
                            <span>Watch</span>
                        </a>
                        <a href="/memories" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                            <FaClock className="text-blue-600" />
                            <span>Memories</span>
                        </a>
                        <a href="/saved" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                            <FaBookmark className="text-blue-600" />
                            <span>Saved</span>
                        </a>
                        <a href="/pages" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                            <FaFlag className="text-blue-600" />
                            <span>Pages</span>
                        </a>
                        <a href="/events" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                            <FaCalendarAlt className="text-blue-600" />
                            <span>Events</span>
                        </a>
                    </div>
                </div>

                {/* Middle Content */}
                <div className="w-full lg:w-1/2 p-4 overflow-y-auto">
                    <Outlet />
                </div>

                {/* Right Sidebar (Visible only on Desktop) */}
                <div className="w-2/6 bg-white p-4 pl-20 overflow-y-auto hidden lg:block">
                    <div className=" mb-4">
                        <h2 className="font-semibold text-lg">Contacts</h2>
                        {/* List of contacts */}
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-2">
                                <img src="https://via.placeholder.com/32" alt="Friend 1" className="rounded-full" />
                                <span>Friend 1</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <img src="https://via.placeholder.com/32" alt="Friend 2" className="rounded-full" />
                                <span>Friend 2</span>
                            </li>
                            {/* Add more contacts as needed */}
                        </ul>
                    </div>
                    <div className="mb-4">
                        <h2 className="font-semibold text-lg">Sponsored</h2>
                        {/* Sponsored content */}
                        <div className="mt-2">
                            <a href="https://example.com" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                                <img src="https://via.placeholder.com/50" alt="Ad 1" />
                                <div>
                                    <p className="font-semibold">Ad Title 1</p>
                                    <p className="text-sm text-gray-600">example.com</p>
                                </div>
                            </a>
                            {/* Add more sponsored content as needed */}
                        </div>
                    </div>
                    <div className="mb-4">
                        <h2 className="font-semibold text-lg">Birthdays</h2>
                        {/* Birthday notifications */}
                        <div className="mt-2">
                            <p>No birthdays today.</p>
                            {/* Display birthdays if available */}
                        </div>
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg">Group Conversations</h2>
                        {/* Group conversations */}
                        <div className="mt-2">
                            <a href="/messages/group1" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                                <img src="https://via.placeholder.com/32" alt="Group 1" className="rounded-full" />
                                <span>Group Chat 1</span>
                            </a>
                            {/* Add more group conversations as needed */}
                     </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
