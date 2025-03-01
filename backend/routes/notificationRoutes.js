const express = require('express');
const { addNotification, fetchNotificationsById, markAsRead } = require('../controllers/notificationController');
const { authenticateUser } = require('../controllers/authController');
const router = express.Router();

router.post('/addNotification/:userId',addNotification)
      .get('/fetchNotifications/:userId',authenticateUser,fetchNotificationsById)
      .patch('/markRead',authenticateUser,markAsRead)


// router.patch('/markRead/:noteId',authenticateUser,async(req,res)=>{console.log("hey")})
module.exports = router;