import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/storeSlice";

const Navbar = () => {
  const { storeInfo } = useSelector((state) => state.store);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `text-sm font-medium transition ${
      isActive(path)
        ? "text-indigo-600"
        : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white border-b px-6 transition-shadow duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14">
          
          {/* Logo */}
          <Link to="/" className="font-bold text-lg">
            Scan<span className="text-indigo-600">2</span>Print
          </Link>

          {/* Desktop Links */}
          <div className="flex items-center gap-6">
            
            <Link to="/" className={linkClass("/")}>
              Home
            </Link>

            {storeInfo && (
              <>
                <Link
                  to="/dashboard"
                  className={linkClass("/dashboard")}
                >
                  Dashboard
                </Link>

                <Link
                  to="/mystore"
                  className={linkClass("/mystore")}
                >
                  My Store
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            )}

            {!storeInfo && (
              <>
                <Link to="/login" className={linkClass("/login")}>
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="h-14" />
    </>
  );
};

export default Navbar;