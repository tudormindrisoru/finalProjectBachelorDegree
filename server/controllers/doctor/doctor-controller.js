const router = require("express").Router();
const { verifyToken } = require("../../middlewares/auth");
const scheduleController = require("../schedule/schedule-controller");
const vacationController = require("../vacation/vacation-controller");

const {
  postDoctorValidation,
  updateDoctorValidation,
} = require("../../validation");

const Doctor = require("../../models/doctor");
const Response = require("../../models/response");
const User = require("../../models/user");
const { update } = require("../../models/doctor");

router.use("/schedule", scheduleController);
router.use("/vacation", vacationController);

router.get("/", verifyToken, async (req, res) => {
  const doctor = await Doctor.findOneByUserId(req.user.id);
  if (doctor.success) {
    res.status(doctor.status).send(doctor);
    return;
  }
  res.status(doctor.status).send(doctor.status, false, doctor);
});

router.post("/", verifyToken, async (req, res) => {
  const { error } = postDoctorValidation(req.body);
  if (error) {
    res
      .status(400)
      .send(new Response(400, false, error.details[0].message).getResponse());
    return;
  }
  const dbResponse = await Doctor.save(
    req.user.id,
    req.body.specialty,
    req.body.cuim
  );
  res.status(dbResponse.status).send(dbResponse);
});

router.put("/", verifyToken, async (req, res) => {
  const { error } = updateDoctorValidation(req.body);
  if (error) {
    res
      .status(400)
      .send(new Response(400, false, error.details[0].message).getResponse());
    return;
  }
  const doctor = await Doctor.findOneByUserId(req.user.id);
  if (doctor.success) {
    const updatedDoctor = await Doctor.update(doctor.message.id, req.body);
    res.status(updatedDoctor.status).send(updatedDoctor);
    return;
  }
  res.status(doctor.status).send(doctor);
});

router.get("/search/:name", verifyToken, async (req, res) => {
  const name = req.params.name;
  if (!!name) {
    const doctors = await Doctor.findAllWithoutAffiliation(name);
    res.status(doctors.status).send(doctors);
    return;
  }
  res
    .status(400)
    .send(
      new Response(
        400,
        false,
        "Please provide name for searching."
      ).getResponse()
    );
});

router.get("/patient-history", verifyToken, async (req, res) => {
  const id = req.user.id;
  const doctor = await Doctor.findOneByUserId(id);

  if (doctor.success) {
    const result = await Doctor.getPatientHistory(doctor.message.id);
    res.status(result.status).send(result);
    return;
  }
  res.status(doctor.status).send(doctor);
});

module.exports = router;
