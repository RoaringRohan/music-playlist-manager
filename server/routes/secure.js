const express = require('express');
const router = express.Router();
const verifyRole = require('../middleware/verifyRole');

const AssignPlaylist = require('../model/assignPlaylist');
const Playlist = require('../model/playlist');
const User = require('../model/user');

// All these endpoints require normal user sign in, and they allow user to create/edit/delete playlists, add/remove songs, and add reviews
router.post('/playlist/new', verifyRole("Normal"), async (req, res) => {
    const playlistName = req.body.playlistName;
    const description = req.body.description;
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(404);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(404);
    }

    const checkCap = await AssignPlaylist.find({username: findUser.username}).exec();
    if (checkCap.length >= 20) {
        return res.status(401).json({'message': 'User exceeded 20 playlist count, cannot make more!'});
    }

    const checkDuplicate = await AssignPlaylist.findOne({playlist_name: playlistName}).exec();
    if (checkDuplicate && checkDuplicate.username == findUser.username) {
        return res.status(401).json({'message': 'Playlist with this name already exists in your account.'});
    }
    try {
        const result = await Playlist.create({
            "playlist_name": playlistName,
            "creator_username": findUser.username,
            "created_at": new Date(),
            "number_of_tracks": "0",
            "total_play_time": "0:00",
            "average_rating": "0",
            "description": description,
            "list_of_tracks": [],
            "visibility": "private"
        });

        const secondResult = await AssignPlaylist.create({
            "username": findUser.username,
            "playlist_name": playlistName
        });

        res.status(201).json({'success': `New playlist ${playlistName} created for ${findUser.username}!`});
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
});

router.get('/playlist/view-all', verifyRole("Normal"), async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(404);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(404);
    }

    const playlists = await AssignPlaylist.find({username: findUser.username}).exec();

    const playlistNames = [];
    for (let i = 0; i < playlists.length; i ++) {
        playlistNames.push(playlists[i].playlist_name);
    }

    res.send(playlistNames);
});

router.get('/playlist/view', verifyRole("Normal"), async (req, res) => {
    const playlistName = req.body.playlistName;
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(404);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(404);
    }

    const desiredPlaylist = await Playlist.findOne({playlist_name: playlistName, creator_username: findUser.username}).exec();
    
    if (desiredPlaylist && desiredPlaylist.creator_username == findUser.username) {
        res.send(desiredPlaylist);
    }
    else {
        res.status(401).json({'message': 'Playlist not found'});
    }
});

router.post('/playlist/edit', verifyRole("Normal"), async (req, res) => {
    const playlistName = req.body.playlistName;
    const description = req.body.description;
    const visibility = req.body.visibility;
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(404);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(404);
    }

    const desiredPlaylist = await Playlist.findOne({playlist_name: playlistName, creator_username: findUser.username}).exec();
    if (desiredPlaylist && desiredPlaylist.creator_username == findUser.username) {
        if (description) {
            desiredPlaylist.description = description;
        }
        if (visibility) {
            if (visibility !== 'Private' && visibility !== 'Public') {
                return res.status(401).json({'message': 'When changing visibility, choose Public or Private.'});
            }
            desiredPlaylist.visibility = visibility;
        }
        desiredPlaylist.created_at = new Date();
        const result = await desiredPlaylist.save();
        return res.status(200).json({'message': 'Edited playlist.'});
    }
});

router.delete('/playlist/delete', verifyRole("Normal"), async (req, res) => {
    const playlistName = req.body.playlistName;
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(404);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(404);
    }

    try {
        const desiredPlaylistFromPlaylists = await Playlist.findOne({playlist_name: playlistName, creator_username: findUser.username}).exec();
        if (desiredPlaylistFromPlaylists && desiredPlaylistFromPlaylists.creator_username == findUser.username) {
            const result = await desiredPlaylistFromPlaylists.delete();
        }
    
        const desiredPlaylistFromAssign = await AssignPlaylist.findOne({playlist_name: playlistName, username: findUser.username}).exec();
        if (desiredPlaylistFromAssign && desiredPlaylistFromAssign.username == findUser.username) {
            const result = await desiredPlaylistFromAssign.delete();
        }

        res.status(200).json({'message': `Removed ${playlistName} playlist.`});
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
    
});

router.post('/playlist/track/add', verifyRole("Normal"), async (req, res) => {
    const playlistName = req.body.playlistName;
    const track = req.body.track;
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(404);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(404);
    }

    const desiredPlaylist = await Playlist.findOne({playlist_name: playlistName, creator_username: findUser.username}).exec();
    
    if (!desiredPlaylist || track === "") {
        return res.status(401).json({'message': 'Playlist does not exist/track not inputted.'})
    }

    if (desiredPlaylist && desiredPlaylist.creator_username == findUser.username) {
        let trackArray = desiredPlaylist.list_of_tracks;
        trackArray.push(JSON.stringify(track));

        let [minutes1, seconds1] = desiredPlaylist.total_play_time.split(':').map(str => parseInt(str));

        let [minutes2, seconds2] = track[0].track_duration.split(':').map(str => parseInt(str));

        let totalSeconds = seconds1 + seconds2;
        let extraMinutes = Math.floor(totalSeconds / 60);
        minutes1 += extraMinutes;
        totalSeconds %= 60;

        minutes1 += minutes2;

        const totalTime = `${minutes1}:${totalSeconds.toString().padStart(2, '0')}`;

        let num = parseInt(desiredPlaylist.number_of_tracks);
        num++;
        
        desiredPlaylist.list_of_tracks = trackArray;
        desiredPlaylist.created_at = new Date();
        desiredPlaylist.number_of_tracks = num.toString();
        desiredPlaylist.total_play_time = totalTime;
        const result = await desiredPlaylist.save();

        return res.status(200).json({'message': 'Added track to playlist.'});
    }
});

router.delete('/playlist/track/delete', verifyRole("Normal"), async (req, res) => {
    const playlistName = req.body.playlistName;
    const track = req.body.track;
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(404);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(404);
    }

    const desiredPlaylist = await Playlist.findOne({playlist_name: playlistName, creator_username: findUser.username}).exec();
    
    if (!desiredPlaylist || track === "") {
        return res.status(401).json({'message': 'Playlist does not exist/track not inputted.'})
    }

    if (desiredPlaylist && desiredPlaylist.creator_username == findUser.username) {
        try {
            let trackArray = desiredPlaylist.list_of_tracks;
            for (let i = 0; i < trackArray.length; i ++) {
                if (JSON.parse(trackArray[i]).track_title == track.track_title) {
                    trackArray.splice(i, 1);
                }
            }
            
            let [minutes1, seconds1] = desiredPlaylist.total_play_time.split(':').map(str => parseInt(str));
            let [minutes2, seconds2] = track.track_duration.split(':').map(str => parseInt(str));

            let totalSeconds = seconds1 - seconds2;
            let extraMinutes = Math.floor(totalSeconds / 60);
            minutes1 -= extraMinutes;
            totalSeconds %= 60;

            minutes1 -= minutes2;

            if (totalSeconds < 0) {
            totalSeconds += 60;
            minutes1--;
            }

            if (minutes1 < 0) {
            minutes1 += 60;
            hours--;
            }

            const totalTime = `${minutes1}:${totalSeconds.toString().padStart(2, '0')}`;

            let num = parseInt(desiredPlaylist.number_of_tracks);
            num--;

            desiredPlaylist.list_of_tracks = trackArray;
            desiredPlaylist.number_of_tracks = num.toString();
            desiredPlaylist.total_play_time = totalTime;
            desiredPlaylist.created_at = new Date();
            const result = await desiredPlaylist.save();

            return res.status(200).json({'message': 'Deleted song from playlist.'});
        } catch (err) {
            res.status(500).json({'message': err.message});
        }
    }
});

router.post('/playlist/review/add', verifyRole("Normal"), async (req, res) => {
    const playlistName = req.body.playlistName;
    const playlistOwner = req.body.playlistOwner;
    const comment = req.body.comment;
    const rating = req.body.rating;
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(404);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(404);
    }

    const desiredPlaylist = await Playlist.findOne({playlist_name: playlistName, creator_username: playlistOwner}).exec();
    
    if (!desiredPlaylist) {
        return res.status(401).json({'message': 'Playlist does not exist.'})
    }

    if (desiredPlaylist.visibility == "Private") {
        return res.status(401).json({'message': 'Sorry this playlist is not public so you cannot add a review to this.'})
    }

    if (desiredPlaylist && desiredPlaylist.creator_username == playlistOwner && rating !== "" && desiredPlaylist.visibility == "Public") {
        let reviewsArray = desiredPlaylist.reviews;

        const review = {
            "rating": rating,
            "comment": comment,
            "reviewer": findUser.username,
            "date": new Date(),
            "visibility": "show"
        }
        reviewsArray.push(JSON.stringify(review));

        let total = 0;
        for (let i = 0; i < reviewsArray.length; i ++) {
            total += parseInt(JSON.parse(reviewsArray[i]).rating);
        }
        let calcAvg = (total)/(reviewsArray.length)
        
        desiredPlaylist.average_rating = calcAvg.toString();
        desiredPlaylist.reviews = reviewsArray;
        const result = await desiredPlaylist.save();

        return res.status(200).json({'message': 'Added review to playlist.'});
    }
    else {
        return res.status(401).json({'message': 'Empty field/could not find public playlist.'});
    }
});

module.exports = router;