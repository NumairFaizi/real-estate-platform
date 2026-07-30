import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">RealEstateHub</Link>
      <div className="flex gap-4 items-center">
        <Link to="/listings">Listings</Link>
        {user ? (
          <>
            <span>Hi, {user.name}</span>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            {user && <Link to="/dashboard">Dashboard</Link>}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;