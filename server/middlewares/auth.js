const jwt = require("jsonwebtoken");

function generateAccessToken(id) {
  return jwt.sign({ id: id }, process.env.TOKEN_SECRET, { expiresIn: "1d" });
}

function decodeAccessToken(token) {
  return jwt_decode(token);
}

const verifyToken = (req, res, next) => {
  const token =
    req.headers && req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;
  if (!token) {
    return res.status(403).send("A token is required for this action");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    res.set({
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Expose-Headers": "*",
    });
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = { generateAccessToken, decodeAccessToken, verifyToken };
