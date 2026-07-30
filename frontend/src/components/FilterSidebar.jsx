import { useState } from 'react';

const FilterSidebar = ({ onFilter, initialCity = '' }) => {
  const [filters, setFilters] = useState({
    city: initialCity,
    type: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const cleared = { city: '', type: '', propertyType: '', minPrice: '', maxPrice: '', bedrooms: '' };
    setFilters(cleared);
    onFilter(cleared);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow flex flex-col gap-3 h-fit">
      <h3 className="font-semibold text-lg mb-2">Filters</h3>

      <input
        type="text"
        name="city"
        placeholder="City"
        value={filters.city}
        onChange={handleChange}
        className="border p-2 rounded text-sm"
      />

      <select name="type" value={filters.type} onChange={handleChange} className="border p-2 rounded text-sm">
        <option value="">Sale or Rent</option>
        <option value="sale">Sale</option>
        <option value="rent">Rent</option>
      </select>

      <select name="propertyType" value={filters.propertyType} onChange={handleChange} className="border p-2 rounded text-sm">
        <option value="">Property Type</option>
        <option value="apartment">Apartment</option>
        <option value="villa">Villa</option>
        <option value="townhouse">Townhouse</option>
        <option value="office">Office</option>
        <option value="plot">Plot</option>
      </select>

      <input
        type="number"
        name="minPrice"
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={handleChange}
        className="border p-2 rounded text-sm"
      />

      <input
        type="number"
        name="maxPrice"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={handleChange}
        className="border p-2 rounded text-sm"
      />

      <input
        type="number"
        name="bedrooms"
        placeholder="Min Bedrooms"
        value={filters.bedrooms}
        onChange={handleChange}
        className="border p-2 rounded text-sm"
      />

      <div className="flex gap-2 mt-2">
        <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded text-sm flex-1">
          Apply
        </button>
        <button type="button" onClick={handleReset} className="border px-4 py-2 rounded text-sm">
          Reset
        </button>
      </div>
    </form>
  );
};

export default FilterSidebar;