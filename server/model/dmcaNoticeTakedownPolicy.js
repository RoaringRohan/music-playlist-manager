const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dmcaNoticeTakedownPolicySchema = new Schema({
    introduction: { type: String, required: true },
    copyright_ownership: { type: String, required: true },
    infringed_material: { type: String, required: true },
    process: { type: String, required: true },
    disclaimer: { type: String, required: true },
    contact_information: { type: String, required: true },
    date: { type: String, required: true },
    claims: { type: [String], required: true }
    
  }, { collection : 'DmcaNoticeTakedownPolicy' });
   
  const DmcaNoticeTakedownPolicy = mongoose.model('DmcaNoticeTakedownPolicy', dmcaNoticeTakedownPolicySchema);
   
  module.exports = DmcaNoticeTakedownPolicy;