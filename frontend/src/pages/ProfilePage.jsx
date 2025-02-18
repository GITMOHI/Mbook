// import  { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { selectUser, updateProfileDetails } from "../services/Auth/AuthSlice";
// import { FaGraduationCap } from "react-icons/fa";
// import { FaSchool } from "react-icons/fa6";
// import { BiHome, BiMapPin } from "react-icons/bi";

// const ProfilePage = () => {
//   const user = useSelector(selectUser); // Get user data from Redux store
//   const [profilePicture, setProfilePicture] = useState(
//     "https://via.placeholder.com/150"
//   );
//   const [coverPicture, setCoverPicture] = useState(
//     "https://via.placeholder.com/1600x400"
//   );
//   const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility

//   // State to manage form data
//   const [formData, setFormData] = useState({
//     bornIn: "",
//     currentCity: "",
//     school: "",
//     college: "",
//     description: "",
//   });

//   // Initialize form data with user details when the form opens
//   const handleEditDetailsClick = () => {
//     setIsFormVisible(true);
//     setFormData({
//       bornIn: user.details?.bornIn || "",
//       currentCity: user.details?.currentCity || "",
//       school: user.details?.school || "",
//       college: user.details?.college || "",
//       description: user.details?.description || "",
//     });

//     console.log(formData);
//   };

//   const handleProfilePictureChange = () => {};
//   const handleCoverPictureChange = () => {};

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const dispatch = useDispatch();
//   const handleDetailSubmit = (e) => {
//     e.preventDefault();
//     try {
//       // Dispatch the async thunk to update profile details
//      dispatch(updateProfileDetails({ userId: user._id, details: formData })).unwrap();

//       // Close the form
//       setIsFormVisible(false);
//     } catch (error) {
//       console.error('Error updating profile details:', error);
//     }
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* Background Overlay and Blur Effect */}
//       {isFormVisible && (
//         <div
//           className="fixed inset-0 backdrop-blur-sm z-40"
//           onClick={() => setIsFormVisible(false)}
//         ></div>
//       )}

//       {/* Cover Photo */}
//       <div className="h-64 relative">
//         <img
//           src={coverPicture}
//           alt="Cover"
//           className="w-full h-full object-cover"
//         />
//         {/* Update Cover Picture Button */}
//         <label
//           htmlFor="cover-picture-upload"
//           className="absolute bottom-4 right-4 bg-white p-2 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center space-x-2"
//         >
//           <span className="text-gray-800">📷</span>
//           <span className="text-sm text-gray-800">Update Cover Picture</span>
//           <input
//             id="cover-picture-upload"
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={handleCoverPictureChange}
//           />
//         </label>
//       </div>

//       {/* Profile Picture and Header */}
//       <div className="max-w-6xl mx-auto px-4 mt-20">
//         <div className="flex items-center space-x-6">
//           {/* Profile Picture */}
//           <div className="relative -mt-10">
//             <img
//               src={profilePicture}
//               alt="Profile"
//               className="w-40 h-40 rounded-full border-4 border-white"
//             />
//             {/* Update Profile Picture Button */}
//             <label
//               htmlFor="profile-picture-upload"
//               className="absolute bottom-2 right-2 bg-white p-2 rounded-full cursor-pointer hover:bg-gray-200 flex items-center space-x-2"
//             >
//               <span className="text-gray-800">📷</span>
//               <input
//                 id="profile-picture-upload"
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleProfilePictureChange}
//               />
//             </label>
//           </div>

//           {/* Profile Header */}
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
//             <p className="text-gray-600">1.5K friends</p>
//             <div className="flex space-x-2 mt-2">
//               <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
//                 + Add to Story
//               </button>
//               <button
//                 className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
//                 onClick={handleEditDetailsClick}
//               >
//                 Edit Profile
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Tabs Menu */}
//         <div className="mt-4 border-t border-gray-300">
//           <div className="flex space-x-8">
//             <a
//               href="#posts"
//               className="py-3 text-blue-600 border-b-2 border-blue-600"
//             >
//               Posts
//             </a>
//             <a href="#about" className="py-3 text-gray-600 hover:text-blue-600">
//               About
//             </a>
//             <a
//               href="#friends"
//               className="py-3 text-gray-600 hover:text-blue-600"
//             >
//               Friends
//             </a>
//             <a
//               href="#photos"
//               className="py-3 text-gray-600 hover:text-blue-600"
//             >
//               Photos
//             </a>
//             <a
//               href="#videos"
//               className="py-3 text-gray-600 hover:text-blue-600"
//             >
//               Videos
//             </a>
//             <a href="#reels" className="py-3 text-gray-600 hover:text-blue-600">
//               Reels
//             </a>
//             <a href="#more" className="py-3 text-gray-600 hover:text-blue-600">
//               More ▼
//             </a>
//           </div>
//         </div>
//       </div>

