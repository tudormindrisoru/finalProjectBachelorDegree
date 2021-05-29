 const express = require('express');
 const app = express();
 const dotenv = require('dotenv');
 const mongoose = require('mongoose');


 dotenv.config();
 //connect to db
 mongoose.connect(
    process.env.DB_CONNECT,
    {   useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));

 const authRoutes = require('./routes/auth');

 // middlewares 
 app.use(express.json());
  
 app.use('/api/doctor', authRoutes);

 app.listen(3000, () => console.log('Server up and running'));