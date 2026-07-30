const Property = require('../models/Property');

// @route GET /api/properties
// supports filters: city, minPrice, maxPrice, bedrooms, type, propertyType
const getProperties = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, bedrooms, type, propertyType } = req.query;

    const filter = {};

    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (type) filter.type = type;
    if (propertyType) filter.propertyType = propertyType;
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/properties/:id
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('postedBy', 'name email');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/properties (protected: agent/admin only)
const createProperty = async (req, res) => {
  try {
    if (req.user.role !== 'agent' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create listings' });
    }

    const property = await Property.create({
      ...req.body,
      postedBy: req.user.id,
    });

    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/properties/:id (protected: owner/admin only)
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this listing' });
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/properties/:id (protected: owner/admin only)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await property.deleteOne();
    res.json({ message: 'Property removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};