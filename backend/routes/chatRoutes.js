const express = require("express");
const router = express.Router();
const {
  getChat,
  createGroupChat,
  addParticipantToGroup,
  removeParticipantFromGroup,
  deleteChat,
  sendMessageFunc,
  getChatListFunc,
  getOrCreate,
  getChatMessages,
} = require("../controllers/chatController");
const { authenticateUser } = require("../controllers/authController");

module.exports = (io) => {
    router
      .get("/getChatList/:userId",authenticateUser, getChatListFunc)
      .get('/:chatId/messages', getChatMessages)
      .post("/sendOneToOneMessage",sendMessageFunc(io))      // Other routes...
      .post("/getOrCreateChat",getOrCreate)
    return router;
  };