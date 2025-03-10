import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { isAccessTokenValid, refreshAccessToken } from "./AuthAPI";

const initialState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

const API_URL = import.meta.env.VITE_API_URL;

export const signUpAsync = createAsyncThunk(
  "auth/signUp",
  async (userData, { rejectWithValue }) => {
    try {
      console.log(import.meta.env);
      console.log(userData, API_URL);
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        userData
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Log In action
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, userData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async action to persist user
export const checkUserPersistence = createAsyncThunk(
  "auth/checkUser",
  async (_, { rejectWithValue }) => {
    try {
      let token = localStorage.getItem("accessToken");

      // If token is missing or expired, refresh it
      if (!isAccessTokenValid()) {
        console.log("token is missing or expired");
        token = await refreshAccessToken();
      }

      if (!token) return rejectWithValue("User not authenticated");

      // Fetch user data using raw fetch
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("User fetch failed");

      const data = await response.json();
      console.log(data);
      return data.user;
    } catch (error) {
      return rejectWithValue("User not authenticated");
    }
  }
);

export const logoutUserAsync = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      // Call the backend logout API to clear the cookie
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // To include cookies in the request
      });

      // Clear localStorage and reset the Redux state
      localStorage.removeItem("accessToken"); // Clear access token from localStorage
      dispatch(logOut()); // Reset the Redux state
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
);

