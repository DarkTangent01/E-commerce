const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true // Unique email
    },
    
    password: {
        type: String,
        required: true
    },

    avatar: {
        type: String
    },

    role: { // Role for user it will be (Normal or Admin)
        type: Number,
        default: 0
    },

    history: { // order history 
        type: Array,
        default: []
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
});

module.exports = User = mongoose.model('User', UserSchema);