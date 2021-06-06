const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    photo: {
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
    specialty: {
        type: String,
        required: false
    },
    cuim: {
        type: String,
        required: false
    },
}, { versionKey: false });


module.exports = mongoose.model('Doctor', doctorSchema); 