// Async thunk to update user details
export const updateProfileDetails = createAsyncThunk(
  "profile/updateDetails",
  async ({ userId, details }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // Assuming token is stored in Redux state

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
      };

      const response = await axios.patch(
        `${API_URL}/api/users/${userId}/details`,
        details,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  "profile/updateProfilePicture",
  async ({ userId, profilePicture }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // Assuming token is stored in Redux state

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
      };

      console.log("Updating profile picture", profilePicture);

      const response = await axios.post(
        `${API_URL}/api/users/${userId}/setProfilePic`,
        { profilePicture },
        config // Pass config for authorization
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
export const updateCoverPicture = createAsyncThunk(
  "profile/updateCoverPicture",
  async ({ userId, coverPicture }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // Assuming token is stored in Redux state

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
      };

      console.log("Updating profile picture", coverPicture);

      const response = await axios.post(
        `${API_URL}/api/users/${userId}/setCoverPic`,
        { coverPicture },
        config // Pass config for authorization
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const postToProfileAsync = createAsyncThunk(
  "profile/postToProfile",
  async ({ userId, postData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // Assuming token is stored in Redux state

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
      };

      console.log("Updating profile...", postData);

      const response = await axios.post(
        `${API_URL}/api/users/${userId}/postToProfile`,
        { postData },
        config // Pass config for authorization
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


export const editPostAsync = createAsyncThunk(
  "profile/editPost",
  async ({postId,updatedData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // Assuming token is stored in Redux state

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
      };
  
      console.log(updatedData);


      const response = await axios.post(
        `${API_URL}/api/users/posts/edit/${postId}`,
        updatedData ,
        config 
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Async thunk to fetch all posts for a user
export const fetchUserPostsAsync = createAsyncThunk(
  "posts/fetchUserPosts",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/posts/${userId}`);
      console.log("all posts  = ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch posts");
    }
  }
);
// Async thunk to fetch newsFeed for a user
export const fetchNewsFeedAsync = createAsyncThunk(
  "posts/fetchNewsFeed",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/newsFeed/${userId}`);
      console.log("newsFeed = ", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch posts");
    }
  }
);





export const updateReactionAsync = async (reaction, userId, postId) => {
  const token = localStorage.getItem("accessToken");
  const id = userId;
  console.log(id);

  if (!token) {
    console.error("No token found. User is not authenticated.");
    return;
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Attach token for authentication
    },
  };

  console.log("Sending reaction", reaction);
  const response = await axios.post(
    `${API_URL}/api/posts/${postId}/react`,
    { userId: id, type: reaction },
    config
  );

  console.log("Received reaction", response.data);

  return response.data;
  //  if (response.data.message === "Reaction removed") {
  //    setSelectedReaction(null); // Clear the selected reaction
  //    setLiked(false); // Mark as unliked
  //  } else {
  //    setSelectedReaction(reaction); // Set the selected reaction
  //    setLiked(true); // Mark as liked
  //  }

  //  setShowReactions(false); // Hide the reactions popup

  // setSelectedReaction(reaction);
  // setLiked(true);
  // setShowReactions(false);
};

//get all user..
// Async thunk to fetch all posts for a user
export const fetchAllUsers = createAsyncThunk(
  "posts/fetchAllUsers",
  async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
      };
      const response = await axios.get(`${API_URL}/api/users`, config);
      console.log("all users  = ", response.data);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);
export const fetchAllFriendRequests = createAsyncThunk(
  "posts/fetchAllFriendRequests", 
  async (userId) => {
    console.log(userId);
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      };
      const response = await axios.get(`${API_URL}/api/users/${userId}/allFriendRequests`,config);
      console.log("all requests  = ", response.data);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

// Async thunk to send a friend request
export const sendFriendRequest = createAsyncThunk(
  'auth/sendFriendRequest',
  async ({ senderId, receiverId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
      };
      const response = await axios.post(`${API_URL}/api/users/sendFriendRequest`, { senderId, receiverId },config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSentRequests = createAsyncThunk(
  "posts/fetchSentRequests",
  async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
      };
      const response = await axios.get(`${API_URL}/api/users/${userId}/sentRequests`, config);
      console.log("sent  = ", response.data);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

export const fetchAllFriendsById = createAsyncThunk(
  "posts/fetchAllFriendsById",
  async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
      };
      const response = await axios.get(`${API_URL}/api/users/${userId}/fetchAllFriends`, config);
      console.log("sent  = ", response.data);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

// Async thunk to confirm a friend request
export const confirmFriendRequest = createAsyncThunk(
  'auth/confirmFriendRequest',
  async ({receiverId,senderId }, { rejectWithValue }) => {
    try {
      console.log(receiverId,"  ",senderId);
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
      };

      const response = await axios.post(`${API_URL}/api/users/confirmFriendRequest`, {receiverId ,senderId},config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



// Async thunk to delete a friend request
export const deleteFriendRequest = createAsyncThunk(
  'auth/deleteFriendRequest',
  async ({ requester, rejecter }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {   
        headers: {
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
        data: { requester, rejecter } // Correct way to send data in DELETE request
      };

      const response = await axios.delete(`${API_URL}/api/users/deleteFriendRequest`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);



// Fetch user by ID
export const fetchUserByIdAsync = createAsyncThunk(
  "auth/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


//delete a post..
export const deletePostAsync = createAsyncThunk(
  'auth/deletePostAsync',
  async (postId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {   
        headers: {
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
        data: {postId}
      }

      const response = await axios.delete(`${API_URL}/api/posts/deletePost`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signUpAsync.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "error!";
      })
      .addCase(loginAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.userDemo;
        state.token = action.payload.accessToken;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || "error";
      })
      .addCase(checkUserPersistence.fulfilled, (state, action) => {
        console.log(action.payload);
        state.user = action.payload;
        // state.user = action.payload;
        const token = localStorage.getItem("accessToken"); // Get latest token
        state.token = token;
        console.log(state.user.profilePicture);
      })
      .addCase(checkUserPersistence.rejected, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("accessToken");
      })

      .addCase(updateProfileDetails.pending, (state) => {
        state.status = "loading";
      })

      .addCase(updateProfileDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.details = action.payload;
        state.error = null;
      })

      .addCase(updateProfileDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateProfilePicture.pending, (state) => {
        state.status = "loading";
      })

      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("payload=", action.payload);
        state.user.profilePicture = action.payload.profilePicture;
        console.log("set to state", state.user.profilePicture);
        state.error = null;
      })

      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCoverPicture.pending, (state) => {
        state.status = "loading";
      })

      .addCase(updateCoverPicture.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.coverImage = action.payload.coverImage;
        state.error = null;
      })

      .addCase(updateCoverPicture.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(postToProfileAsync.pending, (state) => {
        state.status = "loading";
      })

      .addCase(postToProfileAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.profilePosts.push(action.payload.post);
        state.user.newsFeed.push(action.payload.post);
        console.log("hey ai hue");
        state.error = null;
      })

      .addCase(postToProfileAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserPostsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserPostsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.profilePosts = action.payload.posts;
        state.user.newsFeed = action.payload.posts;
        state.error = null;
      })

      .addCase(fetchUserPostsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAllFriendsById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllFriendsById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.allFriends = action.payload;
        state.user.friends = action.payload;
        state.error = null;
      })
      .addCase(fetchAllFriendsById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchSentRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSentRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.allSentReq = action.payload;
        state.error = null;
      })
      .addCase(fetchSentRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAllFriendRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllFriendRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.allRecReq = action.payload;
        state.error = null;
      })
      .addCase(fetchAllFriendRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchNewsFeedAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNewsFeedAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.newsFeed = action.payload;
        state.error = null;
      })
      .addCase(fetchNewsFeedAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserByIdAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profileUser = action.payload; // Store visited profile
      })
      .addCase(fetchUserByIdAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(editPostAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editPostAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.user.profilePosts.findIndex(
          (post) => post._id === action.payload._id
        );
      
        if (index !== -1) {
          state.user.profilePosts[index] = action.payload;
        }
      })
      .addCase(editPostAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deletePostAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user.profilePosts = state.user.profilePosts.filter(
          (post) => post._id !== action.payload.postId
        );
      })
      .addCase(deletePostAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
      
  },
});

// Export actions
export const { logOut, isLoggedIn } = authSlice.actions;

// Export selectors
export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectToken = (state) => state.auth.token;
export const selectAllFriends = (state) => state.auth.user.allFriends;
export const selectAllSentReq = (state) => state.auth.user.allSentReq;
export const selectAllReceiveReq = (state) => state.auth.user.allRecReq;
export const selectNewsFeed = (state) => state.auth.user.newsFeed;

// Export the reducer
export default authSlice.reducer;
