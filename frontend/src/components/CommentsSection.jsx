import { FaPaperPlane } from "react-icons/fa6";
import { selectUser } from "../services/Auth/AuthSlice";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments } from "../services/comments/commentsSlice";
// import { PaperPlane } from "lucide-react"; // Import the paper airplane icon

const Comment = ({
  comment,
  postId,
  depth = 0,
  isReply = false,
  parentCommenter,
}) => {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;

  // Sort replies by createdAt in descending order
  const sortedReplies = comment.replies
    ? [...comment.replies].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    : [];

  const handleReplySubmit = async (parentId, parentType) => {
    if (!replyText) {
      alert("Reply cannot be empty");
      return;
    }

    const token = localStorage.getItem("accessToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const response = await axios.post(
        `${API_URL}/api/posts/comments/addReply`,
        { parentId, text: replyText, parentType, postId },
        config
      );
      dispatch(fetchComments(postId)); // Refetch comments to update the UI
      setReplyText("");
      setReplying(false);
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("An error occurred while submitting the reply.");
    }
  };

  // Handle Enter key press for submitting reply
  const handleReplyKeyPress = (e, parentId, parentType) => {
    if (e.key === "Enter") {
      handleReplySubmit(parentId, parentType);
    }
  };

  return (
    <div className={`relative ${isReply ? "pl-6" : ""}`}>
      {/* Vertical line for replies */}
      {isReply && (
        <div
          className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"
          style={{ left: "1.5rem" }} // Adjust based on your design
        />
      )}

      {/* Horizontal line for replies */}
      {isReply && (
        <div
          className="absolute left-0 top-4 w-6 h-px bg-gray-300"
          style={{ left: "1.5rem" }} // Adjust based on your design
        />
      )}

      {/* Comment content */}
      <div className="flex space-x-2">
        <img
          src={comment.commenter?.profilePicture || "/default-avatar.png"}
          alt="Commenter"
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">
          {/* Comment text */}
          <div className="bg-gray-100 rounded-lg p-2">
            <p className="font-bold text-xs">{comment.commenter?.name}</p>
            <p className="text-[14px]">{comment.text}</p>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2 mt-1 text-xs text-gray-500">
            <button
              onClick={() => handleReaction(comment._id)}
              className="hover:underline"
            >
              {comment.reacted ? "Unlike" : "Like"}
            </button>
            <button
              onClick={() => setReplying(!replying)}
              className="hover:underline"
            >
              Reply
            </button>
            <span>{new Date(comment.createdAt).toLocaleTimeString()}</span>
          </div>

          {/* Reply input */}
          {replying && (
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-black bg-black text-white font-bold">
                {user?.profilePicture ? (
                  <img
                    src={user?.profilePicture}
                    alt={user?.name || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm"> You</span>
                )}
              </div>
              <div className="flex-1 relative">
                {/* Reply context inside the textbox */}
                <div className="flex items-center text-xs text-gray-500 mb-1">
                  <span className="font-semibold">{user?.name}</span>
                  <span className="mx-2">→</span> {/* Arrow for spacing */}
                  <span className="font-semibold">
                    {comment.commenter?.name}
                  </span>
                </div>
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={(e) =>
                    handleReplyKeyPress(e, comment._id, "comment")
                  }
                  placeholder="Write a reply..."
                  className="w-full px-3 py-2 bg-gray-100 rounded-full pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleReplySubmit(comment._id, "comment")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <FaPaperPlane className="mt-3" />
                  {/* Paper airplane icon */}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render nested replies */}
      {sortedReplies.length > 0 && (
        <div className="mt-2">
          {sortedReplies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              postId={postId}
              depth={depth + 1}
              isReply={true} // Mark as a reply to render connecting lines
              parentCommenter={comment.commenter} // Pass the parent commenter's info
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentsSection = ({ postId }) => {
  const dispatch = useDispatch();
  const comments =
    useSelector((state) => state.comments.commentsByPost[postId]) || [];
  const [commentText, setCommentText] = useState("");
  const user = useSelector(selectUser);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleCommentSubmit = async () => {
    if (!commentText) return;

    const token = localStorage.getItem("accessToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.post(
        `${API_URL}/api/posts/comments/addComment`,
        { postId, text: commentText },
        config
      );
      dispatch(fetchComments(postId)); // Refetch comments to update the UI
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  // Handle Enter key press for submitting comment
  const handleCommentKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCommentSubmit();
    }
  };

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  return (
    <div className="mt-4">
      {/* Scrollable comments section */}
      <div className="space-y-4 border-t pt-4 max-h-[60vh] overflow-y-auto">
        {comments?.map((comment) => (
          <Comment key={comment._id} comment={comment} postId={postId} />
        ))}
      </div>

      {/* Fixed comment input at the bottom */}
      <div className="flex items-center space-x-2 mt-4">
        <img
          src={user?.profilePicture || "/default-avatar.png"}
          alt={user?.name || "User"}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1 relative">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={handleCommentKeyPress}
            placeholder="Write a comment..."
            className="w-full px-3 py-2 bg-gray-100 rounded-full pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCommentSubmit}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <FaPaperPlane size={16} /> {/* Paper airplane icon */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
