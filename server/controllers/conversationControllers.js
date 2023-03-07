const User = require('../models/User');
const Conversation = require('../models/Conversation');

const createConversation = async (req, res) => {
    try {
        const newConversation = new Conversation({
            members: [req.body.senderId, req.body.receiverId],
        });
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
};
const getConversations = async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
};
const getConversationByTwoUsers = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] },
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = { createConversation, getConversations, getConversationByTwoUsers };
