const router = require('express').Router();
// const uniqid = require('uniqid');
const Doctor = require('../../models/Doctor');
const Office = require('../../models/office');
// const Affiliation = require('../../models/Affiliation');
// const GeneratedAffiliationCode = require('../../models/GeneratedAffiliationCodes');

const { verifyToken } = require('../../middlewares/auth');
const { officeValidation } = require('../../validation');
// const { getReturnableDoctorInfos } = require('../../helpers/shared-methods');
// const { query } = require('express');
const Response = require('../../models/response');

router.get('/:id', verifyToken, async(req, res) => {
    try {
        const id = req.params.id;
        if(!id) {
            console.error("Id is missing!.");
            res.status(404).send(new Response(404, false, "Id is missing.").getResponse());
        } else {
            const office = await Office.getOneById(id);
            if(office.success) {
                res.set({
                    'Content-Type': 'application/json',
                    'Authorization': req.headers.authorization,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Expose-Headers': '*'
                });
                const doctors = await Office.getAffiliatedDoctors(id);
                if(doctors.success) {
                    office.message.doctors = doctors.message;
                }
            }
            res.status(office.status).send(office);
        }
    } catch(err) {
        console.error(err);
        res.status(500).send(new Response(500, false, err).getResponse());
    }
});

router.post('/', verifyToken, async(req, res) => {
    try {
        const id = req.user.id;
        const { error } = officeValidation(req.body);
        if(id) {
            if(error) {
                res.status(400).send(new Response(400,false, error).getResponse());
            } else {
                res.set({
                    'Content-Type': 'application/json',
                    'Authorization': req.headers.authorization,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Expose-Headers': '*'
                });
                
                const doctor = await Doctor.findOneByUserId(id);
                if(doctor.success && doctor.message.officeId) {
                    res.status(400).send("Doctor afiiliated to an another office.");
                } else {
                    const office = await Office.save(doctor.message.id, req.body);
                    res.status(office.status).send(office);
                } 
            }
        } else {
            res.status(401).send("Unauthorized");
        }
    } catch(err) {
        console.error(err);
        res.status(500).send(new Response(500,false, err).getResponse());
    }
   
});

router.put('/', verifyToken, async(req, res) => {
    try {
        const id = req.user.id;
        const { error } = officeValidation(req.body);
        if(id) {
            if(error) {
                res.status(400).send(new Response(400,false, error).getResponse());
            } else {
                res.set({
                    'Content-Type': 'application/json',
                    'Authorization': req.headers.authorization,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Expose-Headers': '*'
                });
                
                const doctor = await Doctor.findOneByUserId(id);
                if(doctor.success && doctor.message.officeId) {
                    const office = await Office.getOneById(doctor.message.officeId);
                    if(office.success && office.message.administratorId === doctor.message.id) {
                        const changedOffice = await Office.update(doctor.message.id, req.body);
                        res.status(changedOffice.status).send(changedOffice);
                    } else {
                        res.status(office.status).send(office);
                    }
                } else { 
                    res.status(doctor.status).send(doctor);
                } 
            }
        } else {
            res.status(401).send("Unauthorized");
        }
    } catch(err) {
        console.error(err);
        res.status(500).send(new Response(500,false, err).getResponse());
    }
   
});

router.delete('/', verifyToken, async(req, res) => {
    try {
        const id = req.user.id;
        if(id) {
            res.set({
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers': '*'
            });
            
            const doctor = await Doctor.findOneByUserId(id);
            if(doctor.success && doctor.message.officeId) {
                const office = await Office.getOneById(doctor.message.officeId);
                console.log(office.success, office.message.administratorId);
                if(office.success && office.message.administratorId === doctor.message.id) {
                    const deletedOffice = await Office.delete(doctor.message.officeId, doctor.message.id);
                    res.status(deletedOffice.status).send(deletedOffice);
                } else {
                    res.status(office.status).send(office);
                }
            } else { 
                res.status(doctor.status).send(doctor);
            } 
        } else {
            res.status(401).send("Unauthorized");
        }
    } catch(err) {
        console.error(err);
        res.status(500).send(new Response(500,false, err).getResponse());
    }
   
});

// router.post('/', verifyToken, async (req, res) => {
//     try { 
//         const decryptedToken = decryptID(req.header('auth-token'));
//         const affiliationCheck = await Affiliation.findOne({doctorID: decryptedToken._id});
//         if(affiliationCheck) {
//             res.status(405).send('You are not allowed to create an office').
//             return;
//         }
//         const owner = await Doctor.findOne({_id: decryptedToken._id});
//         if(!owner.isActivated) {
//             res.status(405).send('You are not allowed to create an office. Your account is not activated yet.')
//             return;
//         }

