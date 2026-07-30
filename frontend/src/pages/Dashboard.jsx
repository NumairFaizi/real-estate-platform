import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PropertyForm from '../components/PropertyForm';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myListings, setMyListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [tab, setTab] = useState('listings');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyListings();
    fetchInquiries();
  }, [user]);

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

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setTab('listings')}
          className={`pb-2 px-2 ${tab === 'listings' ? 'border-b-2 border-slate-900 font-semibold' : 'text-slate-500'}`}
        >
          My Listings
        </button>
        <button
          onClick={() => setTab('inquiries')}
          className={`pb-2 px-2 ${tab === 'inquiries' ? 'border-b-2 border-slate-900 font-semibold' : 'text-slate-500'}`}
        >
          Inquiries
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {tab === 'listings' && (
        <>
          {!showForm && !editingProperty && (
            <button onClick={() => setShowForm(true)} className="bg-slate-900 text-white px-4 py-2 rounded mb-6">
              + Add New Property
            </button>
          )}

          {showForm && (
            <div className="mb-6">
              <PropertyForm onSubmit={handleCreate} submitLabel="Create Listing" />
              <button onClick={() => setShowForm(false)} className="text-sm text-slate-500 mt-2">Cancel</button>
            </div>
          )}

          {editingProperty && (
            <div className="mb-6">
              <PropertyForm
                initialData={{
                  ...editingProperty,
                  address: editingProperty.location?.address,
                  city: editingProperty.location?.city,
                  lat: editingProperty.location?.lat,
                  lng: editingProperty.location?.lng,
                  amenities: editingProperty.amenities?.join(', '),
                  images: editingProperty.images?.join(', '),
                }}
                onSubmit={handleUpdate}
                submitLabel="Update Listing"
              />
              <button onClick={() => setEditingProperty(null)} className="text-sm text-slate-500 mt-2">Cancel</button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {myListings.map((p) => (
              <div key={p._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-slate-500">{p.location?.city} • AED {p.price?.toLocaleString()} • {p.status}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingProperty(p)} className="text-sm border px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-sm border border-red-500 text-red-500 px-3 py-1 rounded">Delete</button>
                </div>
              </div>
            ))}
            {myListings.length === 0 && <p className="text-slate-500">No listings yet.</p>}
          </div>
        </>
      )}

      {tab === 'inquiries' && (
        <div className="grid grid-cols-1 gap-4">
          {inquiries.map((inq) => (
            <div key={inq._id} className="bg-white p-4 rounded-lg shadow">
              <p className="font-semibold">{inq.property?.title}</p>
              <p className="text-sm text-slate-500">From: {inq.user?.name} ({inq.user?.email})</p>
              <p className="text-sm text-slate-500">Phone: {inq.contactNumber}</p>
              <p className="mt-2">{inq.message}</p>
            </div>
          ))}
          {inquiries.length === 0 && <p className="text-slate-500">No inquiries yet.</p>}
        </div>
      )}
    </div>
  );
};

export default Dashboard;