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
  images: [],
};

const inputClass = "w-full border border-sand rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brass";
const labelClass = "spec-line text-ink/50 block mb-1";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white border border-sand rounded-sm p-6">
      <div>
        <label className={labelClass}>Title</label>
        <input name="title" value={form.title} onChange={handleChange} className={inputClass} required />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className={`${inputClass} h-24`} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Price (AED)</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Listing type</label>
          <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Property type</label>
        <select name="propertyType" value={form.propertyType} onChange={handleChange} className={inputClass}>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="townhouse">Townhouse</option>
          <option value="office">Office</option>
          <option value="plot">Plot</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Bedrooms</label>
          <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Bathrooms</label>
          <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Area (sqft)</label>
          <input name="areaSqft" type="number" value={form.areaSqft} onChange={handleChange} className={inputClass} required />
        </div>
      </div>

      <div>
        <label className={labelClass}>Address</label>
        <input name="address" value={form.address} onChange={handleChange} className={inputClass} required />
      </div>

      <div>
        <label className={labelClass}>City</label>
        <input name="city" value={form.city} onChange={handleChange} className={inputClass} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Latitude (optional)</label>
          <input name="lat" type="number" step="any" value={form.lat} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Longitude (optional)</label>
          <input name="lng" type="number" step="any" value={form.lng} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Amenities (comma separated)</label>
        <input name="amenities" value={form.amenities} onChange={handleChange} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Image URLs (comma separated)</label>
        <input name="images" value={form.images} onChange={handleChange} className={inputClass} />
      </div>

      <button type="submit" className="bg-ink text-paper py-2.5 rounded-sm font-medium hover:bg-ink/90 transition mt-2">
        {submitLabel}
      </button>
    </form>
  );
};

export default PropertyForm;