import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
;
import { FaGraduationCap } from "react-icons/fa";
import { FaSchool } from "react-icons/fa6";
import { BiHome, BiMapPin } from "react-icons/bi";
;
// import PostImages from "../components/PostImages";
import SinglePost from "./SinglePost";
import { useParams } from "react-router";
import { fetchUserByIdAsync } from "../services/Auth/AuthSlice";
import EachPost from "./EachPost";

const ProfilePageView = () => {

   const {id} = useParams();
   const dispatch = useDispatch();
  
  const [profileUser, setProfileUser] = useState(null); // Store the visited user's data

  useEffect(() => {
    // Fetch user profile by ID
    const fetchProfile = async () => {
      try {
        const userData = await dispatch(fetchUserByIdAsync(id)).unwrap();
        setProfileUser(userData); // Update state with fetched user data
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id, dispatch]); // Re-fetch if ID changes

  if (!profileUser) {
    return <p className="text-center text-gray-500">Loading profile...</p>;
  }
   
 
  console.log("Profile = ", profileUser);
  return (
    <div className="bg-gray-100 min-h-screen">


      {/* Cover Photo */}
      <div className="h-96 max-w-6xl mx-auto flex flex-row justify-center -mt-4 items-center relative">

          <img
            src={profileUser?.coverImage}
            alt="Cover"
            className="w-full h-full object-cover rounded-lg "
          />
      </div>

      {/* Profile Picture and Header */}
      <div className="max-w-6xl mx-auto px-4 mt-1">
        <div className="flex flex-col items-center sm:items-start sm:flex-row sm:space-x-6">
          {/* Profile Picture */}
          <div className="relative -mt-10">
              <img
                src={profileUser.profilePicture}
                alt="Profile"
                className="w-48 h-48 rounded-full border-4 border-white"
              />
          </div>

          {/* Profile Header */}
          <div className="text-center sm:text-left mt-4 sm:mt-0">
            <h1 className="text-3xl font-bold text-gray-800">{profileUser?.name}</h1>
            <p className="text-gray-600">1.5K friends</p>
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
              {profileUser?.details?.description || "Hi, I'm new here!"}
            </p>

            <div className="mt-4 space-y-3 text-gray-700">
              {/* College/University */}
              {profileUser.details?.college && (
                <div className="flex items-center space-x-2">
                  <FaGraduationCap className="w-5 h-5 text-yellow-500" />
                  <span>
                    Studied at{" "}
                    <span className="font-semibold ">
                      {profileUser.details.college}
                    </span>
                  </span>
                </div>
              )}

              {/* School */}
              {profileUser.details?.school && (
                <div className="flex items-center space-x-2">
                  <FaSchool className="w-5 h-5 text-purple-500" />
                  <span>
                    Went to{" "}
                    <span className="font-semibold ">
                      {profileUser.details.school}
                    </span>
                  </span>
                </div>
              )}

              {/* Currently Living */}
              {profileUser.details?.currentCity && (
                <div className="flex items-center space-x-2">
                  <BiMapPin className="w-5 h-5 text-blue-500" />
                  <span>
                    Lives in{" "}
                    <span className="font-semibold ">
                      {profileUser.details.currentCity}
                    </span>
                  </span>
                </div>
              )}

              {/* Born In */}
              {profileUser.details?.bornIn && (
                <div className="flex items-center space-x-2">
                  <BiHome className="w-5 h-5 text-green-500" />
                  <span>
                    From{" "}
                    <span className="font-semibold ">
                      {profileUser.details.bornIn}
                    </span>
                  </span>
                </div>
              )}
            </div>

          </div>

          <div className="bg-white p-4 rounded-lg shadow mt-4">
            <h2 className="text-xl font-bold text-gray-800">Photos</h2>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {profileUser?.profilePosts
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
          <div className="mt-6 space-y-4">
            {profileUser?.profilePosts?.every((post) => post.content) &&
              profileUser.profilePosts.map((post, i) => (
                <EachPost key={i} user={profileUser} post={post} />
              ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProfilePageView;
