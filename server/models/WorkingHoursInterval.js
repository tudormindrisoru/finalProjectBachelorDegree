const mongoose = require('mongoose');

const workingHoursIntervalSchema = new mongoose.Schema({
    doctorID: {
        type: String,
        required: true
    },
    dayOfWeek: {
        type: Number,
        required: true,
    },
    start: {
        type: String,
        required: true,
    },
    end: {
        type: String,
        required: true,
    }
}, { versionKey: false });


module.exports = mongoose.model('WorkingHoursInterval', workingHoursIntervalSchema); 