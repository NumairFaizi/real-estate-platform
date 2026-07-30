// @route POST /api/upload
// expects multipart/form-data with field name "images" (multiple files)
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const urls = req.files.map((file) => file.path); // Cloudinary URL
    res.json({ urls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadImages };