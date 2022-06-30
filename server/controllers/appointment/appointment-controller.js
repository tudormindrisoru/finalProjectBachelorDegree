const router = require("express").Router();
const Doctor = require("../../models/Doctor");
const Office = require("../../models/office");
const { verifyToken } = require("../../middlewares/auth");
const Response = require("../../models/response");
const Appointment = require("../../models/appointments");
const { sendSMS } = require("../../sms-sender");
const {
  approvedAppointmentsValidation,
  createAppointmentValidation,
  updateAppointmentValidation,
  approveAppointmentValidation,
  requestAppointmentValidation,
  appointmentReviewValidation,
  setRatingValidation,
} = require("../../validation");
const Sse = require("../../models/sse");
const User = require("../../models/user");
const schedule = require("node-schedule");

router.post("/review", verifyToken, async (req, res) => {
  const { error } = appointmentReviewValidation(req.body);
  if (error) {
    res
      .status(400)
      .send(new Response(400, false, error.details[0].message).getResponse());
    return;
  }

  const reviewRes = await Appointment.addReviewToAnAppointment(req.body);
  res.status(200).send("ok");
});

router.patch("/approve", verifyToken, async (req, res) => {
  const { id } = req.body;
  if (!id) {
    res
      .status(404)
      .send(
        new Response(404, false, "Id parameter should be added.").getResponse()
      );
    return;
  }

  const doctor = await Doctor.findOneByUserId(req.user.id);
  const user = await User.findOneById(req.user.id);
  if (doctor.success) {
    if (!!doctor.message.officeId) {
      const appointment = await Appointment.getPendingAppointmentById(
        doctor.message.id,
        id
      );

      if (appointment.success) {
        const approvedAppointment = await Appointment.approveAppointment(
          doctor.message.id,
          id
        );
        if (approvedAppointment.success) {
          await sendSMS(
            `Programarea dumneavoastra la medicul ${user.message.firstName} ${user.message.lastName} a fost aprobata.`,
            appointment.message.patient.phone
          );

          const sendDate = new Date(appointment.message.startDate);
          sendDate.setHours(sendDate.getHours() - 1);
          schedule.scheduleJob(sendDate, function () {
            // await sendSMS(
            //   `Aveti o programare intr-o ora la doctorul ${user.message.firstName} ${user.message.lastName}.`,
            //   appointment.message.patient.phone
            // );
          });
        }
        res.status(approvedAppointment.status).send(approvedAppointment);
        return;
      }
      res.status(appointment.status).send(appointment);
      return;
    }
    res
      .status(403)
      .send(
        new Response(403, false, "Doctor without affiliation.").getResponse()
      );
    return;
  }
  res.status(doctor.status).send(doctor);
});

router.patch("/reject", verifyToken, async (req, res) => {
  const { id } = req.body;
  if (!id) {
    res
      .status(404)
      .send(
        new Response(404, false, "Id parameter should be added.").getResponse()
      );
    return;
  }

  const doctor = await Doctor.findOneByUserId(req.user.id);
  const user = await User.findOneById(req.user.id);
  if (doctor.success) {
    if (!!doctor.message.officeId) {
      const appointment = await Appointment.getPendingAppointmentById(
        doctor.message.id,
        id
      );
      if (appointment.success) {
        const rejectResult = await Appointment.rejectAppointment(
          doctor.message.id,
          id
        );

        await sendSMS(
          `Programarea dumneavoastra la medicul ${user.message.firstName} ${user.message.lastName} a fost refuzata.`,
          appointment.message.patient.phone
        );
        res.status(rejectResult.status).send(rejectResult);
        return;
      }
      res
        .status(404)
        .send(
          new Response(
            404,
            false,
            "Cererea de programare nu a fost gasita."
          ).getResponse()
        );
      return;
    }
    res
      .status(403)
      .send(new Response(403, false, "Doctor neafiliat.").getResponse());
    return;
  }
  res.status(doctor.status).send(doctor);
});

router.get("/approved", verifyToken, async (req, res) => {
  const { error } = approvedAppointmentsValidation(req.query);
  if (error) {
    res
      .status(400)
      .send(new Response(400, false, error.details[0].message).getResponse());
    return;
  }
  const id = req.user.id;
  const doctor = await Doctor.findOneByUserId(id);
  if (doctor.success) {
    if (!!doctor.message.officeId) {
      const appointments = await Appointment.getAllApprovedAppointments(
        doctor.message.id,
        req.query.startDate,
        req.query.endDate
      );
      res.status(appointments.status).send(appointments);
      return;
    }
    res
      .status(403)
      .send(
        new Response(403, false, "Doctor without affiliation.").getResponse()
      );
    return;
  }
  res.status(doctor.status).send(doctor);
});

