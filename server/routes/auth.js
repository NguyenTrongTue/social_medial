const router = require('express').Router();
const User = require('../models/User');
const { register, login } = require('../controllers/authControllers');
const verifyToken = require('../middlewares/verifyToken');

//REGISTER
router.post('/register', register);

//LOGIN
router.post('/login', login);

module.exports = router;