//         const { error } = officeValidation(req.body);
//         if(error) {
//             res.status(406).send(error.details[0].message);
//             return;
//         }

//         const office = new Office({
//             ownerID: decryptedToken._id,
//             latitude: req.body.latitude,
//             longitude: req.body.longitude,
//             name: req.body.name
//         });
//         const saveOffice = await office.save();
//         const affiliation = new Affiliation({
//             officeID: saveOffice._id,
//             doctorID: decryptedToken._id
//         });
//         await affiliation.save();
//         const returnedResult = Object.assign({}, {"office": req.body } , {"owner": getReturnableDoctorInfos(owner._doc)}, { "doctorList": [getReturnableDoctorInfos(owner._doc)]});
        
//         res.status(201).send(returnedResult);
//     } catch(error) {
//         console.log(new Error(error));
//         res.status(404).send(error);
//     }
// });

// router.put('/', verifyToken, async (req, res) => {
//     try { 
//         const decryptedToken = decryptID(req.header('auth-token'));
//         const office = await Office.findOne({ownerID: decryptedToken._id});
//         if(office) {
//             res.status(405).send('You are not owner of an office. Try create an office first').
//             return;
//         }
        
//         const { error } = officeValidation(req.body);
//         if(error) {
//             res.status(406).send(error.details[0].message);
//             return;
//         }
//         const result = Office.findOneAndUpdate({ _id: office._id}, req.body,  {
//             new: true,
//             useFindAndModify: false
//           })

//         res.status(200).send(result);
//     } catch(error) {
//         console.log(new Error(error));
//         res.status(404).send(error);
//     }
// });

// router.delete('/affiliation', verifyToken, async (req, res) => {
//     try {
//         if(!req.query.id || typeof req.query.id !== String) {
//             res.status(400).send('The id param request typeof field should be string. Please try again');
//             return ;
//         }
//         const decryptedToken = decryptID(req.header('auth-token'));
//         const office = await Office.findOne({ownerID: decryptedToken._id});
//         if(office) {
//             res.status(405).send('You are not owner of an office. Try create an office first').
//             return;
//         }
//         const affiliation = await Affiliation.findOne({_id: req.query.id, ownerID: decryptedToken._id});
//         if(!affiliation) {
//             res.status(404).send('The doctor is not affiliated with your office').
//             return;
//         }
//         const deleteAffiliation = await affiliation.delete();
//         console.log(deleteAffiliation);
//     } catch(error) {
//         console.error(new Error(error));
//         res.status(400).send(error);
//     }
// });

// router.post('/affiliation/generate-code', verifyToken, async (req, res) => {
//     try {
//         const decryptedToken = decryptID(req.header('auth-token'));
//         const office = await Office.findOne({ownerID: decryptedToken._id});
//         console.log(req.query.id , typeof req.query.id);
//         if(!office) {
//             res.status(405).send('You are not owner of an office. Try create an office first.').
//             return;
//         }
//         const doctor = await Doctor.findOne({ _id: decryptedToken._id });
//         if(!doctor.isActivated) {
//             res.status(405).send('Your account is not activated.');
//         }
//         const deleteDate = new Date().setMinutes(new Date().getMinutes() + 5);
//         const generatedCode = new GeneratedAffiliationCode({
//             officeID: office._id,
//             code: uniqid(),
//             deleteDate: deleteDate
//         });

//         const result = await generatedCode.save();
//         console.log(result);
//         res.status(201).send(result);
//     } catch(error) {
//         console.error(new Error(error));
//         res.status(400).send(error);
//     }
// });

// router.post('/affiliation/code-validation', verifyToken, async (req, res) => {
//     try {
//         const decryptedToken = decryptID(req.header('auth-token'));
//         const searchedAffiliation = await Affiliation.findOne({doctorID: decryptedToken._id});
//         console.log(req.query, typeof req.query.id);
//         const doctor = await Doctor.findOne({ _id: decryptedToken._id });
//         if(!doctor.isActivated) {
//             res.status(405).send('Your account is not activated.');
//         }
//         if(searchedAffiliation) {
//             res.status(405).send('You are already affiliated to an office');
//             return;
//         }
//         console.log('ID=',req.query.id);
//         if(!req.query.id) {
//             console.log(typeof req.query.id);
//             res.status(404).send('You should send the code id as param and typeof string');
//             return;
//         }
//         const code = await GeneratedAffiliationCode.findOne({code: req.query.id});
//         if(!code) {
//             res.status(403).send("The code is incorrect.");
//         } 
//         const affiliation = new Affiliation({
//             doctorID: decryptedToken._id,
//             officeID: code.officeID
//         });
//         const result = affiliation.save();
//         res.status(201).send(affiliation);
//     } catch(error) {
//         console.error(new Error(error));
//         res.status(400).send(error);
//     }
// });

module.exports = router;