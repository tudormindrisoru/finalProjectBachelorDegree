const router = require("express").Router();
const multer = require("multer");
const { verifyToken } = require("../../middlewares/auth");
const scheduleController = require("./schedule/schedule-controller");
const {
  postDoctorValidation,
  updateDoctorValidation,
} = require("../../validation");
// const { getReturnableDoctorInfos } = require('../../helpers/shared-methods');
// const { verify } = require('jsonwebtoken');

// const scheduleController = require('./schedule/schedule');
// const vacationController = require('./vacation/vacation');
// router.use('/schedule', scheduleController)

const Doctor = require("../../models/doctor");
const Response = require("../../models/response");
const User = require("../../models/user");
const { update } = require("../../models/doctor");

router.use("/schedule", scheduleController);

router.get("/", verifyToken, async (req, res) => {
  try {
    res.set({
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Expose-Headers": "*",
    });

    const doctor = await Doctor.findOneByUserId(req.user.id);
    console.log(doctor);
    if (doctor.success) {
      res.status(doctor.status).send(doctor);
    }
  } catch (error) {
    console.error(new Error(error));
    res.status(500).send(new Response(500, false, error).getResponse());
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user.id) {
      const { error } = postDoctorValidation(req.body);
      if (error) {
        res.status(400).send(new Response(400, false, error).getResponse());
      } else {
        const doctor = new Doctor(
          null,
          req.body.cuim,
          req.body.specialty,
          null
        );
        const dbResponse = await doctor.save();
        if (dbResponse.success) {
          if (dbResponse.insertId) {
            console.log(dbResponse.insertId);
          }
          res.set({
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Expose-Headers": "*",
          });
        }
        res.status(dbResponse.status).send(dbResponse);
      }
    }
  } catch (error) {
    console.error(new Error(error));
    res.status(500).send(new Response(500, false, error).getResponse());
  }
});

router.put("/", verifyToken, async (req, res) => {
  try {
    const { error } = updateDoctorValidation(req.body);
    res.set({
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Expose-Headers": "*",
    });
    if (error) {
      res.status(400).send(new Response(400, false, error).getResponse());
    } else {
      const doctor = await Doctor.findOneByUserId(req.user.id);
      if (doctor.success) {
        const updatedDoctor = await Doctor.update(doctor.message.id, req.body);
        res.status(updatedDoctor.status).send(updatedDoctor);
      } else {
        res.status(doctor.status).send(doctor);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(new Response(500, false, err).getResponse());
  }
});

router.get("/search-to-invite/:name", verifyToken, async (req, res) => {
  try {
    const name = req.params.name;
    res.set({
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Expose-Headers": "*",
    });
    if (!!name) {
      const doctors = await Doctor.findAllWithoutAffiliation(name);
      res.status(doctors.status).send(doctors);
    } else {
      res
        .status(400)
        .send(
          new Response(
            400,
            false,
            "Please provide name for searching."
          ).getResponse()
        );
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(new Response(500, false, err).getResponse());
  }
});

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null,'./photos/');
//     },
//     filename: function(req, file, cb) {
//         cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true);
//     } else {
//         cb(new Error('The uploaded file format should be jpeg or png.'), false);
//     }
// };
// const upload = multer({ storage: storage , limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter});

// router.put('/', verifyToken, upload.single('photo'), async (req,res) => {
//     try {
//         const { error } = doctorDetailValidation(req.body);
//         if(error) {
//             res.status(406).send(error.details[0].message);
//             return;
//         }
//         const isActivated = { isActivated: doctorDetailValidation(req.body).error ? false : true };
//         const decryptedToken = decodeAccessToken(req.header('auth-token'));
//         const updatedDoctor = Object.assign({}, req.body, isActivated);
//         updatedDoctor.photo = req.file.path.replace('\\','/');

//         const result = await Doctor.findOneAndUpdate({ _id: decryptedToken._id}, updatedDoctor,  {
//             new: true,
//             useFindAndModify: false
//           });
//         res.status(200).send(result);

//     } catch(error) {
//         console.error(new Error(error));
//         res.status(403).send(error);
//     }
// });

// router.post('/vacation-interval', verifyToken, async (req, res) => {
//     try {
//         const { error } = vacationIntervalValidation(req.body);
//         if(error) {
//             res.status(406).send(error.details[0].message);
//             return;
//         }
//         const decryptedToken = decodeAccessToken(req.header('Authorization'));
//         const doctor = await Doctor.findOne({ _id: decryptedToken._id });

//         const vacations = await VacationInterval.find({ doctorID: decryptedToken._id });

//         const workingInterval = new WorkingHoursInterval({
//             doctorID: decryptedToken._id,
//             dayOfWeek: req.body.dayOfWeek,
//             start: req.body.start,
//             end: req.body.end
//         });
//         const savingInterval = await workingInterval.save();

//         console.log(savingInterval);
//         delete savingInterval._doc.doctorID;
//         res.status(200).send(savingInterval);
//         res.status(200).send("Vacation interval response (POST)");
//     } catch(error) {
//         console.log(new Error(error));
//         res.status(400).send(error);
//     }
// });

// router.put('/vacation-interval', verifyToken, async (req, res) => {
//     try {
//         res.status(200).send("Vacation interval response (PUT)");
//     } catch(error) {
//         console.error(new Error(error));
//         res.status(400).send(error);
//     }
// });

// router.delete('/vacation-interval', verifyToken, async (req, res) => {
//     try {
//         res.status(200).send("Vacation interval response (DELETE)");
//     } catch(error) {
//         console.error(new Error(error));
//         res.status(400).send(error);
//     }
// });

// router.get('/schedule', verifyToken, async(req, res) => {
//     try {
//         res.status(200).send("Schedule response (GET)");
//     } catch(error) {
//         console.error(new Error(error));
//         res.status(400).send(error);
//     }
// });

// router.get('/vacation', verifyToken, async(req, res) => {
//     try {
//         res.status(200).send("Vacation response (GET)");
//     } catch(error) {
//         console.log(new Error(error));
//         res.status(400).send(error);
//     }
// });
module.exports = router;
