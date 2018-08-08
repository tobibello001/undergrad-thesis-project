const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: String,
    link: String,
    updated: {
        type: Date,
        index: true
    },
    imageLink: String
});

module.exports = mongoose.model('Post', PostSchema);