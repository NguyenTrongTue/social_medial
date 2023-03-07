const userRoute = require('./users');
const authRoute = require('./auth');
const postRoute = require('./posts');
const conversationRoute = require('./conversations');
const messageRoute = require('./messages');
const commentRoute = require('./comments');

const routes = (app) => {
    app.use('/auth', authRoute);
    app.use('/users', userRoute);
    app.use('/posts', postRoute);
    app.use('/messages', messageRoute);
    app.use('/conversations', conversationRoute);
    app.use('/comments', commentRoute);
};

module.exports = routes;
