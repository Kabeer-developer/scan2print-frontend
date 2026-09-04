import { useEffect, useState } from "react";
import uploadService from "../api/uploadService";

const FileViewer = ({ file, onClose }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isImage = file.fileType?.startsWith("image/");
  const isPdf = file.fileType === "application/pdf";

  useEffect(() => {
    let objectUrl = null;
    let cancelled = false;

    const loadFile = async () => {
      try {
        setLoading(true);
        setError(null);

        const blob = await uploadService.viewFile(file._id);

        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
      } catch (err) {
        console.error("View file error:", err);

        if (!cancelled) {
          setError("Unable to load this file.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadFile();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  const handlePrint = () => {
    if (!fileUrl) return;

    const printWindow = window.open(
      "",
      "_blank",
      "width=1000,height=800"
    );

    if (!printWindow) {
      alert("Please allow pop-ups to print the file.");
      return;
    }

    if (isImage) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print File</title>
            <style>
              html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                min-height: 100%;
              }

              body {
                display: flex;
                justify-content: center;
                align-items: center;
              }

              img {
                max-width: 100%;
                max-height: 100vh;
                object-fit: contain;
              }
            </style>
          </head>

          <body>
            <img
              src="${fileUrl}"
              onload="window.print()"
            />
          </body>
        </html>
      `);

      printWindow.document.close();
      return;
    }

    if (isPdf) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Document</title>

            <style>
              html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
              }

              iframe {
                width: 100%;
                height: 100%;
                border: none;
              }
            </style>
          </head>

          <body>
            <iframe
              id="printFrame"
              src="${fileUrl}"
            ></iframe>

            <script>
              const frame = document.getElementById("printFrame");

              frame.onload = function () {
                setTimeout(() => {
                  frame.contentWindow.focus();
                  frame.contentWindow.print();
                }, 800);
              };
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();
      return;
    }

    alert("This file type cannot currently be printed.");
    printWindow.close();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="bg-white w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900">
              File Preview
            </h2>

            <p className="text-sm text-gray-500 truncate max-w-xl">
              {file.originalFileName}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-4">

            <button
              onClick={handlePrint}
              disabled={!fileUrl || loading || (!isImage && !isPdf)}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              🖨 Print
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>

          </div>
        </div>

        {/* Viewer */}
        <div className="flex-1 bg-gray-100 p-4 overflow-auto flex items-center justify-center">

          {/* Loading */}
          {loading && (
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-indigo-600 border-r-transparent rounded-full animate-spin mx-auto mb-3" />

              <p className="text-sm text-gray-500">
                Loading file...
              </p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="text-center bg-white rounded-xl p-8 shadow-sm">
              <p className="text-red-500 text-sm font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Image */}
          {fileUrl && isImage && !loading && !error && (
            <img
              src={fileUrl}
              alt={file.originalFileName || "File preview"}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
            />
          )}

          {/* PDF */}
          {fileUrl && isPdf && !loading && !error && (
            <iframe
              src={fileUrl}
              title="PDF Preview"
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-full bg-white rounded-lg border border-gray-200"
            />
          )}

          {/* Unsupported */}
          {fileUrl &&
            !isImage &&
            !isPdf &&
            !loading &&
            !error && (
              <div className="bg-white rounded-xl p-8 text-center max-w-md">
                <div className="text-4xl mb-4">
                  📄
                </div>

                <h3 className="font-semibold text-gray-800 mb-2">
                  Preview not available
                </h3>

                <p className="text-sm text-gray-500">
                  This file type cannot currently be viewed or printed.
                </p>
              </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default FileViewer;