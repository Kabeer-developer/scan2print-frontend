import { useDispatch, useSelector } from "react-redux";
import { registerStore } from "../redux/slices/storeSlice";
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

const RegisterStore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef();

  const { storeInfo, loading, error } = useSelector((s) => s.store);

  const [form, setForm] = useState({ name: "", location: "", email: "", password: "" });
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (storeInfo) navigate("/dashboard");
  }, [storeInfo, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogo(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (logo) fd.append("logo", logo);
    await dispatch(registerStore(fd));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-sm">

        {/* Logo mark */}
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="white" opacity="0.9"/>
              <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
              <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
              <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.9"/>
            </svg>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 text-center">Create your store</h2>
          <p className="text-sm text-gray-400 text-center mt-1">Start receiving print jobs today</p>

          <form onSubmit={submit} className="mt-6 space-y-4">

            {/* Logo Upload */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Store Logo</label>
              <div className="flex items-center gap-4">
                {/* Preview */}
                <div className="w-14 h-14 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
                  {preview ? (
                    <img src={preview} alt="logo" className="w-full h-full object-cover" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 bg-indigo-50 px-3 py-1.5 rounded-lg transition"
                  >
                    {preview ? "Change logo" : "Upload logo"}
                  </button>
                  {preview && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="text-xs text-gray-400 hover:text-red-500 transition text-left"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileRef}
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Store Name */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Store Name</label>
              <input
                name="name"
                placeholder="e.g. QuickPrint Bengaluru"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Location</label>
              <input
                name="location"
                placeholder="e.g. Koramangala, Bengaluru"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email address</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
                <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {typeof error === "string" ? error : error.message || "Registration failed"}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-150 mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/>
                  </svg>
                  Creating store…
                </span>
              ) : "Create store"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-sm text-center text-gray-400 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterStore;