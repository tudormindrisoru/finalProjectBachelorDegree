const mongoose = require('mongoose');

const officeSchema = new mongoose.Schema({
    ownerID: {
        type: String,
        required: true
    },
    longitude: {
        type: Number,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    }
}, { versionKey: false });


module.exports = mongoose.model('Office', officeSchema); 