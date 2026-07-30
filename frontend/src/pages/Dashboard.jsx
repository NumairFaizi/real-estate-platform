import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PropertyForm from '../components/PropertyForm';
import PropertyCard from '../components/PropertyCard';
import { formatPriceShort } from '../utils/formatPrice';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [myListings, setMyListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [tab, setTab] = useState('listings');
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyListings();
    fetchInquiries();
    fetchFavorites();
  }, [user, authLoading]);

  const fetchMyListings = async () => {
    const res = await api.get('/properties');
    setMyListings(res.data.filter((p) => p.postedBy?._id === user._id || p.postedBy === user._id));
  };

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/inquiries/my');
      setInquiries(res.data);
    } catch (err) {
      // agent may have no listings yet, ignore
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/auth/favorites');
      setFavorites(res.data);
    } catch (err) {
      // ignore
    }
  };

  const handleCreate = async (payload) => {
    try {
      await api.post('/properties', payload);
      setShowForm(false);
      fetchMyListings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await api.put(`/properties/${editingProperty._id}`, payload);
      setEditingProperty(null);
      fetchMyListings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.delete(`/properties/${id}`);
      fetchMyListings();
    } catch (err) {
      setError('Failed to delete listing');
    }
  };

  if (authLoading) return <p className="spec-line text-ink/50 p-10 text-center">Loading…</p>;
  if (!user) return null;

  const tabClass = (name) =>
    `pb-2 px-1 spec-line transition ${
      tab === name ? 'border-b-2 border-brass text-ink' : 'text-ink/40 hover:text-ink/70'
    }`;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <h1 className="font-display text-3xl text-ink mb-8">Dashboard</h1>

      <div className="flex gap-6 mb-8 border-b border-sand">
        <button onClick={() => setTab('listings')} className={tabClass('listings')}>My listings</button>
        <button onClick={() => setTab('inquiries')} className={tabClass('inquiries')}>Inquiries</button>
        <button onClick={() => setTab('favorites')} className={tabClass('favorites')}>Saved</button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {tab === 'listings' && (
        <>
          {!showForm && !editingProperty && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-brass text-ink px-5 py-2.5 rounded-sm font-medium hover:bg-brass/90 transition mb-8"
            >
              + Add new property
            </button>
          )}

          {showForm && (
            <div className="mb-8">
              <PropertyForm onSubmit={handleCreate} submitLabel="Create listing" />
              <button onClick={() => setShowForm(false)} className="spec-line text-ink/50 mt-3 hover:text-ink">
                Cancel
              </button>
            </div>
          )}

          {editingProperty && (
            <div className="mb-8">
              <PropertyForm
                initialData={{
                  ...editingProperty,
                  address: editingProperty.location?.address,
                  city: editingProperty.location?.city,
                  lat: editingProperty.location?.lat,
                  lng: editingProperty.location?.lng,
                  amenities: editingProperty.amenities,
                  images: editingProperty.images || [],
                }}
                onSubmit={handleUpdate}
                submitLabel="Update listing"
              />
              <button onClick={() => setEditingProperty(null)} className="spec-line text-ink/50 mt-3 hover:text-ink">
                Cancel
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {myListings.map((p) => (
              <div key={p._id} className="bg-white border border-sand rounded-sm p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-display text-lg text-ink">{p.title}</h3>
                  <p className="spec-line text-ink/50 mt-1">
                    {p.location?.city} · {formatPriceShort(p.price)} · {p.status}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditingProperty(p)}
                    className="spec-line border border-sand px-3 py-1.5 rounded-sm hover:border-ink/40 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="spec-line border border-red-200 text-red-500 px-3 py-1.5 rounded-sm hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {myListings.length === 0 && <p className="text-ink/50">No listings yet.</p>}
          </div>
        </>
      )}

      {tab === 'inquiries' && (
        <div className="grid grid-cols-1 gap-3">
          {inquiries.map((inq) => (
            <div key={inq._id} className="bg-white border border-sand rounded-sm p-4">
              <p className="font-display text-lg text-ink">{inq.property?.title}</p>
              <p className="spec-line text-ink/50 mt-1">
                {inq.user?.name} · {inq.user?.email} · {inq.contactNumber}
              </p>
              <p className="mt-3 text-ink/70">{inq.message}</p>
            </div>
          ))}
          {inquiries.length === 0 && <p className="text-ink/50">No inquiries yet.</p>}
        </div>
      )}

      {tab === 'favorites' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((p) => (
            <PropertyCard key={p._id} property={p} />
          ))}
          {favorites.length === 0 && <p className="text-ink/50">No saved properties yet.</p>}
        </div>
      )}
    </div>
  );
};

export default Dashboard;