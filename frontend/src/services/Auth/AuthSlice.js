import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { isAccessTokenValid, refreshAccessToken } from './AuthAPI';

const initialState = {
  user: null,
  token: null,
  status: 'idle', 
  error: null, 
};


const API_URL = import.meta.env.VITE_API_URL;


export const signUpAsync = createAsyncThunk(
  'auth/signUp',
  async (userData, { rejectWithValue }) => {
    try {
        console.log(import.meta.env);
      console.log(userData,API_URL);
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Log In action
export const loginAsync = createAsyncThunk(
  'auth/login',
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
export const checkUserPersistence = createAsyncThunk("auth/checkUser", async (_, { rejectWithValue }) => {
  try {
      let token = localStorage.getItem("accessToken");

      // If token is missing or expired, refresh it
      if (!isAccessTokenValid()) {
          console.log('token is missing or expired')
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
});

export const logoutUserAsync = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
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
});








// Async thunk to update user details
export const updateProfileDetails = createAsyncThunk(
  'profile/updateDetails',
  async ({ userId, details }, { rejectWithValue,getState }) => {
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




// // Async thunk to update user details
// export const updateProfilePicture = createAsyncThunk(
//   'profile/updateProfilePicture',
//   async ({ userId, profilePicture }, { rejectWithValue }) => {
//     try {

//       console.log('Updating profile picture',profilePicture)
//       const response = await axios.post(
//         `${API_URL}/api/users/${userId}/setProfilePic`, 
//         {profilePicture}
//       );
//       console.log(response.data);
//       return response.data; 
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );


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
        { postData},
        config // Pass config for authorization
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








// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signUpAsync.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || "error!";
      })
      .addCase(loginAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.userDemo;
        state.token = action.payload.accessToken; 
        localStorage.setItem("accessToken", action.payload.accessToken);
      })    
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || "error";
      })
      .addCase(checkUserPersistence.fulfilled, (state, action) => {
        console.log(action.payload)
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
       state.status = 'loading';
    })
    
    .addCase(updateProfileDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user.details = action.payload;
        state.error = null;
     })
    
    .addCase(updateProfileDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; 
     })
    .addCase(updateProfilePicture.pending, (state) => {
       state.status = 'loading';
    })
    
    .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log("payload=",action.payload);
        state.user.profilePicture = action.payload.profilePicture;
        console.log("set to state",state.user.profilePicture);
        state.error = null;
     })
    
    .addCase(updateProfilePicture.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; 
     })
    .addCase(postToProfileAsync.pending, (state) => {
       state.status = 'loading';
    })
    
    .addCase(postToProfileAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user.profilePosts.push(action.payload.post);
        state.user.newsFeed.push(action.payload.post);
        console.log('hey ai hue')
        state.error = null;
     })
    
    .addCase(postToProfileAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; 
     })
    .addCase(fetchUserPostsAsync.pending, (state) => {
       state.status = 'loading';
    })
    .addCase(fetchUserPostsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user.profilePosts = action.payload.posts;
        state.user.newsFeed = action.payload.posts;
        state.error = null;
     })
    
    .addCase(fetchUserPostsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; 
     });
      
  },
});

// Export actions
export const { logOut,isLoggedIn } = authSlice.actions;

// Export selectors
export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectToken = (state) => state.auth.token;

// Export the reducer
export default authSlice.reducer;
