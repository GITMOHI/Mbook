import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Tag,
  Maximize2,
  MoreHorizontal,
  MessageCircle,
  ThumbsUp,
  Share2,
  Smile,
  Heart,
} from "lucide-react";
import { useRef } from "react";
import axios from "axios";
import { UNSAFE_getSingleFetchDataStrategy } from "react-router";
import { selectUser, updateReactionAsync } from "../services/Auth/AuthSlice";
import { useDispatch } from "react-redux";


const ImageGrid = ({ images, onImageClick }) => {
  if (!images?.length) return null;

  return (
    <div className={`grid gap-2 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 mt-4'}`}>
      {images.slice(0, 4).map((image, index) => (
        <div
          key={index}
          className={`relative cursor-pointer ${images.length === 3 && index === 0 ? "col-span-2" : ""}`}
          onClick={() => onImageClick(index)}
        >
          <div className={`${images.length === 1 ? "aspect-auto" : "aspect-square"} w-full bg-gray-100 rounded-lg overflow-hidden`}>
            <img
              src={image}
              alt={`Post ${index + 1}`}
              className={`w-full h-full rounded-lg ${images.length === 1 ? "object-contain" : "object-contain p-1"}`}
            />
          </div>

          {index === 3 && images.length > 4 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/30 via-black/20 to-transparent">
              <span className="text-white text-2xl font-bold drop-shadow-md">+{images.length - 4}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};




const SinglePost = ({ user, post }) => {
  

  // console.log(post);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [showReactions, setShowReactions] = useState(false); // State for reaction popup
  const [selectedReaction, setSelectedReaction] = useState(null); // State for selected reaction
  const [allreactions, setAllReactions] = useState(post?.reactions || []);
  const userIds = allreactions?.map((reactor) => reactor.userId) || []
  const [reactionIcons, setReactionIcons] = useState([]); // State for reaction icons

  // const reactionTypes = allreactions.map((reaction) => reaction.type);

  // console.log(reactionTypes)
  
  const people = userIds.map((u)=>u._id);



  const [count, setCount] = useState(post?.reactions?.length || 0);


  useEffect(() => {
    const updatedReactionIcons = allreactions.map((reaction) => {
      const reactionObj = reactions.find((r) => r.label === reaction.type);
      return reactionObj ? reactionObj.icon : null;
    });
    setReactionIcons(updatedReactionIcons);
  }, [allreactions]);
  
  // Update count whenever post.reactions.length changes
  useEffect(() => {
    if (post?.reactions) {
      console.log("reactors= ",post?.reactions.userId);
      setAllReactions(post?.reactions);
      setCount(post.reactions.length);
    }
  }, [post?.reactions?.length]);





  //current users, current reaction to the post....
  const reaction = post?.reactions?.find((reaction) => reaction?.userId._id === user?._id);
  useEffect(()=>{
    setSelectedReaction(reaction?.type)

  },[reaction?.type]);

  

 


 
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === post?.content?.images?.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? post?.content?.images?.length - 1 : prev - 1
    );
  };


  const API_URL = import.meta.env.VITE_API_URL;




  // const handleReactionSelect = async (reaction) => {
  //   const token = localStorage.getItem("accessToken");
  //   const id = user?._id;
  
  //   if (!token) {
  //     console.error("No token found. User is not authenticated.");
  //     return;
  //   }
  
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };
  
  //   console.log("Sending reaction", reaction);
  //   try {
  //     const response = await axios.post(
  //       `${API_URL}/api/posts/${post?._id}/react`,
  //       { userId: id, type: reaction },
  //       config
  //     );
  
  //     console.log("Received reaction", response.data);
  
  //     // Update the post state based on the response
  //     if(response.data.message==="Reaction removed"){
  //          setCount(count-1)
  //          setSelectedReaction(null); // Set the selected reaction
  //          setLiked(false);
  //     }else if(response.data.message==="Reaction updated"){
  //        setCount(count);
  //        setSelectedReaction(reaction); // Set the selected reaction
  //        setLiked(true);
  //     }else{
  //        setCount(count+1);
  //        setSelectedReaction(reaction); // Set the selected reaction
  //        setLiked(true);
  //     }

  //     // setSelectedReaction(reaction); // Set the selected reaction
  //     // setLiked(true); // Mark as liked
  //     setShowReactions(false); // Hide the reactions popup
  //   } catch (error) {
  //     console.error("Error updating reaction:", error);
  //     // Optionally, show an error message to the user
  //   }
  // };
  const handleReactionSelect = async (reaction) => {
    const token = localStorage.getItem("accessToken");
    const id = user?._id;

    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    console.log("Sending reaction", reaction);
    try {
      const response = await axios.post(
        `${API_URL}/api/posts/${post?._id}/react`,
        { userId: id, type: reaction },
        config
      );

      console.log("Received reaction", response.data);

      // Update the allreactions state based on the response
      if (response.data.message === "Reaction removed") {
  
        setAllReactions((prevReactions) =>
          prevReactions.filter((r) => r.userId._id !== id)
        );
        setCount(count - 1);
        setSelectedReaction(null);
        setLiked(false);
      } else if (response.data.message === "Reaction updated") {
       
        setAllReactions((prevReactions) =>
          prevReactions.map((r) =>
            r.userId._id === id ? { ...r, type: reaction } : r
          )
        );
        setCount(count);
        setSelectedReaction(reaction);
        setLiked(true);
      } else {
        
        setAllReactions((prevReactions) => [
          ...prevReactions,
          { userId: { _id: id }, type: reaction },
        ]);
        setCount(count + 1);
        setSelectedReaction(reaction);
        setLiked(true);
      }

      setShowReactions(false); // Hide the reactions popup
    } catch (error) {
      console.error("Error updating reaction:", error);
      // Optionally, show an error message to the user
    }
  };

  
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    setShowReactions(true);
    clearTimeout(timeoutRef.current); 
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 500);
  };

  const reactions = [
    {
      icon: <ThumbsUp color="blue" fill="blue" size={20} />,
      label: "like",
      color: "blue",
    },
    {
      icon: <Heart color="red" fill="red" size={20} />,
      label: "love",
      color: "red",
    },
    { icon: "😆", label: "haha", color: "black" },
    { icon: "😲", label: "wow", color: "black" },
    { icon: "😢", label: "sad", color: "black" },
    { icon: "😡", label: "angry", color: "#dc2626" },
  ];

  // const reactionIcons = reactionTypes.map((type) => {
  //   const reaction = reactions.find((r) => r.label === type);
  //   return reaction ? reaction.icon : null;
  // });

  // console.log(post);
    // Convert the createdAt timestamp to a Date object
    const postDate = new Date(post?.createdAt);

    // Calculate the time difference in a human-readable format
    const timeAgo = formatDistanceToNow(postDate, { addSuffix: true });


  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      {/* user info.. */}
      <div className="flex items-center space-x-3">
        <img
          src={post?.authorId?.profilePicture}
          alt={post?.authorId?.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <div className="flex flex-row gap-1 items-center">
            <p className="font-bold text-gray-800">{user?.name}</p>
            {post?.isProfile? (
              <p className="text-xs text-gray-500">updated his profile picture</p>
            ) : post?.isCover ? (
              <p className="text-sm text-gray-500">updated his cover image</p>
            ) : null}
          </div>
          <p className="text-sm text-gray-500">{timeAgo}</p>
        </div>
      </div>

      <p className="mt-4 text-gray-800">
        {post?.content?.texts  || "Hey, hello world..."}
      </p>

      <ImageGrid
        images={post?.content?.images}
        onImageClick={handleImageClick}
      />

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {/* Like, Comment, Share Section */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
        
        <span className="flex flex-row gap-1">
          <span>{reactionIcons.map((icon, index) => (
          <span key={index}>{icon}</span>
        ))}</span>
        {!people?.length
          ? "No reactions"
          : people.length === 1
          ? userIds[0]['name']
          : people.length === 2
          ? `${userIds[0]['name']} and ${userIds[1]['name']}`
          : `${userIds.slice(-2).join(" and ")} and ${userIds.length - 2} others`}
      </span>
        
        </div>
        <div className="flex justify-around p-4 border-t mt-4">
          <div className="relative">
            <button
              className={`flex items-center space-x-2 hover:cursor-pointer ${
                liked ? "text-blue-600" : "text-gray-600"
              } hover:text-blue-600`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => setLiked(!liked)}
            >
              {selectedReaction ? (
                reactions.find((r) => r.label === selectedReaction)?.icon
              ) : (
                <ThumbsUp size={20} />
              )}
              <span>{selectedReaction || "like"}</span>
            </button>

            {showReactions && (
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="absolute bottom-8 left-0 h-10 cursor-pointer rounded-full bg-white z-50 shadow-2xl p-2 flex space-x-2 transition-opacity duration-200 ease-in-out"
              >
                {reactions.map((reaction, index) => (
                  <button
                    key={index}
                    className="hover:scale-x-150 hover:scale-y-150 cursor-pointer transform transition-transform"
                    onClick={() => handleReactionSelect(reaction.label)}
                  >
              
                    <span style={{ color: reaction.color }}>
                      {" "}
                      {reaction.icon}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle size={20} />
            <span>Comment</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
            <Share2 size={20} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Reactions and Comments Section */}
      <div className="p-4 border-t">
        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 space-y-4 overflow-y-scroll ">
            {/* Existing Comments */}
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex space-x-2">
                  <img
                    src={user?.profilePicture}
                    alt="Commenter"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-2">
                      <p className="font-semibold text-sm">
                        Prittwyraj Mohajan Ritu
                      </p>
                      <p className="text-sm">This is a sample comment.</p>
                    </div>
                    <div className="flex space-x-2 mt-1 text-xs text-gray-500">
                      <button className="hover:underline">Like</button>
                      <button className="hover:underline">Reply</button>
                      <span>4w</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Comments */}
            <button className="text-blue-600 hover:text-blue-700 text-sm">
              View more comments
            </button>

            {/* Comment Input */}
            <div className="flex items-center space-x-2">
              <img
                src={user?.profilePicture}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="w-full px-3 py-2 bg-gray-100 rounded-full pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  <Smile size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex md:flex-row flex-col">
          {/* Close button - repositioned to top-right */}
          <button
            className="hover:cursor-pointer absolute top-4 right-4 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors z-50"
            onClick={() => setShowImageModal(false)}
          >
            <X size={20} />
          </button>

          {/* Image section */}
          <div className="md:flex-1 h-[50vh] md:h-full flex items-center justify-center relative bg-black">
            {post?.content?.images?.length > 1 && (
              <>
                <button
                  className="hover:cursor-pointer absolute left-4 bg-gray-800 rounded-full p-2 text-white hover:bg-gray-700"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="hover:cursor-pointer absolute right-4 bg-gray-800 rounded-full p-2 text-white hover:bg-gray-700"
                  onClick={handleNextImage}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            <img
              src={post?.content?.images[selectedImageIndex]}
              alt={`Full size ${selectedImageIndex + 1}`}
              className="max-h-full max-w-full md:max-w-[calc(100vw-360px)] object-contain"
            />
          </div>

          {/* Comments section */}
          <div className="md:w-[360px] w-full bg-white md:h-full flex flex-col">
            {/* Post info */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={user?.profilePicture}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-500">
                      January 26 at 11:45 AM
                    </p>
                  </div>
                </div>
                <button className="text-gray-600 hover:text-gray-800">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                Edit
              </button>
            </div>

            {/* Reactions */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-2">
                <span>👍 ❤️</span>
                <span className="text-sm text-gray-500">3</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-around p-4 border-b">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <ThumbsUp size={20} />
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <MessageCircle size={20} />
                <span>Comment</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>

            {/* Comments section - scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {[1].map((_, i) => (
                  <div key={i} className="flex space-x-2">
                    <img
                      src={user?.profilePicture}
                      alt="Commenter"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-2">
                        <p className="font-semibold text-sm">Useriii Name</p>
                        <p className="text-sm">This is a sample comment.</p>
                      </div>
                      <div className="flex space-x-2 mt-1 text-xs text-gray-500">
                        <button className="hover:underline">Like</button>
                        <button className="hover:underline">Reply</button>
                        <span>1h</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment input */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <img
                  src={user?.profilePicture}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="w-full px-3 py-2 bg-gray-100 rounded-full pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    <Smile size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePost;
