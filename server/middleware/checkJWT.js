const jwt = require('jsonwebtoken');
require('dotenv').config();

// Ensures that the correct user is being accessed
const checkJWT = (req, res, next) => {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = header.split(' ')[1];
    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403);
            req.user = decoded.UserInformation.username;
            req.role = decoded.UserInformation.role;
            next();
        }
    );
}

module.exports = checkJWT;