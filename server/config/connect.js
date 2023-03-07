const mongoose = require('mongoose');

function connectDB() {
    try {
        mongoose.connect(
            'mongodb+srv://trongnguyen:Tuetn2002@cluster0.7frzaxg.mongodb.net/social_media?retryWrites=true&w=majority',
            { useNewUrlParser: true, useUnifiedTopology: true },
            () => {
                console.log('Connected to MongoDB');
            },
        );
    } catch (err) {
        console.log('Connect failed');
    }
}

module.exports = connectDB;
