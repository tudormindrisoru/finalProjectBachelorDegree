const router = require('express').Router();
var validator = require("email-validator");

const User = require('../../models/user');
const Response = require('../../models/response');
const PhoneAuth = require('../../models/phone-auth');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const schedule = require('node-schedule');
 
const { 
    passwordLogInValidation,
    phoneLogInStep1Validation,
    phoneLogInStep2Validation,
    registerStep1Validation,
    registerStep2Validation
} = require('../../validation');


router.post('/login-with-password', async(req, res) => {
    const { error } = passwordLogInValidation(req.body);
    if(error) {
        res.status(400).send({ "result": new Response(400, error.details[0].message) });
    } else {
        const response = await User.findOneByEmailAndPass(req.body.email,req.body.password);
        res.status(response.status).send(response);
    }
});

router.post('/login-with-phone-step1', async(req, res) => {

    const { error } = phoneLogInStep1Validation(req.body);
    if(error) {
        res.status(400).send(new Response(400, error.details[0].message).getResponse());
    } else {
        const response = await User.findOneByPhone(req.body.phone);
        if(response.status !== 200) {
            res.status(response.status).send(response);
        } else {
            const EXPIRATION_DATE = new Date(new Date().getTime() + 5*60000);
            const phoneAuth = new PhoneAuth(response._message.id, req.body.phone, EXPIRATION_DATE);
            const addedRes = await phoneAuth.insertIntoDB();
            if(addedRes.status === 201) {
                // TO DO: Use Twilio to send SMS to user.
                schedule.scheduleJob(EXPIRATION_DATE, function(){
                       phoneAuth.removeFromDB();
                });
            }
            res.status(201).send(new Response(201,"Code generated! please send the code received via SMS!").getResponse());
        }
    }
});

router.post('/login-with-phone-step2', async(req, res) => {
    const { error } = phoneLogInStep2Validation(req.body);
    if(error) {
        res.status(400).send(new Response(400, error.details[0].message).getResponse());
    } else {
        const result = await PhoneAuth.findOneByPhoneInDB(req.body.phone);
        if(!result) {
            res.status(404).send(new Response(404, "Code expired!").getResponse());
        } else {
            if(result.code === req.body.code) {
                result.phoneAuth.removeFromDB();
                const user = await User.findOneByPhone(result.phoneAuth.phone);
                if(user) {
                    res.status(user.status).send(user);
                } else {
                    res.status(404).send(new Response(404, "User not found!").getResponse());
                }
            } else {
                res.status(403).send(new Response(403,"The code is not correct!").getResponse());
            }
        }
    }
});

router.post('/register-step1', async(req, res) => {
    const { error } = registerStep1Validation(req.body);
    if(error) {
        res.status(400).send(new Response(400, error.details[0].message).getResponse());
    } else {
        if(validator.validate(req.body.email)) {

            const user = new User(req.body.firstName, req.body.lastName, req.body.email, req.body.email, req.body.password);
            const response = await user.save();
            if(response.status === 201) {
                const EXPIRATION_DATE = new Date(new Date().getTime() + 1*60000);
                const phoneAuth = new PhoneAuth(response.message.id, req.body.phone, EXPIRATION_DATE);
                const addedRes = await phoneAuth.insertIntoDB();
                if(addedRes.status === 201) {
                    // TO DO: Use Twilio to send SMS to user.
                    schedule.scheduleJob(EXPIRATION_DATE, function(){
                           phoneAuth.removeFromDB();
                    });
                }
                res.status(201).send(new Response(201,"Code generated! Please send the code received via SMS!").getResponse());
            } else {
                res.status(response.status).send(response);
            }
        } else {
            res.status(400).send(new Response(400,"This email is invalid.").getResponse());
        }
    }
});

router.post('/register-step2', async(req, res) => {
    const { error } = registerStep2Validation(req.body);
    
    if(error) {
        res.status(400).send(new Response(400,error.details[0].message).getResponse());
    } else {
        const result = await PhoneAuth.findOneByPhoneInDB(req.body.phone);
        if(!result) {
            res.status(404).send(new Response(404, "Code expired!").getResponse());
        } else {
            if(result.code === req.body.code) {
                result.phoneAuth.removeFromDB();
                const user = await User.findOneByPhone(result.phoneAuth.phone);
                const isValidated = await user.validate();
                if(isValidated) {
                    res.status(user.status).send(user);
                } else {
                    res.status(404).send(new Response(404, "User not found!").getResponse());
                }
            } else {
                res.status(403).send(new Response(403,"The code is not correct!").getResponse());
            }
        }
    }
}); 

module.exports = router;