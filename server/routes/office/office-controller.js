const router = require("express").Router();

const Doctor = require("../../models/Doctor");
const Office = require("../../models/office");
// const Affiliation = require('../../models/Affiliation');
// const GeneratedAffiliationCode = require('../../models/GeneratedAffiliationCodes');

const { verifyToken } = require("../../middlewares/auth");
const {
  officeValidation,
  officeInvitationValidation,
  officeInvitationResponse,
} = require("../../validation");
// const { getReturnableDoctorInfos } = require('../../helpers/shared-methods');
// const { query } = require('express');
const Response = require("../../models/response");

router.put("/invite", verifyToken, async (req, res) => {
  const { error } = officeInvitationResponse(req.body);
  if (error) {
    res
      .status(400)
      .send(new Response(400, false, error.details[0].message).getResponse());
    return;
  }
  const id = req.user.id;
  const doctor = await Doctor.findOneByUserId(id);
  if (doctor.success) {
    const response = await Office.handleInvitation(
      doctor.message.id,
      req.body.invitationId,
      req.body.officeId,
      req.body.response
    );
    res.status(response.status).send(response);
    return;
  }
  res.status(doctor.status).send(doctor);
});

router.get("/available-cities", verifyToken, async (req, res) => {
  const doctor = await Doctor.findOneByUserId(req.user.id);
  const cityList = await Office.getCityList(doctor.message.id);
  res.status(cityList.status).send(cityList);
});

router.get("/", verifyToken, async (req, res) => {
  const { city } = req.query;
  const offices = await Office.getByCity(city);
  res.status(offices.status).send(offices);
});

router.get("/doctors", verifyToken, async (req, res) => {
  const { officeId } = req.query;
  const doctor = await Doctor.findOneByUserId(req.user.id);
  const doctors = await Office.getDoctorsByOfficeId(
    officeId,
    doctor.message.id
  );
  res.status(doctors.status).send(doctors);
});

router.get("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  if (!id) {
    console.error("Id is missing!.");
    res
      .status(404)
      .send(new Response(404, false, "Id is missing.").getResponse());
    return;
  }
  const office = await Office.getOneById(id);
  if (office.success) {
    const d = await Doctor.findOneByUserId(req.user.id);

    const doctors = await Office.getAffiliatedDoctors(
      id,
      d.success ? d.message.id : undefined
    );
    if (doctors.success) {
      office.message.doctors = doctors.message;
    }
  }
  res.status(office.status).send(office);
});

router.post("/", verifyToken, async (req, res) => {
  const id = req.user.id;
  const { error } = officeValidation(req.body);
  if (error) {
    res
      .status(400)
      .send(new Response(400, false, error.details[0].message).getResponse());
    return;
  }

  const doctor = await Doctor.findOneByUserId(id);
  if (doctor.success && doctor.message.officeId) {
    res.status(400).send("Doctor afiiliated to an another office.");
    return;
  }
  const office = await Office.save(doctor.message.id, req.body);
  res.status(office.status).send(office);
});

router.post("/invite", verifyToken, async (req, res) => {
  const { error } = officeInvitationValidation(req.body);
  if (error) {
    res
      .status(400)
      .send(new Response(400, false, error.details[0].message).getResponse());
    return;
  }
  const id = req.user.id;
  const doctor = await Doctor.findOneByUserId(id);
  if (doctor.success && doctor.message.officeId) {
    const office = await Office.getOneById(doctor.message.officeId);
    if (office.success) {
      if (office.message.administratorId === doctor.message.id) {
        const invitation = await Office.inviteDoctor(
          req.body.doctorId,
          req.body.officeId
        );
        res.status(invitation.status).send(invitation);
        return;
      }
      res
        .status(401)
        .send(
          new Response(
            401,
            false,
            "You are not authorized to send invitations."
          ).getResponse()
        );
      return;
    }
    res
      .status(400)
      .send(
        new Response(
          400,
          false,
          "You are not affiliated to any office."
        ).getResponse()
      );

    return;
  }
  const office = await Office.save(doctor.message.id, req.body);
  res.status(office.status).send(office);
});

router.put("/", verifyToken, async (req, res) => {
  const { error } = officeValidation(req.body);
  if (error) {
    res
      .status(400)
      .send(new Response(400, false, error.details[0].message).getResponse());
    return;
  }
  const id = req.user.id;
  const doctor = await Doctor.findOneByUserId(id);
  if (doctor.success && doctor.message.officeId) {
    const office = await Office.getOneById(doctor.message.officeId);
    if (
      office.success &&
      office.message.administratorId === doctor.message.id
    ) {
      const changedOffice = await Office.update(doctor.message.id, req.body);
      res.status(changedOffice.status).send(changedOffice);
      return;
    }
    res.status(office.status).send(office);
    return;
  }
  res.status(doctor.status).send(doctor);
});

router.delete("/", verifyToken, async (req, res) => {
  const doctor = await Doctor.findOneByUserId(id);
  if (doctor.success && doctor.message.officeId) {
    const office = await Office.getOneById(doctor.message.officeId);
    console.log(office.success, office.message.administratorId);
    if (
      office.success &&
      office.message.administratorId === doctor.message.id
    ) {
      const deletedOffice = await Office.delete(
        doctor.message.officeId,
        doctor.message.id
      );
      res.status(deletedOffice.status).send(deletedOffice);
      return;
    }
    res.status(office.status).send(office);
    return;
  }
  res.status(doctor.status).send(doctor);
});

module.exports = router;
