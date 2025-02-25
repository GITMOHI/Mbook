import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserPostsAsync,
  postToProfileAsync,
  selectUser,
  updateCoverPicture,
  updateProfileDetails,
  updateProfilePicture,
} from "../services/Auth/AuthSlice";
import { FaGraduationCap } from "react-icons/fa";
import { FaSchool } from "react-icons/fa6";
import { BiHome, BiMapPin } from "react-icons/bi";
import { uploadImageToCloudinary } from "../utils/cloudinaryUpload";
import { toast, ToastContainer } from "react-toastify";
// import PostImages from "../components/PostImages";
import SinglePost from "./SinglePost";

const ProfilePage = () => {
  const user = useSelector(selectUser); // Get user data from Redux store

  const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility
  const [profilePicture,   setProfilePicture] = useState(null); // State to control form visibility

  // State to manage form data
  const [formData, setFormData] = useState({
    bornIn: "",
    currentCity: "",
    school: "",
    college: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure the name and value from the event target
    setFormData((prevFormData) => ({
      ...prevFormData, // Spread the previous form data
      [name]: value, // Update the specific field using the name as the key
    }));
  };
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
  const [isCoverUploading, setIsCoverUploading] = useState(false);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    setIsUploading(true);
    if (file) {
      try {
        console.log("called");
        const imageUrl = await uploadImageToCloudinary(file);
        console.log(imageUrl);
        setProfilePicture(imageUrl);

        //upload the picture to user info
        dispatch(
          updateProfilePicture({ userId: user._id, profilePicture: imageUrl })
        ).unwrap();

        toast.success("Profile picture updated successfully!");

        const postData = {
          content: {
            images: [imageUrl],
          },
          isProfile: true,
          authorId: user?._id,
        };
        //posting profile picture to users profile..
        dispatch(postToProfileAsync({ userId: user._id, postData: postData }))
          .unwrap()
          .then(() => dispatch(fetchUserPostsAsync(user._id)));
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
    console.log(file);
    setIsCoverUploading(true);
    if (file) {
      try {
        console.log("called");
        const imageUrl = await uploadImageToCloudinary(file);
        console.log(imageUrl);
        setCoverPicture(imageUrl);

        //upload the picture to user info
        dispatch(
          updateCoverPicture({ userId: user._id, coverPicture: imageUrl })
        ).unwrap();

        toast.success("Cover Image updated successfully!");

        const postData = {
          content: {
            images: [imageUrl],
          },
          isCover: true,
          authorId: user?._id,
        };
        //posting profile picture to users profile..
        dispatch(postToProfileAsync({ userId: user._id, postData: postData }))
          .unwrap()
          .then(() => dispatch(fetchUserPostsAsync(user._id)));
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        toast.error("Failed to upload profile picture!!");
      } finally {
        setIsCoverUploading(false);
      }
    }
  };

  useEffect(() => {
    dispatch(fetchUserPostsAsync(user._id));
  }, [user._id, dispatch]);
  // console.log(user?.profilePosts[0].content.images[0])

  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [isPostUploading, setIsPostUploading] = useState(false);

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    console.log(files); // Log selected files

    setIsPostUploading(true);

    if (files.length > 0) {
      try {
        console.log("Uploading started...");

        // Upload each file to Cloudinary and get URLs
        const uploadedUrls = await Promise.all(
          files.map(async (file) => await uploadImageToCloudinary(file))
        );

        console.log("Uploaded URLs:", uploadedUrls);

        // Separate images and videos based on file type
        const imageUrls = uploadedUrls.filter((url) =>
          url.includes("/image/upload/")
        );
        const videoUrls = uploadedUrls.filter((url) =>
          url.includes("/video/upload/")
        );

        setImages((prev) => [...prev, ...imageUrls]); // Update images state
        setVideos((prev) => [...prev, ...videoUrls]); // Update videos state

        // Dispatch an action if needed (e.g., updating the user's media collection)
        // dispatch(
        //   updateUserMedia({ userId: user._id, images: imageUrls, videos: videoUrls })
        // ).unwrap();

        toast.success("Media uploaded successfully!");
      } catch (error) {
        console.error("Error uploading media:", error);
        toast.error("Failed to upload media!");
      } finally {
        setIsPostUploading(false);
      }
    }
  };

  const handlePostText = (e) => {
    setText(e.target.value);
    console.log(text);
  };
  // Handle Post Submission
  const handleSubmit = async () => {
    const postData = { text, images, videos };
    console.log("Post Data:", postData);

    const newPostData = {
      texts: text, // Assuming text is already in the correct format
      images: images,
      videos: videos,
    };

    const Data = {
      content: {
        texts: text,
        images: postData.images,
        videos: postData.videos,
      },
      authorId: user?._id,
    };

    dispatch(postToProfileAsync({ userId: user._id, postData: Data }))
      .unwrap()
      .then(() => dispatch(fetchUserPostsAsync(user._id)));

    console.log("New Post Data with URLs:", newPostData);
    setShowModal(false); // Close modal
    setText("");
    setImages([]);
    setVideos([]);
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
      <div className="h-96 max-w-6xl mx-auto flex flex-row justify-center -mt-4 items-center relative">
        {isCoverUploading ? (
          // Spinner while uploading
          <div className="w-10 h-10 flex flex-row justify-center items-center  border-4 border-white rounded-full bg-gray-300">
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
          <img
            src={user?.coverImage}
            alt="Cover"
            className="w-full h-full object-cover rounded-lg "
          />
        )}
        {/* Update Cover Picture Button */}
        <label
          htmlFor="cover-picture-upload"
          className="absolute bottom-4 right-4 bg-white p-2 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center space-x-2"
        >
          <span className="text-gray-800">📷</span>
          <span className="text-sm text-gray-800 font-bold">Edit</span>
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
      <div className="max-w-6xl mx-auto px-4 mt-1">
        <div className="flex flex-col items-center sm:items-start sm:flex-row sm:space-x-6">
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
                className="w-48 h-48 rounded-full border-4 border-white"
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
          <div className="text-center sm:text-left mt-4 sm:mt-0">
            <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-gray-600">1.5K friends</p>
            <div className="flex items-center  gap-2 flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
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
          <div className="flex flex-wrap justify-center sm:justify-start space-x-4 sm:space-x-8">
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
        <div className="order-1 md:order-none md:sticky top-10 h-screen overflow-y-auto">
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
              {user?.profilePosts
                ?.flatMap((post) => post?.content?.images || [])
                .slice(0, 9) // Flatten the array of images
                .map((image, i) => (
                  <img
                    key={i} // Always use a unique key for list items
                    src={image}
                    alt="Post content"
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
        <div className="col-span-2 order-2 md:order-none overflow-y-auto h-screen">
          {/* whats in your mind..? */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-2">
              <img
                src={user.profilePicture}
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <input
                onClick={() => setShowModal(true)}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-2 border border-gray-300 rounded-full"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 flex items-center justify-center text-gray-600 hover:bg-gray-100 p-2 rounded-md"
              >
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

          {/* Pop-up Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm z-50">
              <div className="bg-white p-4 rounded-lg shadow-xl border-slate-50 border-2   lg:h-[90%]  w-[88%] md:w-[500px] py-9">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl text-center w-full font-bold text-gray-800">
                    Create Post
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={user?.profilePicture ? user.profilePicture : ""}
                    className="w-10 h-10 rounded-full"
                    alt="Profile"
                  />
                  <div>
                    <div className="font-semibold">{user?.name}</div>
                    <select className="text-sm text-gray-600 bg-transparent px-0 py-1">
                      <option>Public</option>
                    </select>
                  </div>
                </div>

                {/* Text Area */}
                <textarea
                  onChange={handlePostText}
                  name="postText"
                  placeholder="What's on your mind?"
                  className="w-full p-3 border-none text-lg focus:ring-0 resize-none min-h-[100px]"
                />

                {/* Media Upload Area */}
                <div
                  className="mt-4 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50"
                  onClick={() => document.getElementById("fileUpload").click()}
                >
                  <div className="text-gray-600 font-medium mb-1">
                    📷 Add photos/videos
                  </div>
                  <div className="text-gray-400 text-sm">or drag and drop</div>
                  <div className="text-gray-400 text-sm mt-2">
                    Add photos and videos from your mobile device.
                  </div>
                </div>

                {/* Media Previews */}

                {isPostUploading ? (
                  <div className="mt-4 grid grid-cols-3 gap-2 overflow-y-scroll h-20 md:h-36">
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-3 gap-2 overflow-y-scroll h-20 md:h-36">
                    {images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        className="rounded-lg h-32 object-cover"
                      />
                    ))}
                    {videos.map((vid, index) => (
                      <video
                        key={index}
                        src={vid}
                        controls
                        className="rounded-lg h-32"
                      />
                    ))}
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                  id="fileUpload"
                />

                {/* Post Button */}
                <button
                  disabled={isPostUploading}
                  onClick={handleSubmit}
                  className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Add to your post
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-4">
            {user?.profilePosts?.every((post) => post.content) &&
              user.profilePosts.map((post, i) => (
                <SinglePost key={i} user={user} post={post} />
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
