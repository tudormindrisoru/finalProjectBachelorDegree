const db = require("../config/db");
const Response = require("../models/response");

class Schedule {
  id;
  startTime;
  endTime;
  weekDay;
  doctorId;

  constructor(id, startTime, endTime, weekDay, doctorId = null) {
    this.id = id;
    this.startTime = startTime;
    this.endTime = endTime;
    this.weekDay = weekDay;
    this.doctorId = doctorId;
  }

  static async findAllSchedulesIntervalsByDoctorId(doctorId) {
    try {
      const GET_SCHEDULES = `SELECT id, weekDay, startTime, endTime FROM schedules WHERE doctorId = ${doctorId}`;
      const result = await db.execute(GET_SCHEDULES);
      if (!!result && !!result[0]) {
        console.log("length = ", result[0].length);
        if (result[0].length > 0) {
          const schedules = await result[0].reduce(function (groups, item) {
            groups[+item.weekDay] = groups[item.weekDay] || [];
            groups[+item.weekDay].push(item);
            console.log(groups);
            return groups;
          }, {});
          return new Response(200, true, schedules).getResponse();
        }
        return new Response(200, true, {}).getResponse();
      }
      return new Response(200, true, []).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, error).getResponse();
    }
  }

  static async create(schedule, doctorId) {
    try {
      const SQL_INSERT = `INSERT INTO schedules(doctorId, weekDay, startTime, endTime) VALUES(${doctorId},${schedule.weekDay},${schedule.start},${schedule.end});`;
      const INSERT_RESULT = await db.execute(SQL_INSERT);
      if (INSERT_RESULT && INSERT_RESULT[0].affectedRows == 1) {
        const SQL_GET = `SELECT id, weekDay, startTime, endTime FROM schedules WHERE doctorId = ${doctorId} AND startTime = ${schedule.start} AND endTime = ${schedule.end}`;
        const GET_RESULT = await db.execute(SQL_GET);
        if (!!GET_RESULT && GET_RESULT[0][0]) {
          return new Response(200, true, GET_RESULT[0][0]).getResponse();
        }
      }
      return new Response(
        400,
        false,
        "Schedule could not be created!"
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, error).getResponse();
    }
  }

  static async update(schedule, doctorId) {
    try {
      const SQL_UPDATE = `UPDATE schedules SET startTime = ${schedule.start}, endTime = ${schedule.end} WHERE doctorId = ${doctorId} AND id = ${schedule.id}`;
      const result = await db.execute(SQL_UPDATE);
      if (!!result && result[0] && result[0].affectedRows === 1) {
        return new Response(200, true, "Schedule updated.").getResponse();
      }
      return new Response(
        404,
        false,
        "Schedule could not be updated."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Something went wrong.").getResponse();
    }
  }

  static async delete(intervalId, doctorId) {
    try {
      const SQL_DELETE = `DELETE FROM schedules WHERE id = ${intervalId} AND doctorId = ${doctorId}`;
      const result = await db.execute(SQL_DELETE);
      if (!!result && result[0] && result[0].affectedRows === 1) {
        return new Response(
          200,
          true,
          "Schedule interval removed successfully."
        ).getResponse();
      }
      return new Response(
        400,
        false,
        "Shedule interval could not be deleted."
      ).getResponse();
    } catch (error) {
      console.error(error);
      return new Response(500, false, "Something went wrong.").getResponse();
    }
  }
}

module.exports = Schedule;
