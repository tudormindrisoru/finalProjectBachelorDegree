const mongoose = require('mongoose');

const affiliationSchema = new mongoose.Schema({
    officeID: {
        type: String,
        required: true
    },
    doctorID: {
        type: String,
        required: true,
    }
},{ versionKey: false });


module.exports = mongoose.model('Affiliation', affiliationSchema); 