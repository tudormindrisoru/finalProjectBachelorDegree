const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../../models/Doctor');
const { authValidation } = require('../../validation');
const { getReturnableDoctorInfos } = require('../../helpers/shared-methods');

router.post('/register', async (req,res) => {
    //validate the user received data
    console.log(req.body);
    const { error } = authValidation(req.body);
    if(error) {
        res.status(406).send(error.details[0].message);
        return;
    }
    //check if user email exist already in database
    const emailExist = await Doctor.findOne({ email:req.body.email });
    if(emailExist) {
        res.status(400).send('Email already in use!');
        return;
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const doctor = new Doctor({
        email: req.body.email,
        password: hashedPassword,
        photo: 'photos/user.png'
    });

    try {
        const savedDoctor = await doctor.save();
        res.status(201).send(getReturnableDoctorInfos(savedDoctor));
    } catch(error) {
        console.error(new Error(error));
        res.status(400).send(error);
    }
});

router.post('/login', async (req,res) => {
    //validate the user received data
    try {
        const { error } = authValidation(req.body); 
        if(error) {
            res.status(406).send(error.details[0].message);
            return;
        }
        //check if the user exist
        const doctor = await Doctor.findOne({ email:req.body.email });
        const correctPassword = await bcrypt.compare(req.body.password, doctor.password);
        if(!doctor || !correctPassword) {
            res.status(400).send('Incorrect credentials! Please try again.');
            return;
        }
        //create and assign token
        const token = jwt.sign({_id: doctor._id},process.env.TOKEN_SECRET);
        res.header('auth-token', token).status(200).send(getReturnableDoctorInfos(doctor._doc));
    } catch(error) {
        console.error(new Error(error));
        res.status(404).send('Bad request!');
    }
});
 
// router.post('/login')

module.exports = router;