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


    static async findOneById(id) {
        const GET_DOCTOR_SQL = `SELECT * FROM doctors WHERE id = ${id}`;
        const doctor = await db.execute(GET_DOCTOR_SQL);
        console.log(doctor);
        if(doctor && doctor[0][0]) {
            return new Response(200, true, new Doctor(...doctor[0][0])).getResponse();
        } else {
            return new Response(404, false, "Doctor not found.").getResponse();
        }
    }
}

module.exports = Doctor;