const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');

const createPost = async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
};

const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json('the post has been updated');
        } else {
            res.status(403).json('you can update only your post');
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json('the post has been deleted');
        } else {
            res.status(403).json('you can delete only your post');
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const likeandDislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const check = post.likes.some((like) => like.userId === req.body.userId);
        if (!check) {
            await post.updateOne({
                $push: {
                    likes: { userId: req.body.userId, action: req.body.action },
                },
            });
            res.status(200).json('The post has been liked');
        } else {
            await post.updateOne({
                $pull: {
                    likes: {
                        userId: req.body.userId,
                    },
                },
            });
            res.status(200).json('The post has been disliked');
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
const changeReact = async (req, res) => {
    try {
        const updatePost = await Post.updateOne(
            { _id: req.params.id, 'likes.userId': req.body.userId },
            {
                $set: { 'likes.$.action': req.body.action },
            },
            { new: true },
        );
        res.status(200).json(updatePost);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTilinePosts = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            }),
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAllPostOfUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    createPost,
    updatePost,
    deletePost,
    likeandDislikePost,
    changeReact,
    getPost,
    getTilinePosts,
    getAllPostOfUser,
};
