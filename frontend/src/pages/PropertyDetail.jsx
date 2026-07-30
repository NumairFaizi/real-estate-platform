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
      await api.post('/inquiries', { property: id, message, contactNumber });
      setInquirySent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send inquiry');
    }
  };

  if (loading) return <p className="spec-line text-ink/50 p-10 text-center">Loading…</p>;
  if (error && !property) return <p className="text-red-500 p-10 text-center">{error}</p>;

  const hasCoords = property.location?.lat && property.location?.lng;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      {/* Image Gallery */}
      <div className="mb-8">
        <div className="h-96 bg-sand/40 rounded-sm overflow-hidden flex items-center justify-center">
          {property.images?.length > 0 ? (
            <img
              src={property.images[activeImage]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="spec-line text-ink/40">No images available</span>
          )}
        </div>

        {property.images?.length > 1 && (
          <div className="flex gap-2 mt-2">
            {property.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-20 object-cover rounded-sm cursor-pointer border-2 ${
                  activeImage === idx ? 'border-brass' : 'border-transparent'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: Details */}
        <div className="md:col-span-2">
          <span className="spec-line text-oasis">
            {property.propertyType} · For {property.type}
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-ink mt-2">{property.title}</h1>
          <p className="text-ink/50 mt-1">{property.location?.address}, {property.location?.city}</p>

          <p className="font-mono text-3xl text-brass font-medium mt-5">
            AED {property.price?.toLocaleString()}
            {property.type === 'rent' && <span className="text-base text-ink/50 font-sans"> /year</span>}
          </p>

          <div className="spec-line text-ink/60 flex gap-6 mt-5 border-y border-sand py-4">
            <span>{property.bedrooms} bed</span>
            <span>{property.bathrooms} bath</span>
            <span>{property.areaSqft} sqft</span>
          </div>

          <h3 className="font-display text-xl text-ink mt-8">Description</h3>
          <p className="text-ink/70 mt-3 leading-relaxed">{property.description}</p>

          {property.amenities?.length > 0 && (
            <>
              <h3 className="font-display text-xl text-ink mt-8">Amenities</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {property.amenities.map((a, idx) => (
                  <span key={idx} className="spec-line bg-sand/40 text-ink/70 px-3 py-1.5 rounded-sm">
                    {a}
                  </span>
                ))}
              </div>
            </>
          )}

          {hasCoords && (
            <div className="mt-8">
              <h3 className="font-display text-xl text-ink mb-3">Location</h3>
              <div className="h-64 rounded-sm overflow-hidden border border-sand">
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
        <div className="bg-white border border-sand rounded-sm p-6 h-fit">
          <h3 className="font-display text-xl text-ink mb-1">Contact agent</h3>
          <p className="spec-line text-ink/40 mb-5">Posted by {property.postedBy?.name}</p>

          {!user && (
            <p className="text-sm text-ink/50">
              <a href="/login" className="text-oasis font-medium hover:underline">Log in</a> to send an inquiry.
            </p>
          )}

          {user && inquirySent && (
            <p className="text-oasis text-sm border border-oasis/30 bg-oasis/10 rounded-sm px-3 py-2">
              Inquiry sent — the agent will contact you soon.
            </p>
          )}

          {user && !inquirySent && (
            <form onSubmit={handleInquiry} className="flex flex-col gap-3">
              <input
                type="tel"
                placeholder="Your contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="border border-sand rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
                required
              />
              <textarea
                placeholder="I'm interested in this property…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border border-sand rounded-sm px-3 py-2 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-brass"
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" className="bg-ink text-paper py-2.5 rounded-sm text-sm font-medium hover:bg-ink/90 transition">
                Send inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;