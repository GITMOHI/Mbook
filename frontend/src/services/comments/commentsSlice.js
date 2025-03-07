import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Fetch comments for a specific post
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");// Assuming token is stored in Redux state

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
      };
      
      console.log("here..in commentsSlice.js");

      const response = await axios.get(`${API_URL}/api/posts/comments/${postId}`,config);
      return { postId, comments: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch comments");
    } 
  }
);

// Add a comment to a post
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ postId, text, userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");// Assuming token is stored in Redux state

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
      };
      
      console.log("adding comment..");
      const response = await axios.post(`${API_URL}/api/posts/comments/addComment`, { postId, text, commenter:userId },config);
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add comment");
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    commentsByPost: {}, // Store comments grouped by postId
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Comments
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.commentsByPost[action.payload.postId] = action.payload.comments;
        state.status = "succeeded";
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (!state.commentsByPost[postId]) {
          state.commentsByPost[postId] = [];
        }
        state.commentsByPost[postId].push(comment);
      });
  },
});

export default commentsSlice.reducer;
