const express = require('express');
const { authenticateUser } = require('../controllers/authController');
const { updateReaction, getComments, addComment, addReply } = require('../controllers/postController');
const router = express.Router();

// router.get('/comments/:postId',getComments)
//       .post('/:postId/react',authenticateUser,updateReaction)
//       .post('/comments/addComment',authenticateUser,addComment)
//       .post('/comments/addReply',authenticateUser,addReply)



module.exports = (io) => {
      router.get('/comments/:postId',getComments)
      .post('/:postId/react',authenticateUser,updateReaction)
      .post('/comments/addComment',authenticateUser,addComment(io))
      .post('/comments/addReply',authenticateUser,addReply(io))

  return router;
};
