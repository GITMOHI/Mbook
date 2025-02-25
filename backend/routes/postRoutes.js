const express = require('express');
const { authenticateUser } = require('../controllers/authController');
const { updateReaction } = require('../controllers/postController');
const router = express.Router();

router.post('/:postId/react',authenticateUser,updateReaction)



module.exports = router;