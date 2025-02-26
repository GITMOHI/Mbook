const express = require('express');
const { addNotification, fetchNotificationsById } = require('../controllers/notificationController');
const router = express.Router();

router.post('/addNotification/:userId',addNotification)
      .get('/fetchNotifications/:userId',fetchNotificationsById)



module.exports = router;