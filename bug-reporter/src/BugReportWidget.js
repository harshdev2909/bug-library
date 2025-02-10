import React, { useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas"
import "./index.css";

const BugReportWidget = ({ apiKey, apiUrl }) => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("")
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  // Capture screenshot of the page using html2canvas
  const captureScreenshot = async () => {
    const canvas = await html2canvas(document.body);
    setScreenshot(canvas.toDataURL("image/png")); // Base64 encoded PNG
  };

  // Submit bug report along with the screenshot to the backend
  const submitBugReport = async () => {
    if (!description.trim()) return alert("Please enter a bug description.");
    setLoading(true);

    try {
      const data = { description, screenshot };

      const response = await axios.post(
        `http://localhost:5000/api/bugs/submit`, // Backend endpoint
        data,
        { headers: { "x-api-key": apiKey } } // Include API key for authorization
      );

      alert("Bug reported successfully!")
      setOpen(false);
      setDescription("");
      setScreenshot(null);
    } catch (error) {
      console.error("Error submitting bug:", error);
      alert("Failed to report bug.");
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition"
      >
        🐞 Report Bug
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-3">Report a Bug</h2>

            <textarea
              className="w-full p-2 border rounded"
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <div className="mt-3">
              {screenshot ? (
                <img src={screenshot} alt="Screenshot" className="w-full rounded" />
              ) : (
                <button
                  onClick={captureScreenshot}
                  className="bg-blue-500 text-white px-3 py-1 rounded "
                >
                  Capture Screenshot
                </button>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitBugReport}
                className="px-3 py-1 bg-green-500 text-white rounded"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BugReportWidget;
