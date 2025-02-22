const User = require('../models/User');
const Post = require("../models/Post");
const Reaction = require("../models/Reaction");
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Update user details
exports.updateUserDetails = async (req, res) => {
  const { userId } = req.params; // Get the user ID from the URL params
  const { bornIn, currentCity, school, college, description } = req.body; // Get the updated details from the request body

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's details
    user.details = {
      bornIn: bornIn || user.details.bornIn, // Use the new value or keep the existing one
      currentCity: currentCity || user.details.currentCity,
      school: school || user.details.school,
      college: college || user.details.college,
      description: description || user.details.description,
    };

    // Save the updated user to the database
    const updatedUser = await user.save();

    // Return the updated user details
    res.status(200).json(updatedUser.details);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//profilePicture..

exports.setProfilePicture = async (req, res) => {
  const { userId } = req.params; // Get the user ID from the URL params
  const { profilePicture } = req.body; // Get the updated details from the request body
  
  console.log("profile=",req.body)
  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    user.profilePicture = profilePicture || ' ';
    console.log(user.profilePicture);


    const updatedUser = await user.save();
    console.log(updatedUser);
    console.log(updatedUser.profilePicture);

    // Return the new profile picture..
    res.status(200).json({ profilePicture: updatedUser.profilePicture });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.setCoverPicture = async (req, res) => {
  const { userId } = req.params; // Get the user ID from the URL params
  const { coverPicture } = req.body; // Get the updated details from the request body
  

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    user.coverImage = coverPicture || ' ';

    const updatedUser = await user.save();
    console.log(updatedUser);
    console.log(updatedUser.coverImage);

    // Return the new profile picture..
    res.status(200).json({ coverImage: updatedUser.coverImage});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.postToProfile = async (req, res) => {
  try {
    const { postData } = req.body; // Extract post data
    const {userId} = req.params; // Get user ID from authenticated request
    
    
    console.log(postData);
    if (!postData) {
      return res.status(400).json({ message: "Post content cannot be empty." });
    }

    const newPost = new Post(postData);

    await newPost.save();
    console.log("NewPost = ",newPost);

    // Add post to user's profile posts & news feed
    await User.findByIdAndUpdate(userId, {
      $push: { profilePosts: newPost._id, newsFeed: newPost._id }
    });

    // Add post to all friends' news feed
    // const user = await User.findById(userId);
    // if (user.friends.length > 0) {
    //   await User.updateMany(
    //     { _id: { $in: user.friends } },
    //     { $push: { newsFeed: newPost._id } }
    //   );
    // }
    // console.log(newPost);
    return res.status(201).json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    console.error("Error posting to profile:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};



exports.fetchAllPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find posts where the authorId is the user, but exclude posts with a pageId (user's page posts)
    const posts = await Post.find({ authorId: userId, pageId: null }) 
      .populate({
        path: "reactions",
        populate: { path: "userId", select: "name profilePicture -password" }, // Populate reactions with user details, excluding password
      })
      .sort({ createdAt: -1 }); // Sort by newest first
    //  console.log("your posts = ",posts);
    res.status(200).json({posts:posts});
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};