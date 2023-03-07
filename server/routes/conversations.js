const router = require('express').Router();

const {
    createConversation,
    getConversations,
    getConversationByTwoUsers,
} = require('../controllers/conversationControllers');

router.post('/', createConversation);
router.get('/:userId', getConversations);
router.get('/find/:firstUserId/:secondUserId', getConversationByTwoUsers);

module.exports = router;
