import { useSelector } from "react-redux";

const MyStore = () => {
  const storeInfo = useSelector((state) => state.store.storeInfo);

  if (!storeInfo) {
    return (
      <div className="p-6 text-center">
        <p>Please login to view your store.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        
        <h2 className="text-2xl font-bold mb-6">
          My Store
        </h2>

        {/* Store Info */}
        <div className="flex items-center gap-6 mb-8">
          <img
            src={
              storeInfo.logoUrl ||
              "https://via.placeholder.com/100"
            }
            alt="Logo"
            className="w-24 h-24 rounded-xl object-cover border"
          />

          <div>
            <h3 className="text-xl font-semibold">
              {storeInfo.name}
            </h3>
            <p className="text-gray-500">
              {storeInfo.email}
            </p>
          </div>
        </div>

        {/* QR Section */}
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-4">
            Store QR Code
          </h4>

          {storeInfo.qrCodeUrl ? (
            <>
              <img
                src={storeInfo.qrCodeUrl}
                alt="QR"
                className="mx-auto w-56 h-56 object-contain mb-4"
              />

              <button
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = storeInfo.qrCodeUrl;
                  a.download = "store-qr.png";
                  a.click();
                }}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Download QR
              </button>
            </>
          ) : (
            <p className="text-gray-500">
              QR not available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyStore;