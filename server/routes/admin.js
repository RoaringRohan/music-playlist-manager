const express = require('express');
const router = express.Router();

const verifyRole = require('../middleware/verifyRole');
const Playlist = require('../model/playlist');
const User = require('../model/user');
const SecurityPrivacyPolicy = require('../model/securityPrivacyPolicy');
const DmcaNoticeTakedownPolicy = require('../model/dmcaNoticeTakedownPolicy');
const AcceptableUsePolicy = require('../model/acceptableUsePolicy');

// Routes here only allowed for admins, also they allow admin to deactivate/activate users, disable/enable reviews, and create/edit policies
router.post('/grant-privilege', verifyRole("Admin"), async (req, res) => {
    const emailAddress = req.body.emailAddress;

    const findUser = await User.findOne({emailAddress: emailAddress}).exec();

    if (!findUser) return res.status(401).json({'message': 'Cannot find user.'});

    findUser.role = "Admin";
    const result = await findUser.save();
    res.sendStatus(200);
});

router.post('/make-review-hidden', verifyRole("Admin"), async (req, res) => {
    const playlistName = req.body.playlistName;
    const playlistOwner = req.body.playlistOwner;
    const reviewer = req.body.reviewer;
    const date = req.body.date;

    const desiredPlaylist = await Playlist.findOne({playlist_name: playlistName, creator_username: playlistOwner}).exec();

    if (!desiredPlaylist) return res.status(401).json({'message': 'Cannot find playlist.'});

    let reviewsArray = desiredPlaylist.reviews;

    try {
        for (let i = 0; i < reviewsArray.length; i ++) {
            if (JSON.parse(reviewsArray[i]).reviewer == reviewer && JSON.parse(reviewsArray[i]).date == date) {
                let review = JSON.parse(reviewsArray[i]);
                review.visibility = "hidden";
                jsonString = JSON.stringify(review);
                reviewsArray[i] = jsonString;
    
                desiredPlaylist.reviews = reviewsArray;
                const result = await desiredPlaylist.save();
    
                res.status(200).json({'message': 'Changed review to hidden.'});
            }
        }
    } catch (err) {
        return res.status(401).json({'message': `Could not change review's visibility.`});
    }
    
});

router.post('/make-review-show', verifyRole("Admin"), async (req, res) => {
    const playlistName = req.body.playlistName;
    const playlistOwner = req.body.playlistOwner;
    const reviewer = req.body.reviewer;
    const date = req.body.date;

    const desiredPlaylist = await Playlist.findOne({playlist_name: playlistName, creator_username: playlistOwner}).exec();

    if (!desiredPlaylist) return res.status(401).json({'message': 'Cannot find playlist.'});

    let reviewsArray = desiredPlaylist.reviews;

    try {
        for (let i = 0; i < reviewsArray.length; i ++) {
            if (JSON.parse(reviewsArray[i]).reviewer == reviewer && JSON.parse(reviewsArray[i]).date == date) {
                let review = JSON.parse(reviewsArray[i]);
                review.visibility = "show";
                jsonString = JSON.stringify(review);
                reviewsArray[i] = jsonString;
    
                desiredPlaylist.reviews = reviewsArray;
                const result = await desiredPlaylist.save();
    
                res.status(200).json({'message': 'Changed review to show.'});
            }
        }
    } catch (err) {
        return res.status(401).json({'message': `Could not change review's visibility.`});
    }
    
});

router.post('/usage/activate', verifyRole("Admin"), async (req, res) => {
    const emailAddress = req.body.emailAddress;

    const findUser = await User.findOne({emailAddress: emailAddress}).exec();

    if (!findUser) return res.status(401).json({'message': 'Account was not found.'});
    
    if (findUser.usage == "active") return res.status(401).json({'message': 'Account is already active.'});

    if (findUser.usage = "deactivated") {
        findUser.usage = "active";
        const result = await findUser.save();
        res.status(200).json({'message': 'Account activated again'});
    }
});

router.post('/usage/deactivate', verifyRole("Admin"), async (req, res) => {
    const emailAddress = req.body.emailAddress;

    const findUser = await User.findOne({emailAddress: emailAddress}).exec();

    if (!findUser) return res.status(401).json({'message': 'Account was not found.'});
    
    if (findUser.usage == "deactivated") return res.status(401).json({'message': 'Account is already deactivated.'});

    if (findUser.usage = "active") {
        findUser.usage = "deactivated";
        const result = await findUser.save();
        res.status(200).json({'message': 'Account deactivated.'});
    }
});

