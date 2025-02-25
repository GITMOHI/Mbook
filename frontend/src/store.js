// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './services/Auth/AuthSlice'
import NotificationReducer from './services/Notification/NotificationSlice'


// Configure the Redux store with the auth reducer
const store = configureStore({
  reducer: {
    auth: authReducer,
    notification:NotificationReducer
   
  },
});

export default store;
