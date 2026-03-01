import { useEffect, useState } from "react";
import storeService from "../api/storeService";
import StoreCard from "../components/StoreCard";

const Home = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await storeService.getAllStores();
        setStores(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = stores.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-900">Print Stores</h1>
          <p className="text-sm text-gray-400 mt-1">
            Select a store to upload your documents for printing
          </p>

          {/* Search */}
          <div className="relative mt-5 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Loading skeletons */}
        {loading && (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 animate-pulse">
                <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-gray-300">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">
              {search ? `No stores matching "${search}"` : "No stores available right now"}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-2 text-xs text-indigo-500 hover:text-indigo-600 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Store Grid */}
        {!loading && filtered.length > 0 && (
          <>
            <p className="text-xs text-gray-400 font-medium mb-4">
              {filtered.length} {filtered.length === 1 ? "store" : "stores"} found
            </p>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((store) => (
                <StoreCard key={store._id} store={store} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;