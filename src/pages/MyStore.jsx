import { useSelector } from "react-redux";

const MyStore = () => {
  const storeInfo = useSelector((state) => state.store.storeInfo);

  if (!storeInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="text-center">
          <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          <p className="text-gray-600 text-sm font-medium">Please login to view your store.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/60 p-8">

        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-7">
          My Store
        </h2>

        {/* Store Info */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
          <img
            src={
              storeInfo.logoUrl ||
              "https://via.placeholder.com/100"
            }
            alt="Logo"
            className="w-24 h-24 rounded-2xl object-cover border border-gray-100 shadow-sm"
          />

          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {storeInfo.name}
            </h3>
            <p className="text-gray-400 text-sm mt-0.5">
              {storeInfo.email}
            </p>
          </div>
        </div>

        {/* QR Section */}
        <div className="text-center">
          <h4 className="text-base font-semibold text-gray-800 mb-5">
            Store QR Code
          </h4>

          {storeInfo.qrCodeUrl ? (
            <>
              <div className="inline-block p-5 bg-gray-50 border border-gray-100 rounded-2xl mb-5">
                <img
                  src={storeInfo.qrCodeUrl}
                  alt="QR"
                  className="mx-auto w-52 h-52 object-contain"
                />
              </div>
              <div>
                <button
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = storeInfo.qrCodeUrl;
                    a.download = "store-qr.png";
                    a.click();
                  }}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200 active:scale-[0.98] transition-all duration-200"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download QR
                </button>
              </div>
            </>
          ) : (
            <div className="py-10 bg-gray-50 border border-gray-100 rounded-2xl">
              <p className="text-gray-400 text-sm font-medium">
                QR not available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyStore;