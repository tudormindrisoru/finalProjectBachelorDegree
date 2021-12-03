const router = require('express').Router();
const Doctor = require('../../models/Doctor');
const Affiliation = require('../../models/Affiliation');
const Office = require('../../models/Office');
const { doctorSearchValidation, scheduleSearchValidation } = require('../../validation');
const { getReturnableDoctorInfos } = require('../../helpers/shared-methods');

router.get('/doctor-search', async (req,res) => {
    try {
        const { error } = doctorSearchValidation(req.query);
        if(error) {
            res.status(406).send(error.details[0].message);
            return;
        }
        const FILTER = {};
        if(req.query.city) {
            FILTER.city = req.query.city;
        }
        if(req.query.specialty) {
            FILTER.specialty = req.query.specialty;
        }
        if(req.query.doctor_name) {
            FILTER.doctor_name = req.query.doctor_name;
        }
        if(req.query.office_name) {
            FILTER.office_name = req.query.office_name;
        }

        const doctorList = await Doctor.find(
            {
                isActivated: true
            }
        );
        let doctors = doctorList;
        if(FILTER.doctor_name && doctors) {
            const nameArray = FILTER.doctor_name.split(" "); 
            doctors.filter((elem) => {
                for(let name of nameArray) {
                    if(elem.firstName.includes(name) || elem.lastName.includes(name)) {
                        return true;
                    }
                }
                return false;
            });
        }

        if(FILTER.city && doctors) {
            doctors = doctors.filter(function(doc) {
                return doc.city === FILTER.city; 
            });            
        }

        if(FILTER.specialty && doctors) {
            doctors = doctors.filter(function(doc) {
                return doc.specialty === FILTER.specialty;
            });
        }
        let result = [];
        for(const doctor of doctors) {
            const affiliation = await Affiliation.findOne({ doctorID: doctor._id});
            const office = await Office.findOne({ _id: affiliation._doc.officeID });
            if(office) {
                if(FILTER.office_name) {
                    if(office._doc.name.includes(FILTER.office_name)) {
                        result.push({
                            doctor: getReturnableDoctorInfos(doctor._doc),
                            office: office._doc,
                            affiliationID: affiliation._doc._id
                        });
                    }
                    continue;
                }
                result.push({
                    doctor: getReturnableDoctorInfos(doctor._doc),
                    office: office._doc
                });
            }
        }
        res.status(200).send(result);
    } catch(error) {
        console.error(new Error(error));
        res.status(404).send(error);
    }
});
// MODIFY AFTER FINISH VACATION AND SCHEDULE API ROUTES
router.get('/doctor-schedule', async (req, res) => {
    try {
        const { error } = scheduleSearchValidation(req.query);
        if(error) {
            res.status(406).send(error.details[0].message);
            return;
        }
        const affiliation = await Affiliation.findOne({ _id: req.query.affiliationID });
        if(!affiliation) {
            res.status(404).send("Affiliation id incorrect. Please try again.");
        }
        const doctor = await Doctor.findOne({ _id: affiliation._doc.doctorID });
        console.log(doctor._doc);
        res.status(200).send(doctor._doc);
    } catch(error) {
        console.error(new Error(error));
        res.status(400).send(error);
    }
});
// MODIFY AFTER FINISH VACATION AND SCHEDULE API ROUTES
router.post('/appointment', async (req, res) => {
    try {
        res.status(200).send("Patient appointment response");
    } catch(error) {
        console.error(error);
        res.status(400).send(error);
    } 
});
module.exports = router;