const multer = require('multer');

const bgPhotoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/person');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const postPhotoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/post');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/video');
    },
    filename: function (req, file, cb) {
        cb(null, req.body.name);
    },
});

const uploadPhoto = multer({ storage: bgPhotoStorage });
const uploadPostPhoto = multer({ storage: postPhotoStorage });
const uploadVideoPhoto = multer({ storage: videoStorage });

module.exports = { uploadPhoto, uploadPostPhoto, uploadVideoPhoto };
