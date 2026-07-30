import { useState } from 'react';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  type: 'sale',
  propertyType: 'apartment',
  bedrooms: '',
  bathrooms: '',
  areaSqft: '',
  address: '',
  city: '',
  lat: '',
  lng: '',
  amenities: '',
  images: '',
};

const PropertyForm = ({ initialData, onSubmit, submitLabel = 'Save' }) => {
  const [form, setForm] = useState(initialData || emptyForm);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      type: form.type,
      propertyType: form.propertyType,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      areaSqft: Number(form.areaSqft),
      location: {
        address: form.address,
        city: form.city,
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
      },
      amenities: form.amenities
        ? form.amenities.split(',').map((a) => a.trim()).filter(Boolean)
        : [],
      images: form.images
        ? form.images.split(',').map((i) => i.trim()).filter(Boolean)
        : [],
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white p-6 rounded-lg shadow">
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2 rounded" required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded h-24" required />

      <div className="grid grid-cols-2 gap-3">
        <input name="price" type="number" placeholder="Price (AED)" value={form.price} onChange={handleChange} className="border p-2 rounded" required />
        <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded">
          <option value="sale">Sale</option>
          <option value="rent">Rent</option>
        </select>
      </div>

      <select name="propertyType" value={form.propertyType} onChange={handleChange} className="border p-2 rounded">
        <option value="apartment">Apartment</option>
        <option value="villa">Villa</option>
        <option value="townhouse">Townhouse</option>
        <option value="office">Office</option>
        <option value="plot">Plot</option>
      </select>

      <div className="grid grid-cols-3 gap-3">
        <input name="bedrooms" type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={handleChange} className="border p-2 rounded" />
        <input name="bathrooms" type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={handleChange} className="border p-2 rounded" />
        <input name="areaSqft" type="number" placeholder="Area (sqft)" value={form.areaSqft} onChange={handleChange} className="border p-2 rounded" required />
      </div>

      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="border p-2 rounded" required />
      <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="border p-2 rounded" required />

      <div className="grid grid-cols-2 gap-3">
        <input name="lat" type="number" step="any" placeholder="Latitude (optional)" value={form.lat} onChange={handleChange} className="border p-2 rounded" />
        <input name="lng" type="number" step="any" placeholder="Longitude (optional)" value={form.lng} onChange={handleChange} className="border p-2 rounded" />
      </div>

      <input name="amenities" placeholder="Amenities (comma separated)" value={form.amenities} onChange={handleChange} className="border p-2 rounded" />
      <input name="images" placeholder="Image URLs (comma separated)" value={form.images} onChange={handleChange} className="border p-2 rounded" />

      <button type="submit" className="bg-slate-900 text-white py-2 rounded mt-2">{submitLabel}</button>
    </form>
  );
};

export default PropertyForm;