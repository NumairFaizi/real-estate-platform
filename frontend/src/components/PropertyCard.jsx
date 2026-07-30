import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  return (
    <Link
      to={`/listings/${property._id}`}
      className="group block bg-white rounded-sm border border-sand overflow-hidden hover:border-brass transition"
    >
      <div className="h-48 bg-sand/40 flex items-center justify-center text-ink/30 overflow-hidden">
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <span className="spec-line">No image</span>
        )}
      </div>

      <div className="p-4">
        <span className="spec-line text-oasis">
          {property.propertyType} · For {property.type}
        </span>

        <h3 className="font-display text-lg mt-1 truncate">{property.title}</h3>
        <p className="text-ink/50 text-sm">{property.location?.city}</p>

        <p className="font-mono text-brass font-medium mt-3 text-lg">
          AED {property.price?.toLocaleString()}
          {property.type === 'rent' && <span className="text-sm text-ink/50"> /yr</span>}
        </p>

        <div className="spec-line text-ink/50 mt-3 flex gap-3 border-t border-sand pt-3">
          <span>{property.bedrooms} bed</span>
          <span>{property.bathrooms} bath</span>
          <span>{property.areaSqft} sqft</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;