// const express = require('express');
// const connectDB = require('./config/db');

// const app = express();
// const cors = require('cors');
// const cookieParser = require('cookie-parser');

// require('dotenv').config();
// connectDB();

// app.get('/',async(req,res)=>{
//     res.send('API is running and changes are detected...and ok');
// })


// //middlewares..
// app.use(cors({
//     origin: 'http://localhost:5173', // Allow requests from this origin
//     credentials: true, // Allow cookies and credentials
// }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));







// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require('./routes/userRoutes');
// const postRoutes = require('./routes/postRoutes');



// //routes..
// app.use('/api/users', userRoutes);
// app.use("/api/auth", authRoutes); 
// app.use("/api/posts", postRoutes); 


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));








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


app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);

// Notification Model Import
const Notification = require('./models/Notification'); // Ensure you have this model

// Socket.io for Real-Time Notifications
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
  
    // Listen for notifications from the client
    socket.on('sendNotification', async (data) => {
      const { message, senderId,receivers, type, targetId } = data;
      console.log(data);
  
      // Save the notification in MongoDB
      const newNotification = new Notification({ message, senderId,receivers, type, targetId });
      await newNotification.save();
  
      // Emit notifications differently based on userIds length
      if (  receivers.length === 1) {
        // Send notification to a single user
        io.emit(`notification-${ receivers[0]}`, newNotification);
      } else {
        // Broadcast notification to multiple users
        receivers.forEach((id) => {
          io.emit(`notification-${id}`, newNotification);
        });
      }
    });
  
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
  

// Start the server with Socket.io support
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
