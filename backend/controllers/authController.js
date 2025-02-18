const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_refresh_token_secret";



exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("clicked...",req.body);
    
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });
    
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        console.log("created new user",newUser);
    
        res.status(201).json({ message: "User registered successfully" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
      }
}



// Generate Access Token
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });  // Access token valid for 1 hour
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });  // Refresh token valid for 7 days
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate access and refresh tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Store the refresh token in the database (optional, for session management)
        user.refreshToken = refreshToken;  // Store refresh token in the user document
        await user.save();

        // Send the refresh token as an HTTP-only, SameSite cookie for security
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,  // Prevent access to cookie via JavaScript
            secure: process.env.NODE_ENV === "production",  // Set to true in production for HTTPS
            sameSite: "Strict",  // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000,  // Refresh token valid for 7 days
        });

        // Send the access token and user info in the response body
        const userDemo = await User.findOne({email}).select('-password -refreshToken');

        res.json({
            accessToken,
            userDemo,
            message: "Logged in successfully"
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login Failed ", error });
    }
};


exports.refreshToken = async (req, res) => {
    console.log("Refreshing...");
    try {
        console.log(req.cookies);
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

        // Verify refresh token (Check expiration)
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({ message: "Refresh token expired. Please log in again." });

            // If refresh token is valid, generate a new access token
            const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verify token
        req.user = decoded; // Attach decoded user ID to request
        // console.log(req.user);
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
};

exports.fetchMe = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password -refreshToken"); // Exclude sensitive data

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.logout = async (req, res) => {
    try {
      // Get the refresh token from the cookie
      const refreshToken = req.cookies.refreshToken;
  
      if (!refreshToken) {
        return res.status(400).json({ message: "No refresh token found" });
      }
  
      // Find user by the refresh token (you can also store refreshToken in the database to identify the user)
      const user = await User.findOne({ refreshToken });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Clear the refresh token in the database (optional, depends on your session management approach)
      user.refreshToken = null;
      await user.save();
  
      // Clear the refresh token cookie by setting it to an expired date
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Ensure it's only sent over HTTPS in production
        sameSite: "Strict",
      });
  
      res.status(200).json({ message: "Logged out successfully" });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error during logout" });
    }
};

  