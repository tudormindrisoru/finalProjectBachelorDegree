const db = require("../config/db");
const Response = require("../models/response");
const { encrypt, decrypt } = require("../utils");
class Doctor {
  _id;
  _cuim;
  _specialty;
  _officeId;

  constructor(id, cuim, specialty, officeId) {
    [this._id, this._cuim, this._specialty, this._officeId] = [
      id,
      cuim,
      specialty,
      officeId,
    ];
  }

  static async save(userId, specialty, cuim) {
    try {
      const GET_USER_SQL = `SELECT docId FROM users WHERE id =${userId}`;
      const user = await db.execute(GET_USER_SQL);
      if (!!user && !!user[0] && !!user[0][0].docId) {
        return new Response(
          404,
          false,
          "Ai deja datele doctorului completate"
        ).getResponse();
      }
      console.log("cuim , specialty", cuim, specialty);
      const INSERT_DOCTOR_SQL = `INSERT INTO doctors(cuim, specialty) VALUES("${cuim}","${specialty}")`;
      const doctor = await db.execute(INSERT_DOCTOR_SQL);
      console.log(doctor);
      if (!!doctor && !!doctor[0] && doctor[0].affectedRows === 1) {
        console.log("IN IF");
        const UPDATE_USER_SQL = `UPDATE users SET docId = ${doctor[0].insertId} WHERE id = ${userId}`;
        const updateRes = await db.execute(UPDATE_USER_SQL);
        if (!!updateRes && !!updateRes[0] && updateRes[0].affectedRows === 1) {
          const GET_DOCTOR = `SELECT * FROM doctors WHERE id = ${doctor[0].insertId}`;
          const result = await db.execute(GET_DOCTOR);
          if (!!result && result[0] && result[0][0]) {
            return new Response(201, true, result[0][0]).getResponse();
          }
        }
      }
      return new Response(
        404,
        false,
        "Doctorul nu a putut fi adaugat."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server!").getResponse();
    }
  }

  static async update(id, doctorChanges) {
    try {
      const UPDATE_DOCTOR_SQL = `UPDATE doctors SET cuim = '${doctorChanges.cuim}', specialty='${doctorChanges.specialty}' WHERE id=${id};`;
      const doctor = await db.execute(UPDATE_DOCTOR_SQL);
      console.log(doctor);
      if (doctor && doctor[0].affectedRows === 1) {
        return new Response(
          200,
          true,
          "Doctor information changed"
        ).getResponse();
      }
      return new Response(
        404,
        false,
        "Doctorul nu a fost gasit."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Erorare de server!").getResponse();
    }
  }

  static async findOneByUserId(id) {
    try {
      const GET_DOCTOR_SQL = `SELECT * FROM doctors WHERE id = (SELECT docId FROM users WHERE id=${id});`;
      const doctor = await db.execute(GET_DOCTOR_SQL);
      if (doctor && doctor[0][0]) {
        const { id, cuim, specialty, officeId } = doctor[0][0];
        return new Response(200, true, {
          id: id,
          cuim: cuim,
          specialty: specialty,
          officeId: officeId,
        }).getResponse();
      }
      return new Response(
        404,
        false,
        "Doctorul nu a fost gasit."
      ).getResponse();
    } catch (err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }

  static async findAllWithoutAffiliation(name) {
    try {
      const GET_DOCTORS_SQL = `SELECT ${decrypt(
        "u.firstName"
      )} as 'firstName' ,${decrypt(
        "u.lastName"
      )} as 'lastName', u.photo,${decrypt(
        "u.phone"
      )} as 'phone', d.id, d.specialty FROM users u JOIN doctors d ON u.docId = d.id WHERE (${decrypt(
        "u.firstName"
      )} LIKE '${name}%' OR ${decrypt(
        "u.firstName"
      )} LIKE '${name}%') AND d.officeId IS NULL;`;
      const doctors = await db.execute(GET_DOCTORS_SQL);
      let res = [];
      if (!!doctors[0] && doctors[0].length > 0) {
        res = doctors[0].map((element) => {
          return {
            id: element.id,
            specialty: element.specialty,
            user: {
              firstName: element.firstName,
              lastName: element.lastName,
              photo: element.photo,
              phone: element.phone,
            },
          };
        });
      }
      return new Response(200, true, res).getResponse();
    } catch (err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }

  static async getPatientHistory(doctorId) {
    //TO DO: update this request to get user form
    try {
      const SQL_GET_PATIENT_HISTORY = `SELECT ${decrypt(
        "u.firstName"
      )} as 'firstName', ${decrypt("u.lastName")} as 'lastName' ,${decrypt(
        "u.phone"
      )} as 'phone', u.photo, ${decrypt(
        "u.email"
      )} as 'email', a.patientId, a.startDate, a.endDate, a.notes FROM users u JOIN appointments a ON a.patientId = u.id WHERE a.doctorId = ${doctorId} ORDER BY a.startDate DESC`;
      const result = await db.execute(SQL_GET_PATIENT_HISTORY);
      if (!!result && !!result[0]) {
        const mappedRes = result[0].map((e) => {
          return {
            startDate: e.startDate,
            endDate: e.endDate,
            notes: e.notes,
            patient: {
              id: e.patientId,
              firstName: e.firstName,
              lastName: e.lastName,
              email: e.email,
              phone: e.phone,
              photo: e.photo,
            },
          };
        });
        return new Response(200, true, mappedRes).getResponse();
      }
      return new Response(
        404,
        false,
        "No paietient history found."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server.").getResponse();
    }
  }

  static async getDoctorReviews(docId) {
    try {
      const GET_SQL = `SELECT r.id, r.points, r.text FROM doctors d JOIN appointments a ON d.id = a.doctorId JOIN reviews r ON r.id = a.reviewId WHERE a.reviewId IS NOT NULL AND d.id = ${docId}`;
      const result = await db.execute(GET_SQL);
      if (!!result) {
        return new Response(200, true, result[0]).getResponse();
      }
      return new Response(
        404,
        false,
        "Recenziile nu au putut fi preluate."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }
}

module.exports = Doctor;
