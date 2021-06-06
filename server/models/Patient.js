const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    reports: {
        type: Number,
        required: true
    }
}, { versionKey: false });


module.exports = mongoose.model('Patient', patientSchema); 