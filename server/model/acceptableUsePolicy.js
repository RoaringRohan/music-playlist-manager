const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const acceptableUsePolicySchema = new Schema({
    introduction: { type: String, required: true },
    scope: { type: String, required: true },
    prohibited_activities: { type: String, required: true },
    compliance_with_laws: { type: String, required: true },
    security: { type: String, required: true },
    monitoring_and_enforcement: { type: String, required: true },
    changes_to_policy: { type: String, required: true },
    contact_information: { type: String, required: true },
    date: { type: String, required: true },
    claims: { type: [String], required: true }
    
  }, { collection : 'AcceptableUsePolicy' });
   
  const AcceptableUsePolicy = mongoose.model('AcceptableUsePolicy', acceptableUsePolicySchema);
   
  module.exports = AcceptableUsePolicy;