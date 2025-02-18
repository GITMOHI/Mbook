const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();
connectDB();

app.get('/',async(req,res)=>{
    res.send('API is running and changes are detected...and ok');
})


//middlewares..
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true, // Allow cookies and credentials
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));







const authRoutes = require("./routes/authRoutes");



//routes..
app.use('/api/users', userRoutes);
app.use("/api/auth", authRoutes); 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));