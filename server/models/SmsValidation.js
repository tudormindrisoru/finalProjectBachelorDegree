const mongoose = require('mongoose');

const smsValidationSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    deleteDate: {
        type: Date,
        required: true,
    }
}, { versionKey: false });


module.exports = mongoose.model('SmsValidation', smsValidationSchema); 