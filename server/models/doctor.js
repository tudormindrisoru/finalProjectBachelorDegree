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
        try {
            const GET_DOCTOR_SQL = `SELECT * FROM doctors WHERE id = (SELECT docId FROM users WHERE id=${id});`;
            const doctor = await db. execute(GET_DOCTOR_SQL);
            if(doctor && doctor[0][0]) {
                const { id, cuim, specialty, officeId } = doctor[0][0];
                return new Response(200, true, { "id": id, "cuim": cuim, "specialty":  specialty,"officeId":officeId}).getResponse();
            } else {
                return new Response(404, false, "Doctor not found.").getResponse();
            }
        } catch(err) {
            console.error(err);
            return new Response(500, false, err).getResponse();
        }
    }

    static async findAllWithoutAffiliation(name) {
        try {
            const GET_DOCTORS_SQL = `SELECT u.firstName, u.lastName, u.photo, u.phone, d.id, d.specialty FROM users u JOIN doctors d ON u.docId = d.id WHERE (u.firstName LIKE '${name}%' OR u.lastName LIKE '${name}%') AND d.officeId IS NULL;`;
            const doctors = await db.execute(GET_DOCTORS_SQL);
            let list = [];
            if(!!doctors[0] && doctors[0].length > 0) {
                console.log(doctors[0]);
                doctors[0].forEach(element => {
                  list.push({
                    'id': element.id,
                    'specialty': element.specialty,
                    'user': {
                      'firstName': element.firstName,
                      'lastName': element.lastName,
                      'photo': element.photo,
                      'phone': element.phone
                    }
                  })
                });
            }
            return new Response(200, true, list).getResponse();
        } catch(err) {
            console.error(err);
            return new Response(500, false, err).getResponse();
        }
    }

}

module.exports = Doctor;