router.post('/create-security-and-privacy-policy', verifyRole("Admin"), async (req, res) => {
    const { introduction, scope, data_collection, data_use, data_security, data_access_rights, changes_to_policy, contact_information, claims } = req.body;

    const date = (new Date()).toString();

    const policy = new SecurityPrivacyPolicy({
        introduction,
        scope,
        data_collection,
        data_use,
        data_security,
        data_access_rights,
        changes_to_policy,
        contact_information,
        date,
        claims
    });

    try {
        await policy.save();

        res.status(201).json({ message: 'Policy created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/edit-security-and-privacy-policy', verifyRole("Admin"), async (req, res) => {
    const { introduction, scope, data_collection, data_use, data_security, data_access_rights, changes_to_policy, contact_information, date, claims } = req.body;

    try {
        const policy = await SecurityPrivacyPolicy.findOne({ date: date });
    
        if (!policy) return res.status(404).json({ message: 'Policy not found' });
    
        const newDate = new Date();

        policy.introduction = introduction;
        policy.scope = scope;
        policy.data_collection = data_collection;
        policy.data_use = data_use;
        policy.data_security = data_security;
        policy.data_access_rights = data_access_rights;
        policy.changes_to_policy = changes_to_policy;
        policy.contact_information = contact_information;
        policy.date = newDate.toString();
        policy.claims = claims;
    
        await policy.save();
    
        res.status(201).json({ message: 'Policy updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/add-claim-security-and-privacy-policy', verifyRole("Admin"), async (req, res) => {
    const date = req.body.date
    const claims = req.body.claims;

    try {
        const policy = await SecurityPrivacyPolicy.findOne({ date: date });
    
        if (!policy) return res.status(404).json({ message: 'Policy not found' });
    
        const newDate = (new Date()).toString();
        let claimsArray = policy.claims;

        const object = {
            "claim": claims,
            "date": newDate
        }
        claimsArray.push(JSON.stringify(object));

        policy.claims = claimsArray;
    
        await policy.save();
    
        res.status(201).json({ message: 'Policy claim added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/create-dmca-notice-and-takedown-policy', verifyRole("Admin"), async (req, res) => {
    const { introduction, copyright_ownership, infringed_material, process, disclaimer, contact_information, claims } = req.body;

    const date = (new Date()).toString();

    const policy = new DmcaNoticeTakedownPolicy({
        introduction,
        copyright_ownership,
        infringed_material,
        process,
        disclaimer,
        contact_information,
        date,
        claims
    });

    try {
        await policy.save();

        res.status(201).json({ message: 'Policy created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/edit-dmca-notice-and-takedown-policy', verifyRole("Admin"), async (req, res) => {
    const { introduction, copyright_ownership, infringed_material, process, disclaimer, contact_information, date, claims } = req.body;

  try {
    const policy = await DmcaNoticeTakedownPolicy.findOne({ date: date });

    if (!policy) return res.status(404).json({ message: 'Policy not found' });

    const newDate = new Date();

    policy.introduction = introduction;
    policy.copyright_ownership = copyright_ownership;
    policy.infringed_material = infringed_material;
    policy.process = process;
    policy.disclaimer = disclaimer;
    policy.contact_information = contact_information;
    policy.date = newDate.toString();
    policy.claims = claims;

    await policy.save();

    res.status(201).json({ message: 'Policy updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/add-claim-dmca-notice-and-takedown-policy', verifyRole("Admin"), async (req, res) => {
    const date = req.body.date
    const claims = req.body.claims;

    try {
        const policy = await DmcaNoticeTakedownPolicy.findOne({ date: date });
    
        if (!policy) return res.status(404).json({ message: 'Policy not found' });
    
        const newDate = (new Date()).toString();
        let claimsArray = policy.claims;

        const object = {
            "claim": claims,
            "date": newDate
        }
        claimsArray.push(JSON.stringify(object));

        policy.claims = claimsArray;
    
        await policy.save();
    
        res.status(201).json({ message: 'Policy claim added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/create-acceptable-use-policy', verifyRole("Admin"), async (req, res) => {
    const { introduction, scope, prohibited_activities, compliance_with_laws, security, monitoring_and_enforcement, changes_to_policy, contact_information, claims } = req.body;

    const date = (new Date()).toString();

    const policy = new AcceptableUsePolicy({
        introduction,
        scope,
        prohibited_activities,
        compliance_with_laws,
        security,
        monitoring_and_enforcement,
        changes_to_policy,
        contact_information,
        date,
        claims
    });

    try {
        await policy.save();

        res.status(201).json({ message: 'Policy created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/edit-acceptable-use-policy', verifyRole("Admin"), async (req, res) => {
    const { introduction, scope, prohibited_activities, compliance_with_laws, security, monitoring_and_enforcement, changes_to_policy, contact_information, date, claims } = req.body;

    try {
        const policy = await AcceptableUsePolicy.findOne({ date: date });

        if (!policy) return res.status(404).json({ message: 'Policy not found' });

        const newDate = (new Date()).toString();

        policy.introduction = introduction;
        policy.scope = scope;
        policy.prohibited_activities = prohibited_activities;
        policy.compliance_with_laws = compliance_with_laws;
        policy.security = security;
        policy.monitoring_and_enforcement = monitoring_and_enforcement;
        policy.changes_to_policy = changes_to_policy;
        policy.contact_information = contact_information;
        policy.date = newDate;
        policy.claims = claims;

        await policy.save();

        res.status(201).json({ message: 'Policy updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/add-claim-acceptable-use-policy', verifyRole("Admin"), async (req, res) => {
    const date = req.body.date
    const claims = req.body.claims;

    try {
        const policy = await AcceptableUsePolicy.findOne({ date: date });
    
        if (!policy) return res.status(404).json({ message: 'Policy not found' });
    
        const newDate = (new Date()).toString();
        let claimsArray = policy.claims;

        const object = {
            "claim": claims,
            "date": newDate
        }
        claimsArray.push(JSON.stringify(object));

        policy.claims = claimsArray;
    
        await policy.save();
    
        res.status(201).json({ message: 'Policy claim added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;