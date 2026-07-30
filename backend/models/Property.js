const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['sale', 'rent'],
    required: true,
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'villa', 'independent-house', 'builder-floor', 'plot', 'office'],
    required: true,
  },

  bedrooms: {
    type: Number,
    default: 0,
  },
  bathrooms: {
    type: Number,
    default: 0,
  },
  areaSqft: {
    type: Number,
    required: true,
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
  },
  images: [
    {
      type: String, // Cloudinary URLs, added later
    },
  ],
  amenities: [
    {
      type: String,
    },
  ],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'rented'],
    default: 'available',
  },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);