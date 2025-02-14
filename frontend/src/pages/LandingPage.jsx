import React from 'react';
import { NavLink } from 'react-router-dom';

function LandingPage() {
  return (
    
    <div className="font-sans bg-gray-100">

      {/* Header */}
      <header className="bg-blue-600 text-white p-5">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="https://via.placeholder.com/50" alt="Mbook Logo" className="animate-bounce mr-3" />
            <span className="text-3xl font-semibold">Mbook</span>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#features" className="hover:text-blue-300">Features</a></li>
              <li><a href="#contact" className="hover:text-blue-300">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Welcome to Mbook</h1>
          <p className="text-lg mb-6">The place to connect with friends, share updates, and discover new content.</p>
          <div className="space-x-4">
           <NavLink to="/login">
              <button className="hover:cursor-pointer btn btn-primary shadow-2xl bg-blue-700 text-white px-8 py-3 rounded-full transform transition duration-300 hover:scale-110 hover:shadow-lg">
                Log in
              </button>
           </NavLink>
            <NavLink to="/signup">
               <button className="hover:cursor-pointer btn btn-secondary shadow-2xl bg-blue-700 text-white px-8 py-3 rounded-full transform transition duration-300 hover:scale-110 hover:shadow-lg">
                 Sign Up
               </button>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Explore What Mbook Offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-200 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Connect with Friends</h3>
              <p>Stay in touch with family and friends, share photos, videos, and updates.</p>
            </div>
            <div className="bg-gray-200 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Discover Content</h3>
              <p>Follow pages and groups to explore your interests and get the latest updates.</p>
            </div>
            <div className="bg-gray-200 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Instant Messaging</h3>
              <p>Chat with friends in real-time, share media, and create group conversations.</p>
            </div>
          </div>
        </div>
      </section>

  {/* New Call to Action Section */}
  <section className="bg-blue-600 text-white py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Discover Mbook’s Features</h2>
          <p className="text-lg mb-6">Explore all the exciting features that Mbook has to offer. Stay connected with friends, explore your interests, and much more!</p>
          <div className="space-x-4">
            <button className="btn btn-primary text-white px-8 py-3 rounded-full transform transition duration-300 hover:scale-110 hover:shadow-lg">
              Learn More
            </button>
            <button className="btn btn-secondary text-white px-8 py-3 rounded-full transform transition duration-300 hover:scale-110 hover:shadow-lg">
              Explore Now
            </button>
          </div>
        </div>
      </section>

      
    </div>
  );
}

export default LandingPage;
