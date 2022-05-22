const { verifyToken } = require("../../../middlewares/auth");
const router = require("express").Router();

const Doctor = require("../../../models/doctor");
const Vacation = require("../../../models/vacation");
const Response = require("../../../models/response");

const { vacationValidation } = require("../../../validation");

router.get("/", verifyToken, async (req, res) => {
  res.set({
    "Content-Type": "application/json",
    Authorization: req.headers.authorization,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
  });
  const doctor = await Doctor.findOneByUserId(req.user.id);
  if (doctor.success) {
    const vacations = await Vacation.getAllVacations(doctor.message.id);
    console.log(vacations);
    res.status(vacations.status).send(vacations);
  } else {
    res.status(doctor.status).send(doctor);
  }
});

router.post("/", verifyToken, async (req, res) => {
  res.set({
    "Content-Type": "application/json",
    Authorization: req.headers.authorization,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
  });
  const { error } = vacationValidation(req.body);
  if (error) {
    res.status(400, false, new Response(400, false, error).getResponse());
  } else {
    const doctor = await Doctor.findOneByUserId(req.user.id);
    if (doctor.success) {
      const vacation = await Vacation.create(req.body, doctor.message.id);
      console.log(vacation);
      res.status(vacation.status).send(vacation);
    } else {
      res.status(doctor.status).send(doctor);
    }
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  res.set({
    "Content-Type": "application/json",
    Authorization: req.headers.authorization,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
  });

  const id = +req.params.id;
  if (typeof id === "number") {
    const doctor = await Doctor.findOneByUserId(req.user.id);
    if (doctor.success) {
      const removedVacation = await Vacation.delete(id, doctor.message.id);
      res.status(removedVacation.status).send(removedVacation);
    } else {
      res.status(doctor.status).send(doctor);
    }
  } else {
    res
      .status(400)
      .send(new Response(400, false, "Id should be a number").getResponse());
  }
});

module.exports = router;