// {/* Main Content */}
// <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//   {/* Left Sidebar */}
//   <div className="order-1 md:order-none">
//     <div className="bg-white p-4 rounded-lg shadow">
//       <h2 className="text-xl font-bold text-gray-800">Intro</h2>
//       <p className="text-gray-600 mt-2">
//         {user.details?.description || "Hi, I'm new here!"}
//       </p>

//       <div className="mt-4 space-y-3 text-gray-700">
//         {/* College/University */}
//         {user.details?.college && (
//           <div className="flex items-center space-x-2">
//             <FaGraduationCap className="w-5 h-5 text-yellow-500" />
//             <span>
//               Studied at <span className="font-semibold ">{user.details.college}</span>
//             </span>
//           </div>
//         )}

//         {/* School */}
//         {user.details?.school && (
//           <div className="flex items-center space-x-2">
//             <FaSchool className="w-5 h-5 text-purple-500" />
//             <span>
//               Went to <span className="font-semibold ">{user.details.school}</span>
//             </span>
//           </div>
//         )}

//         {/* Currently Living */}
//         {user.details?.currentCity && (
//           <div className="flex items-center space-x-2">
//             <BiMapPin className="w-5 h-5 text-blue-500" />
//             <span>
//               Lives in <span className="font-semibold ">{user.details.currentCity}</span>
//             </span>
//           </div>
//         )}

//         {/* Born In */}
//         {user.details?.bornIn && (
//           <div className="flex items-center space-x-2">
//             <BiHome className="w-5 h-5 text-green-500" />
//             <span>
//               From <span className="font-semibold ">{user.details.bornIn}</span>
//             </span>
//           </div>
//         )}
//       </div>

//       <button
//         className="hover:cursor-pointer w-full mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
//         onClick={handleEditDetailsClick}
//       >
//         Edit Details
//       </button>
//     </div>

//     <div className="bg-white p-4 rounded-lg shadow mt-4">
//       <h2 className="text-xl font-bold text-gray-800">Photos</h2>
//       <div className="grid grid-cols-3 gap-2 mt-2">
//         {[...Array(9)].map((_, i) => (
//           <img
//             key={i}
//             src="https://via.placeholder.com/100"
//             alt="Photo"
//             className="rounded-lg"
//           />
//         ))}
//       </div>
//     </div>

//     <div className="bg-white p-4 rounded-lg shadow mt-4">
//       <h2 className="text-xl font-bold text-gray-800">Friends</h2>
//       <p className="text-gray-600 mt-2">1.5K friends</p>
//       <div className="grid grid-cols-3 gap-2 mt-2">
//         {[...Array(6)].map((_, i) => (
//           <div key={i}>
//             <img
//               src="https://via.placeholder.com/100"
//               alt="Friend"
//               className="rounded-lg"
//             />
//             <p className="text-sm text-gray-800 mt-1">Friend {i + 1}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>

//   {/* Main Posts Section */}
//   <div className="col-span-2 order-2 md:order-none">
//     <div className="bg-white p-4 rounded-lg shadow">
//       <div className="flex items-center space-x-2">
//         <img
//           src="https://via.placeholder.com/40"
//           alt="User"
//           className="w-10 h-10 rounded-full"
//         />
//         <input
//           type="text"
//           placeholder="What's on your mind, Mohiuddin?"
//           className="w-full p-2 border border-gray-300 rounded-full"
//         />
//       </div>
//       <div className="flex justify-between mt-4">
//         <button className="flex-1 flex items-center justify-center text-gray-600 hover:bg-gray-100 p-2 rounded-md">
//           <span className="mr-2">📷</span> Photo/Video
//         </button>
//         <button className="flex-1 flex items-center justify-center text-gray-600 hover:bg-gray-100 p-2 rounded-md">
//           <span className="mr-2">🎥</span> Live Video
//         </button>
//         <button className="flex-1 flex items-center justify-center text-gray-600 hover:bg-gray-100 p-2 rounded-md">
//           <span className="mr-2">😊</span> Feeling/Activity
//         </button>
//       </div>
//     </div>

