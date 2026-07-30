const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

const createInquiry = async (req, res) => {
  try {
    const { property, message, contactNumber } = req.body;
    const inquiry = await Inquiry.create({
      property,
      user: req.user.id,
      message,
      contactNumber,
    });
    res.status(201).json(inquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get inquiries for properties owned by the logged-in agent
const getMyInquiries = async (req, res) => {
  try {
    const myProperties = await Property.find({ postedBy: req.user.id }).select('_id');
    const propertyIds = myProperties.map((p) => p._id);

    const inquiries = await Inquiry.find({ property: { $in: propertyIds } })
      .populate('property', 'title')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createInquiry, getMyInquiries };