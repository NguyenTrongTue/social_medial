const router = require('express').Router();
const {
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    getCommentsByPostId,
} = require('../controllers/commentControllers');
const verifyToken = require('../middlewares/verifyToken');

router.post('/', verifyToken, createComment);
router.put('/update/:commentId', verifyToken, updateComment);
router.delete('/delete/:commentId', verifyToken, deleteComment);
router.put('/:commentId/like', likeComment);
router.get('/:postId', getCommentsByPostId);

module.exports = router;
