const User = require("../models/User");
const Post = require("../models/Post");
const Reaction = require("../models/Reaction");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Extract the user ID from the request parameters

    console.log(`Fetching user with ID: ${id}`);

    // Find the user by ID and populate only necessary fields
    const user = await User.findById(id)
      .select('name email profilePicture coverImage friends profilePosts') // Only select essential fields
      .populate('friends', 'name profilePicture') // Populate the friends list with only name and profilePicture
      .populate({
        path: 'profilePosts',
        select: 'content createdAt reactions', // Include reactions in profile posts
        options: { sort: { createdAt: -1 } }, // Sort by createdAt field in descending order 
        populate: [
          {
            path: 'authorId', // Populate post's author details
            select: 'name profilePicture',
          },
          {
            path: 'reactions', // Populate reactions for each post
            select: 'type userId', // Select the reaction type and the userId who reacted
            populate: {
              path: 'userId', // Populate the user who reacted
              select: 'name profilePicture',
            },
          },
        ],
      })
      .exec();

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user data as a JSON response
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);

    // Return a generic error message for any server issue
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};




exports.updateUserDetails = async (req, res) => {
  const { userId } = req.params; // Get the user ID from the URL params
  const { bornIn, currentCity, school, college, description } = req.body; // Get the updated details from the request body

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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

  console.log("profile=", req.body);
  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = profilePicture || " ";
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
      return res.status(404).json({ message: "User not found" });
    }

    user.coverImage = coverPicture || " ";

    const updatedUser = await user.save();
    console.log(updatedUser);
    console.log(updatedUser.coverImage);

    // Return the new profile picture..
    res.status(200).json({ coverImage: updatedUser.coverImage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.postToProfile = (io) => async (req, res) => {
  try {
    const { postData } = req.body; // Extract post data
    const { userId } = req.params; // Get user ID from authenticated request

    console.log(postData);
    if (!postData) {
      return res.status(400).json({ message: "Post content cannot be empty." });
    }

    const newPost = new Post(postData);

    await newPost.save();
    console.log("NewPost = ", newPost);

    // Add post to user's profile posts & news feed
    await User.findByIdAndUpdate(userId, {
      $push: { profilePosts: newPost._id, newsFeed: newPost._id },
    });

    const user = await User.findById(userId).populate("newsFeed");
    //pushing the post to users friends newsfeed...
    if (user && user.friends.length > 0) {
      console.log("i am here..");
      try {
        const result = await User.updateMany(
          { _id: { $in: user.friends } },
          { $push: { newsFeed: { $each: [newPost._id], $position: 0 } } }
        );
        console.log("Update result:", result); // Log the result to see how many documents were modified
      } catch (err) {
        console.error("Error updating friends newsFeeds:", err);
      }
    }

    const message = `${user.name} has just shared a new post!`;

      const notification = new Notification({
        message: message,
        type: "post",
        targetId:newPost._id , // 
        receivers: user?.friends, 
        senderId: user?._id,
      });
      
      // Save the notification to the database
      await notification.save();
      
      await User.updateMany(
        { _id: { $in: user?.friends } },  // Find all friends by their IDs
        { $push: { notifications: notification._id } } // Push the notification ID to their notifications array
      );

      // Emit the notification to each friend individually
      user?.friends?.forEach((friendId) => {
        io.emit(`post-${friendId}`, notification);
      });
      

    console.log(newPost);
    return res
      .status(201)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    console.error("Error posting to profile:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


exports.fetchAllPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find posts by the user, excluding posts with a pageId
    let posts = await Post.find({ authorId: userId, pageId: null })
      .populate({
        path: "reactions",
        populate: { path: "userId", select: "-password -refreshToken" }, // Exclude password only
      })
      .populate({
        path: "authorId", // Populate the authorId field
        select: "-password -refreshToken", // Exclude sensitive fields
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    // Filter posts that have `sharedFrom` and populate them
    const sharedPosts = posts.filter(post => post.sharedFrom);

    if (sharedPosts.length > 0) {
      posts = await Post.populate(posts, {
        path: "sharedFrom",
        populate: { path: "authorId", select: "-password -refreshToken" }, // Original post's author
      });
    }

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};


// exports.fetchAllPosts = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Find posts where the authorId is the user, but exclude posts with a pageId (user's page posts)
//     const posts = await Post.find({ authorId: userId, pageId: null })
//       .populate({
//         path: "reactions",
//         populate: { path: "userId", select: "-password -refreshToken" }, // Exclude password only
//       })
//       .populate({
//         path: "authorId", // Populate the authorId field
//         select: "-password -refreshToken", // Exclude sensitive fields
//       })
//       .sort({ createdAt: -1 }); // Sort by newest first

//     res.status(200).json({ posts });
//   } catch (error) {
//     console.error("Error fetching user posts:", error);
//     res.status(500).json({ message: "Failed to fetch posts" });
//   }
// };


exports.fetchNewsFeed = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("newsFeed")
      .populate({
        path: "newsFeed",
        model: "Post",
        populate: [
          {
            path: "authorId", // Who created the post (or shared it)
            model: "User",
            select: "name profilePicture",
          },
          {
            path: "reactions",
            model: "Reaction",
            populate: {
              path: "userId",
              model: "User",
              select: "name profilePicture",
            },
          },
          {
            path: "sharedFrom", // If it's a shared post, get the original post
            model: "Post",
            populate: {
              path: "authorId", // Original author of the shared post
              model: "User",
              select: "name profilePicture",
            },
          },
        ],
        options: { sort: { createdAt: -1 } }, // Sort by newest first
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.newsFeed);
  } catch (error) {
    console.error("Error fetching news feed:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};


// exports.fetchNewsFeed = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await User.findById(userId)
//       .select("newsFeed")
//       .populate({
//         path: "newsFeed",
//         model: "Post",

//         populate: [
//           {
//             path: "authorId",
//             model: "User",
//             select: "name profilePicture",
//           },
//           {
//             path: "reactions",
//             model: "Reaction",

//             populate: {
//               path: "userId",
//               model: "User",
//               select: "name profilePicture",
//             },
//           },
//         ],
//         options: { sort: { createdAt: -1 } },
//       });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
    

//     return res.status(200).json(user.newsFeed);
//   } catch (error) {
//     console.error("Error fetching user posts:", error);
//     res.status(500).json({ message: "Failed to fetch posts" });
//   }
// };


exports.editPost = async (req, res) => {
  const { postId } = req.params;
  console.log("edit id: ", postId);

  const updatedData = req.body;  // Directly use req.body
  console.log("Updated Data:", updatedData);

  try {
    // Find the post by its ID
    const post = await Post.findById(postId);
    console.log("Post found:", post);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update the fields with the new data
    post.content.texts = updatedData.texts || post.content.texts;
    post.content.videos = updatedData.videos || post.content.videos;
    post.content.images = updatedData.images || post.content.images;
    post.isProfile = updatedData.isProfile !== undefined ? updatedData.isProfile : post.isProfile;
    post.isCover = updatedData.isCover !== undefined ? updatedData.isCover : post.isCover;

    // Log the updated post object before saving
    console.log("Updated Post Object:", post);

    // Save the updated post to the database
    await post.save();

    console.log("Post saved:", post);

    return res.status(200).json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



exports.editPost = async (req, res) => {
  const { postId } = req.params;  // Get the postId from the URL params
  console.log("edit id: ", postId);

  const updatedData = req.body;  // Get updatedData from the request body
  console.log("Updated Data:", updatedData);  // Log the received data

  try {
    // Find the post by its ID
    const post = await Post.findById(postId);
    console.log("Post found:", post);  // Log the post

    if (!post) {
      return res.status(404).json({ message: "Post not found" });  // Return error if post is not found
    }

    // Update the fields with the new data
    post.content.texts = updatedData.texts || post.content.texts;
    post.content.videos = updatedData.videos || post.content.videos;
    post.content.images = updatedData.images || post.content.images;
    post.isProfile = updatedData.isProfile !== undefined ? updatedData.isProfile : post.isProfile;
    post.isCover = updatedData.isCover !== undefined ? updatedData.isCover : post.isCover;

    // Log the updated post object before saving
    console.log("Updated Post Object:", post);

    // Save the updated post to the database
    await post.save();

    // Populate the authorId field to include user details
    const populatedPost = await Post.findById(postId).populate('authorId');

    console.log("Post saved and populated:", populatedPost);  // Log the populated post

    return res.status(200).json(populatedPost);  // Return the populated post
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.sendFriendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;

  console.log(senderId, receiverId);

  try {
    // Find sender and receiver
    const sender = await User.findById(senderId).select("+password"); // Include the password field
    const receiver = await User.findById(receiverId).select("+password"); // Include the password field

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if a friend request has already been sent
    if (sender.friendRequestsSent.includes(receiverId)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    if (sender.friendRequestsReceived.includes(receiverId)) {
      return res
        .status(400)
        .json({
          message: `${receiver.name} has already sent Sent you a friend request`,
        });
    }
    if (receiver.friendRequestsReceived.includes(senderId)) {
      return res
        .status(400)
        .json({
          message: `Friend request already received by ${receiver.name}`,
        });
    }

    // Update sender and receiver
    sender.friendRequestsSent.push(receiverId);
    receiver.friendRequestsReceived.push(senderId);

    console.log("here");
    // Save changes to the database
    await sender.save();
    await receiver.save();

    res
      .status(200)
      .json({ message: "Friend request sent successfully", sender });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.confirmFriendRequest = (io) => async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    console.log("Confirming friend request...");

    // Find both users
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      console.log("One or both users not found:", senderId, receiverId);
      return res.status(404).json({ error: "User not found" });
    }

    // Check if they are already friends
    if (
      sender.friends.includes(receiverId) ||
      receiver.friends.includes(senderId)
    ) {
      return res.status(400).json({ error: "They are already friends" });
    }

    // Remove friend request
    sender.friendRequestsReceived = sender.friendRequestsReceived.filter(
      (_id) => _id.toString() !== receiverId
    );
    receiver.friendRequestsSent = receiver.friendRequestsSent.filter(
      (_id) => _id.toString() !== senderId
    );

    // Add to friends list
    sender.friends.push(receiverId);
    receiver.friends.push(senderId);

    // Save changes
    await sender.save();
    await receiver.save();

    // Create a notification for the **receiver** (who sent the request)
    const notification = new Notification({
      message: `${sender.name} accepted your friend request! 🎉`,
      type: "requestAccepted",
      targetId: senderId, // The one who accepted the request
      receivers: [receiverId], // The requester (receiver) should receive the notification
      senderId: senderId, // The one who accepted the request
    });
    await notification.save();
    await User.findByIdAndUpdate(receiverId, {
      $push: { notifications: notification._id },
    });

    console.log("Notification saved:", notification);

    // Emit real-time notification to the **receiver**
    io.emit(`requestAccepted-${receiverId}`, notification);

    // Send response with the notification and updated user info
    res
      .status(200)
      .json({
        message: "Friend request confirmed",
        notification,
        sender,
        receiver,
      });
  } catch (error) {
    console.error("Error confirming friend request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.fetchAllFriendsById = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`Fetching friends for user: ${userId}`);

    // Find user and populate friends
    const user = await User.findById(userId).populate(
      "friends",
      "name email profilePicture newsFeed"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.getSentRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user and populate the sent friend requests
    const user = await User.findById(userId).populate(
      "friendRequestsSent",
      "name email profilePicture"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the populated list of sent friend requests
    res.status(200).json(user.friendRequestsSent);
  } catch (error) {
    console.error("Error fetching sent friend requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllFriendRequest = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId); // Assuming the user ID is passed as a URL parameter
  // console.log("user ew= ",user)

  try {
    // Find the user by ID and populate the `friendRequestsReceived` field with user details
    const user = await User.findById(userId)
      .populate({
        path: "friendRequestsReceived",
        select: "name profilePicture email", // Select only the fields you need
      })
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the populated friend requests
    const friendRequests = user.friendRequestsReceived;

    res.status(200).json(friendRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteFriendRequest = async (req, res) => {
  try {
    const { requester, rejecter } = req.body; // Get user IDs
    console.log("Requester:", requester);

    if (!requester || !rejecter) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Remove requester from rejecter's received requests
    const rejecterUser = await User.findByIdAndUpdate(
      rejecter,
      { $pull: { friendRequestsReceived: requester } },
      { new: true }
    );

    // Remove rejecter from requester's sent requests
    const requesterUser = await User.findByIdAndUpdate(
      requester,
      { $pull: { friendRequestsSent: rejecter } },
      { new: true }
    );

    if (!rejecterUser || !requesterUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Friend request deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};



exports.searchFriend = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Query parameter is required" });
    }


    console.log("q = ",query);
    // Find users matching the query (case-insensitive)
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },  // Search by name (case-insensitive)
        { email: { $regex: query, $options: "i" } }  // Search by email (case-insensitive)
      ]
    }).select("name email profilePicture"); // Limit the fields returned

    // Return the users if found
    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error.message); // Log the error message
    res.status(500).json({ message: "Internal Server Error", error: error.message }); // Return more detailed error info
  }
};
