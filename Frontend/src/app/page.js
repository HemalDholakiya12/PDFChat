"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { FaUpload, FaQuestionCircle } from 'react-icons/fa'; 

export default function Home() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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

  if (!hasMounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-sans text-[#1F2937] animate-fadeIn">
      <Head>
        <title>PDFChat – Intelligent PDF Q&A Assistant</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1F2937] mb-3 animate-slideUp">PDFChat – PDF Q&A Assistant</h1>
          <p className="text-[#6B7280] text-xl animate-slideUp">
            Welcome to <strong>PDFChat</strong> — Upload a PDF, preview it, and ask questions to receive precise and relevant answers, powered by AI.
          </p>
        </header>

        {/* File Upload and Preview */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-10 border border-[#E5E7EB] animate-slideUp">
          <h2 className="text-2xl font-semibold text-[#1F2937] mb-6 flex items-center space-x-2">
            <FaUpload /> {/* Upload icon */}
            <span>Upload Your Document</span>
          </h2>
          <p className="text-[#6B7280] mb-6 text-base">
            Please upload a clear, text-based PDF for optimal results.
          </p>
          <div className="space-y-6">
            <label className="block w-full">
              <span className="text-[#6B7280] text-sm font-medium mb-2 block">Select PDF File</span>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  setFile(selectedFile);
                  setError(null);
                }}
                className="text-[#1F2937] border border-[#E5E7EB] rounded-lg p-3 w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#E0F7FF] file:text-[#3B82F6] hover:file:bg-[#E0F7FF] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                aria-label="Upload PDF file"
              />
            </label>
            <button
              onClick={handleUploadPDF}
              disabled={loading}
              className="bg-[#2C3E50] text-white px-8 py-3 rounded-lg hover:bg-[#34495E] disabled:bg-[#BDC3C7] transition-colors duration-200 flex items-center justify-center w-full md:w-auto animate-slideUp"
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
                <h3 className="text-xl font-semibold text-[#1F2937] mb-4">PDF Preview</h3>
                <div className="border border-[#E5E7EB] rounded-xl p-6 bg-[#F9FAFB] max-h-[500px] overflow-auto">
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
          {error && <p className="text-[#DC2626] text-sm mt-4">{error}</p>}
        </div>

        {/* Ask Question */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-[#E5E7EB] animate-slideUp">
          <h2 className="text-2xl font-semibold text-[#1F2937] mb-6 flex items-center space-x-2">
            <FaQuestionCircle /> {/* Question icon */}
            <span>Ask a Question</span>
          </h2>
          <p className="text-[#6B7280] mb-6 text-base">
            Enter a question related to the uploaded PDF to receive a detailed response.
          </p>
          <div className="space-y-6">
            <div>
              <label className="block">
                <span className="text-[#6B7280] text-sm font-medium mb-2 block">Your Question</span>
              </label>
              <input
                type="text"
                placeholder="e.g., 'What is the main topic?' or 'Summarize the document'..."
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  setError(null);
                }}
                className="text-[#1F2937] border border-[#E5E7EB] rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#2C3E50] transition-colors duration-200 disabled:bg-[#F9FAFB] disabled:text-[#B5B5B5]"
                aria-label="Enter your question"
                disabled={!file}
              />
              <button
                onClick={handleAskQuestion}
                disabled={loading || !file}
                className="bg-[#2C3E50] text-white px-8 py-3 rounded-lg mt-4 hover:bg-[#34495E] disabled:bg-[#BDC3C7] transition-colors duration-200 flex items-center justify-center w-full md:w-auto"
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
            {error && <p className="text-[#DC2626] text-sm mt-4">{error}</p>}
            {answer && (
              <div className="mt-6 p-6 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] animate-slideUp">
                <h3 className="text-xl font-semibold text-[#1F2937] mb-4">Answer</h3>
                <p className="text-[#4B5563] whitespace-pre-wrap">{answer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
