"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);

  // Set hasMounted to true after initial client-side render
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Only create object URL after mounting
  useEffect(() => {
    if (!hasMounted || !file) return;

    const url = URL.createObjectURL(file);
    setPdfUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file, hasMounted]);

  const handleUploadPDF = useCallback(async () => {
    if (!file) {
      setError("Please select a PDF file to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post("http://localhost:40000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("PDF uploaded and processed successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to upload PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [file]);

  const handleAskQuestion = useCallback(async () => {
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:40000/ask/", { question });
      setAnswer(res.data.answer || "No answer available.");
    } catch (err) {
      console.error(err);
      setError("Error retrieving answer.");
      setAnswer("");
    } finally {
      setLoading(false);
    }
  }, [question]);

  // Avoid rendering anything that uses browser-only APIs until mounted
  if (!hasMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-3">
            PDF Q&A Assistant
          </h1>
          <p className="text-gray-600 text-xl">
            Upload a PDF, preview it, and ask questions to get intelligent, context-aware answers powered by advanced AI.
          </p>
        </header>

        {/* File Upload and Preview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-gray-200">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6">
            Upload Your Document
          </h2>
          <p className="text-gray-600 mb-6 text-base">
            Please upload a clear, text-based PDF (maximum 10MB) for optimal results.
          </p>
          <div className="space-y-6">
            <label className="block w-full">
              <span className="text-gray-700 text-sm font-medium mb-2 block">
                Select PDF File
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  setFile(selectedFile);
                  setError(null);
                }}
                className="text-gray-800 border border-gray-300 rounded-lg p-3 w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Upload PDF file"
              />
            </label>
            <button
              onClick={handleUploadPDF}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 flex items-center justify-center w-full md:w-auto"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Uploading...
                </>
              ) : (
                "Upload PDF"
              )}
            </button>
            {pdfUrl && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">
                  PDF Preview
                </h3>
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 max-h-[500px] overflow-auto">
                  <iframe
                    src={pdfUrl}
                    width="100%"
                    height="450"
                    title="PDF Preview"
                    className="border-0"
                    onError={() => setError("Failed to load PDF preview.")}
                  />
                </div>
              </div>
            )}
          </div>
          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
        </div>

        {/* Ask Question */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6">
            Ask a Question
          </h2>
          <p className="text-gray-600 mb-6 text-base">
            Enter a question related to the uploaded PDF to receive a detailed response.
          </p>
          <div className="space-y-6">
            <div>
              <label className="block">
                <span className="text-gray-700 text-sm font-medium mb-2 block">
                  Your Question
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g., 'What is the main topic?' or 'Summarize the document'..."
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  setError(null);
                }}
                className="text-gray-800 border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-500"
                aria-label="Enter your question"
                disabled={!file}
              />
              <button
                onClick={handleAskQuestion}
                disabled={loading || !file}
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg mt-4 hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors duration-200 flex items-center justify-center w-full md:w-auto"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Ask"
                )}
              </button>
            </div>
            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
            {answer && (
              <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Answer</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}