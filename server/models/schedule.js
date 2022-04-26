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
      if (!!result && !result[0]) {
        const schedules = result[0].reduce(function (groups, item) {
          groups[item.weekDay] = groups[item.weekDay] || [];
          groups[item.weekDay].push(item);
          return item;
        }, Object.create(null));
        console.log(schedules);
        return new Response(200, true, schedules).getResponse();
      }
    } catch (error) {
      console.error(error);
      return new Response(500, false, error).getResponse();
    }
  }
}

module.exports = Schedule;
