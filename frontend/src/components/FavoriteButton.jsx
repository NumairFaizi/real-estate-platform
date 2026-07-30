import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const FavoriteButton = ({ propertyId }) => {
  const { user, fetchUser } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setIsFavorited(user.savedListings?.includes(propertyId));
  }, [user, propertyId]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    setLoading(true);
    try {
      if (isFavorited) {
        await api.delete(`/auth/favorites/${propertyId}`);
        setIsFavorited(false);
      } else {
        await api.post(`/auth/favorites/${propertyId}`);
        setIsFavorited(true);
      }
      await fetchUser(); // Syncs global context
    } catch (err) {
      // fail silently, button just won't toggle
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition ${
        isFavorited ? 'bg-brass text-ink' : 'bg-white/90 text-ink/50 hover:text-brass'
      }`}
      aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
    >
      {isFavorited ? '★' : '☆'}
    </button>
  );
};

export default FavoriteButton;