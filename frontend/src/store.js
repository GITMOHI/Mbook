// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './services/Auth/AuthSlice'


// Configure the Redux store with the auth reducer
const store = configureStore({
  reducer: {
    auth: authReducer,
   
  },
});

export default store;
