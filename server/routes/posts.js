const router = require('express').Router();
const fs = require('fs-extra');
const {
    createPost,
    updatePost,
    deletePost,
    likeandDislikePost,
    changeReact,
    getPost,
    getTilinePosts,
    getAllPostOfUser,
} = require('../controllers/postControllers');
const verifyToken = require('../middlewares/verifyToken');
const { uploadPostPhoto, uploadVideoPhoto } = require('../upload/storage');
const dbx = require('../config/dropbox');

//create a post
router.post('/', createPost);

//upload photo
router.post('/upload/image', verifyToken, uploadPostPhoto.single('file'), (req, res) => {
    try {
        return res.status(200).json('File uploded successfully');
    } catch (error) {
        console.error(error);
    }
});

// upload video

router.post('/upload/video', verifyToken, uploadVideoPhoto.single('file'), async (req, res, next) => {
    try {
        return res.status(200).json('File uploded successfully');
    } catch (err) {
        next(err);
    }
});
//update a post
router.put('/:id', updatePost);

//delete a post
router.delete('/:id', deletePost);

//like / dislike a post
router.put('/:id/like', likeandDislikePost);

//chang action type
router.put('/:id/like/change', changeReact);

//get a post
router.get('/:id', getPost);

//get timeline posts
router.get('/timeline/:userId', getTilinePosts);

//get user's all posts
router.get('/profile/:username', getAllPostOfUser);

module.exports = router;
