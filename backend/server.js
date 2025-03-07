



const express = require('express');
const connectDB = require('./config/db');
const http = require('http'); // Required for Socket.io
const { Server } = require('socket.io'); // Import Socket.io
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();



// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app); // Attach HTTP server for Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods:["GET","POST"]
    // credentials: true, // Allow cookies and credentials
  },
  pingTimeout: 60000
});





// Connect to MongoDB
connectDB();

// Basic route for server check
app.get('/', async (req, res) => {
  res.send('API is running and changes are detected...and ok');
});

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const Notification = require('./models/Notification'); 

app.use('/api/users', userRoutes(io)); 
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes(io));
app.use('/api/notifications', notificationRoutes);


const { default: axios } = require('axios');




io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for notifications from the client
  socket.on('sendNotification', async (data) => {
      const { message, senderId, receivers, type, targetId } = data;
      console.log("Received notification:", data);
     
      try {
          // Send a request to your existing API route for saving notifications
          const savedNotifications = await Promise.all(
              receivers.map(async (receiverId) => {
                  const response = await axios.post(
                      `${process.env.API_URI}/api/notifications/addNotification/${receiverId}`, 
                      { senderId, message, type, targetId },
                      { headers: { 'Content-Type': 'application/json' } }
                  );
                  return response.data; // Returning saved notification
              })
          );

          console.log("Saved notifications:", savedNotifications);

          // Emit notifications to the relevant users
          savedNotifications.forEach((notification) => {
             console.log("Saved notification:", notification.receivers);
              io.emit(`notification-${notification.receivers}`, notification);
          });

      } catch (error) {
          console.error("Error saving notification:", error.response?.data || error.message);
      }
  });

  socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
  });
});













// Start the server with Socket.io support
const PORT = process.env.PORT || 5000;
console.log(process.env.API_URI)
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
