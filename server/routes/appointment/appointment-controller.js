const router = require('express').Router();
const Doctor = require('../../models/Doctor');
const Office = require('../../models/office');
const { verifyToken } = require('../../middlewares/auth');
const Response = require('../../models/response');
const Appointment = require('../../models/appointments');


 router.get('/approved', verifyToken, async (req, res) => {
     try {
         res.set({
             'Content-Type': 'application/json',
             'Authorization': req.headers.authorization,
             'Access-Control-Allow-Origin': '*',
             'Access-Control-Expose-Headers': '*'
         });
        const id = req.user.id;
        const doctor = await Doctor.findOneByUserId(id);
        if(doctor.success) {
            if(!!doctor.message.officeId) {
                const appointments = await Appointment.getAllApprovedAppointments(doctor.message.id);
                res.status(appointments.status).send(appointments);
            } else {
                res.status(403).send(new Response(403, false, "Doctr without affiliation.").getResponse());
            }
        } else {
            res.status(doctor.status).send(doctor);
        }
     } catch(err) {
        console.error(err);
        res.status(500).send(new Response(500, false, err).getResponse());
     }
 });

module.exports = router;