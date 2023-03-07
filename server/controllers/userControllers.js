const User = require('../models/User');
const Post = require('../models/Post');

const bcrypt = require('bcrypt');

const updateAccount = async (req, res) => {
    if (req.user.id === req.params.id) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json('Account has been updated');
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json('You can update only your account!');
    }
};

const deleteAccount = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json('Account has been deleted');
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json('You can delete only your account!');
    }
};

const getAccount = async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId ? await User.findById(userId) : await User.findOne({ username: username });
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map((friendId) => {
                return User.findById(friendId);
            }),
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, avatar } = friend;
            friendList.push({ _id, username, avatar });
        });
        res.status(200).json(friendList);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getMutuals = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const otherUser = await User.findById(req.params.userId);
        const mutuals = currentUser.followings.filter((friendId) => otherUser.followings.includes(friendId));
        const mutualList = await Promise.all(
            mutuals.map((mutual) => {
                return User.findById(mutual);
            }),
        );

        const result = [];
        mutualList.map((user) => {
            const { _id, username, avatar } = user;
            result.push({ _id, username, avatar });
        });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

const getPhotos = async (req, res, next) => {
    try {
        var { avatar, coverPicture } = await User.findById(req.params.userId);
        avatar = 'person/' + avatar;
        coverPicture = 'person/' + coverPicture;

        const posts = await Post.find({ userId: req.params.userId });
        const postImgs = posts.map((post) => {
            return `post/${post.img}`;
        });
        res.status(200).json([...postImgs, avatar, coverPicture]);
    } catch (err) {
        next(err);
    }
};

const follow = async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json('user has been followed');
            } else {
                res.status(403).json('you allready follow this user');
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json('you cant follow yourself');
    }
};
const unfollow = async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json('user has been unfollowed');
            } else {
                res.status(403).json('you dont follow this user');
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json('you cant unfollow yourself');
    }
};
module.exports = { updateAccount, deleteAccount, getAccount, getFriends, getMutuals, follow, unfollow, getPhotos };
