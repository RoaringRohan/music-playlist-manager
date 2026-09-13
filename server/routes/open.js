const express = require('express');
const { default: mongoose } = require('mongoose');
const { find } = require('../model/track');
const Track = require('../model/track');
const Playlist = require('../model/playlist');
const SecurityPrivacyPolicy = require('../model/securityPrivacyPolicy');
const DmcaNoticeTakedownPolicy = require('../model/dmcaNoticeTakedownPolicy');
const AcceptableUsePolicy = require('../model/acceptableUsePolicy');
const router = express.Router();

//All these routes are accessible without needing to sign in, it displays the top playlists and the policies and allows people to search tracks
router.post('/tracks', async (req, res) => {
    const artist_name = req.body.artist_name;
    const track_genres = req.body.track_genres;
    const track_title = req.body.track_title;

    const searchParams = {};

  if (track_title) {
    searchParams.track_title = { $regex: track_title, $options: 'i' };
  }
  if (artist_name) {
    searchParams.artist_name = { $regex: artist_name, $options: 'i' };
  }
  if (track_genres) {
    searchParams.track_genres = { $regex: track_genres, $options: 'i' };
  }

  await Track.find(searchParams, 'track_title artist_name album_title track_genres track_duration track_date_created')
    .limit(20)
    .exec((err, tracks) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }
      const modifiedTracks = tracks.map(track => {
        return {
          track_title: track.track_title,
          artist_name: track.artist_name,
          album_title: track.album_title,
          track_genres: track.track_genres,
          track_duration: track.track_duration,
          track_date_created: track.track_date_created,
          youtube_search_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${track.artist_name} ${track.track_title}`)}`
        };
      });

      res.send(modifiedTracks);
    });
});

router.get('/playlists', async (req, res) => {
    await Playlist.find({ is_public: true }, 'playlist_name creator_username number_of_tracks total_play_time average_rating description list_of_tracks')
      .sort({ created_at: -1 })
      .limit(10)
      .exec((err, playlists) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }
        res.send(playlists);
      });
});

router.get('/security-and-privacy-policy', async (req, res) => {
  try {
      const policies = await SecurityPrivacyPolicy.find();
  
      res.json(policies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

router.get('/dmca-notice-and-takedown-policy', async (req, res) => {
  try {
      const policies = await DmcaNoticeTakedownPolicy.find();
  
      res.json(policies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

router.get('/acceptable-use-policy', async (req, res) => {
  try {
      const policies = await AcceptableUsePolicy.find();
  
      res.json(policies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

module.exports = router;