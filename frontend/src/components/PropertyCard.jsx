import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  return (
    <Link
      to={`/listings/${property._id}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
    >
      <div className="h-48 bg-slate-200 flex items-center justify-center text-slate-400">
        {property.images?.[0] ? (
          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
        ) : (
          <span>No Image</span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{property.title}</h3>
        <p className="text-slate-500 text-sm">{property.location?.city}</p>

        <p className="text-slate-900 font-bold mt-2">
          AED {property.price?.toLocaleString()}
          {property.type === 'rent' && <span className="text-sm font-normal">/yr</span>}
        </p>

        <div className="flex gap-3 text-sm text-slate-500 mt-2">
          <span>{property.bedrooms} Beds</span>
          <span>{property.bathrooms} Baths</span>
          <span>{property.areaSqft} sqft</span>
        </div>

        <span className="inline-block mt-3 text-xs px-2 py-1 bg-slate-100 rounded capitalize">
          {property.propertyType} • For {property.type}
        </span>
      </div>
    </Link>
  );
};

export default PropertyCard;