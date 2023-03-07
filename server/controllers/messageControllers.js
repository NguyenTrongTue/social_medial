const Message = require('../models/Message');

const createMessage = async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getMessage = async (req, res) => {
    try {
        const message = await Message.find({ conversationId: req.params.conversationId });
        res.status(200).json(message);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { getMessage, createMessage };
