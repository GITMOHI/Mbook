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
        const token = localStorage.getItem("accessToken"); // Get latest token
        state.token = token;
        console.log(state.user);
    })
    .addCase(checkUserPersistence.rejected, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("accessToken");
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
