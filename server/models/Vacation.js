const mongoose = require('mongoose');

const vacationIntervalSchema = new mongoose.Schema({
    doctorID: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    }
}, { versionKey: false });


module.exports = mongoose.model('VacationInterval', vacationIntervalSchema); 