const mongoose = require('mongoose');

const cuimSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    doctorID: {
        type: String,
        required: false
    }
}, { versionKey: false });


module.exports = mongoose.model('CUIM', cuimSchema); 