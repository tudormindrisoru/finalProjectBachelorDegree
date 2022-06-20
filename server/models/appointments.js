const db = require("../config/db");
const Response = require("../models/response");
const Vacation = require("../models/vacation");

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

  static convertDateToString(date) {
    console.log("DATE = ", date);
    const result =
      new Date(date).getFullYear().toString() +
      "-" +
      (new Date(date).getMonth() + 1 < 10
        ? "0" + (new Date(date).getMonth() + 1)
        : new Date(date).getMonth() + 1
      ).toString() +
      "-" +
      (new Date(date).getDate() < 10
        ? "0" + new Date(date).getDate()
        : new Date(date).getDate()
      ).toString();
    console.log("result DATE = ", result);
    return result;
  }

  static convertTimeToString(time) {
    console.log("TIME = ", time);
    const result =
      (Math.floor(time / 60).toString().length < 2
        ? "0" + Math.floor(time / 60)
        : Math.floor(time / 60)) +
      ":" +
      ((time % 60).toString().length < 2 ? "0" + (time % 60) : time % 60);
    console.log("TIME result =", result);
    return result;
  }

  static async getAllApprovedAppointments(docId, startDate, endDate) {
    try {
      const start = Appointment.convertDateToString(startDate);
      // .toISOString().split('T')[0] + ' ' + new Date(startDate).toISOString().split('T')[1].split('.')[0];
      const end = Appointment.convertDateToString(endDate);
      // .toISOString().split('T')[0] + ' ' +new Date(endDate).toISOString().split('T')[1].split('.')[0];
      // end+= (' ' + end.split('.')[0]);
      console.log(start, " ", end);
      const GET_APPOINTMENTS_SQL = `SELECT u.firstName, u.lastName, u.photo, u.phone, a.doctorId, a.officeId, a.patientId, a.startDate, a.endDate, a.notes, a.reason, a.id FROM appointments a JOIN users u ON a.patientId = u.id WHERE a.doctorId=${docId} AND ((a.startDate BETWEEN DATE_FORMAT('${start}', "%Y-%m-%d %H:%i:%s") AND DATE_FORMAT('${end}', "%Y-%m-%d %H:%i:%s")) OR (a.endDate BETWEEN DATE_FORMAT('${start}', "%Y-%m-%d %H:%i:%s") AND DATE_FORMAT('${end}', "%Y-%m-%d %H:%i:%s"))) AND isApproved=1`;
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
            reason: element.reason,
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
      console.log("DATA ", data);
      if (
        new Date(data.startDate).getTime() > new Date(data.endDate).getTime()
      ) {
        return new Response(
          404,
          false,
          "Data de final ar trebui sa fie mai mare decat ceva de inceput."
        ).getResponse();
      }
      const GET_APPOINTMENTS_SQL = `SELECT * FROM appointments WHERE (startDate >= '${data.startDate}' AND startDate < '${data.endDate}') OR (endDate > '${data.startDate}' AND endDate <= '${data.endDate}') OR (startDate <= '${data.startDate}' AND '${data.endDate}' <= endDate)`;
      console.log("save appointment = ", data);
      console.log(GET_APPOINTMENTS_SQL);
      const appointments = await db.execute(GET_APPOINTMENTS_SQL);

      if (!!appointments && !!appointments[0] && !!appointments[0][0]) {
        return new Response(
          409,
          false,
          "Conflict de suprapunere."
        ).getResponse();
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

        const INSERT_APPOINTMENT_SQL = `INSERT INTO appointments (doctorId, officeId, patientId, startDate, endDate, notes, isApproved) VALUES(${data.doctorId},${data.officeId}, ${data.patientId},'${data.startDate}', '${data.endDate}','${data.notes}',1)`;
        console.log("INSERT APPOINTMENsT SQL = ", INSERT_APPOINTMENT_SQL);
        const insertExecution = await db.execute(INSERT_APPOINTMENT_SQL);
        if (!!insertExecution && !!insertExecution[0]) {
          const get_appointment = `SELECT * FROM appointments WHERE doctorId = ${data.doctorId} AND patientId = ${data.patientId} ORDER BY id DESC LIMIT 1`;
          const appointmment_res = await db.execute(get_appointment);
          if (
            !!appointmment_res &&
            appointmment_res[0] &&
            appointmment_res[0][0]
          ) {
            const get_patient = `SELECT id,firstName,lastName,email,phone,photo FROM users WHERE id = ${appointmment_res[0][0].patientId}`;
            const patient = await db.execute(get_patient);
            let result = appointmment_res[0][0];
            delete result.patientId;
            if (!!patient && patient[0] && patient[0][0]) {
              result["patient"] = patient[0][0];
              return new Response(201, true, result).getResponse();
            }
            return new Response(
              404,
              false,
              "Pacientul nu a fost gasit."
            ).getResponse();
          }
        }

        return new Response(
          400,
          false,
          "Programarea nu a putut fi creata."
        ).getResponse();
      }
    } catch (err) {
      console.error("EROARE = ", err);
      return new Response(500, false, err).getResponse();
    }
  }

  static async update(appointment) {
    try {
      if (
        new Date(appointment.startDate).getTime() >
        new Date(appointment.endDate).getTime()
      ) {
        return new Response(
          404,
          false,
          "Data de start trebuie sa fie mai mica decat cea de sfarsit."
        ).getResponse();
      }
      const GET_APPOINTMENTS_SQL = `SELECT * FROM appointments WHERE (startDate >= '${appointment.startDate}' AND startDate < '${appointment.endDate}') OR (endDate > '${appointment.startDate}' AND endDate <= '${appointment.endDate}') OR (startDate <= '${appointment.startDate}' AND '${appointment.endDate}' <= endDate) AND id != ${appointment.id}`;
      console.log("save appointment = ", appointment);
      console.log(GET_APPOINTMENTS_SQL);
      const appointments = await db.execute(GET_APPOINTMENTS_SQL);
      console.log("appointment get resp = ", appointments[0][0]);
      console.log(
        "EXIST = ",
        !!appointments && !!appointments[0] && !!appointments[0][0]
      );
      if (!!appointments && !!appointments[0] && !!appointments[0][0]) {
        return new Response(
          409,
          false,
          "Conflict de suprapunere"
        ).getResponse();
      } else {
        let table_data = {
          doctorId: appointment.doctorId,
          officeId: appointment.officeId,
          patientId: appointment.patientId,
          startDate: appointment.startDate,
          endDate: appointment.endDate,
          notes: appointment.notes,
          isApproved: 1,
        };

        const UPDATE_APPOINTMENT_SQL = `UPDATE appointments SET doctorId=${
          appointment.doctorId
        }, officeId=${
          appointment.officeId
        }, startDate='${this.convertDateToString(
          appointment.startDate
        )} ${new Date(
          appointment.startDate
        ).toLocaleTimeString()}', endDate='${this.convertDateToString(
          appointment.endDate
        )}  ${new Date(appointment.endDate).toLocaleTimeString()}', notes='${
          appointment.notes
        }' WHERE id = ${appointment.id} AND isApproved = 1`;
        console.log("UPDATE APPOINTMENT SQL = ", UPDATE_APPOINTMENT_SQL);
        const updateRes = await db.execute(UPDATE_APPOINTMENT_SQL);
        if (!!updateRes && !!updateRes[0] && updateRes[0].affectedRows === 1) {
          return new Response(
            200,
            true,
            "Programarea a fost modificata"
          ).getResponse();
        }

        return new Response(
          400,
          false,
          "Programarea nu a putut fi modificata."
        ).getResponse();
      }
    } catch (err) {
      console.error("EROARE = ", err);
      return new Response(500, false, err).getResponse();
    }
  }

  static async getAllPendingAppointments(doctorId) {
    try {
      const GET_NOT_APPROVED_APPOINTMENTS_SQL = `SELECT a.id, a.startDate, a.endDate, a.notes, a.isApproved, p.id AS 'patientId' ,p.firstName, p.lastName, p.phone, p.photo FROM appointments a JOIN users p ON a.patientId = p.id WHERE a.isApproved IS NULL AND a.doctorId = ${doctorId}`;
      const result = await db.execute(GET_NOT_APPROVED_APPOINTMENTS_SQL);
      console.log("181 ", result);
      if (!!result && result[0]) {
        const mappedResult = result[0].map((element) => {
          return {
            id: element.id,
            startDate: element.startDate,
            endDate: element.endDate,
            notes: element.notes,
            isApproved: element.isApproved,
            patient: {
              id: element.patientId,
              firstName: element.firstName,
              lastName: element.lastName,
              phone: element.phone,
              photo: element.photo,
            },
          };
        });
        return new Response(200, true, mappedResult).getResponse();
      }
      return new Response(400, false, "Something went wrong").getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Server error").getResponse();
    }
  }

  static async approveAppointment(doctorId, id) {
    try {
      const SQL_APPROVE_APPOINTMENT = `UPDATE appointments SET isApproved = 1 WHERE doctorId = ${doctorId} AND id = ${id}`;
      const update_result = await db.execute(SQL_APPROVE_APPOINTMENT);
      if (!!update_result && update_result[0].affectedRows === 1) {
        return new Response(200, true, "Programare aprobata.").getResponse();
      }
      return new Response(
        400,
        false,
        "Appointment could not be approved."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Server error").getResponse();
    }
  }

  static async approveAppointment(doctorId, id) {
    try {
      const SQL_REJECT_APPOINTMENT = `UPDATE appointments SET isApproved = 1 WHERE doctorId = ${doctorId} AND id = ${id}`;
      const delete_result = await db.execute(SQL_REJECT_APPOINTMENT);
      if (!!delete_result && delete_result[0].affectedRows === 1) {
        return new Response(200, true, "Programare aprobata.").getResponse();
      }
      return new Response(
        400,
        false,
        "Programare nu a putut fi aprobata."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }

  static async rejectAppointment(doctorId, id) {
    try {
      const SQL_REJECT_APPOINTMENT = `UPDATE appointments SET isApproved = 0 WHERE doctorId = ${doctorId} AND id = ${id}`;
      const delete_result = await db.execute(SQL_REJECT_APPOINTMENT);
      if (!!delete_result && delete_result[0].affectedRows === 1) {
        return new Response(200, true, "Programare respinsa.").getResponse();
      }
      return new Response(
        400,
        false,
        "Programarea nu a putut fi respinsa."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }

  static async getPendingAppointmentById(doctorId, appointmentId) {
    try {
      const SQL_GET_PENDING_APPOINTMENT = `SELECT a.id, a.startDate, a.endDate, a.notes, a.isApproved, p.id AS 'patientId' ,p.firstName, p.lastName, p.phone, p.photo FROM appointments a JOIN users p ON a.patientId = p.id WHERE a.isApproved IS NULL AND a.doctorId = ${doctorId} AND a.id = ${appointmentId}`;
      console.log(SQL_GET_PENDING_APPOINTMENT);
      const result = await db.execute(SQL_GET_PENDING_APPOINTMENT);
      if (!!result && !!result[0] && !!result[0][0]) {
        const pendingRequest = {
          id: result[0][0].id,
          startDate: result[0][0].startDate,
          endDate: result[0][0].endDate,
          notes: result[0][0].notes,
          isApproved: result[0][0].isApproved,
          patient: {
            id: result[0][0].patientId,
            firstName: result[0][0].firstName,
            lastName: result[0][0].lastName,
            phone: result[0][0].phone,
            photo: result[0][0].photo,
          },
        };
        return new Response(200, true, pendingRequest).getResponse();
      }
      return new Response(
        400,
        false,
        "Programarea nu a fost gasita."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }

  static async getFreeSlotsByDate(date, doctorId) {
    try {
      const d = Vacation.convertDate(date);
      console.log("DATE = ", date, d);
      const GET_VACATION = `SELECT * FROM vacations WHERE startDate >= '${d}' AND endDate <= '${d}' AND doctorId = ${doctorId}`;
      const vacations = await db.execute(GET_VACATION);
      console.log("VACATIONS = ", vacations[0]);
      if (!!vacations && vacations[0].length > 0) {
        return new Response(
          409,
          false,
          "Doctorul selectat este in vacanta."
        ).getResponse();
      }
      const day = new Date(d).getDay() - 1;
      const GET_SCHEDULE = `SELECT * FROM schedules WHERE weekDay = ${day} AND doctorId = ${doctorId}`;
      const schedule = await db.execute(GET_SCHEDULE);
      console.log("schedule = ", schedule[0]);
      if (!!schedule && schedule[0].length > 0) {
        let doctorSchedule = schedule[0].map((elem) => {
          return {
            startTime: elem.startTime,
            endTime: elem.endTime,
          };
        });
        const GET_APPOINTMENTS_SQL = `SELECT startDate, endDate FROM appointments WHERE startDate > CURDATE() AND doctorId =${doctorId} AND isApproved !=0`;
        const appointments = await db.execute(GET_APPOINTMENTS_SQL);
        console.log("appointmnets = ", appointments[0]);
        let options = [];
        doctorSchedule.forEach((elem) => {
          let { startTime, endTime } = elem;
          while (startTime + 15 <= endTime) {
            options.push({ startTime, endTime: startTime + 15 });
            startTime += 15;
          }
        });

        if (!!appointments && appointments[0].length > 0) {
          appointments[0].forEach((elem) => {
            if (Vacation.convertDate(elem.startDate) === d) {
              const hours = {
                start: new Date(elem.startDate).getHours(),
                end: new Date(elem.endDate).getHours(),
              };
              const minutes = {
                start: new Date(elem.startDate).getMinutes(),
                end: new Date(elem.endDate).getMinutes(),
              };
              const start = hours.start * 60 + minutes.start;
              const end = hours.end * 60 + minutes.end;
              options = options.filter(
                (elem) => elem.endTime <= start || elem.startTime >= end
              );
            }
          });
        }
        return new Response(200, true, options).getResponse();
      }
      return new Response(200, true, []).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, error).getResponse();
    }
  }

  static async createAppointmentRequest(patientId, data) {
    try {
      console.log("data = ", data);
      let startD = new Date(data.date);
      let endD = new Date(data.date);
      startD = new Date(startD).setHours(Math.floor(data.startTime / 60));
      startD = new Date(startD).setMinutes(data.startTime % 60);
      endD = new Date(endD).setHours(Math.floor(data.endTime / 60));
      endD = new Date(endD).setMinutes(data.endTime % 60);
      const start =
        Appointment.convertDateToString(startD) +
        " " +
        Appointment.convertTimeToString(data.startTime);
      const end =
        Appointment.convertDateToString(endD) +
        " " +
        Appointment.convertTimeToString(data.endTime);
      console.log(start, end);
      const GET_APPOINTMENTS_SQL = `SELECT * FROM appointments WHERE (startDate >= '${start}' AND startDate < '${end}') OR (endDate > '${start}' AND endDate <= '${end}') OR (startDate <= '${start}' AND '${end}' <= endDate)`;
      const appointments = await db.execute(GET_APPOINTMENTS_SQL);
      if (!!appointments && appointments[0].length > 0) {
        return new Response(
          409,
          false,
          "Intervalul programarii se suprapune cu alt interval."
        ).getResponse();
      }

      const INSERT_APPOINTMENT_SQL = `INSERT INTO appointments(doctorId, officeId, patientId, startDate, endDate, reason) VALUES(${data.doctorId},${data.officeId},${patientId}, '${start}', '${end}','${data.reason}')`;
      const result = await db.execute(INSERT_APPOINTMENT_SQL);
      if (!!result && result[0].affectedRows === 1) {
        const GET_ID = `SELECT id FROM appointments WHERE startDate ='${start}' AND endDate = '${end}' AND doctorId = ${data.doctorId} AND patientId = ${patientId}`;
        const result = await db.execute(GET_ID);
        if (!!result && result[0][0]) {
          return new Response(200, true, {
            result: "Solicitare creata.",
            id: result[0][0].id,
          }).getResponse();
        }
        // return new Response(200, true, "Solicitare creata.").getResponse();
      }
      return new Response(
        400,
        false,
        "Solicitarea nu a putut fi inregistrata."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, error).getResponse();
    }
  }

  static async addReviewToAnAppointment(review) {
    try {
      const VERIFY_EXISTANCE_SQL = `SELECT reviewId FROM appointments WHERE id = ${review.appointmentId}`;
      const verify = await db.execute(VERIFY_EXISTANCE_SQL);

      if (!!verify && !!verify[0] && verify[0][0].reviewId !== null) {
        return new Response(
          409,
          false,
          "Aceasta programare are deja o recenzie."
        ).getResponse();
      }

      const INSERT_SQL = `INSERT INTO reviews(text, points) VALUES('${review.text}','${review.points}');`;
      const result = await db.execute(INSERT_SQL);

      if (!!result && !!result[0] && result[0].affectedRows === 1) {
        const UPDATE_APPOINTMENT_REVIEW_FIELD = `UPDATE appointments SET reviewId = ${result[0].insertId} WHERE id = ${review.appointmentId}`;
        const update = await db.execute(UPDATE_APPOINTMENT_REVIEW_FIELD);
        if (!!update && !!update[0] && !!update[0].affectedRows === 1) {
          return new Response(
            200,
            true,
            "Recenzia a fost adaugata"
          ).getResponse();
        }
      }
      return new Response(
        400,
        false,
        "Recenzia nu a putut fi adaugata"
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }

  static async getLastFiveApprovedAppointmentsByPatientId(patientId) {
    try {
      const GET_SQL = `SELECT a.id, a.doctorId, u.firstName, u.lastName, d.specialty, a.startDate, a.endDate, a.reason, a.reviewId FROM appointments a JOIN doctors d ON a.doctorId = d.id JOIN users u ON u.docId = d.id WHERE d.id = a.doctorId AND a.patientId = ${patientId} AND CURRENT_TIMESTAMP() > a.endDate AND a.isApproved = 1 ORDER BY id DESC LIMIT 5`;
      console.log(GET_SQL);
      const result = await db.execute(GET_SQL);
      if (!!result && !!result[0]) {
        return new Response(200, true, result[0]).getResponse();
      }
      return new Response(
        404,
        false,
        "Datele nu au putut fi preluate"
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, error).getResponse();
    }
  }

  static async getRatingsById(ids) {
    try {
      console.log("ids = ", ids);
      const GET_RATINGS = `SELECT id, points FROM reviews WHERE id IN(${ids})`;
      const result = await db.execute(GET_RATINGS);
      console.log("ratings=", result[0]);
      if (!!result && !!result[0]) {
        return new Response(200, true, result[0]).getResponse();
      }
      return new Response(
        404,
        false,
        "Ratingurile nu au putut fi obtinute"
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }

  static async setRating(appointmentId, points) {
    try {
      const SET_RATING = `INSERT INTO reviews(points) VALUES(${points})`;
      const ratingResult = await db.execute(SET_RATING);
      console.log("app id", appointmentId);
      if (!!ratingResult && ratingResult[0].affectedRows === 1) {
        const UPDATE_APPOINTMENT = `UPDATE appointments SET reviewId = ${ratingResult[0].insertId} WHERE id = ${appointmentId}`;
        const updateAppointmentResult = await db.execute(UPDATE_APPOINTMENT);
        if (
          !!updateAppointmentResult &&
          updateAppointmentResult[0].affectedRows === 1
        ) {
          return new Response(
            200,
            true,
            "Ratingul a fost trimis"
          ).getResponse();
        }
      }
      return new Response(
        400,
        false,
        "Nu s-a putut procesa cererea adaugare a ratingului."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }
}

module.exports = Appointment;
