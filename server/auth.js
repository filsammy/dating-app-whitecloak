const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email
    };

    return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "5d"});

};

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({ auth: "Failed. No Token" });
    }

    if (token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        if (err) {
            return res.status(403).send({
                auth: "Failed",
                message: err.message
            });
        } else {
            req.user = decodedToken;
            next();
        }
    });
};