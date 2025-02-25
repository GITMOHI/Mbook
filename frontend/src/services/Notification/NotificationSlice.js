import { createSlice } from '@reduxjs/toolkit';

const NotificationSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    addNotification: (state, action) => {
      state.push({ id: Date.now(), ...action.payload, read: false });
    },
    markAsRead: (state, action) => {
      return state.map(notification =>
        notification.id === action.payload ? { ...notification, read: true } : notification
      );
    },
    clearNotifications: () => [],
  },
});

export const { addNotification, markAsRead, clearNotifications } = NotificationSlice.actions;
export default NotificationSlice.reducer;
