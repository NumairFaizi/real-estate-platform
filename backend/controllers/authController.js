const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      savedListings: user.savedListings,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      savedListings: user.savedListings,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/favorites/:propertyId
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

// @route DELETE /api/auth/favorites/:propertyId
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

// @route GET /api/auth/favorites
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedListings');
    res.json(user.savedListings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, getMe, addFavorite, removeFavorite, getFavorites };