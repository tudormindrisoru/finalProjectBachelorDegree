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
      const SQL_GET = `SELECT id, startDate, endDate FROM vacations WHERE doctorId = ${doctorId}`;
      const result = await db.execute(SQL_GET);
      if (!!result && !!result[0]) {
        return new Response(200, true, result[0]).getResponse();
      }
      return new Response(404, false, "Error").getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Something went wrong").getResponse();
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
            "Vacation is overlapping"
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
        "Vacation could not be inserted."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Something went wrong").getResponse();
    }
  }

  static async delete(id, doctorId) {
    try {
      const SQL_DELETE = `DELETE FROM vacations WHERE doctorId = ${doctorId} AND id = ${id}`;
      const result = await db.execute(SQL_DELETE);
      if (!!result && result[0].affectedRows === 1) {
        return new Response(200, true, "Vacation removed.").getResponse();
      }
      return new Response(
        400,
        false,
        "Vacation could not be removed"
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Something went wrong.").getResponse();
    }
  }

  //   static async update() {}
}

module.exports = Vacation;
