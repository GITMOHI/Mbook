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
import {
  deletePostAsync,
  fetchUserPostsAsync,
  postToProfileAsync,
  selectProfilePosts,
  selectUser,
  sharePostToFeedAsync,
} from "../services/Auth/AuthSlice";
import { uploadImageToCloudinary } from "../utils/cloudinaryUpload";
import { toast } from "react-toastify";
import { FaDeleteLeft, FaNewspaper, FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import EditPostModal from "./EditPostModal";
import { useNavigate } from "react-router";

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
            r.userId?._id === loggedInUser._id
              ? { ...r, type: reactionType }
              : r
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

  const timeAgoSharedPost = formatDistanceToNow(
    new Date(post?.sharedFrom?.createdAt || Date.now()),
    {
      addSuffix: true,
    }
  );

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

  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      dispatch(fetchComments(postId));
    }
  }, [showComments, dispatch, postId]);

  // const [editClicked, setEditClicked] = useState(false);
  const [isPostUploading, setIsPostUploading] = useState(false);
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const [showModal, setShowModal] = useState(false);

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

  // Handle clicks outside of the modal
  const modalRef = useRef(null); // Reference for the modal container
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    }

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const [editClicked, setEditClicked] = useState(false);

  const [throwTrashModal, setThrowTrashModal] = useState(false);
  const handleThrowTrash = (e) => {
    e.preventDefault();
    setThrowTrashModal(false);
    console.log(postId);
    dispatch(deletePostAsync(postId))
      .unwrap()
      .then((res) => {
        console.log(res);
        if (res.postId) {
          toast.success("Post was moved succesfully!");
        } else {
          toast.error("Error moving the post..");
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  //sharing features....

  const [showShareOptions, setShowShareOptions] = useState(false);
  const [shareFeed, setShareFeed] = useState(false);
  const [sharedPostText, setsharedPostText] = useState("");

  const handlesharedPostText = (e) => {
    e.preventDefault();
    setsharedPostText(e.target.value);
  };

  const handleShareToFeed = () => {
    setShowShareOptions(false); // Close popup after clicking

    console.log(sharedPostText);
    const toBeShared = post?.sharedFrom ? post.sharedFrom._id : post._id;
    console.log(toBeShared);
    dispatch(sharePostToFeedAsync({ postId: toBeShared, sharedPostText }))
      .unwrap()
      .then((res) => {
        if (res.sharedPost) {
          // Check if post was shared successfully
          toast.success("Post was shared to NewsFeed!");

          // Fetch updated user posts after sharing
          dispatch(fetchUserPostsAsync(user?._id));
        } else {
          console.error("Error sharing post:", res);
          toast.error("Error sharing the post!");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error("Error sharing the post!");
      });
  };

  // const handleShareToMessenger = () => {
  //   dispatch(sharePostToMessenger(post._id));
  //   setShowShareOptions(false); // Close popup after clicking
  // };
  const shareModalRef = useRef(null);
  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (shareModalRef.current && !shareModalRef.current.contains(event.target)) {
  //       setShowShareOptions(false);
  //     }
  //   }

  //   if (showShareOptions) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   } else {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [shareModalRef,showShareOptions]);

  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center space-x-3 relative">
        <img
          src={authorProfilePic}
          alt={authorName}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex flex-row justify-between w-full items-center">
          <div>
            <div className="flex flex-row gap-1 items-center">
              <p className="font-bold text-gray-800">{authorName}</p>
              {post?.isProfile && (
                <p className="text-xs text-gray-500">
                  updated their profile picture
                </p>
              )}
              {post?.isCover && (
                <p className="text-sm text-gray-500">
                  updated their cover image
                </p>
              )}
            </div>
            <p className="text-sm text-gray-500">{timeAgo}</p>
          </div>

          {/* "..." Button with relative positioning */}
          {loggedInUser?._id == post?.authorId._id ? (
            <div className="relative" ref={modalRef}>
              <p
                onClick={() => setShowModal(!showModal)}
                className="text-3xl cursor-pointer hover:bg-slate-100 px-2 rounded-3xl"
              >
                ...
              </p>

              {/* Pop-up Modal positioned below the button */}
              {showModal && (
                <div className="absolute top-full z-50 right-0 mt-2 bg-white shadow-lg rounded-xl w-48 p-2 border border-gray-300">
                  <button
                    onClick={() => {
                      setEditClicked(true);
                      setShowModal(false);
                    }}
                    className="flex cursor-pointer items-center gap-2 w-full px-3 py-2 hover:bg-gray-200 rounded-md"
                  >
                    <FaEdit />
                    Edit Post
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setThrowTrashModal(true);
                    }}
                    className="flex cursor-pointer items-center gap-2 w-full px-3 py-2 hover:bg-gray-200 rounded-md"
                  >
                    <FaTrash />
                    Move to Trash
                  </button>
                </div>
              )}
            </div>
          ) : (
            " "
          )}
        </div>
      </div>

      {/* trash modal.. */}
      {throwTrashModal ? (
        <div className=" backdrop-blur-sm fixed inset-0 flex items-center justify-center z-50 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3xl">
            <h2 className="text-lg font-semibold">Move to your trash?</h2>
            <p className="text-sm text-gray-600 mt-2">
              Items in your trash will be automatically deleted after 30 days.
              You can delete them from your trash earlier by going to activity
              log in settings.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 text-gray-700 cursor-pointer border-none bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => {
                  setThrowTrashModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 cursor-pointer text-white bg-blue-600 rounded hover:bg-blue-700"
                onClick={handleThrowTrash}
              >
                Move
              </button>
            </div>
          </div>
        </div>
      ) : (
        " "
      )}

      {/* Post content */}
      {!post.sharedFrom ? (
        <p className="mt-4 text-gray-800">{post?.content?.texts || " "}</p>
      ) : (
        <p className="mt-4 mb-4 text-gray-800">
          {post.textOnshare ? post.textOnshare[0] : ""}
        </p>
      )}

      {/* Image gallery */}
      <ImageGrid
        images={post?.content?.images || []}
        onImageClick={handleImageClick}
      />

      {/* User info shared post's owner */}
      {post.sharedFrom && (
        <div>
          <div className="flex mt-8 items-center space-x-3 relative">
            <img
              src={post.sharedFrom.authorId?.profilePicture}
              alt={authorName}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold">{post.sharedFrom.authorId?.name}</p>
              <p className="text-gray-500">{timeAgoSharedPost}</p>
            </div>
          </div>
          <div className="mt-4">
            <p>
              {post.sharedFrom.content?.texts
                ? post.sharedFrom.content?.texts
                : ""}
            </p>
          </div>
        </div>
      )}

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

      {/* Pop-up Modal */}
      {editClicked && (
        <EditPostModal
          post={post}
          user={user}
          editClicked={editClicked}
          setEditClicked={setEditClicked}
          handleSubmit={handleSubmit}
          isPostUploading={isPostUploading}
          setIsPostUploading={setIsPostUploading}
        />
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
          className="flex cursor-pointer items-center space-x-2 text-gray-600 hover:text-blue-600"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={20} />
          <span>Comment</span>
        </button>

        {/* Share button */}
        <button
          onClick={() => setShowShareOptions(!showShareOptions)}
          className="flex cursor-pointer items-center space-x-2 text-gray-600 hover:text-blue-600"
        >
          <Share2 size={20} />
          <span>Share</span>

          {/* Share Options Popup */}
          {showShareOptions && (
            <div className="relative" ref={shareModalRef}>
              <div className=" text-gray-600 absolute  z-50 top-4 -right-28 mt-2 bg-white shadow-lg rounded-xl w-56 p-2 border border-gray-300">
                <button
                  onClick={() => {
                    setShareFeed(!shareFeed);
                  }}
                  className="block cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  <p className="cursor-pointer">Share to News Feed</p>
                </button>

                <button
                  // onClick={handleShareToMessenger}
                  className="block cursor-pointer  w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Share to Messenger
                </button>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* share pop up... */}
      {shareFeed && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl border-slate-50 border-2   lg:h-[90%]  w-[88%] md:w-[500px] py-9">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-center w-full font-bold text-gray-800">
                Share Post
              </h2>
              <button
                onClick={() => setShareFeed(false)}
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
              onChange={handlesharedPostText}
              name="sharedPostText"
              placeholder="Write something about it.."
              className="w-full p-3 border-none text-lg focus:ring-0 resize-none min-h-[100px]"
            />

            <div className="border-1 w-full h-80 gap-3 overflow-x-auto p-2">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={
                    post?.authorId?.profilePicture
                      ? post.authorId.profilePicture
                      : ""
                  }
                  className="w-10 h-10 rounded-full"
                  alt="Profile"
                />
                <p className="font-semibold mb-2">{post?.authorId?.name}</p>
              </div>

              <div>
                {post.content?.texts ? (
                  <p className="mb-3">{post.content.texts}</p>
                ) : (
                  " "
                )}
                {post?.content?.images?.map((image, index) => (
                  <div key={`image-${index}`} className="h-full flex-shrink-0">
                    <img
                      src={image}
                      alt={`Post image ${index}`}
                      className="h-full w-auto object-cover rounded-lg shadow-md"
                    />
                  </div>
                ))}

                {post?.content?.videos?.map((video, index) => (
                  <div key={`video-${index}`} className="h-full flex-shrink-0">
                    <video
                      controls
                      className="h-full w-auto rounded-lg shadow-md"
                    >
                      <source src={video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>

            {/* Post Button */}
            <button
              disabled={isPostUploading}
              onClick={handleShareToFeed}
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Share now
            </button>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {showComments && <CommentsSection postId={postId}></CommentsSection>}

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
              className="absolute cursor-pointer top-4 right-4 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 z-50"
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
                    <p
                      onClick={() => {
                        const path =
                          user?._id === post.authorId._id
                            ? "/home/profile"
                            : `/home/profiles/${post.authorId._id}`;
                        navigate(path);
                      }}
                      className="font-semibold hover:underline cursor-pointer"
                    >
                      {authorName}
                    </p>
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
                  <span className="cursor-pointer">Comment</span>
                </button>

                {/* Share button */}
                {/* <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                   onClick={() => setShowShareOptions(!showShareOptions)}
                   >
                  <Share2 size={20} />
                  <span className="cursor-pointer">Share</span>
                </button> */}
              </div>

              {/* Comments section */}
              <div className="flex-1 overflow-y-auto p-4">
                {showComments && (
                  <CommentsSection postId={postId}></CommentsSection>
                )}
              </div>

              {/* Comment input */}
              {/* <div className="p-4 border-t">
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
              </div> */}
            </div>
          </div>
        )}
    </div>
  );
};

export default EachPost;
