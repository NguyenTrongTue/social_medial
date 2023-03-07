const express = require('express');
const app = express();
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');


const routes = require('./routes');
const connectDB = require('./config/connect');

dotenv.config();

app.use('/images', express.static(path.join(__dirname, 'public/images')));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('common'));
app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:3000',
        allowedHeaders: 'X-Requested-With, Content-Type, Authorization',
        methods: 'GET, POST, PATCH, PUT, POST, DELETE, OPTIONS',
    }),
);

routes(app);
connectDB();

app.listen(8800, () => {
    console.log('Backend server is running!');
});
