import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchStoreFiles, deleteFile } from "../redux/slices/uploadSlice";

const FileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const getFileExtension = (name = "") => name.split(".").pop()?.toUpperCase() || "FILE";

const extColor = (ext) => {
  const map = {
    PDF: "bg-red-50 text-red-500 border-red-100",
    PNG: "bg-blue-50 text-blue-500 border-blue-100",
    JPG: "bg-yellow-50 text-yellow-600 border-yellow-100",
    JPEG: "bg-yellow-50 text-yellow-600 border-yellow-100",
    DOC: "bg-indigo-50 text-indigo-500 border-indigo-100",
    DOCX: "bg-indigo-50 text-indigo-500 border-indigo-100",
    ZIP: "bg-purple-50 text-purple-500 border-purple-100",
  };
  return map[ext] || "bg-gray-50 text-gray-500 border-gray-100";
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const storeInfo = useSelector((state) => state.store.storeInfo);
  const { files = [], loading } = useSelector((state) => state.uploads);
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (!storeInfo?.id) return;
    dispatch(fetchStoreFiles(storeInfo.id));
  }, [dispatch, storeInfo?.id]);

  if (!storeInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          <p className="text-gray-600 text-sm font-medium">Please log in to view your dashboard</p>
        </div>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this file?")) return;
    setDeletingId(id);
    await dispatch(deleteFile(id));
    setDeletingId(null);
  };

  const handleDownload = async (fileId, fileName) => {
    setDownloadingId(fileId);
    try {
      const token = JSON.parse(localStorage.getItem("storeInfo"))?.token;
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload/download/${fileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Download failed. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Uploaded Files</h1>
            <p className="text-sm text-gray-400 mt-1">
              {storeInfo.name} · {files.length} {files.length === 1 ? "file" : "files"}
            </p>
          </div>
          {!loading && files.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-white border border-gray-100 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Synced
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-gray-100 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && files.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
              <FileIcon />
            </div>
            <p className="text-gray-600 text-sm font-semibold">No files uploaded yet</p>
            <p className="text-gray-400 text-xs mt-1">Files from customers will appear here</p>
          </div>
        )}

        {/* File List */}
        {!loading && files.length > 0 && (
          <div className="space-y-2.5">
            {files.map((f) => {
              const ext = getFileExtension(f.originalFileName);
              const isDeleting = deletingId === f._id;
              const isDownloading = downloadingId === f._id;

              return (
                <div
                  key={f._id}
                  className={`bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:border-indigo-100 hover:shadow-md hover:shadow-gray-100/60 transition-all duration-200 ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
                >
                  {/* File type badge */}
                  <div className={`shrink-0 w-11 h-11 rounded-xl border flex items-center justify-center text-[10px] font-bold tracking-wide ${extColor(ext)}`}>
                    {ext.slice(0, 4)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{f.originalFileName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 truncate">{f.userName}</span>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(f.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleDownload(f._id, f.originalFileName)}
                      disabled={isDownloading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150 disabled:opacity-50"
                    >
                      <DownloadIcon />
                      {isDownloading ? "…" : "Download"}
                    </button>

                    <button
                      onClick={() => handleDelete(f._id)}
                      disabled={isDeleting}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors duration-150 disabled:opacity-50"
                    >
                      <TrashIcon />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;