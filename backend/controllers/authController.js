const User = require('../models/User');

// @route POST /api/users/favorites/:propertyId
const addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.savedListings.includes(req.params.propertyId)) {
      user.savedListings.push(req.params.propertyId);
      await user.save();
    }
    res.json(user.savedListings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/users/favorites/:propertyId
const removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedListings = user.savedListings.filter(
      (id) => id.toString() !== req.params.propertyId
    );
    await user.save();
    res.json(user.savedListings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/users/favorites
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedListings');
    res.json(user.savedListings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};