import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthError, selectAuthStatus, signUpAsync } from "../services/Auth/AuthSlice";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function SignUpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signUpAsync({ email, password, name: username }))
      .unwrap()
      .then((response) => {
        console.log("i am here , ", response);
        if (response.message && response.message !== "User registered successfully") {
          toast.error(response.message);
        } else {
          toast.success("User registered successfully!");
          setTimeout(() => navigate("/login"), 2000); 
        }
      })
      .catch((error) => {
        toast.error("Failed to register user. Please try again.");
      });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Sign Up Form Section */}
      <section className="flex-grow flex items-center justify-center bg-gray-50 py-10">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-3xl font-semibold text-center mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600" htmlFor="username">
                Username
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg p-2">
                <FaUser className="text-gray-400" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-2 text-gray-700 outline-none"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
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

            {/* Password Input */}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Signing Up..." : "Sign Up"}
            </button>

            {/* Error Message */}
            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
          </form>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Login
              </a>
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

export default SignUpPage;
