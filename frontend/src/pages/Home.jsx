import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(city ? `/listings?city=${encodeURIComponent(city)}` : '/listings');
  };

  return (
    <div>
      <section className="bg-ink text-paper px-6 md:px-10 pt-20 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="spec-line text-brass mb-4">Mumbai · Pune · Bangalore · Delhi</p>
          <h1 className="font-display text-4xl md:text-6xl leading-tight">
            Property, drawn to scale.
          </h1>
          <p className="text-sand mt-5 max-w-xl mx-auto text-lg">
            Every listing here comes with real numbers — price, size, and location —
            laid out the way you'd read a floor plan, not a brochure.
          </p>

          <form onSubmit={handleSearch} className="mt-10 flex max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search by city — e.g. Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 px-4 py-3 rounded-l-sm text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-brass"
            />
            <button
              type="submit"
              className="bg-brass text-ink px-6 py-3 rounded-r-sm font-medium hover:bg-brass/90 transition"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="border-b border-sand bg-paper px-6 md:px-10 py-6">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6 text-center spec-line text-ink/70">
          <div>
            <p className="font-display text-2xl text-ink normal-case tracking-normal">Verified</p>
            Listings only
          </div>
          <div>
            <p className="font-display text-2xl text-ink normal-case tracking-normal">Direct</p>
            Agent contact
          </div>
          <div>
            <p className="font-display text-2xl text-ink normal-case tracking-normal">No fee</p>
            To browse
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 text-center">
        <h2 className="font-display text-3xl text-ink">Listing a property?</h2>
        <p className="text-ink/60 mt-2">Agents post for free — no commission on inquiries.</p>
        <button
          onClick={() => navigate('/register')}
          className="mt-6 bg-oasis text-paper px-6 py-3 rounded-sm hover:bg-oasis/90 transition font-medium"
        >
          Register as an agent
        </button>
      </section>
    </div>
  );
};

export default Home;