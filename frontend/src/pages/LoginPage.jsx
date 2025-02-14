import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAsync } from "../services/Auth/AuthSlice";
import { toast, ToastContainer } from "react-toastify";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); 


  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Dispatch the loginAsync action
    dispatch(loginAsync({ email, password }))
      .unwrap()
      .then((response) => {
        if (response?.user?.name) {
          toast.success(`Welcome, ${response.user.name}!`);
        }
        toast.success(`Welcome,`);
        console.log('here..')
        setTimeout(() => navigate("/home"), 2000); 
    })
      .catch((error) => {
        // Handle error
        toast.error("Failed to login. Please try again.",error);
      });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />

      <Navbar></Navbar>

      {/* Sign Up Form Section */}
      <section className="flex-grow flex items-center justify-center bg-gray-50 py-10">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-3xl font-semibold text-center mb-6">Log In</h2>
          <form onSubmit={handleSubmit}>


            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600" htmlFor="email">
                Email Address
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg p-2">
                <FaEnvelope className="text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-2 text-gray-700 outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600" htmlFor="password">
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg p-2">
                <FaLock className="text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-2 text-gray-700 outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              Log in
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Register a new account?{" "}
              <NavLink to="/signup" className="text-blue-600 hover:underline">
                Sign up
              </NavLink>  
             
            </p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p className="text-sm">&copy; 2025 Mbook. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LoginPage;
