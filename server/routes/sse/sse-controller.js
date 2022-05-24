const router = require("express").Router();
const Sse = require("../../models/sse");

router.get("/", async (req, res) => {
  await Sse.configureSse(res);
});

// const notif1 = {
//   type: "OFFICE_INVITE",
//   message: {
//     doctorId: 1,
//     entryId: 2,
//   },
// };

// const notif2 = {
//   type: "APPOINTMENT_REQUEST",
//   message: {
//     doctorId: 1,
//     entryId: 59,
//   },
// };
module.exports = router;
