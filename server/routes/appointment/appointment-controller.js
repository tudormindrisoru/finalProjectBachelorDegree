const router = require('express').Router();
const Doctor = require('../../models/Doctor');
const Office = require('../../models/office');
const { verifyToken } = require('../../middlewares/auth');
const Response = require('../../models/response');
const Appointment = require('../../models/appointments');
const { approvedAppointmentsValidation, createAppointmentValidation, updateAppointmentValidation } = require('../../validation');

router.get('/approved', verifyToken, async (req, res) => {
     try {
        res.set({
            'Content-Type': 'application/json',
            'Authorization': req.headers.authorization,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': '*'
        });
        console.log(req.query);
         const { error } = approvedAppointmentsValidation(req.query);
         if(error) {
             res.status(400).send(new Response(400, false, error).getResponse());
         } else {
            const id = req.user.id;
            const doctor = await Doctor.findOneByUserId(id);
            if(doctor.success) {
                if(!!doctor.message.officeId) {
                    console.log(doctor.message);
                    const appointments = await Appointment.getAllApprovedAppointments(doctor.message.id, req.query.startDate, req.query.endDate);
                    res.status(appointments.status).send(appointments);
                } else {
                    res.status(403).send(new Response(403, false, "Doctor without affiliation.").getResponse());
                }
            } else {
                res.status(doctor.status).send(doctor);
            }
         }
     } catch(err) {
        console.error(err);
        res.status(500).send(new Response(500, false, err).getResponse());
     }
 });

 router.post('/approved', verifyToken, async (req, res) => {
    try {
        const { error } = createAppointmentValidation(req.body);
        res.set({
            'Content-Type': 'application/json',
            'Authorization': req.headers.authorization,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': '*'
        });
        if(error) {
            res.status(400).send(new Response(400, false, error).getResponse());
        } else {
            const id = req.user.id;
            if(!!id) {
                const doctor = await Doctor.findOneByUserId(id);
                if(doctor.success && !!doctor.message.officeId) {
                    const office = await Office.getOneById(doctor.message.officeId);
                    if(office.success) {
                        const data = { 'doctorId': doctor.message.id, 'officeId': office.message.id, ...req.body };
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
    } catch(err) {
        console.error("EROARE C = ",err);
        res.status(500).send(new Response(500, false, err).getResponse());
    }
 });

 router.put('/approved', verifyToken, async (req, res) => {
    try {
        const { error } = updateAppointmentValidation(req.body);
        res.set({
            'Content-Type': 'application/json',
            'Authorization': req.headers.authorization,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Expose-Headers': '*'
        });
        if(error) {
            res.status(400).send(new Response(400, false, error).getResponse());
        } else {
            const id = req.user.id;
            if(!!id) {
                const doctor = await Doctor.findOneByUserId(id);
                if(doctor.success && !!doctor.message.officeId) {
                    const office = await Office.getOneById(doctor.message.officeId);
                    if(office.success) {
                        const data = { 'doctorId': doctor.message.id, 'officeId': office.message.id, ...req.body };
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
    } catch(err) {
        console.error(err);
        res.status(500).send(new Response(500, false, err).getResponse());
    }
 });

module.exports = router;