const jwt = require('jsonwebtoken');

module.export = function (req,res,next) {
    const token = req.header('auth-token');
    if(!token) {
        return res.status(401).send("Acces denied!");
    }

    try {
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch(error) {
        res.status(401).send("Invalid token!");
    }
}


