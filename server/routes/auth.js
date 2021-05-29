const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const { authValidation } = require('../validation');

router.post('/register', async (req,res) => {
    //validate the user received data
    const { error } = authValidation(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
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
        password: hashedPassword
    });

    try {
        const savedDoctor = await doctor.save();
        res.status(201).send(savedDoctor);
    } catch(error) {
        console.log(error);
        res.status(400).send(error);
    }
});

router.post('/login', async (req,res) => {
    //validate the user received data
    const { error } = authValidation(req.body); 
    if(error) {
        res.status(400).send(error.details[0].message);
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
    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
    res.header('auth-token', token).status(200).send("Logged in!");
});
 
// router.post('/login')

module.exports = router;