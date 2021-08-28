const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32,
        unique: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
});

module.exports = User = mongoose.model('Category', CategorySchema)