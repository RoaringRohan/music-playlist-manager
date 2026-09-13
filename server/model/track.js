const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trackSchema = new Schema({
    track_title: { type: String, required: true },
    artist_name: { type: String, required: true },
    album_title: { type: String, required: true },
    track_genres: { type: [String], required: true },
    track_duration: { type: String, required: true },
    track_date_created: { type: String, required: true }
    
  }, { collection : 'Tracks' });
   
  const Track = mongoose.model('Track', trackSchema);
   
  module.exports = Track;