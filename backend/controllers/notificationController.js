const User = require("../models/User");
const Notification = require("../models/Notification");

// exports.addNotification = async (req, res) => {
//   try {
//     const { userId } = req.params; // Get userId from request params
//     const { senderId, type, message, targetId } = req.body; // Extract notification details

//     console.log(`Adding notification for user: ${userId}`, req.body);
//     console.log(senderId, message,type,targetId);
//     // Validate required fields
//     if (!senderId || !type || !message) {
//       return res.status(400).json({ error: "Missing required fields." });
//     }

//     // Create a new notification
//     const newNotification = new Notification({
//       sender: senderId,
//       receiver: userId, // Receiver ID
//       type,
//       message,
//       targetId,
//     });

//     console.log("New notification:", newNotification);

//     // Save the notification in the database
//     await newNotification.save();

//     // Add the notification reference to the user's notifications array
//     await User.findByIdAndUpdate(userId, {
//       $push: { notifications: newNotification._id },
//     });

//     res.status(201).json(newNotification);
//   } catch (error) {
//     console.error("Error adding notification:", error);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };


// In your addNotification controller:
exports.addNotification = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request params (receiver)
    const { senderId, type, message, targetId } = req.body; // Extract notification details

    console.log(`✅ Received in API:`, { userId, senderId, type, message, targetId });

    if (!senderId || !type || !message) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Create a new notification
    const newNotification = new Notification({
      senderId,            // Ensure the senderId is correctly saved here
      receiver: userId,    // Receiver is extracted from URL
      type,
      message,
      targetId,
      receivers: [userId]  // This should also include the userId as the receiver
    });

    // Log the new notification object before saving
    console.log("✅ Saving notification:", newNotification);

    // Save the notification in the database
    await newNotification.save();
    console.log("✅ Saved notification:", newNotification);

    // Add the notification reference to the user's notifications array
    await User.findByIdAndUpdate(userId, {
      $push: { notifications: newNotification._id },
    });

    res.status(201).json(newNotification);
  } catch (error) {
    console.error("❌ Error adding notification:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};



exports.fetchNotificationsById = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request parameters

    console.log(`Fetching notifications for user: ${userId}`);

    // Find the user and populate the notifications
    const user = await User.findById(userId).populate({
      path: "notifications",
      populate: { path: "senderId", select: "name email profilePicture" }, // Populate senderId within notifications
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Send the populated notifications
    res.status(200).json(user.notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};




exports.markAsRead = async (req, res) => {
  try {
    console.log("hereeeeeeeeeeeeeee")
    const { notificationId } = req.body; // Get the notification ID from the request params
     console.log("id == " + notificationId)
    // Find the notification by ID and update its 'read' status
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true } // Return the updated document
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(updatedNotification); // Send back the updated notification
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};