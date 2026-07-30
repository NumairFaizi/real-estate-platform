const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  contactNumber: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);