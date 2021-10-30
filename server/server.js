 
 'use strict';
 const express = require('express');
 const app = express();
 const dotenv = require('dotenv');

 dotenv.config();

 //connect to db



//  mongoose.connect(
//     process.env.DB_CONNECT,
//     {   useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true,
//     })
    // .then(() => console.log("Database connected!"))
    // .catch(err => console.log(err));

 const authController = require('./routes/auth/auth-controller');
//  const patientController = require('./routes/patient/patient-controller');
//  const doctorController = require('./routes/doctor/doctor-controller');
//  const officeController = require('./routes/office/office-controller');
 
 // middlewares 
 app.use(express.json());

 app.use((err, req, res, next) => {
    console.log(err.stack);
    console.log(err.name);
    console.log(err.code);

    res.status(500).json({
        message: "Something went wrong!"
    });
 });
  
 app.use(process.env.PHOTOS_DIR, express.static('photos'));
 app.use('/api/auth', authController);
//  app.use('/api/doctor', doctorController);
//  app.use('/api/office', officeController)
//  app.use('/api/patient', patientController);
const PORT = process.env.PORT || 3000;
 app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));