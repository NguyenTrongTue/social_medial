const router = require('express').Router();
const fs = require('fs-extra');
const User = require('../models/User');
const verifyToken = require('../middlewares/verifyToken');
const {
    updateAccount,
    deleteAccount,
    getAccount,
    getFriends,
    follow,
    unfollow,
    getMutuals,
    getPhotos,
} = require('../controllers/userControllers');
const { uploadPhoto } = require('../upload/storage');

//upload photo
router.post(
    '/upload/coverPicture',
    verifyToken,
    async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user.coverPicture) next();
            else {
                const filePath = `public/images/person/${user.coverPicture}`;
                fs.removeSync(filePath);
                next();
            }
        } catch (error) {
            next(error);
        }
    },
    uploadPhoto.single('file'),
    (req, res) => {
        try {
            return res.status(200).json('File uploded successfully');
        } catch (error) {
            console.error(error);
        }
    },
);
//upload photo
router.post(
    '/upload/avatar',
    verifyToken,
    async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user.avatar) next();
            else {
                const filePath = `public/images/person/${user.avatar}`;
                fs.removeSync(filePath);
                next();
            }
        } catch (error) {
            next(error);
        }
    },
    uploadPhoto.single('file'),
    (req, res) => {
        try {
            return res.status(200).json('File uploded successfully');
        } catch (error) {
            console.error(error);
        }
    },
);


//update user
router.put('/:id', verifyToken, updateAccount);

//delete user
router.delete('/:id', deleteAccount);

//get a user
router.get('/', getAccount);

//get friends
router.get('/friends/:userId', getFriends);
// get mutuals
router.get('/mutuals/:userId', verifyToken, getMutuals);
// get photos
router.get('/photos/:userId', getPhotos);

//follow a user

router.put('/:id/follow', follow);

//unfollow a user

router.put('/:id/unfollow', unfollow);

module.exports = router;
