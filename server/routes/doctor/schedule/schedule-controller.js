const router = require("express").Router();
const Response = require("../../../models/response");
const Schedules = require("../../../models/schedule");
const { verifyToken } = require("../../../middlewares/auth");
const { scheduleValidation } = require("../../../validation");

const Doctor = require("../../../models/doctor");

const { workingHoursIntervalValidation } = require("../../../validation");
const Schedule = require("../../../models/schedule");

router.get("/intervals", verifyToken, async (req, res) => {
  const doctor = await Doctor.findOneByUserId(req.user.id);
  if (doctor.success) {
    const schedules = await Schedules.findAllSchedulesIntervalsByDoctorId(
      doctor.message.id
    );
    console.log("SCHEDULES = ", schedules);
    res.status(schedules.status).send(schedules);
    return;
  }
  res.status(doctor.status).send(doctor);
});

router.get("/:id", verifyToken, async (req, res) => {
  if (!req.params.id) {
    res
      .status(400)
      .send(new Response(400, false, "Id param is missing.").getResponse());
    return;
  }

  const schedule = await Schedule.findAllSchedulesIntervalsByDoctorId(
    req.params.id
  );
  res.status(schedule.status).send(schedule);
});

router.post("/intervals", verifyToken, async (req, res) => {
  const { error } = scheduleValidation(req.body);
  if (error) {
    res
      .status(404)
      .send(new Response(404, false, error.details[0].message).getResponse());
    return;
  }
  const doctor = await Doctor.findOneByUserId(req.user.id);
  if (doctor.success) {
    const schedule = await Schedule.create(req.body, doctor.message.id);
    res.status(schedule.status).send(schedule);
    return;
  }
  res.status(doctor.status).send(doctor);
});

router.put("/intervals", verifyToken, async (req, res) => {
  if (+req.body.id < 0) {
    console.log("body = ", req.body);
    res
      .status(404)
      .send(
        new Response(404, false, "Id parameter is required.").getResponse()
      );
    return;
  }
  const { error } = scheduleValidation(req.body);
  if (error) {
    res
      .status(404)
      .send(new Response(404, false, error.details[0].message).getResponse());
    return;
  }
  const doctor = await Doctor.findOneByUserId(req.user.id);
  if (doctor.success) {
    const schedule = await Schedule.update(req.body, doctor.message.id);
    res.status(schedule.status).send(schedule);
    return;
  }
  res.status(doctor.status).send(doctor);
});

router.delete("/intervals/:id", verifyToken, async (req, res) => {
  if (+req.params.id < 0) {
    console.log("body = ", req.body);
    res
      .status(404)
      .send(
        new Response(404, false, "Id parameter is required.").getResponse()
      );
    return;
  }
  const doctor = await Doctor.findOneByUserId(req.user.id);
  if (doctor.success) {
    const schedule = await Schedule.delete(req.params.id, doctor.message.id);
    res.status(schedule.status).send(schedule);
    return;
  }
  res.status(doctor.status).send(doctor);
});

module.exports = router;
