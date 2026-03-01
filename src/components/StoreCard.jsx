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
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 group"
    >
      {/* Logo */}
      <div className="shrink-0">
        {!imgError && store.logoUrl ? (
          <img
            src={store.logoUrl}
            alt={store.name}
            onError={() => setImgError(true)}
            className="w-16 h-16 rounded-xl object-cover border border-gray-100"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
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
          <span className="inline-block mt-1.5 text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
            {store.category}
          </span>
        )}
      </div>

      {/* Arrow */}
      <svg className="shrink-0 text-gray-300 group-hover:text-indigo-400 transition-colors duration-150" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </Link>
  );
};

export default StoreCard;