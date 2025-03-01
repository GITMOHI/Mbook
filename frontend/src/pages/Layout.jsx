











    import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaUser, FaUsers, FaStore, FaTv, FaClock, FaBookmark, FaFlag, FaCalendarAlt } from 'react-icons/fa';

const Layout = () => {
    const location = useLocation();
    const isProfilePage = location.pathname === "/home/profile"; // Check if on Profile Page
    const isPeoplePage = location.pathname === "/home/peoples" || location.pathname === "/home/peoples/frndReq"  || location.pathname === "/home/peoples/frndSugg"  || location.pathname === "/home/peoples/allFriends";
  

    return (
        <div className="flex flex-col h-screen">
            {/* Navbar */}
            <Navbar />

            {/* Main Content Section */}
            <div className="flex border-2 flex-1 bg-gray-200">
                {/* Left Sidebar (Hidden on Profile Page) */}
                {!(isProfilePage || isPeoplePage) && (
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
                )}

                {/* Middle Content */}
                <div className={`p-4 overflow-y-auto ${(isProfilePage || isPeoplePage) ? 'w-full' : 'w-full lg:w-1/2'}`}>
                    <Outlet />
                </div>

                {/* Right Sidebar (Hidden on Profile Page) */}
                {!(isProfilePage || isPeoplePage) && (
                    <div className="w-2/6 bg-white p-4 pl-20 overflow-y-auto hidden lg:block">
                        <div className="mb-4">
                            <h2 className="font-semibold text-lg">Contacts</h2>
                            <ul className="space-y-2">
                                <li className="flex items-center space-x-2">
                                    <img src="https://via.placeholder.com/32" alt="Friend 1" className="rounded-full" />
                                    <span>Friend 1</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <img src="https://via.placeholder.com/32" alt="Friend 2" className="rounded-full" />
                                    <span>Friend 2</span>
                                </li>
                            </ul>
                        </div>
                        <div className="mb-4">
                            <h2 className="font-semibold text-lg">Sponsored</h2>
                            <div className="mt-2">
                                <a href="https://example.com" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                                    <img src="https://via.placeholder.com/50" alt="Ad 1" />
                                    <div>
                                        <p className="font-semibold">Ad Title 1</p>
                                        <p className="text-sm text-gray-600">example.com</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className="mb-4">
                            <h2 className="font-semibold text-lg">Birthdays</h2>
                            <div className="mt-2">
                                <p>No birthdays today.</p>
                            </div>
                        </div>
                        <div>
                            <h2 className="font-semibold text-lg">Group Conversations</h2>
                            <div className="mt-2">
                                <a href="/messages/group1" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                                    <img src="https://via.placeholder.com/32" alt="Group 1" className="rounded-full" />
                                    <span>Group Chat 1</span>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Layout;
