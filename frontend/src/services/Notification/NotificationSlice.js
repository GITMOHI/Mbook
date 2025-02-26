import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL;

// Async thunk to fetch notifications by user ID
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications/fetchNotifications/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to add a new notification
export const addNotification = createAsyncThunk(
  'notifications/addNotification',
  async ({ userId, ...notificationData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${API_URL}/api/notifications/addNotification/${userId}`, notificationData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to mark a notification as read
export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to clear all notifications
export const clearNotifications = createAsyncThunk(
  'notifications/clearNotifications',
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/notifications/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  allNotifications: [],
  unreadCount: 0, 
};

const NotificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.allNotifications = action.payload;
      })
      .addCase(addNotification.fulfilled, (state, action) => {
        state.allNotifications.push(action.payload);
        state.unreadCount += 1; // Increase count
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.allNotifications = state.allNotifications.map(notification =>
          notification.id === action.payload.id ? { ...notification, read: true } : notification
        );
        state.unreadCount -=1;
      })
      .addCase(clearNotifications.fulfilled, (state) => {
        state.allNotifications = [];
      });
  },
});


export const selectNotifications= (state) => state.notification.allNotifications;
export const selectUnreadCount = (state) => state.notification.unreadCount;

export default NotificationSlice.reducer;
