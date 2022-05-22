const router = require("express").Router();
const Doctor = require("../../models/Doctor");
const Office = require("../../models/office");
const { verifyToken } = require("../../middlewares/auth");
const Response = require("../../models/response");
const Appointment = require("../../models/appointments");
const {
  approvedAppointmentsValidation,
  createAppointmentValidation,
  updateAppointmentValidation,
  approveAppointmentValidation,
} = require("../../validation");

router.put("/", verifyToken, async (req, res) => {
  res.set({
    "Content-Type": "application/json",
    Authorization: req.headers.authorization,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
  });
  const { error } = approveAppointmentValidation(req.body);
  if (error) {
    res.status(404).send(new Response(404, false, error).getResponse());
  } else {
    const id = req.user.id;
    const doctor = await Doctor.findOneByUserId(id);
    if (doctor.success) {
      if (!!doctor.message.officeId) {
        const approveResult = await Appointment.approveAppointment(
          doctor.message.id,
          req.body.id
        );
        res.status(approveResult.status).send(approveResult);
      } else {
        res
          .status(403)
          .send(
            new Response(
              403,
              false,
              "Doctor without affiliation."
            ).getResponse()
          );
      }
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
  if (!req.params.id) {
    res
      .status(404)
      .send(
        new Response(404, false, "Id parameter should be added.").getResponse()
      );
  } else {
    const id = req.user.id;
    const doctor = await Doctor.findOneByUserId(id);
    if (doctor.success) {
      if (!!doctor.message.officeId) {
        const rejectResult = await Appointment.rejectAppointment(
          doctor.message.id,
          req.params.id
        );
        res.status(rejectResult.status).send(rejectResult);
      } else {
        res
          .status(403)
          .send(
            new Response(
              403,
              false,
              "Doctor without affiliation."
            ).getResponse()
          );
      }
    } else {
      res.status(doctor.status).send(doctor);
    }
  }
});

router.get("/approved", verifyToken, async (req, res) => {
  res.set({
    "Content-Type": "application/json",
    Authorization: req.headers.authorization,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
  });
  const { error } = approvedAppointmentsValidation(req.query);
  if (error) {
    res.status(400).send(new Response(400, false, error).getResponse());
  } else {
    const id = req.user.id;
    const doctor = await Doctor.findOneByUserId(id);
    if (doctor.success) {
      if (!!doctor.message.officeId) {
        console.log(doctor.message);
        const appointments = await Appointment.getAllApprovedAppointments(
          doctor.message.id,
          req.query.startDate,
          req.query.endDate
        );
        res.status(appointments.status).send(appointments);
      } else {
        res
          .status(403)
          .send(
            new Response(
              403,
              false,
              "Doctor without affiliation."
            ).getResponse()
          );
      }
    } else {
      res.status(doctor.status).send(doctor);
    }
  }
});

router.post("/approved", verifyToken, async (req, res) => {
  const { error } = createAppointmentValidation(req.body);
  res.set({
    "Content-Type": "application/json",
    Authorization: req.headers.authorization,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
  });
  if (error) {
    res.status(400).send(new Response(400, false, error).getResponse());
  } else {
    const id = req.user.id;
    if (!!id) {
      const doctor = await Doctor.findOneByUserId(id);
      if (doctor.success && !!doctor.message.officeId) {
        const office = await Office.getOneById(doctor.message.officeId);
        if (office.success) {
          const data = {
            doctorId: doctor.message.id,
            officeId: office.message.id,
            ...req.body,
          };
          const appointment = await Appointment.save(data);
          console.log(appointment);
          res.status(appointment.status).send(appointment);
        } else {
          res.status(office.status).send(office);
        }
      } else {
        res.status(doctor.status).send(doctor);
      }
    } else {
      res.status(400, false, "Invalid user id.");
    }
  }
});

router.put("/approved", verifyToken, async (req, res) => {
  const { error } = updateAppointmentValidation(req.body);
  res.set({
    "Content-Type": "application/json",
    Authorization: req.headers.authorization,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
  });
  if (error) {
    res.status(400).send(new Response(400, false, error).getResponse());
  } else {
    const id = req.user.id;
    if (!!id) {
      const doctor = await Doctor.findOneByUserId(id);
      if (doctor.success && !!doctor.message.officeId) {
        const office = await Office.getOneById(doctor.message.officeId);
        if (office.success) {
          const data = {
            doctorId: doctor.message.id,
            officeId: office.message.id,
            ...req.body,
          };
          const appointment = Appointment.update(data);
          res.status(appointment.status).send(appointment);
        } else {
          res.status(office.status).send(office);
        }
      } else {
        res.status(doctor.status).send(doctor);
      }
    } else {
      res.status(400, false, "Invalid user id.");
    }
  }
});

router.get("/pending", verifyToken, async (req, res) => {
  res.set({
    "Content-Type": "application/json",
    Authorization: req.headers.authorization,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
  });
  const doctor = await Doctor.findOneByUserId(req.user.id);
  if (doctor.success) {
    const pendingAppointments = await Appointment.getAllPendingAppointments(
      doctor.message.id
    );
    res.status(pendingAppointments.status).send(pendingAppointments);
  } else {
    res
      .status(doctor.status)
      .send(new Response(doctor.status, false, doctor).getResponse());
  }
});

router.get("/pending/:id", verifyToken, async (req, res) => {
  res.set({
    "Content-Type": "application/json",
    Authorization: req.headers.authorization,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
  });
  const pendingAppointmentId = +req.params.id;
  if (!!pendingAppointmentId) {
    const doctor = await Doctor.findOneByUserId(req.user.id);
    if (doctor.success) {
      const pendingAppointment = await Appointment.getPendingAppointmentById(
        doctor.message.id,
        pendingAppointmentId
      );
      res.status(pendingAppointment.status).send(pendingAppointment);
    } else {
      res
        .status(doctor.status)
        .send(new Response(doctor.status, false, doctor).getResponse());
    }
  } else {
    res
      .status(404)
      .send(new Response(404, false, "Id si required!").getResponse());
  }
});

module.exports = router;