router.post("/approved", verifyToken, async (req, res) => {
  const { error } = createAppointmentValidation(req.body);

  if (error) {
    res
      .status(400)
      .send(new Response(400, false, error.details[0].message).getResponse());
    return;
  }
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
        res.status(appointment.status).send(appointment);

        if (appointment.success) {
          // await sendSMS(
          //   `Aveti o programare la medicul ${doctor.message.firstName} ${doctor.message.lastName} la data ${new Date(appointment.message.startDate).toLocaleString()}.`,
          //   appointment.message.patient.phone
          // );
        }
        return;
      }

      res.status(office.status).send(office);
      return;
    }

    res.status(doctor.status).send(doctor);
    return;
  }
  res.status(400, false, "Invalid user id.");
});

router.put("/approved", verifyToken, async (req, res) => {
  const { error } = updateAppointmentValidation(req.body);

  if (error) {
    res
      .status(400)
      .send(new Response(400, false, error.details[0].message).getResponse());
    return;
  }
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

        const appointment = await Appointment.update(data);
        res.status(appointment.status).send(appointment);
        return;
      }

      res.status(office.status).send(office);
      return;
    }

    res.status(doctor.status).send(doctor);
    return;
  }
  res.status(400, false, "Datele utilizatorului invalide.");
});

router.get("/pending", verifyToken, async (req, res) => {
  const doctor = await Doctor.findOneByUserId(req.user.id);
  if (doctor.success) {
    const pendingAppointments = await Appointment.getAllPendingAppointments(
      doctor.message.id
    );
    res.status(pendingAppointments.status).send(pendingAppointments);
    return;
  }
  res
    .status(doctor.status)
    .send(new Response(doctor.status, false, doctor).getResponse());
});

router.get("/pending/:id", verifyToken, async (req, res) => {
  const pendingAppointmentId = +req.params.id;
  if (!!pendingAppointmentId) {
    const doctor = await Doctor.findOneByUserId(req.user.id);
    if (doctor.success) {
      const pendingAppointment = await Appointment.getPendingAppointmentById(
        doctor.message.id,
        pendingAppointmentId
      );
      res.status(pendingAppointment.status).send(pendingAppointment);
      return;
    }
    res
      .status(doctor.status)
      .send(new Response(doctor.status, false, doctor).getResponse());
    return;
  }
  res
    .status(404)
    .send(new Response(404, false, "Id-ul este necesar").getResponse());
});

router.get("/free-slots", verifyToken, async (req, res) => {
  const { date, doctorId } = req.query;
  if (!date || !doctorId) {
    res
      .status(400)
      .send(
        new Response(400, false, "Parametrul date este necesar.").getResponse()
      );
    return;
  }
  const slots = await Appointment.getFreeSlotsByDate(date, +doctorId);
  res.status(slots.status).send(slots);
});

router.post("/request", verifyToken, async (req, res) => {
  const { error } = requestAppointmentValidation(req.body);
  if (error) {
    res
      .status(400)
      .send(new Response(400, false, error.details[0].message).getResponse());
    return;
  }
  const { id } = req.user;
  const user = await User.findOneById(id);
  const doctor = await User.findOneByDoctorId(req.body.doctorId);
  const result = await Appointment.createAppointmentRequest(id, req.body);
  if (result.success && user.success && doctor.success) {
    Sse.emitEvent({
      type: "APPOINTMENT_REQUEST",
      doctorId: req.body.doctorId,
      entryId: result.message?.id,
    });

    // await sendSMS(
    //   `Ati solicitat o programare pentru o consultatie la doctorul ${
    //     doctor.message.firstName
    //   } ${doctor.message.lastName} pentru data ${new Date(
    //     req.body.date
    //   ).toLocaleDateString()} la ora ${
    //     Math.floor(req.body.startTime / 60) < 10
    //       ? "0" + Math.floor(req.body.startTime / 60)
    //       : Math.floor(req.body.startTime / 60)
    //   }:${
    //     req.body.startTime % 60 < 10
    //       ? "0" + (req.body.startTime % 60)
    //       : req.body.startTime % 60
    //   }`,
    //   user.message.phone
    // );
    res
      .status(result.status)
      .send(
        new Response(
          result.status,
          result.success,
          result.message.result
        ).getResponse()
      );
    return;
  }
  res.status(result.status).send(result);
});

router.get("/last", verifyToken, async (req, res) => {
  const patientId = req.user.id;
  const lastFiveAppointments =
    await Appointment.getLastFiveApprovedAppointmentsByPatientId(patientId);
  res.status(lastFiveAppointments.status).send(lastFiveAppointments);
});

router.get("/ratings", verifyToken, async (req, res) => {
  const ids = req.query.reviewIds;
  const result = await Appointment.getRatingsById(ids);
  res.status(result.status).send(result);
});

router.post("/ratings", verifyToken, async (req, res) => {
  const { error } = setRatingValidation(req.body);
  if (error) {
    res
      .status(404)
      .send(new Response(404, false, error.details[0].message).getResponse());
    return;
  }
  c;
  const ratingAdded = await Appointment.setRating(
    req.body.appointmentId,
    req.body.points
  );
  res.status(ratingAdded.status).send(ratingAdded);
});
module.exports = router;
