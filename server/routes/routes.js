const router = require("express").Router();
const authController = require("../controllers/auth/auth-controller");
const userController = require("../controllers/user/user-controller");
const doctorController = require("../controllers/doctor/doctor-controller");
const officeController = require("../controllers/office/office-controller");
const appointmentController = require("../controllers/appointment/appointment-controller");
const sseController = require("../controllers/sse/sse-controller");

router.use("/auth", authController);
router.use("/doctors", doctorController);
router.use("/users", userController);
router.use("/offices", officeController);
router.use("/appointments", appointmentController);
router.use("/sse", sseController);

module.exports = router;
