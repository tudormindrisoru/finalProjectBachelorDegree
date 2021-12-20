const jwt = require('jsonwebtoken');

function generateAccessToken(id) {
    return jwt.sign({ "id": id }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
}

function decodeAccessToken(token) {
    console.log(jwt_decode(token));
    return jwt_decode(token);
}

const verifyToken = (req, res, next) => {
    const token = req.headers && req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
    if (!token) {
      return res.status(403).send("A token is required for this action");
    }
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = decoded;
      console.log(decoded);
    } catch (err) {
        console.log(err);
      return res.status(401).send("Invalid Token");
    }
    return next();
  };


module.exports = { generateAccessToken, decodeAccessToken, verifyToken }