const jwt = require('jsonwebtoken');
const createErorr = require('./createError');

const verifyToken = (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) return next(createErorr(401, 'Unauthorized'));

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createErorr(403, 'Token is not valid'));
        req.user = user;
        next();
    });
};
module.exports = verifyToken;                                                                               
