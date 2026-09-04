import { useEffect, useState } from "react";
import uploadService from "../api/uploadService";

const FileViewer = ({ file, onClose }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [blobType, setBlobType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let objectUrl = null;
    let cancelled = false;

    const loadFile = async () => {
      try {
        setLoading(true);
        setError(null);
        setFileUrl(null);

        const blob = await uploadService.viewFile(file._id);

        if (cancelled) return;

        const actualType =
          blob.type &&
          blob.type !== "application/octet-stream"
            ? blob.type
            : file.fileType;

        const correctedBlob = new Blob([blob], {
          type: actualType,
        });

        objectUrl = URL.createObjectURL(correctedBlob);

        setBlobType(actualType);
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

  const isImage =
    blobType.startsWith("image/") ||
    file.fileType?.startsWith("image/");

  const isPdf =
    blobType === "application/pdf" ||
    file.fileType === "application/pdf";

  // =====================================================
  // PRINT IMAGE
  // =====================================================

  const printImage = () => {
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

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print File</title>

          <style>
            @page {
              margin: 10mm;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              width: 100%;
              background: white;
            }

            body {
              display: flex;
              justify-content: center;
              align-items: flex-start;
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
            alt="Print"
            onload="setTimeout(() => window.print(), 300)"
          />
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  // =====================================================
  // PRINT PDF
  // =====================================================

  const printPdf = () => {
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

    /*
     * Create a simple print page containing the PDF.
     *
     * The PDF itself is still coming from our protected
     * Blob URL. The Cloudinary URL is never exposed.
     */

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print File</title>

          <style>
            html,
            body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              background: white;
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
            id="pdfFrame"
            src="${fileUrl}"
          ></iframe>

          <script>
            const frame = document.getElementById("pdfFrame");

            frame.onload = function () {
              setTimeout(() => {
                window.focus();
                window.print();
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  // =====================================================
  // PRINT
  // =====================================================

  const handlePrint = () => {
    if (!fileUrl) return;

    if (isImage) {
      printImage();
      return;
    }

    if (isPdf) {
      printPdf();
      return;
    }

    alert("This file type cannot currently be printed.");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="bg-white w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900">
              File Preview
            </h2>

            <p className="text-sm text-gray-500 truncate max-w-xl">
              {file.originalFileName}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-4">

            {/* Print */}
            <button
              onClick={handlePrint}
              disabled={
                !fileUrl ||
                loading ||
                (!isImage && !isPdf)
              }
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              🖨 Print
            </button>

            {/* Close */}
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
          {fileUrl &&
            isImage &&
            !loading &&
            !error && (
              <img
                src={fileUrl}
                alt={file.originalFileName || "File preview"}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
              />
            )}

          {/* PDF */}
          {fileUrl &&
            isPdf &&
            !loading &&
            !error && (
              <iframe
                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1`}
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