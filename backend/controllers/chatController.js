const { default: mongoose } = require("mongoose");
const Chat = require("../models/Chat");

exports.getChatListFunc = async (req, res) => {
  const { userId } = req.params;

  // console.log("userIdkkkk ==",userId);

  // Validate required fields
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    // Find all chats where the user is a participant
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name profilePicture") // Populate participant details
      .populate("messages.sender", "name profilePicture") // Populate message sender details
      .sort({ updatedAt: -1 }); // Sort by most recent activity

    if (!chats || chats.length === 0) {
      return res.json({ message: "No chats" });
    }

    // console.log();

    res.json({ conversations: chats });
  } catch (error) {
    console.error("Error in getChatList:", error);
    res.status(500).json({ error: "Failed to retrieve chat list" });
  }
};

exports.sendMessageFunc = (io) => async (req, res) => {
  try {
    const { chatId, sender, text, timestamp } = req.body; // Destructure the request body

    // Validate chatId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ error: "Invalid chat ID" });
    }

    // Validate message data
    if (!sender || !text) {
      return res.status(400).json({ error: "Invalid message data" });
    }

    // Find the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Create the message object
    const message = {
      sender,
      text,
      timestamp: timestamp || new Date(), // Use provided timestamp or default to current time
    };

    // Add the message to the chat
    chat.messages.push(message);
    await chat.save();

    const messageData = {
      chatId: chatId, // The chat ID
      message: {
        sender: sender, // The sender's ID
        text: text, // The message text
        timestamp: timestamp || new Date(), // The message timestamp
      },
    };

    // Emit the message in real-time using Socket.io
    io.to(chatId).emit("newMessage", messageData);
    
    // Return success response
    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("Error in sendMessageFunc:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//one-one chat create..
exports.getOrCreate = async (req, res) => {
  const { userId, currentUserId } = req.body;

  try {
    // Check if a chat already exists between the two users
    let chat = await Chat.findOne({
      participants: { $all: [userId, currentUserId] },
      isGroupChat: false,
    });

    // If no chat exists, create a new one
    if (!chat) {
      chat = await Chat.create({
        participants: [userId, currentUserId],
        isGroupChat: false,
        messages: [],
      });
    }

    // Return the chat object
    res.json(chat);
  } catch (error) {
    console.error("Error in getOrCreateChat:", error);
    res.status(500).json({ error: "Failed to fetch or create chat" });
  }
};

exports.getChatMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Validate chatId
    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ error: "Invalid chat ID" });
    }

    // Find the chat by ID
    const chat = await Chat.findById(chatId).select("messages"); // Only fetch the messages field

    // If chat not found, return 404
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    console.log("messeages = ", chat.messages);
    // Return the messages array
    res.json(chat.messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
};
