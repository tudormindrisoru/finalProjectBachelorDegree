const db = require('../config/db');
const Response = require('../models/response');

class Doctor {
     _id;
    _cuim;
    _specialty;
    _officeId;

    constructor(id, cuim, specialty, officeId) {
        [this._id, this._cuim, this._specialty, this._officeId ] = [id, cuim, specialty, officeId];
    }

    async save() {
        const INSERT_DOCTOR_SQL = `INSERT INTO doctors(cuim, specialty) VALUES("${this._cuim}","${this._specialty}")`;
        const doctor = await db.execute(INSERT_DOCTOR_SQL);
        console.log(doctor);
        if(doctor && doctor[0][0]) {
            return new Response(201, true, new Doctor(...doctor[0][0])).getResponse();
        } else {
            return new Response(404, false, "Doctor not found.").getResponse();
        }
    }

    static async update(id, doctorChanges) {
        const UPDATE_DOCTOR_SQL = `UPDATE doctors SET cuim = '${doctorChanges.cuim}', specialty='${doctorChanges.specialty}' WHERE id=${id};`
        const doctor = await db.execute(UPDATE_DOCTOR_SQL);
        console.log(doctor);
        if(doctor && doctor[0].affectedRows === 1) {
            return new Response(200, true, "Doctor information changed").getResponse();
        }
        return new Response(404, false, "Doctor not found.").getResponse();
    }

    static async findOneByUserId(id) {
        const GET_DOCTOR_SQL = `SELECT * FROM doctors WHERE id = (SELECT docId FROM users WHERE id=${id});`;
        const doctor = await db. execute(GET_DOCTOR_SQL);
        if(doctor && doctor[0][0]) {
            const { id, cuim, specialty, officeId } = doctor[0][0];
            return new Response(200, true, { "id": id, "cuim": cuim, "specialty":  specialty,"officeId":officeId}).getResponse();
        } else {
            return new Response(404, false, "Doctor not found.").getResponse();
        }
    }

}

module.exports = Doctor;