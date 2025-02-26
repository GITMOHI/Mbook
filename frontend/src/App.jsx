import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes.jsx";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkUserPersistence, selectUser } from "./services/Auth/AuthSlice";
import  io  from 'socket.io-client';
// import socket from "./utils/socket.js";


const socket = io.connect("http://localhost:5000");

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    console.log("Attempting to connect to Socket.io server...");

    socket.on('connect', () => {
      console.log('Connected to Socket.io server:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:dddddddddddddd', error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);



  useEffect(() => {
    dispatch(checkUserPersistence()).finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>; // Prevents flickering of unauthorized content
  }

  return <RouterProvider router={routes} />;
}

export default App;
