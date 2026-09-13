const express = require('express');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const router = express.Router();

const User = require('../model/user');

// Ensures the cookie can be refreshed into a new jwt token
router.get('/', async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) return res.status(403);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || findUser.username !== decoded.username) return res.sendStatus(403);
            
            const accessToken = jwt.sign(
                { 
                    "UserInformation": {
                        "username": findUser.username,
                        "role": findUser.role
                    }
                }, 
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '300s' }
            );
            res.json({ accessToken })
        }
    );
})

module.exports = router;