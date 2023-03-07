const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        const userSaved = await newUser.save();
        res.status(200).json(newUser);
    } catch (err) {
        res.status(500).json(err);
    }
};

const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json('user not found');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json('wrong password');
        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, ...others } = user._doc;

        res.cookie('accessToken', token, {
            httpOnly: true,
        })
            .status(200)
            .json({ ...others, accessToken: token });
    } catch (err) {
        res.status(500).json(err);
    }
};



module.exports = { register, login };
