const db = require('../config/db');
const Response = require('../models/response');

class Appointment {
    id;
    doctorId;
    officeId;
    patientId;
    startDate;
    endDate;
    notes;
    isApproved;

    constructor(id, doctorId, officeId, patientId, startDate, endDate, notes, isApproved) {
        this.id = id;
        this.doctorId = doctorId;
        this.officeId = officeId;
        this.patientId = patientId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.notes = notes;
        this.isApproved = isApproved;    
    }

    static async getAllApprovedAppointments(docId) {
        try {
            const GET_APPOINTMENTS_SQL = `SELECT * FROM appointments WHERE doctorId=${docId} AND isApproved=1`;
            const appointments = await db.execute(GET_APPOINTMENTS_SQL);
            return new Response(200, true, appointments[0]).getResponse();
        } catch(err) {
            console.error(err);
            return new Response(500, false, err).getResponse();
        }
    }
}

module.exports = Appointment;