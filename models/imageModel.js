const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    hairstyle: String,
    color: String, // Define color as an array of strings
    imageUrl: String,
    category: String,
});

module.exports = mongoose.model('Image', imageSchema);