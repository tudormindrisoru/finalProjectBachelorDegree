const router = require("express").Router();
const Response = require("../../../models/response");
const Schedules = require("../../../models/schedule");
const { verifyToken } = require("../../../middlewares/auth");
const { scheduleValidation } = require("../../../validation");

const Doctor = require("../../../models/doctor");

const { workingHoursIntervalValidation } = require("../../../validation");
const Schedule = require("../../../models/schedule");

router.get("/intervals", verifyToken, async (req, res) => {
  res.set({
    "Content-Type": "application/json",
    Authorization: req.headers.authorization,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
  });

  const doctor = await Doctor.findOneByUserId(req.user.id);
  if (doctor.success) {
    const schedules = await Schedules.findAllSchedulesIntervalsByDoctorId(
      doctor.message.id
    );
    console.log("SCHEDULES = ", schedules);
    res.status(schedules.status).send(schedules);
  } else {
    res.status(doctor.status).send(doctor);
  }
});

router.post("/intervals", verifyToken, async (req, res) => {
  res.set({
    "Content-Type": "application/json",
    Authorization: req.headers.authorization,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
  });

  const { error } = scheduleValidation(req.body);
  if (error) {
    res.status(404).send(new Response(404, false, error).getResponse());
  } else {
    const doctor = await Doctor.findOneByUserId(req.user.id);
    if (doctor.success) {
      const schedule = await Schedule.create(req.body, doctor.message.id);
      res.status(schedule.status).send(schedule);
    } else {
      res.status(doctor.status).send(doctor);
    }
  }
});

router.put("/intervals", verifyToken, async (req, res) => {
  res.set({
    "Content-Type": "application/json",
    Authorization: req.headers.authorization,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
  });

  if (+req.body.id < 0) {
    console.log("body = ", req.body);
    res
      .status(404)
      .send(
        new Response(404, false, "Id parameter is required.").getResponse()
      );
  } else {
    const { error } = scheduleValidation(req.body);
    if (error) {
      res.status(404).send(new Response(404, false, error).getResponse());
    } else {
      const doctor = await Doctor.findOneByUserId(req.user.id);
      if (doctor.success) {
        const schedule = await Schedule.update(req.body, doctor.message.id);
        res.status(schedule.status).send(schedule);
      } else {
        res.status(doctor.status).send(doctor);
      }
    }
  }
});

router.delete("/intervals/:id", verifyToken, async (req, res) => {
  res.set({
    "Content-Type": "application/json",
    Authorization: req.headers.authorization,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
  });

  if (+req.params.id < 0) {
    console.log("body = ", req.body);
    res
      .status(404)
      .send(
        new Response(404, false, "Id parameter is required.").getResponse()
      );
  } else {
    const doctor = await Doctor.findOneByUserId(req.user.id);
    if (doctor.success) {
      const schedule = await Schedule.delete(req.params.id, doctor.message.id);
      res.status(schedule.status).send(schedule);
    } else {
      res.status(doctor.status).send(doctor);
    }
  }
});

module.exports = router;
