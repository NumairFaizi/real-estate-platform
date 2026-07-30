import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <p className="spec-line text-oasis text-center mb-2">Welcome back</p>
        <h2 className="font-display text-3xl text-ink text-center mb-8">Log in</h2>

        <div className="bg-white border border-sand rounded-sm p-8">
          {error && (
            <p className="text-red-600 text-sm mb-4 border border-red-200 bg-red-50 rounded-sm px-3 py-2">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="spec-line text-ink/50 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-sand rounded-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brass"
                required
              />
            </div>

            <div>
              <label className="spec-line text-ink/50 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-sand rounded-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brass"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-ink text-paper py-2.5 rounded-sm hover:bg-ink/90 transition font-medium mt-2 disabled:opacity-50"
            >
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink/60 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-oasis font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;