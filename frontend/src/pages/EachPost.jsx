import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  MessageCircle,
  Share2,
  Smile,
  Heart,
} from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addComment, fetchComments } from "../services/comments/commentsSlice";
import CommentsSection from "../components/CommentsSection";
import { selectUser } from "../services/Auth/AuthSlice";

// Image Grid Component
const ImageGrid = ({ images, onImageClick }) => {
  if (!images?.length) return null;

  return (
    <div
      className={`grid gap-2 ${
        images.length === 1 ? "grid-cols-1" : "grid-cols-2 mt-4"
      }`}
    >
      {images.slice(0, 4).map((image, index) => (
        <div
          key={index}
          className={`relative cursor-pointer ${
            images.length === 3 && index === 0 ? "col-span-2" : ""
          }`}
          onClick={() => onImageClick(index)}
        >
          <div
            className={`${
              images.length === 1 ? "aspect-auto" : "aspect-square"
            } w-full bg-gray-100 rounded-lg overflow-hidden`}
          >
            <img
              src={image}
              alt={`Post ${index + 1}`}
              className={`w-full h-full rounded-lg ${
                images.length === 1 ? "object-contain" : "object-contain p-1"
              }`}
            />
          </div>

          {index === 3 && images.length > 4 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <span className="text-white text-2xl font-bold">
                +{images.length - 4}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const EachPost = ({ user, post }) => {
  // State variables
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  const [showReactionsPanel, setShowReactionsPanel] = useState(false);
  const [userReaction, setUserReaction] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [showReactorsModal, setShowReactorsModal] = useState(false);
  const [filteredReactions, setFilteredReactions] = useState([]);
  const [reactorSearchTerm, setReactorSearchTerm] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const timeoutRef = useRef(null); // Ref to store the timeout ID

  const reactionTypes = [
    {
      icon: <ThumbsUp color="blue" fill="blue" size={18} />,
      label: "like",
      color: "blue",
      emoji: "👍",
    },
    {
      icon: <Heart color="red" fill="red" size={18} />,
      label: "love",
      color: "red",
      emoji: "❤️",
    },
    { icon: "😆", label: "haha", color: "black", emoji: "😆" },
    { icon: "😲", label: "wow", color: "black", emoji: "😲" },
    { icon: "😢", label: "sad", color: "black", emoji: "😢" },
    { icon: "😡", label: "angry", color: "#dc2626", emoji: "😡" },
  ];

  const loggedInUser = useSelector(selectUser);

  // Initialize reactions from post data
  useEffect(() => {
    if (post?.reactions && Array.isArray(post.reactions)) {
      setReactions(post.reactions);
      setFilteredReactions(post.reactions);

      // Check if current user has reacted
      const currentUserReaction = post.reactions.find(
        (reaction) => reaction.userId?._id === user?._id
      );

      if (currentUserReaction) {
        setUserReaction(currentUserReaction.type);
        setLiked(true);
      }
    }
  }, [post?.reactions, user?._id]);

  // Filter reactions when search term changes
  useEffect(() => {
    if (reactorSearchTerm.trim() === "") {
      setFilteredReactions(reactions);
    } else {
      const filtered = reactions.filter((reaction) =>
        reaction.userId?.name
          ?.toLowerCase()
          .includes(reactorSearchTerm.toLowerCase())
      );
      setFilteredReactions(filtered);
    }
  }, [reactorSearchTerm, reactions]);

  // Handle image click in grid
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  // Navigate through images in modal
  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === (post?.content?.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? (post?.content?.images?.length || 1) - 1 : prev - 1
    );
  };

  // Handle reaction selection
  const handleReactionSelect = async (reactionType) => {
    const token = localStorage.getItem("accessToken");
    if (!token || !loggedInUser?._id) {
      console.error("User is not authenticated");
      return;
    }

    const sound = new Audio("/reaction.mp3"); // Path to your sound file
    sound.play().catch((error) => {
      console.error("Failed to play sound:", error);
    });

    try {
      const response = await axios.post(
        `${API_URL}/api/posts/${post?._id}/react`,
        { userId: loggedInUser._id, type: reactionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message === "Reaction removed") {
        setReactions((prevReactions) =>
          prevReactions.filter((r) => r.userId?._id !== loggedInUser._id)
        );
        setUserReaction(null);
        setLiked(false);
      } else if (response.data.message === "Reaction updated") {
        setReactions((prevReactions) =>
          prevReactions.map((r) =>
            r.userId?._id === loggedInUser._id ? { ...r, type: reactionType } : r
          )
        );
        setUserReaction(reactionType);
        setLiked(true);
      } else {
        const newReaction = {
          userId: {
            _id: loggedInUser._id,
            name: loggedInUser.name || "You",
            profilePicture: loggedInUser.profilePicture,
          },
          type: reactionType,
        };
        setReactions((prevReactions) => [...prevReactions, newReaction]);
        setUserReaction(reactionType);
        setLiked(true);
      }

      setShowReactionsPanel(false); // Hide the panel immediately
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  // Function to show the reactions panel
  const handleMouseEnter = () => {
    setShowReactionsPanel(true);
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Function to hide the reactions panel after a delay
  const handleMouseLeave = () => {
    // Set a timeout to hide the panel after 1.5 seconds
    timeoutRef.current = setTimeout(() => {
      setShowReactionsPanel(false);
    }, 400); // 1.5 seconds delay
  };

  // Get emoji for a reaction type
  const getEmojiForType = (type) => {
    const reaction = reactionTypes.find((r) => r.label === type);
    return reaction ? reaction.emoji : "👍";
  };

  // Get current user's reaction icon
  const getUserReactionIcon = () => {
    if (!userReaction) return <ThumbsUp size={20} />;
    const reaction = reactionTypes.find((r) => r.label === userReaction);
    if (!reaction) return <ThumbsUp size={20} />;
    if (typeof reaction.icon === "string") return <span>{reaction.icon}</span>;
    return reaction.icon;
  };

  // Get distinct reaction types for display
  const getDistinctReactionEmojis = () => {
    const uniqueTypes = [...new Set(reactions.map((r) => r.type))];
    return uniqueTypes.map((type) => getEmojiForType(type));
  };

  // Format reactors display text
  const getReactorsDisplayText = () => {
    if (reactions.length === 0) return "No reactions";
    const reactorNames = reactions
      .filter((r) => r.userId && r.userId.name)
      .map((r) => r.userId.name);
    if (reactorNames.length === 0) return "No reactions";
    if (reactorNames.length === 1) return reactorNames[0];
    if (reactorNames.length === 2)
      return `${reactorNames[0]} and ${reactorNames[1]}`;
    return `${reactorNames[0]}, ${reactorNames[1]} and ${
      reactorNames.length - 2
    } others`;
  };

  // Format post date
  const timeAgo = formatDistanceToNow(new Date(post?.createdAt || Date.now()), {
    addSuffix: true,
  });

  // Get author info
  const authorName = post?.authorId?.name || "User";
  const authorProfilePic =
    post?.authorId?.profilePicture || "/default-avatar.png";

  // Get distinct reaction types for display, returning the icon instead of the emoji
  const getDistinctReactionIcons = () => {
    const uniqueTypes = [...new Set(reactions.map((r) => r.type))];
    return uniqueTypes.map((type) => {
      const reaction = reactionTypes.find((r) => r.label === type);
      return reaction ? reaction.icon : <ThumbsUp size={20} />; // Fallback to thumbs up if no reaction found
    });
  };

  //comments handling..
  const dispatch = useDispatch();
  const postId = post?._id;

  // Memoize selector to avoid unnecessary re-renders
  const comments =
    useSelector((state) => state.comments.commentsByPost[postId]) || [];
  const [commentText, setCommentText] = useState("");
  // const [showComments, setShowComments] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      dispatch(fetchComments(postId));
    }
  }, [showComments, dispatch, postId]);

  const handleCommentSubmit = () => {
    if (commentText.trim() === "") return;
    dispatch(addComment({ postId, text: commentText, userId: user?._id }));
    setCommentText(""); // Clear input field
  };

  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  // const [comments, setComments] = useState([]);

  const handleReaction = async (commentId) => {};



  const handleReplySubmit = async (parentId, replyText, parentType) => {
    if (!replyText) {
      alert("Reply cannot be empty");
      return;
    }

    const token = localStorage.getItem("accessToken");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/posts/comments/addReply`,
        {
          parentId,
          text: replyText,
          parentType, // Pass the parentType to the API
        },
        config
      );

      if (response.status === 201) {
        // Update the UI by refetching comments or replies
        dispatch(fetchComments(postId)); // Refetch comments to update the UI
        setReplyText({ ...replyText, [parentId]: "" });
        setReplyingTo(null);
      } else {
        alert("Failed to add reply");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("An error occurred while submitting the reply.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      {/* User info */}
      <div className="flex items-center space-x-3">
        <img
          src={authorProfilePic}
          alt={authorName}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <div className="flex flex-row gap-1 items-center">
            <p className="font-bold text-gray-800">{authorName}</p>
            {post?.isProfile && (
              <p className="text-xs text-gray-500">
                updated their profile picture
              </p>
            )}
            {post?.isCover && (
              <p className="text-sm text-gray-500">updated their cover image</p>
            )}
          </div>
          <p className="text-sm text-gray-500">{timeAgo}</p>
        </div>
      </div>

      {/* Post content */}
      <p className="mt-4 text-gray-800">{post?.content?.texts || " "}</p>

      {/* Image gallery */}
      <ImageGrid
        images={post?.content?.images || []}
        onImageClick={handleImageClick}
      />

      {/* Reactions summary - show only if there are reactions */}
      {reactions.length > 0 && (
        <div
          className="mt-4 pt-4 flex items-center space-x-2 text-sm text-gray-600 cursor-pointer hover:underline"
          onClick={() => setShowReactorsModal(true)}
        >
          <div className="flex">
            {getDistinctReactionIcons()
              .slice(0, 3)
              .map((icon, index) => (
                <span key={index} className="mr-1">
                  {icon}
                </span>
              ))}
          </div>
          <span>{getReactorsDisplayText()}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex cursor-pointer justify-around p-4 border-t mt-4">
        {/* Like/React button with popup */}
        <div className="relative">
          <button
            className={`flex items-center cursor-pointer space-x-2 ${
              liked ? "text-blue-600" : "text-gray-600"
            } hover:text-blue-600`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              if (userReaction) {
                handleReactionSelect(userReaction);
              } else {
                handleReactionSelect("like");
              }
            }}
          >
            {getUserReactionIcon()}
            <span className="capitalize">{userReaction || "Like"}</span>
          </button>

          {/* Reactions popup */}
          {showReactionsPanel && (
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="absolute bottom-8 left-0 h-10 rounded-full bg-white z-50 shadow-2xl p-2 flex space-x-2"
            >
              {reactionTypes.map((reaction, index) => (
                <button
                  key={index}
                  className="cursor-pointer hover:scale-125 transform transition-transform px-1"
                  onClick={() => handleReactionSelect(reaction.label)}
                >
                  {typeof reaction.icon === "string" ? (
                    <span>{reaction.icon}</span>
                  ) : (
                    reaction.icon
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment button */}
        <button
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={20} />
          <span>Comment</span>
        </button>

        {/* Share button */}
        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
          <Share2 size={20} />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && 
        <CommentsSection postId={postId}></CommentsSection>
      } 

      {/* Reactors Modal */}
      {showReactorsModal && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center bg-opacity-50 backdrop-blur-sm  justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="font-bold text-lg">People who reacted</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowReactorsModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Reaction type filter buttons */}
            <div className="p-2 flex border-b overflow-x-auto">
              <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 font-medium mx-1 whitespace-nowrap">
                All
              </button>
              {getDistinctReactionIcons().map((icon, index) => {
                const reactionType = reactionTypes.find((r) => r.icon === icon);
                return (
                  <button
                    key={index}
                    className="px-4 py-2 rounded-full hover:bg-gray-100 text-gray-800 font-medium mx-1 whitespace-nowrap flex items-center"
                  >
                    <span className="mr-1">{icon}</span>
                    {reactionType?.label || ""}
                  </button>
                );
              })}
            </div>

            {/* Search bar */}
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search by name..."
                value={reactorSearchTerm}
                onChange={(e) => setReactorSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Reactions list */}
            <div className="max-h-96 overflow-y-auto p-2">
              {filteredReactions.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {reactorSearchTerm
                    ? "No matching names found"
                    : "No reactions yet"}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {filteredReactions.map((reaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            reaction.userId?.profilePicture ||
                            "/default-avatar.png"
                          }
                          alt={reaction.userId?.name || "User"}
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="font-medium">
                          {reaction.userId?.name || "Unknown User"}
                        </span>
                      </div>
                      <span className="text-xl">
                        {getEmojiForType(reaction.type)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Close button */}
            <div className="border-t p-3 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-medium"
                onClick={() => setShowReactorsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal &&
        post?.content?.images &&
        post.content.images.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex md:flex-row flex-col">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 z-50"
              onClick={() => setShowImageModal(false)}
            >
              <X size={20} />
            </button>

            {/* Image display */}
            <div className="md:flex-1 h-[50vh] md:h-full flex items-center justify-center relative">
              {post.content.images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 bg-gray-800 rounded-full p-2 text-white hover:bg-gray-700"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    className="absolute right-4 bg-gray-800 rounded-full p-2 text-white hover:bg-gray-700"
                    onClick={handleNextImage}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              <img
                src={post.content.images[selectedImageIndex]}
                alt={`Full size ${selectedImageIndex + 1}`}
                className="max-h-full max-w-full md:max-w-[calc(100vw-360px)] object-contain"
              />
            </div>

            {/* Sidebar with post info */}
            <div className="md:w-[360px] w-full bg-white md:h-full flex flex-col">
              {/* Post author info */}
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2">
                  <img
                    src={authorProfilePic}
                    alt={authorName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{authorName}</p>
                    <p className="text-xs text-gray-500">{timeAgo}</p>
                  </div>
                </div>
              </div>

              {/* Reactions summary */}
              {/* Reactions summary - show only if there are reactions */}
              {reactions.length > 0 && (
                <div
                  className="mt-4 pl-4 pt-4 flex items-center space-x-2 text-sm text-gray-600 cursor-pointer hover:underline"
                  onClick={() => setShowReactorsModal(true)}
                >
                  <div className="flex">
                    {getDistinctReactionIcons()
                      .slice(0, 3)
                      .map((icon, index) => (
                        <span key={index} className="mr-1">
                          {icon}
                        </span>
                      ))}
                  </div>
                  <span>{getReactorsDisplayText()}</span>
                </div>
              )}

              {/* Action buttons */}
              {/* <div className="flex justify-around p-4 border-b">
                <button
                  className={`flex items-center space-x-2 ${
                    liked ? "text-blue-600" : "text-gray-600"
                  } hover:text-blue-600`}
                  onClick={() => {
                    if (userReaction) {
                      handleReactionSelect(userReaction);
                    } else {
                      handleReactionSelect("like");
                    }
                  }}
                >
                  {getUserReactionIcon()}
                  <span className="capitalize">{userReaction || "Like"}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                  <MessageCircle size={20} />
                  <span>Comment</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                  <Share2 size={20} />
                  <span>Share</span>
                </button>
              </div> */}

              <div className="flex cursor-pointer justify-around p-4 border-t mt-4">
                {/* Like/React button with popup */}
                <div className="relative">
                  <button
                    className={`flex items-center cursor-pointer space-x-2 ${
                      liked ? "text-blue-600" : "text-gray-600"
                    } hover:text-blue-600`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => {
                      if (userReaction) {
                        handleReactionSelect(userReaction);
                      } else {
                        handleReactionSelect("like");
                      }
                    }}
                  >
                    {getUserReactionIcon()}
                    <span className="capitalize">{userReaction || "Like"}</span>
                  </button>

                  {/* Reactions popup */}
                  {showReactionsPanel && (
                    <div
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className="absolute bottom-8 left-0 h-10 rounded-full bg-white z-50 shadow-2xl p-2 flex space-x-2"
                    >
                      {reactionTypes.map((reaction, index) => (
                        <button
                          key={index}
                          className="cursor-pointer hover:scale-125 transform transition-transform px-1"
                          onClick={() => handleReactionSelect(reaction.label)}
                        >
                          {typeof reaction.icon === "string" ? (
                            <span>{reaction.icon}</span>
                          ) : (
                            reaction.icon
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comment button */}
                <button
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setShowComments(!showComments)}
                >
                  <MessageCircle size={20} />
                  <span>Comment</span>
                </button>

                {/* Share button */}
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                  <Share2 size={20} />
                  <span>Share</span>
                </button>
              </div>

              {/* Comments section */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {/* Sample comment */}
                  <div className="flex space-x-2">
                    <img
                      src={user?.profilePicture || "/default-avatar.png"}
                      alt="Commenter"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-2">
                        <p className="font-semibold text-sm">User Name</p>
                        <p className="text-sm">This is a sample comment.</p>
                      </div>
                      <div className="flex space-x-2 mt-1 text-xs text-gray-500">
                        <button className="hover:underline">Like</button>
                        <button className="hover:underline">Reply</button>
                        <span>1h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment input */}
              <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                  <img
                    src={user?.profilePicture || "/default-avatar.png"}
                    alt={user?.name || "User"}
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

export default EachPost;
