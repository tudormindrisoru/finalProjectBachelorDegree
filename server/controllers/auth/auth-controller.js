const router = require("express").Router();
var validator = require("email-validator");
const { sendSMS } = require("../../sms-sender");

const User = require("../../models/user");
const Response = require("../../models/response");
const PhoneAuth = require("../../models/phone-auth");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const schedule = require("node-schedule");

const {
  passwordLogInValidation,
  phoneLogInStep1Validation,
  phoneLogInStep2Validation,
  registerStep1Validation,
  registerStep2Validation,
} = require("../../validation");
const { generateAccessToken, verifyToken } = require("../../middlewares/auth");

router.post("/login-with-password", async (req, res) => {
  const { error } = passwordLogInValidation(req.body);
  if (error) {
    res
      .status(400)
      .send({ result: new Response(400, false, error.details[0].message) });
    return;
  }
  const response = await User.findOneByEmailAndPass(
    req.body.email,
    req.body.password
  );
  if (response.status === 200) {
    res.set({
      "Content-Type": "application/json",
      Authorization: "Bearer " + generateAccessToken(response.message.id),
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Expose-Headers": "*",
    });
  }
  res.status(response.status).send(response);
});

router.post("/login-with-phone-step1", async (req, res) => {
  const { error } = phoneLogInStep1Validation(req.body);
  if (error) {
    res
      .status(400)
      .send(new Response(400, false, error.details[0].message).getResponse());
    return;
  }
  const response = await User.findOneByPhone(req.body.phone);
  if (response.status !== 200) {
    res.status(response.status).send(response);
    return;
  }
  const EXPIRATION_DATE = new Date(new Date().getTime() + 5 * 60000);
  const phoneAuth = new PhoneAuth(req.body.phone, EXPIRATION_DATE);
  const addedRes = await phoneAuth.insertIntoDB();
  console.log("SMS = ", addedRes.message.code);
  await sendSMS(addedRes.message.code, addedRes.message.phone);
  res
    .status(201)
    .send(
      new Response(
        201,
        true,
        "Code generated! please send the code received via SMS!"
      ).getResponse()
    );
});

router.post("/login-with-phone-step2", async (req, res) => {
  const { error } = phoneLogInStep2Validation(req.body);
  if (error) {
    res
      .status(400)
      .send(new Response(400, false, error.details[0].message).getResponse());
    return;
  }
  const result = await PhoneAuth.findOneByPhoneInDB(req.body.phone);
  if (!result) {
    res
      .status(404)
      .send(new Response(404, false, "Code expired!").getResponse());
    return;
  }
  if (result.code === req.body.code) {
    result.phoneAuth.removeFromDB();
    const user = await User.findOneByPhone(req.body.phone);
    if (user && user?.status === 200) {
      res.set({
        "Content-Type": "application/json",
        Authorization: "Bearer " + generateAccessToken(user.message.id),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "*",
      });
      res.status(user.status).send(user);
      return;
    }
    res
      .status(404)
      .send(new Response(404, false, "User not found!").getResponse());
    return;
  }
  res
    .status(403)
    .send(new Response(403, false, "The code is not correct!").getResponse());
});

router.post("/register-step1", async (req, res) => {
  const { error } = registerStep1Validation(req.body);
  if (error) {
    res
      .status(400)
      .send(new Response(400, false, error.details[0].message).getResponse());
    return;
  }
  if (validator.validate(req.body.email)) {
    const user = new User(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.password,
      req.body.phone
    );
    const response = await user.save();
    if (response.status === 201) {
      const EXPIRATION_DATE = new Date(new Date().getTime() + 1 * 60000);
      const phoneAuth = new PhoneAuth(req.body.phone, EXPIRATION_DATE);
      const addedRes = await phoneAuth.insertIntoDB();
      if (addedRes.status === 201) {
        await sendSMS(addedRes.message.code, addedRes.message.phone);
        schedule.scheduleJob(EXPIRATION_DATE, function () {
          phoneAuth.removeFromDB();
        });
      }
      res
        .status(201)
        .send(
          new Response(
            201,
            true,
            "Code generated! Please send the code received via SMS!"
          ).getResponse()
        );
      return;
    }
    res.status(response.status).send(response);
    return;
  }
  res
    .status(400)
    .send(new Response(400, false, "This email is invalid.").getResponse());
});

router.post("/register-step2", async (req, res) => {
  const { error } = registerStep2Validation(req.body);

  if (error) {
    res
      .status(400)
      .send(new Response(400, false, error.details[0].message).getResponse());
    return;
  }
  const result = await PhoneAuth.findOneByPhoneInDB(req.body.phone);
  if (!result) {
    res
      .status(404)
      .send(new Response(404, false, "Code expired!").getResponse());
    return;
  }
  if (result.code === req.body.code) {
    await result.phoneAuth.removeFromDB();
    const user = new User(
      undefined,
      undefined,
      undefined,
      undefined,
      req.body.phone
    );
    const isValidated = await user.validate();
    if (isValidated) {
      const user_res = await User.findOneByPhone(req.body.phone);
      res.status(user_res.status).send(user_res);
      return;
    }
    res
      .status(404)
      .send(new Response(404, false, "User not found!").getResponse());

    return;
  }
  res
    .status(403)
    .send(new Response(403, false, "The code is not correct!").getResponse());
});

router.get("/user-by-token", verifyToken, async (req, res) => {
  const user = await User.findOneById(req.user.id);
  res.status(user.status).send(user);
});

module.exports = router;
