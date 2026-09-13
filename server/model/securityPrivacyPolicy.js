const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const securityPrivacyPolicySchema = new Schema({
    introduction: { type: String, required: true },
    scope: { type: String, required: true },
    data_collection: { type: String, required: true },
    data_use: { type: String, required: true },
    data_security: { type: String, required: true },
    data_access_rights: { type: String, required: true },
    changes_to_policy: { type: String, required: true },
    contact_information: { type: String, required: true },
    date: { type: String, required: true },
    claims: { type: [String], required: true }
    
  }, { collection : 'SecurityPrivacyPolicy' });
   
  const SecurityPrivacyPolicy = mongoose.model('SecurityPrivacyPolicy', securityPrivacyPolicySchema);
   
  module.exports = SecurityPrivacyPolicy;