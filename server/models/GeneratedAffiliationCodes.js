const mongoose = require('mongoose');

const generatedAffiliationCodeSchema = new mongoose.Schema({
    officeID: {
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


module.exports = mongoose.model('GeneratedAffiliationCode', generatedAffiliationCodeSchema); 