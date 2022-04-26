const db = require("../config/db");
const Response = require("../models/response");

class Appointment {
  id;
  doctorId;
  officeId;
  patientId;
  startDate;
  endDate;
  notes;
  isApproved;

  constructor(
    id,
    doctorId,
    officeId,
    patientId,
    startDate,
    endDate,
    notes,
    isApproved
  ) {
    this.id = id;
    this.doctorId = doctorId;
    this.officeId = officeId;
    this.patientId = patientId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.notes = notes;
    this.isApproved = isApproved;
  }

  static async getAllApprovedAppointments(docId, startDate, endDate) {
    try {
      const start =
        new Date(startDate).getFullYear() +
        "-" +
        (new Date(startDate).getMonth() + 1) +
        "-" +
        new Date(startDate).getDate();
      // .toISOString().split('T')[0] + ' ' + new Date(startDate).toISOString().split('T')[1].split('.')[0];
      const end =
        new Date(endDate).getFullYear() +
        "-" +
        (new Date(endDate).getMonth() + 1) +
        "-" +
        new Date(endDate).getDate();
      // .toISOString().split('T')[0] + ' ' +new Date(endDate).toISOString().split('T')[1].split('.')[0];
      // end+= (' ' + end.split('.')[0]);
      console.log(start, " ", end);
      const GET_APPOINTMENTS_SQL = `SELECT u.firstName, u.lastName, u.photo, u.phone, a.doctorId, a.officeId, a.patientId, a.startDate, a.endDate, a.notes, a.id FROM appointments a JOIN users u ON a.patientId = u.id WHERE a.doctorId=${docId} AND ((a.startDate BETWEEN DATE_FORMAT('${start}', "%Y-%m-%d %H:%i:%s") AND DATE_FORMAT('${end}', "%Y-%m-%d %H:%i:%s")) OR (a.endDate BETWEEN DATE_FORMAT('${start}', "%Y-%m-%d %H:%i:%s") AND DATE_FORMAT('${end}', "%Y-%m-%d %H:%i:%s"))) AND isApproved=1`;
      const appointments = await db.execute(GET_APPOINTMENTS_SQL);
      let res = appointments && appointments[0] ? appointments[0] : [];
      if (res.length > 0) {
        res = res.map(function (element) {
          return {
            id: element.id,
            docId: element.doctorId,
            officeId: element.officeId,
            startDate: element.startDate,
            endDate: element.endDate,
            notes: element.notes,
            patient: {
              id: element.patientId,
              firstName: element.firstName,
              lastName: element.lastName,
              photo: element.photo,
              phone: element.phone,
            },
          };
        });
        console.log(res);
      }
      return new Response(200, true, res).getResponse();
    } catch (err) {
      console.error(err);
      return new Response(500, false, err).getResponse();
    }
  }

  static async save(data) {
    try {
      if (
        new Date(data.startDate).getTime() > new Date(data.endDate).getTime()
      ) {
        return new Response(
          404,
          false,
          "End date should be grater than start date."
        ).getResponse();
      }
      const GET_APPOINTMENTS_SQL = `SELECT * FROM appointments WHERE (startDate >= '${data.startDate}' AND startDate < '${data.endDate}') OR (endDate > '${data.startDate}' AND endDate <= '${data.endDate}') OR (startDate <= '${data.startDate}' AND '${data.endDate}' <= endDate)`;
      console.log("save appointment = ", data);
      console.log(GET_APPOINTMENTS_SQL);
      const appointments = await db.execute(GET_APPOINTMENTS_SQL);
      console.log("appointment get resp = ", appointments[0][0]);
      console.log(
        "EXIST = ",
        !!appointments && !!appointments[0] && !!appointments[0][0]
      );
      if (!!appointments && !!appointments[0] && !!appointments[0][0]) {
        return new Response(409, false, "Overlay conflict.").getResponse();
      } else {
        let table_data = {
          doctorId: data.doctorId,
          officeId: data.officeId,
          patientId: data.patientId,
          startDate: data.startDate,
          endDate: data.endDate,
          notes: data.notes,
          isApproved: 1,
        };
        const INSERT_APPOINTMENT_SQL = `INSERT INTO appointments SET doctorId=${data.doctorId}, officeId=${data.officeId}, patientId=${data.patientId}, startDate='${data.startDate}', endDate='${data.endDate}', notes='${data.notes}', isApproved=1`;
        console.log("INSERT APPOINTMENT SQL = ", INSERT_APPOINTMENT_SQL);
        const insertExecution = await db.execute(INSERT_APPOINTMENT_SQL);
        if (!!insertExecution && !!insertExecution[0]) {
          console.log("insert execution = ", insertExecution);
          const get_appointment = `SELECT * FROM appointments WHERE doctorId = ${data.doctorId} AND patientId = ${data.patientId} ORDER BY id DESC LIMIT 1`;
          const appointmment_res = await db.execute(get_appointment);
          if (
            !!appointmment_res &&
            appointmment_res[0] &&
            appointmment_res[0][0]
          ) {
            console.log("appointment res = ", appointmment_res[0][0]);
            const get_patient = `SELECT id,firstName,lastName,email,phone,photo FROM users WHERE id = ${appointmment_res[0][0].patientId}`;
            const patient = await db.execute(get_patient);
            let result = appointmment_res[0][0];
            delete result.patientId;
            if (!!patient && patient[0] && patient[0][0]) {
              result["patient"] = patient[0][0];
              return new Response(201, true, result).getResponse();
            }
            return new Response(404, false, "Patient not found!").getResponse();
          }
        }

        return new Response(
          400,
          false,
          "The appointment could not be created."
        ).getResponse();

        const insertedAppointment = await db.execute(INSERT_APPOINTMENT_SQL);
        console.log(insertedAppointment[0]);
      }
    } catch (err) {
      console.error("EROARE = ", err);
      return new Response(500, false, err).getResponse();
    }
  }
}

module.exports = Appointment;
