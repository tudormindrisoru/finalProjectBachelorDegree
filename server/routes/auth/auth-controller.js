const router = require('express').Router();

const User = require('../../models/user');
const Response = require('../../models/response');
const PhoneAuth = require('../../models/phone-auth');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const schedule = require('node-schedule');


const { 
    passwordAuthValidation, 
    phoneAuthStep1Validation, 
    phoneAuthStep2Validation 
} = require('../../validation');


router.post('/login-with-password', async(req, res) => {
    const { error } = passwordAuthValidation(req.body);
    if(error) {
        res.status(400).send({ "result": new Response(400, error.details[0].message) });
    } else {
        const response = await User.findOneByEmailAndPass(req.body.email,req.body.password);
        res.status(200).send({ "result": response.getResponse()});
    }
});

router.post('/login-with-phone-step1', async(req, res) => {

    const { error } = phoneAuthStep1Validation(req.body);
    if(error) {
        res.status(400).send({ "result": new Response(400, error.details[0].message).getResponse()});
    } else {
        const response = await User.findOneByPhone(req.body.phone);
        if(response._status !== 200) {
            res.status(404).send(response.getResponse());
        } else {
            const EXPIRATION_DATE = new Date(new Date().getTime() + 1*60000);
            const phoneAuth = new PhoneAuth(response._message.id, req.body.phone, EXPIRATION_DATE);
            const addedRes = await phoneAuth.insertIntoDB();
            if(addedRes.getResponse().status === 201) {
                schedule.scheduleJob(EXPIRATION_DATE, function(){
                       phoneAuth.removeFromDB();
                });
            }
            // AICI VOI PRIMI UN NUMAR DE TELEFON -> VERIFICARE IN USERS DACA EXISTA VREUN USER CU ACEST NUMAR 
            // -> SALVARE INTR-O TABELA 'PHONEAUTH' NUMARUL DE TELEFON, ID-ul USERULUI, COD DE 6 CIFRE GENERAT SI EXPIREDATE (DUPA CE EXPIREDATE TRECE VA FI STERS)
            // RETURNEAZA ID-UL USERULUI.
            // !!! TWILIO VA TRIMITE UN MESAJ LA NUMARUL DE TELEFON A USERULUI CU CODUL SALVAT IN TABELA !!!
            res.status(201).send("Code generated! please send the code received via SMS!");
        }
    }
});

router.post('/login-with-phone-step2', async(req, res) => {
    // PRIMESTE ID-uL USERULUI SI CODUL DE 6 CARACTERE SCRIS DE USER 
    // IN CAZ DE CODUL CORESPUNDE CU CEL DIN TABELA -> TRIMITE DATELE USERULUI + JSON WEB TOKEN
    // IN CAZ DE CODUL NU CORESPUNDE -> TRIMITE 401 UNAUTHORIZED 
    // PERMITE REINCERCARI
    const { error } = phoneAuthStep2Validation(req.body);
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
                    res.status(200).send(user.getResponse());
                } else {
                    res.status(404).send(new Response(404, "User not found!"));
                }
            } else {
                res.status(403).send(new Response(403,"The code is not correct!").getResponse());
            }
        }
    }
});

router.post('/register-step1', async(req, res) => {
    const user = new User('Mindrisoru','Tudor','tudorg12.mindrisoru@gmail.com','password','0742748693');
    const response = await user.save();
    res.status(200).send({ "result": response });
});

router.post('/register-step2', async(req, res) => {

}); 
// router.post('/register', async (req,res) => {
//     //validate the user received data
//     console.log(req.body);
//     const { error } = authValidation(req.body);
//     if(error) {
//         res.status(406).send(error.details[0].message);
//         return;
//     }
//     //check if user email exist already in database
//     const emailExist = await Doctor.findOne({ email:req.body.email });
//     if(emailExist) {
//         res.status(400).send('Email already in use!');
//         return;
//     }

//     //hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);
//     const doctor = new Doctor({
//         email: req.body.email,
//         password: hashedPassword,
//         photo: 'photos/user.png'
//     });

//     try {
//         const savedDoctor = await doctor.save();
//         res.status(201).send(getReturnableDoctorInfos(savedDoctor));
//     } catch(error) {
//         console.error(new Error(error));
//         res.status(400).send(error);
//     }
// });

// router.post('/login', async (req,res) => {
//     //validate the user received data
//     try {
//         const { error } = authValidation(req.body); 
//         if(error) {
//             res.status(406).send(error.details[0].message);
//             return;
//         }
//         //check if the user exist
//         const doctor = await Doctor.findOne({ email:req.body.email });
//         const correctPassword = await bcrypt.compare(req.body.password, doctor.password);
//         if(!doctor || !correctPassword) {
//             res.status(400).send('Incorrect credentials! Please try again.');
//             return;
//         }
//         //create and assign token
//         const token = jwt.sign({_id: doctor._id},process.env.TOKEN_SECRET);
//         res.header('auth-token', token).status(200).send(getReturnableDoctorInfos(doctor._doc));
//     } catch(error) {
//         console.error(new Error(error));
//         res.status(404).send('Bad request!');
//     }
// });
 
// router.post('/login')

module.exports = router;