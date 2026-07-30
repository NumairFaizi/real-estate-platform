import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-ink text-paper px-6 md:px-10 py-5 flex justify-between items-center border-b border-brass/30">
      <Link to="/" className="font-display text-2xl tracking-tight">
        Real<span className="text-brass">Estate</span>Hub
      </Link>

      <div className="flex gap-6 items-center spec-line">
        <Link to="/listings" className="hover:text-brass transition">Listings</Link>

        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-brass transition">Dashboard</Link>
            <span className="text-sand hidden sm:inline">Hi, {user.name}</span>
            <button
              onClick={logout}
              className="border border-paper/30 px-3 py-1.5 rounded-sm hover:border-brass hover:text-brass transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-brass transition">Login</Link>
            <Link
              to="/register"
              className="bg-brass text-ink px-4 py-1.5 rounded-sm hover:bg-brass/90 transition font-medium"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;