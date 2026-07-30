import { useState, useEffect } from 'react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';

const Listings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProperties = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      // remove empty values so we don't send blank query params
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const params = new URLSearchParams(cleanFilters).toString();
      const res = await api.get(`/properties?${params}`);
      setProperties(res.data);
    } catch (err) {
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Browse Properties</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <FilterSidebar onFilter={fetchProperties} />
        </div>

        <div className="md:col-span-3">
          {loading && <p>Loading properties...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && properties.length === 0 && <p>No properties found.</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;