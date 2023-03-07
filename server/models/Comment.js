const mongoose = require('mongoose');

const Comment = new mongoose.Schema(
    {
        postId: {
            type: String,
        },
        userId: {
            type: String,
        },
        text: {
            type: String,
            max: 500,
        },
        likes: {
            type: Array,
            default: [],
        },
        isEdit: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Comment', Comment);
