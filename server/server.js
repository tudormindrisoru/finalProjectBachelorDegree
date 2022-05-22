"use strict";
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

//  const WEBSITE_URL = 'http://localhost:4200';
app.use(
  cors({
    origin: "*",
  })
);

dotenv.config();

const authController = require("./routes/auth/auth-controller");
const userController = require("./routes/user/user-controller");
const doctorController = require("./routes/doctor/doctor-controller");
const officeController = require("./routes/office/office-controller");
const appointmentController = require("./routes/appointment/appointment-controller");
const sseController = require("./routes/sse/sse-controller");

// middlewares
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: "Something went wrong!",
  });
});

app.use(process.env.PHOTOS_DIR, express.static("photos"));
app.use("/api/auth", authController);
app.use("/api/doctors", doctorController);
app.use("/api/users", userController);
app.use("/api/offices", officeController);
app.use("/api/appointments", appointmentController);
app.use("/api/sse", sseController);
//  app.use('/api/patient', patientController);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
