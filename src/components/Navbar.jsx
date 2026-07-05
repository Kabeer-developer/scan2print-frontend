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
    `relative text-sm font-medium py-1 transition-colors duration-200 ${
      isActive(path)
        ? "text-indigo-600 after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-indigo-600 after:rounded-full"
        : "text-slate-500 hover:text-slate-900"
    }`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b transition-all duration-300 ${
          scrolled ? "shadow-sm border-slate-200" : "border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
          
          {/* Logo */}
          <Link
            to="/"
            className="font-semibold text-xl tracking-tight text-slate-900"
          >
            Scan<span className="text-indigo-600">2</span>Print
          </Link>

          {/* Desktop Links */}
          <div className="flex items-center gap-8">
            
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

                <div className="h-5 w-px bg-slate-200" />

                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors duration-200"
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
                  className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="h-16" />
    </>
  );
};

export default Navbar;