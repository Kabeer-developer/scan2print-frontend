import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import storeService from "../api/storeService";
import uploadService from "../api/uploadService";

const StoreDetail = () => {
  const { id } = useParams();
  const fileRef = useRef();

  const [store, setStore] = useState(null);
  const [storeLoading, setStoreLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success" | "error", msg: string }
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await storeService.getStoreById(id);
        setStore(data);
      } catch {
        setStatus({ type: "error", msg: "Store not found." });
      } finally {
        setStoreLoading(false);
      }
    };
    load();
  }, [id]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const removeFile = () => {
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !file) {
      setStatus({ type: "error", msg: "Please enter your name and select a file." });
      return;
    }

    const fd = new FormData();
    fd.append("userName", userName.trim());
    fd.append("note", note.trim());
    fd.append("file", file);

    try {
      setLoading(true);
      setStatus(null);
      await uploadService.uploadFile(id, fd);
      setStatus({ type: "success", msg: "File uploaded successfully! The store will process it shortly." });
      setUserName("");
      setNote("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setStatus({ type: "error", msg: "Upload failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const initials = store?.name
    ? store.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "ST";

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Loading state
  if (storeLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/>
          </svg>
          Loading store…
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Store not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-lg mx-auto">

        {/* Store Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 mb-4">
          <div className="shrink-0">
            {!imgError && store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name}
                onError={() => setImgError(true)}
                className="w-14 h-14 rounded-xl object-cover border border-gray-100"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-base">
                {initials}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900 truncate">{store.name}</h2>
            {store.location && (
              <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {store.location}
              </p>
            )}
          </div>
          {store.isOpen !== false && (
            <span className="ml-auto shrink-0 text-xs font-semibold text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
              Open
            </span>
          )}
        </div>

        {/* Upload Form Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 mb-1">Upload Document</h3>
          <p className="text-xs text-gray-400 mb-5">Fill in your details and attach the file you want printed.</p>

          <form onSubmit={submit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Your Name</label>
              <input
                placeholder="e.g. Rahul Sharma"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Note <span className="text-gray-300 font-normal">(optional)</span>
              </label>
              <textarea
                placeholder="e.g. Print double-sided, A4, colour..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition resize-none"
              />
            </div>

            {/* File Drop Zone */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">File</label>
              {!file ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl px-4 py-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors duration-150"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-2 text-gray-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-500">Drop file here or <span className="text-indigo-600">browse</span></p>
                  <p className="text-xs text-gray-300 mt-1">PDF, JPG, PNG, DOCX supported</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 border border-gray-100 bg-gray-50 rounded-xl px-4 py-3">
                  <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center text-indigo-500 shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                  </div>
                  <button type="button" onClick={removeFile} className="shrink-0 text-gray-300 hover:text-red-400 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              )}
              <input type="file" ref={fileRef} onChange={(e) => { const f = e.target.files[0]; if (f) setFile(f); }} className="hidden" />
            </div>

            {/* Status */}
            {status && (
              <div className={`flex items-start gap-2 text-sm rounded-lg px-3.5 py-2.5 border ${
                status.type === "success"
                  ? "bg-green-50 border-green-100 text-green-700"
                  : "bg-red-50 border-red-100 text-red-600"
              }`}>
                <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {status.type === "success"
                    ? <><polyline points="20 6 9 17 4 12"/></>
                    : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
                  }
                </svg>
                {status.msg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-150"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/>
                  </svg>
                  Uploading…
                </span>
              ) : "Upload File"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;