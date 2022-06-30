const router = require("express").Router();
const Sse = require("../../models/sse");

router.get("/", async (req, res) => {
  await Sse.configureSse(res);
});

module.exports = router;