//     {/* Posts */}
//     <div className="mt-6 space-y-4">
//       {[...Array(3)].map((_, i) => (
//         <div key={i} className="bg-white p-4 rounded-lg shadow">
//           <div className="flex items-center space-x-2">
//             <img
//               src="https://via.placeholder.com/40"
//               alt="User"
//               className="w-10 h-10 rounded-full"
//             />
//             <div>
//               <p className="font-bold text-gray-800">{user.name}</p>
//               <p className="text-sm text-gray-600">2 hours ago</p>
//             </div>
//           </div>
//           <p className="mt-2 text-gray-800">
//             This is a sample post. Lorem ipsum dolor sit amet, consectetur
//             adipiscing elit.
//           </p>
//           <img
//             src="https://via.placeholder.com/600x300"
//             alt="Post"
//             className="mt-2 rounded-lg"
//           />
//         </div>
//       ))}
//     </div>
//   </div>
// </div>

//       {/* Modal Form for Edit Details */}
//       {isFormVisible && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           {/* Overlay with blur effect */}
//           <div
//             className="fixed inset-0 backdrop-blur-sm"
//             onClick={() => setIsFormVisible(false)}
//           ></div>

//           {/* Modern and Elegant Form */}
//           <div className="bg-white p-8 rounded-lg w-[600px] shadow-2xl transform transition-all duration-300 ease-in-out">
//             {/* Form Header */}
//             <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//               Edit Details
//             </h2>

//             {/* Form Fields */}
//             <form className="space-y-6" onSubmit={handleDetailSubmit}>
//               {/* Two-Column Grid */}
//               <div className="grid grid-cols-2 gap-6">
//                 {/* Left Column */}
//                 <div className="space-y-6">
//                   {/* Born In */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Born in
//                     </label>
//                     <input
//                       type="text"
//                       name="bornIn"
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                       placeholder="Enter your birthplace"
//                       value={formData.bornIn}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   {/* Current City */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Current City
//                     </label>
//                     <input
//                       type="text"
//                       name="currentCity"
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                       placeholder="Enter your current city"
//                       value={formData.currentCity}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   {/* School */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       School
//                     </label>
//                     <input
//                       type="text"
//                       name="school"
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                       placeholder="Enter your school name"
//                       value={formData.school}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                 </div>

//                 {/* Right Column */}
//                 <div className="space-y-6">
//                   {/* College/University */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       College/University
//                     </label>
//                     <input
//                       type="text"
//                       name="college"
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                       placeholder="Enter your college/university name"
//                       value={formData.college}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   {/* Describe Yourself in One Sentence */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Describe yourself in one sentence
//                     </label>
//                     <textarea
//                       name="description"
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                       rows="3"
//                       placeholder="E.g., I'm a passionate developer who loves solving problems."
//                       value={formData.description}
//                       onChange={handleInputChange}
//                     ></textarea>
//                   </div>
//                 </div>
//               </div>

//               {/* Form Buttons */}
//               <div className="flex justify-end space-x-4">
//                 <button
//                   type="button"
//                   className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
//                   onClick={() => setIsFormVisible(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  updateProfileDetails,
  updateProfilePicture,
} from "../services/Auth/AuthSlice";
import { FaGraduationCap } from "react-icons/fa";
import { FaSchool } from "react-icons/fa6";
import { BiHome, BiMapPin } from "react-icons/bi";
import { uploadImageToCloudinary } from "../utils/cloudinaryUpload";
import { toast, ToastContainer } from "react-toastify";

