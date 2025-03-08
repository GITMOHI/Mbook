const express = require("express");
const {
  getUsers,
  updateUserDetails,
  setProfilePicture,
  postToProfile,
  fetchAllPosts,
  setCoverPicture,
  sendFriendRequest,
  getAllFriendRequest,
  getSentRequests,
  fetchAllFriendsById,
  confirmFriendRequest,
  deleteFriendRequest,
  fetchNewsFeed,
  getUserById,
  editPost,

} = require("../controllers/userController");
const { authenticateUser } = require("../controllers/authController");
const router = express.Router();




router.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});


// Export the function that accepts io
module.exports = (io) => {
  router
    .get("/:userId/sentRequests", getSentRequests)
    .get("/:userId/allFriendRequests", authenticateUser, getAllFriendRequest)
    .get("/:userId/fetchAllFriends", authenticateUser, fetchAllFriendsById)
    .get("/", authenticateUser, getUsers)
    .get("/:id",getUserById)
    .post("/posts/edit/:postId",editPost)
    .get("/posts/:userId", fetchAllPosts)
    .get("/newsFeed/:userId", fetchNewsFeed)
    .post("/confirmFriendRequest", authenticateUser, confirmFriendRequest(io))  // Pass io to confirmFriendRequest
    .post("/sendFriendRequest", authenticateUser, sendFriendRequest)
    .post("/:userId/setProfilePic", authenticateUser, setProfilePicture)
    .post("/:userId/setCoverPic", authenticateUser, setCoverPicture)
    .post("/:userId/postToProfile", authenticateUser, postToProfile(io) )
    .patch("/:userId/details", authenticateUser, updateUserDetails)
    .delete("/deleteFriendRequest",authenticateUser, deleteFriendRequest)
  return router;
};




// module.exports = (io) => {
//   router
//   .get("/:userId/sentRequests", getSentRequests)
//   .get("/:userId/allFriendRequests", authenticateUser, getAllFriendRequest)
//   .get("/:userId/fetchAllFriends", authenticateUser, fetchAllFriendsById)
//   .get("/posts/:userId", fetchAllPosts)
//   .get("/newsFeed/:userId", fetchNewsFeed)
//   .get("/", authenticateUser, getUsers) // Keep above `/:id`
//   .get("/:id", getUserById) // This must be at the end
//   .post("/confirmFriendRequest", authenticateUser, confirmFriendRequest(io))
//   .post("/sendFriendRequest", authenticateUser, sendFriendRequest)
//   .post("/:userId/setProfilePic", authenticateUser, setProfilePicture)
//   .post("/:userId/setCoverPic", authenticateUser, setCoverPicture)
//   .post("/:userId/postToProfile", authenticateUser, postToProfile(io))
//   .patch("/:userId/details", authenticateUser, updateUserDetails)
//   .delete("/deleteFriendRequest", authenticateUser, deleteFriendRequest);


//   return router;
// };
