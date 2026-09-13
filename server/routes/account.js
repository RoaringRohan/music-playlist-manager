const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { default: mongoose } = require('mongoose');
const { find } = require('../model/user');
const router = express.Router();

const User = require('../model/user');

// These routes do not require authentication because you need these routes to make accounts/login, etc.
router.post('/register', async (req, res) => {
    const username = req.body.username;
    const emailAddress = req.body.emailAddress;
    const password = req.body.password;

    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!validRegex.test(emailAddress)) {
        return res.status(401).json({'message': 'Not a valid email address.'});
    }

    const checkDuplicateEmail = await User.findOne({emailAddress: emailAddress}).exec();
    if (checkDuplicateEmail) {
        return res.status(409).json({'message': 'Account with this email already exists.'});
    }

    const checkDuplicateUsername = await User.findOne({username: username}).exec();
    if (checkDuplicateUsername) {
        return res.status(409).json({'message': 'Pick a different username, this one is in use.'});
    }

    try {

        const hashed = await bcrypt.hash(password, 10);

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.PASSWORD
            }
        });

        const token = jwt.sign(
            { 
                "UserInformation": {
                    "username": username,
                    "emailAddress": emailAddress,
                    "password": hashed
                }
            },
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '1d' }
        );

        const mailConfiguration = {
            from: process.env.EMAIL_USERNAME,
            to: emailAddress,
            subject: 'Email Verification',
            text: `Hi! There, You have created an account with us. Please follow the given link to verify your email, this link expires in 1 day!
                   http://localhost:3000/api/account/verify/${token} 
                   Thanks`
        };

        await transport.sendMail(mailConfiguration, function(error, info){
            if (error) throw Error(error);
            console.log(info);
            res.sendStatus(200).json({'message': 'Email Sent Successfully'})
        });

    } catch (err) {
        res.status(500).json({'message': err.message});
    }
});

router.get('/verify/:token', async (req, res) => {
    const {token} = req.params;

    try {
        await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded) {
            if (err) return res.status(403).json({'message': 'Email verification failed, possibly the link is invalid or expired'});
            
            const result = await User.create({
                "usage": "active",
                "username": decoded.UserInformation.username,
                "emailAddress": decoded.UserInformation.emailAddress,
                "password": decoded.UserInformation.password,
                "role": "Normal"
            });
        });
    
        return res.status(201).json({'success': `New user created!`});
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
});

router.post('/login', async (req, res) => {
    const emailAddress = req.body.emailAddress;
    const password = req.body.password;

    if (!emailAddress) return res.status(400).json({'message': 'Email Address not entered.'});
    else if (!password) return res.status(400).json({'message': 'Password not entered.'});

    const findUser = await User.findOne({emailAddress: emailAddress}).exec();

    if (!findUser) return res.status(401).json({'message': 'Email Address/Password was incorrect.'});
    if (findUser.usage === 'deactivated') return res.status(401).json({'message': 'Account has been deactivated, contact admin to log in.'})

    const crossCheckPassword = await bcrypt.compare(password, findUser.password);

    if (crossCheckPassword) {
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
        const refreshToken = jwt.sign(
            { "username": findUser.username }, 
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: '1d' }
        );

        findUser.refreshToken = refreshToken;
        const result = await findUser.save();

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000 });
        
        //res.cookie('jwt-access', accessToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000 });
        res.json({ accessToken, "role": findUser.role });
    }
    else return res.status(401).json({'message': 'Username/Password was incorrect.'});
});

router.post('/update-password', async (req, res) => {
    const newPassword = req.body.password;
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(404);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(404);
    }
    
    const hashed = await bcrypt.hash(newPassword, 10);

    findUser.password = hashed;
    const result = await findUser.save();

    res.sendStatus(204);
});

router.get('/logout', async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }
    
    findUser.refreshToken = '';
    const result = await findUser.save();

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
});

router.get('/deactivate', async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }
    
    findUser.username = 'deactivated';
    findUser.refreshToken = '';
    const result = await findUser.save();

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
});

module.exports = router;