const router = require('express').Router();

const {createMessage, getMessage} = require('../controllers/messageControllers');

router.post('/', createMessage);
router.get('/:conversationId', getMessage);

module.exports = router;
