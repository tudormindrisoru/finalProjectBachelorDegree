const db = require("../config/db");
const Response = require("../models/response");

class Vacation {
  id;
  startDate;
  endDate;
  doctorId;

  constructor(id, startDate, endDate, doctorId = null) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.doctorId = doctorId;
  }

  static convertDate(date) {
    const day = new Date(date).getDate();
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();
    return `${year}-${month}-${day}`;
  }

  static async getAllVacations(doctorId) {
    try {
      const SQL_GET = `SELECT id, startDate, endDate FROM vacations WHERE doctorId = ${doctorId} AND endDate > CURDATE() `;
      const result = await db.execute(SQL_GET);
      if (!!result && !!result[0]) {
        return new Response(200, true, result[0]).getResponse();
      }
      return new Response(404, false, "Eroare").getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }

  static async getVacationsByDoctorId(doctorId) {
    try {
      const SQL_GET = `SELECT id, startDate, endDate FROM vacations WHERE doctorId = ${doctorId} AND endDate > CURDATE()`;
      const vacations = await db.execute(SQL_GET);
      if (!!vacations && vacations[0]) {
        return new Response(200, true, vacations[0]).getResponse();
      }
      return new Response(
        404,
        false,
        new Response("Vacante inexistente").getResponse()
      );
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }

  static async create(vacation, doctorId) {
    try {
      const vacations = await Vacation.getAllVacations(doctorId);
      let { startDate, endDate } = vacation;
      startDate = Vacation.convertDate(startDate);
      endDate = Vacation.convertDate(endDate);
      if (vacations.message.length > 0) {
        const overlap = vacations.message.find(
          (v) =>
            (new Date(v.startDate).getDate() > new Date(startDate).getDate() &&
              new Date(v.endDate).getDate() < new Date(endDate).getDate()) ||
            (new Date(v.startDate).getDate() <= new Date(startDate).getDate() &&
              new Date(v.endDate).getDate() >= new Date(endDate).getDate()) ||
            (new Date(v.startDate).getDate() <= new Date(startDate).getDate() &&
              new Date(v.endDate).getDate() > new Date(startDate).getDate() &&
              new Date(v.endDate).getDate() < new Date(endDate).getDate())
        );
        console.log("overlap = ", overlap);
        if (overlap) {
          return new Response(
            400,
            false,
            "Suprapunere intre intervale"
          ).getResponse();
        }
      }
      const SQL_INSERT = `INSERT INTO vacations(startDate, endDate, doctorId) VALUES('${startDate}', '${endDate}', ${doctorId})`;
      const insertResult = await db.execute(SQL_INSERT);
      if (!!insertResult && insertResult[0].affectedRows === 1) {
        const GET_SQL = `SELECT id, startDate, endDate FROM vacations WHERE startDate = '${startDate}' AND endDate = '${endDate}' AND doctorId =${doctorId}`;
        const getResult = await db.execute(GET_SQL);
        if (!!getResult && getResult[0][0]) {
          return new Response(200, true, getResult[0][0]).getResponse();
        }
      }
      return new Response(
        404,
        false,
        "Intervalul nu a putut fi adaugat."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }

  static async update(vacation, doctorId, vacationId) {
    try {
      const vacations = await Vacation.getAllVacations(doctorId);
      vacations.message = vacations.message.filter((v) => v.id !== vacationId);
      console.log("----- WDB VACATIONS = ", vacations.message);
      let { startDate, endDate } = vacation;
      startDate = Vacation.convertDate(startDate);
      endDate = Vacation.convertDate(endDate);
      if (vacations.message.length > 0) {
        const overlap = vacations.message.find(
          (v) =>
            (new Date(v.startDate).getDate() > new Date(startDate).getDate() &&
              new Date(v.endDate).getDate() < new Date(endDate).getDate()) ||
            (new Date(v.startDate).getDate() <= new Date(startDate).getDate() &&
              new Date(v.endDate).getDate() >= new Date(endDate).getDate()) ||
            (new Date(v.startDate).getDate() <= new Date(startDate).getDate() &&
              new Date(v.endDate).getDate() > new Date(startDate).getDate() &&
              new Date(v.endDate).getDate() < new Date(endDate).getDate())
        );
        if (overlap) {
          return new Response(
            400,
            false,
            "Vacation is overlapping"
          ).getResponse();
        }
      }
      const SQL_UPDATE = `UPDATE vacations SET startDate = '${startDate}', endDate = '${endDate}' WHERE doctorId = ${doctorId} AND id = ${vacationId}`;
      const updateResult = await db.execute(SQL_UPDATE);
      if (!!updateResult && updateResult[0].affectedRows === 1) {
        return new Response(200, true, "Interval actualizat.").getResponse();
      }
      return new Response(
        404,
        false,
        "Intervalul nu a putut fi actualizat."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server").getResponse();
    }
  }

  static async delete(id, doctorId) {
    try {
      const SQL_DELETE = `DELETE FROM vacations WHERE doctorId = ${doctorId} AND id = ${id}`;
      const result = await db.execute(SQL_DELETE);
      if (!!result && result[0].affectedRows === 1) {
        return new Response(200, true, "Interval sters.").getResponse();
      }
      return new Response(
        400,
        false,
        "Intervalul nu a putut fi sters."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Eroare de server.").getResponse();
    }
  }

  //   static async update() {}
}

module.exports = Vacation;
