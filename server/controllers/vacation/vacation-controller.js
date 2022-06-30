const { verifyToken } = require("../../middlewares/auth");
const router = require("express").Router();

const Doctor = require("../../models/doctor");
const Vacation = require("../../models/vacation");
const Response = require("../../models/response");

const { vacationValidation } = require("../../validation");

router.get("/:id", verifyToken, async (req, res) => {
  const doctorId = req.params.id;
  if (!doctorId) {
    res
      .status(400)
      .send(
        new Response(400, false, "Id parameter is requried!").getResponse()
      );
    return;
  }
  const vacations = await Vacation.getVacationsByDoctorId(doctorId);
  res.status(vacations.status).send(vacations);
});

router.get("/", verifyToken, async (req, res) => {
  const doctor = await Doctor.findOneByUserId(req.user.id);
  if (doctor.success) {
    const vacations = await Vacation.getAllVacations(doctor.message.id);
    res.status(vacations.status).send(vacations);
    return;
  }
  res.status(doctor.status).send(doctor);
});

router.post("/", verifyToken, async (req, res) => {
  const { error } = vacationValidation(req.body);
  if (error) {
    res.status(
      400,
      false,
      new Response(400, false, error.details[0].message).getResponse()
    );
    return;
  }
  const doctor = await Doctor.findOneByUserId(req.user.id);
  if (doctor.success) {
    const vacation = await Vacation.create(req.body, doctor.message.id);
    res.status(vacation.status).send(vacation);
    return;
  }
  res.status(doctor.status).send(doctor);
});

router.put("/", verifyToken, async (req, res) => {
  const { error } = vacationValidation(req.body);
  if (error) {
    res.status(
      400,
      false,
      new Response(400, false, error.details[0].message).getResponse()
    );
    return;
  }
  const id = req.body.id;
  const doctor = await Doctor.findOneByUserId(req.user.id);
  if (doctor.success) {
    const vacation = await Vacation.update(req.body, doctor.message.id, id);
    res.status(vacation.status).send(vacation);
    return;
  }
  res.status(doctor.status).send(doctor);
});

router.delete("/:id", verifyToken, async (req, res) => {
  const id = +req.params.id;
  if (typeof id === "number") {
    const doctor = await Doctor.findOneByUserId(req.user.id);
    if (doctor.success) {
      const removedVacation = await Vacation.delete(id, doctor.message.id);
      res.status(removedVacation.status).send(removedVacation);
      return;
    }
    res.status(doctor.status).send(doctor);
    return;
  }
  res
    .status(400)
    .send(new Response(400, false, "Id should be a number").getResponse());
});

module.exports = router;