const ProfilePage = () => {
  const user = useSelector(selectUser); // Get user data from Redux store
  const [profilePicture, setProfilePicture] = useState(
    "https://via.placeholder.com/150"
  );
  const [coverPicture, setCoverPicture] = useState(
    "https://via.placeholder.com/1600x400"
  );
  const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility

  // State to manage form data
  const [formData, setFormData] = useState({
    bornIn: "",
    currentCity: "",
    school: "",
    college: "",
    description: "",
  });

  // Initialize form data with user details when the form opens
  const handleEditDetailsClick = () => {
    setIsFormVisible(true);
    setFormData({
      bornIn: user.details?.bornIn || "",
      currentCity: user.details?.currentCity || "",
      school: user.details?.school || "",
      college: user.details?.college || "",
      description: user.details?.description || "",
    });

    console.log(formData);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const dispatch = useDispatch();
  const handleDetailSubmit = (e) => {
    e.preventDefault();
    try {
      // Dispatch the async thunk to update profile details
      dispatch(
        updateProfileDetails({ userId: user._id, details: formData })
      ).unwrap();

      // Close the form
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error updating profile details:", error);
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    setIsUploading(true);
    if (file) {
      try {
        console.log("called");
        const imageUrl = await uploadImageToCloudinary(file);
        console.log(imageUrl);
        setProfilePicture(imageUrl);
        dispatch(
          updateProfilePicture({ userId: user._id, profilePicture: imageUrl })
        ).unwrap();

        toast.success("Profile picture updated successfully!");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        toast.error("Failed to upload profile picture!!");
      } finally {
        setIsUploading(false); 
      }
    }
  };

  const handleCoverPictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadImageToCloudinary(file);
        setCoverPicture(imageUrl);
        dispatch(
          updateProfileDetails({ userId: user._id, coverPicture: imageUrl })
        ).unwrap();
      } catch (error) {
        console.error("Error uploading cover picture:", error);
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Background Overlay and Blur Effect */}
      {isFormVisible && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40"
          onClick={() => setIsFormVisible(false)}
        ></div>
      )}

      {/* Cover Photo */}
      <div className="h-64 relative">
        <img
          src={coverPicture}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {/* Update Cover Picture Button */}
        <label
          htmlFor="cover-picture-upload"
          className="absolute bottom-4 right-4 bg-white p-2 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center space-x-2"
        >
          <span className="text-gray-800">📷</span>
          <span className="text-sm text-gray-800">Update Cover Picture</span>
          <input
            id="cover-picture-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverPictureChange}
          />
        </label>
      </div>

      {/* Profile Picture and Header */}
      <div className="max-w-6xl mx-auto px-4 mt-20">
        <div className="flex items-center space-x-6">
          {/* Profile Picture */}
       
          <div className="relative -mt-10">
            {isUploading ? (
              // Spinner while uploading
              <div className="w-40 h-40 flex items-center justify-center border-4 border-white rounded-full bg-gray-100">
                <svg
                  className="w-10 h-10 text-gray-500 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </div>
            ) : (
              // Show profile picture when not uploading
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-white"
              />
            )}

            {/* Update Profile Picture Button */}
            <label
              htmlFor="profile-picture-upload"
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full cursor-pointer hover:bg-gray-200 flex items-center space-x-2"
            >
              <span className="text-gray-800">📷</span>
              <input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureChange}
              />
            </label>
          </div>

          {/* Profile Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-600">1.5K friends</p>
            <div className="flex space-x-2 mt-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                + Add to Story
              </button>
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                onClick={handleEditDetailsClick}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Menu */}
        <div className="mt-4 border-t border-gray-300">
          <div className="flex space-x-8">
            <a
              href="#posts"
              className="py-3 text-blue-600 border-b-2 border-blue-600"
            >
              Posts
            </a>
            <a href="#about" className="py-3 text-gray-600 hover:text-blue-600">
              About
            </a>
            <a
              href="#friends"
              className="py-3 text-gray-600 hover:text-blue-600"
            >
              Friends
            </a>
            <a
              href="#photos"
              className="py-3 text-gray-600 hover:text-blue-600"
            >
              Photos
            </a>
            <a
              href="#videos"
              className="py-3 text-gray-600 hover:text-blue-600"
            >
              Videos
            </a>
            <a href="#reels" className="py-3 text-gray-600 hover:text-blue-600">
              Reels
            </a>
            <a href="#more" className="py-3 text-gray-600 hover:text-blue-600">
              More ▼
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="order-1 md:order-none">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800">Intro</h2>
            <p className="text-gray-600 mt-2">
              {user.details?.description || "Hi, I'm new here!"}
            </p>

            <div className="mt-4 space-y-3 text-gray-700">
              {/* College/University */}
              {user.details?.college && (
                <div className="flex items-center space-x-2">
                  <FaGraduationCap className="w-5 h-5 text-yellow-500" />
                  <span>
                    Studied at{" "}
                    <span className="font-semibold ">
                      {user.details.college}
                    </span>
                  </span>
                </div>
              )}

              {/* School */}
              {user.details?.school && (
                <div className="flex items-center space-x-2">
                  <FaSchool className="w-5 h-5 text-purple-500" />
                  <span>
                    Went to{" "}
                    <span className="font-semibold ">
                      {user.details.school}
                    </span>
                  </span>
                </div>
              )}

              {/* Currently Living */}
              {user.details?.currentCity && (
                <div className="flex items-center space-x-2">
                  <BiMapPin className="w-5 h-5 text-blue-500" />
                  <span>
                    Lives in{" "}
                    <span className="font-semibold ">
                      {user.details.currentCity}
                    </span>
                  </span>
                </div>
              )}

              {/* Born In */}
              {user.details?.bornIn && (
                <div className="flex items-center space-x-2">
                  <BiHome className="w-5 h-5 text-green-500" />
                  <span>
                    From{" "}
                    <span className="font-semibold ">
                      {user.details.bornIn}
                    </span>
                  </span>
                </div>
              )}
            </div>

            <button
              className="hover:cursor-pointer w-full mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              onClick={handleEditDetailsClick}
            >
              Edit Details
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mt-4">
            <h2 className="text-xl font-bold text-gray-800">Photos</h2>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[...Array(9)].map((_, i) => (
                <img
                  key={i}
                  src="https://via.placeholder.com/100"
                  alt="Photo"
                  className="rounded-lg"
                />
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mt-4">
            <h2 className="text-xl font-bold text-gray-800">Friends</h2>
            <p className="text-gray-600 mt-2">1.5K friends</p>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <img
                    src="https://via.placeholder.com/100"
                    alt="Friend"
                    className="rounded-lg"
                  />
                  <p className="text-sm text-gray-800 mt-1">Friend {i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Posts Section */}
        <div className="col-span-2 order-2 md:order-none">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-2">
              <img
                src="https://via.placeholder.com/40"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <input
                type="text"
                placeholder="What's on your mind, Mohiuddin?"
                className="w-full p-2 border border-gray-300 rounded-full"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button className="flex-1 flex items-center justify-center text-gray-600 hover:bg-gray-100 p-2 rounded-md">
                <span className="mr-2">📷</span> Photo/Video
              </button>
              <button className="flex-1 flex items-center justify-center text-gray-600 hover:bg-gray-100 p-2 rounded-md">
                <span className="mr-2">🎥</span> Live Video
              </button>
              <button className="flex-1 flex items-center justify-center text-gray-600 hover:bg-gray-100 p-2 rounded-md">
                <span className="mr-2">😊</span> Feeling/Activity
              </button>
            </div>
          </div>

          {/* Posts */}
          <div className="mt-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center space-x-2">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-bold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <p className="mt-2 text-gray-800">
                  This is a sample post. Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit.
                </p>
                <img
                  src="https://via.placeholder.com/600x300"
                  alt="Post"
                  className="mt-2 rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Form for Edit Details */}
      {isFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay with blur effect */}
          <div
            className="fixed inset-0 backdrop-blur-sm"
            onClick={() => setIsFormVisible(false)}
          ></div>

          {/* Modern and Elegant Form */}
          <div className="bg-white p-8 rounded-lg w-[600px] shadow-2xl transform transition-all duration-300 ease-in-out">
            {/* Form Header */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Edit Details
            </h2>

            {/* Form Fields */}
            <form className="space-y-6" onSubmit={handleDetailSubmit}>
              {/* Two-Column Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Born In */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Born in
                    </label>
                    <input
                      type="text"
                      name="bornIn"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Enter your birthplace"
                      value={formData.bornIn}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Current City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current City
                    </label>
                    <input
                      type="text"
                      name="currentCity"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Enter your current city"
                      value={formData.currentCity}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* School */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      School
                    </label>
                    <input
                      type="text"
                      name="school"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Enter your school name"
                      value={formData.school}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* College/University */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      College/University
                    </label>
                    <input
                      type="text"
                      name="college"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Enter your college/university name"
                      value={formData.college}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Describe Yourself in One Sentence */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Describe yourself in one sentence
                    </label>
                    <textarea
                      name="description"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      rows="3"
                      placeholder="E.g., I'm a passionate developer who loves solving problems."
                      value={formData.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                  onClick={() => setIsFormVisible(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
