const mongoose = require('mongoose');

const Conversation = new mongoose.Schema(
    {
        members: {
            type: Array,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Conversation', Conversation);
