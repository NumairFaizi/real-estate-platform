import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [inquirySent, setInquirySent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        setError('Property not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleInquiry = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inquiries', {
        property: id,
        message,
        contactNumber,
      });
      setInquirySent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send inquiry');
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;
  if (error && !property) return <p className="p-8 text-red-500">{error}</p>;

  const hasCoords = property.location?.lat && property.location?.lng;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Image Gallery */}
      <div className="mb-6">
        <div className="h-96 bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
          {property.images?.length > 0 ? (
            <img
              src={property.images[activeImage]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-slate-400">No Images Available</span>
          )}
        </div>

        {property.images?.length > 1 && (
          <div className="flex gap-2 mt-2">
            {property.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                  activeImage === idx ? 'border-slate-900' : 'border-transparent'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Details */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">{property.title}</h1>
          <p className="text-slate-500 mt-1">{property.location?.address}, {property.location?.city}</p>

          <p className="text-2xl font-bold mt-4">
            AED {property.price?.toLocaleString()}
            {property.type === 'rent' && <span className="text-base font-normal"> /year</span>}
          </p>

          <div className="flex gap-6 mt-4 text-slate-700">
            <span>{property.bedrooms} Bedrooms</span>
            <span>{property.bathrooms} Bathrooms</span>
            <span>{property.areaSqft} sqft</span>
          </div>

          <h3 className="font-semibold text-lg mt-6">Description</h3>
          <p className="text-slate-600 mt-2">{property.description}</p>

          {property.amenities?.length > 0 && (
            <>
              <h3 className="font-semibold text-lg mt-6">Amenities</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {property.amenities.map((a, idx) => (
                  <span key={idx} className="bg-slate-100 px-3 py-1 rounded text-sm">{a}</span>
                ))}
              </div>
            </>
          )}

          {hasCoords && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Location</h3>
              <div className="h-64 rounded-lg overflow-hidden">
                <MapContainer
                  center={[property.location.lat, property.location.lng]}
                  zoom={14}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[property.location.lat, property.location.lng]}>
                    <Popup>{property.title}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}
        </div>

        {/* Right: Inquiry Form */}
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h3 className="font-semibold text-lg mb-4">Contact Agent</h3>
          <p className="text-sm text-slate-500 mb-4">
            Posted by {property.postedBy?.name}
          </p>

          {!user && (
            <p className="text-sm text-slate-500">Please log in to send an inquiry.</p>
          )}

          {user && inquirySent && (
            <p className="text-green-600 text-sm">Inquiry sent! The agent will contact you soon.</p>
          )}

          {user && !inquirySent && (
            <form onSubmit={handleInquiry} className="flex flex-col gap-3">
              <input
                type="tel"
                placeholder="Your Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="border p-2 rounded text-sm"
                required
              />
              <textarea
                placeholder="I'm interested in this property..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border p-2 rounded text-sm h-24"
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" className="bg-slate-900 text-white py-2 rounded text-sm">
                Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;