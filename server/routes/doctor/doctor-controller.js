const router = require('express').Router();
const multer = require('multer');
const Doctor = require('../../models/Doctor');
const WorkingHoursInterval = require('../../models/WorkingHoursInterval');
const { verifyToken, decryptID } = require('../../verifyToken');
const { doctorDetailValidation, workingHoursIntervalValidation } = require('../../validation');
const { getReturnableDoctorInfos } = require('../../helpers/shared-methods');
const { verify } = require('jsonwebtoken');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,'./photos/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('The uploaded file format should be jpeg or png.'), false);
    }
};
const upload = multer({ storage: storage , limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter});

router.put('/profile', verifyToken, upload.single('photo'), async (req,res) => {
    try {
        const { error } = doctorDetailValidation(req.body);
        if(error) {
            res.status(406).send(error.details[0].message);
            return;
        }
        const isActivated = { isActivated: doctorDetailValidation(req.body).error ? false : true };
        const decryptedToken = decryptID(req.header('auth-token'));
        const updatedDoctor = Object.assign({}, req.body, isActivated);
        updatedDoctor.photo = req.file.path.replace('\\','/');
        
        const result = await Doctor.findOneAndUpdate({ _id: decryptedToken._id}, updatedDoctor,  {
            new: true,
            useFindAndModify: false
          });
        res.status(200).send(result);
        
    } catch(error) {
        console.error(new Error(error));
        res.status(403).send(error);
    }
});

router.get('/profile', verifyToken , async (req, res) => {
    try {
        const decryptedToken = decryptID(req.header('auth-token'));
        const result = await Doctor.findOne({ _id: decryptedToken._id });
        let doctor = {
            ...result._doc, password: '', _id: '', email: ''
        }
        doctor = getReturnableDoctorInfos(doctor);
        res.status(200).send(doctor);
    } catch(error) {
        console.error(new Error(error));
        res.status(404).send(error);
    }
});

router.post('/schedule-interval', verifyToken, async (req, res) => {
    try {
        const { error } = workingHoursIntervalValidation(req.body);
        if(error) {
            res.status(406).send(error.details[0].message);
            return;
        }
        const decryptedToken = decryptID(req.header('auth-token'));
        const intervals = await WorkingHoursInterval.find({ doctorID: decryptedToken._id,  dayOfWeek: req.body.dayOfWeek });
        for(let interval of intervals) {
            if (
              (interval.start <= req.body.start &&
                interval.end >= req.body.start) ||
              (interval.start >= req.body.start &&
                interval.end >= req.body.end) ||
              (interval.start <= req.body.start &&
                interval.end <= req.body.end) ||
              (interval.start < req.body.start && interval.end < req.body.end)
            ) {
                res.status(406).send("Intervals overflow.");
                return;
            }
        }
        const workingInterval = new WorkingHoursInterval({
            doctorID: decryptedToken._id,
            dayOfWeek: req.body.dayOfWeek,
            start: req.body.start,
            end: req.body.end
        });
        const savingInterval = await workingInterval.save();

        console.log(savingInterval);
        delete savingInterval._doc.doctorID;
        res.status(200).send(savingInterval);
    } catch(error) {
        console.error(new Error(error));
        res.status(400).send(error);
    }
});

router.put('/schedule-interval', verifyToken, async (req, res) => {
    try {

        res.status(200).send("Schedule interval response (PUT)");
    } catch(error) {
        console.error(new Error(error));
        res.status(400).send(error);
    }
});

router.delete('/schedule-interval', verifyToken, async (req, res) => {
    try {
        res.status(200).send("Schedule interval response (DELETE)");
    } catch(error) {
        console.error(new Error(error));
        res.status(400).send(error);
    }
});

router.post('/vacation-interval', verifyToken, async (req, res) => {
    try {
        res.status(200).send("Vacation interval response (POST)");
    } catch(error) {
        console.log(new Error(error));
        res.status(400).send(error);
    }
});

router.put('/vacation-interval', verifyToken, async (req, res) => {
    try {
        res.status(200).send("Vacation interval response (PUT)");
    } catch(error) {
        console.error(new Error(error));
        res.status(400).send(error);
    }
});

router.delete('/vacation-interval', verifyToken, async (req, res) => {
    try {
        res.status(200).send("Vacation interval response (DELETE)");
    } catch(error) {
        console.error(new Error(error));
        res.status(400).send(error);
    }
});

router.get('/schedule', verifyToken, async(req, res) => {
    try {
        res.status(200).send("Schedule response (GET)");
    } catch(error) {
        console.error(new Error(error));
        res.status(400).send(error);
    }
});

router.get('/vacation', verifyToken, async(req, res) => {
    try {
        res.status(200).send("Vacation response (GET)");
    } catch(error) {
        console.log(new Error(error));
        res.status(400).send(error);
    }
});
module.exports = router;