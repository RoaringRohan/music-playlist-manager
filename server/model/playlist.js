const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
    playlist_name: { type: String, required: true },
    creator_username: { type: String, required: true },
    created_at: {type: Date, required: true},
    number_of_tracks: { type: String, required: true },
    total_play_time: { type: String, required: true },
    average_rating: { type: String, required: true },
    description: { type: String, required: true },
    list_of_tracks: { type: [String], required: true },
    visibility: { type: String, required: true},
    reviews: { type: [String], required: true }

  }, { collection : 'Playlists' });
   
  const Playlist = mongoose.model('Playlist', playlistSchema);
   
  module.exports = Playlist;