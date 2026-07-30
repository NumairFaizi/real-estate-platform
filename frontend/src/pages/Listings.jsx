import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';

const Listings = () => {
  const [searchParams] = useSearchParams();
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
    // pick up ?city=... if the user searched from the Home page
    const cityFromUrl = searchParams.get('city');
    fetchProperties(cityFromUrl ? { city: cityFromUrl } : {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <h1 className="font-display text-3xl text-ink mb-8">Browse properties</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <FilterSidebar
            onFilter={fetchProperties}
            initialCity={searchParams.get('city') || ''}
          />
        </div>

        <div className="md:col-span-3">
          {loading && <p className="spec-line text-ink/50">Loading properties…</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {!loading && !error && properties.length === 0 && (
            <p className="text-ink/50">No properties match those filters. Try widening your search.</p>
          )}

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