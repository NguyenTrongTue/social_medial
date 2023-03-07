const createError = require('../middlewares/createError');
const Comment = require('../models/Comment');

const createComment = async (req, res) => {
    try {
        const postId = req.body.postId;
        const userId = req.user.id;
        const newComment = new Comment({ postId, userId, text: req.body.text });
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateComment = async (req, res, next) => {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);

    if (comment.userId === req.user.id) {
        try {
            await comment.updateOne({
                $set: { ...req.body, isEdit: true },
            });
            res.status(200).json('The comment has been updated');
        } catch (err) {
            next(err);
        }
    } else {
        return next(createError(403, 'You are not allowed to update this comment'));
    }
};

const deleteComment = async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId);
    if (comment.userId === req.user.id) {
        try {
            await comment.deleteOne();
            res.status(200).json('The comment has been deleted');
        } catch (err) {
            next(err);
        }
    } else {
        return next(createError(403, 'You are not allowed to delete this comment'));
    }
};

const likeComment = async (req, res, next) => {
    const userId = req.body.userId;
    const comment = await Comment.findById(req.params.commentId);
    try {
        if (!comment.likes.includes(userId)) {
            await comment.updateOne({
                $push: { likes: userId },
            });
            res.status(200).json('The comment has been liked');
        } else {
            await comment.updateOne({
                $pull: { likes: userId },
            });
            res.status(200).json('The comment has been disliked');
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getCommentsByPostId = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const comments = await Comment.find({ postId });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = { createComment, updateComment, deleteComment, likeComment, getCommentsByPostId };
