const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        max: 256,
        required: true
    },
    isActivated: {
        type: Boolean,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    birthDate: {
        type: Date,
        required: false
    },
    speicalty: {
        type: String,
        required: false
    },
    cuim: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('Doctor', userSchema); 