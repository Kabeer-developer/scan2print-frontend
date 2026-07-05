import { useState } from "react";
import { Link } from "react-router-dom";

const StoreCard = ({ store }) => {
  const [imgError, setImgError] = useState(false);

  const initials = store.name
    ? store.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "ST";

  return (
    <Link
      to={`/store/${store._id}`}
      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 hover:-translate-y-0.5 transition-all duration-200 group"
    >
      {/* Logo */}
      <div className="shrink-0">
        {!imgError && store.logoUrl ? (
          <img
            src={store.logoUrl}
            alt={store.name}
            onError={() => setImgError(true)}
            className="w-16 h-16 rounded-xl object-cover border border-gray-100 ring-1 ring-transparent group-hover:ring-indigo-100 transition-all duration-200"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg tracking-tight">
            {initials}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-150">
          {store.name}
        </h3>
        {store.location && (
          <p className="text-sm text-gray-400 mt-0.5 truncate flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {store.location}
          </p>
        )}
        {store.category && (
          <span className="inline-block mt-1.5 text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
            {store.category}
          </span>
        )}
      </div>

      {/* Arrow */}
      <div className="shrink-0 w-7 h-7 rounded-full bg-gray-50 group-hover:bg-indigo-50 flex items-center justify-center transition-colors duration-150">
        <svg className="text-gray-300 group-hover:text-indigo-500 transition-colors duration-150" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>
    </Link>
  );
};

export default StoreCard;