const router = require("express").Router();
const multer = require("multer");
const { verifyToken } = require("../../middlewares/auth");
const User = require("../../models/user");
const Response = require("../../models/response");
const { updateUserValidation } = require("../../validation");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./photos/");
  },
  filename: function (req, file, cb) {
    const arr = file.originalname.split(".");
    const extension = arr[arr.length - 1];

    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") +
        req.user.id +
        "." +
        extension
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
    return;
  }
  cb(new Error("The uploaded file format should be jpeg or png."), false);
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

router.get("/", verifyToken, async (req, res) => {
  const name = req.query.name;
  if (!!name) {
    const result = await User.findAllByName(name, req.user.id);
    if (result.success) {
    }
    res.status(result.status).send(result);
    return;
  }
  res
    .status(404)
    .send(
      new Response(
        404,
        false,
        "User name is missing. Add a name in query request."
      ).getResponse()
    );
});

router.put(
  "/update-photo",
  verifyToken,
  upload.single("photo"),
  async (req, res) => {
    const photoPath = req.file.path.replace("\\", "/");
    const result = await User.updatePhotoById(req.user.id, photoPath);
    res.status(result.status).send(result);
  }
);

router.put("/", verifyToken, async (req, res) => {
  const { error } = updateUserValidation(req.body);
  if (error) {
    res
      .status(400)
      .send(new Response(400, false, error.details[0].message).getResponse());
    return;
  }

  const result = await User.updateUserById(req.body, req.user.id);
  res.status(result.status).send(result);
});

module.exports = router;
