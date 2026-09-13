const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignPlaylistSchema = new Schema({
    username: { type: String, required: true },
    playlist_name: { type: String, required: true },
    
  }, { collection : 'AssignPlaylists' });
   
  const AssignPlaylist = mongoose.model('AssignPlaylist', assignPlaylistSchema);
   
  module.exports = AssignPlaylist;