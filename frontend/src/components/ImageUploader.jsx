import { useState } from 'react';
import api from '../services/api';

const ImageUploader = ({ images, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (images.length + files.length > 6) {
      setError('Max 6 images per listing');
      return;
    }

    setError('');
    setUploading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange([...images, ...res.data.urls]);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url) => {
    onChange(images.filter((img) => img !== url));
  };

  return (
    <div>
      <label className="spec-line text-ink/50 block mb-1">Photos (up to 6)</label>

      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((url) => (
          <div key={url} className="relative w-20 h-20">
            <img src={url} className="w-full h-full object-cover rounded-sm border border-sand" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-ink text-paper rounded-full text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <label className="inline-block border border-sand border-dashed rounded-sm px-4 py-3 text-sm text-ink/60 cursor-pointer hover:border-brass transition">
        {uploading ? 'Uploading…' : '+ Upload images'}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ImageUploader;