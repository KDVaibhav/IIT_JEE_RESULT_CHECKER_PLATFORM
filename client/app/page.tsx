"use client";

import { useState, useRef } from "react";
import { fetchResultByHallTicket } from "@/lib/api";
import { Loader2, Search, Download } from "lucide-react";
import { jsPDF } from "jspdf";

interface ResultType {
  name: string;
  email: string;
  hallTicketNo: string;
  rank: number;
  maths: number;
  physics: number;
  chemistry: number;
  total: number;
  pass: boolean;
}

export default function ResultForm() {
  const [hallTicket, setHallTicket] = useState("");
  const [loading, setLoading] = useState(false);
  const pdfLoading = false;
  const [error, setError] = useState("");
  const [result, setResult] = useState<ResultType | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hallTicket.trim()) return;

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const data = await fetchResultByHallTicket(hallTicket.trim());
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch results. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("IIT JEE 2025 Result", 105, 20, { align: "center" });

    // Add result details
    doc.setFontSize(12);
    let y = 40;
    const lineHeight = 8;
    if (result) {
      doc.text(`Name: ${result.name}`, 20, y);
      y += lineHeight;
      doc.text(`Email: ${result.email}`, 20, y);
      y += lineHeight;
      doc.text(`Hall Ticket No: ${result.hallTicketNo}`, 20, y);
      y += lineHeight;
      doc.text(`Maths: ${result.maths}`, 20, y);
      y += lineHeight;
      doc.text(`Physics: ${result.physics}`, 20, y);
      y += lineHeight;
      doc.text(`Chemistry: ${result.chemistry}`, 20, y);
      y += lineHeight;
      doc.text(`Total Marks: ${result.total} / 210`, 20, y);
      y += lineHeight;
      doc.text(`Rank: ${result.rank}`, 20, y);
      y += lineHeight;
      doc.text(`Status: ${result.pass ? "Passed ✅" : "Failed ❌"}`, 20, y);
      y += lineHeight;
    }
    doc.save(`JEE_Result_${hallTicket}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700 print:text-black">
          🎓 IIT JEE 2025 Result Checker
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 print:hidden"
        >
          <input
            type="text"
            placeholder="Enter Hall Ticket Number eq. HT000078 or HT000345"
            value={hallTicket}
            onChange={(e) => setHallTicket(e.target.value)}
            className="text-slate-500 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-all disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {loading ? "Checking..." : "Check Result"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-600 text-center font-medium print:text-black">
            {error}
          </p>
        )}

        {result && (
          <div
            className="mt-8 border-t pt-6 print:border-none print:pt-2"
            ref={pdfRef}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 print:text-black">
              Result Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700 print:text-black">
              <p>
                <span className="font-medium">Name:</span> {result.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {result.email}
              </p>
              <p>
                <span className="font-medium">Hall Ticket:</span>{" "}
                {result.hallTicketNo}
              </p>
              <p>
                <span className="font-medium">Rank:</span> {result.rank}
              </p>
              <p>
                <span className="font-medium">Total Marks:</span> {result.total}{" "}
                / 210
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={
                    result.pass
                      ? "text-green-600 font-bold print:text-black"
                      : "text-red-600 font-bold print:text-black"
                  }
                >
                  {result.pass ? "Passed ✅" : "Failed ❌"}
                </span>
              </p>
              <p>
                <span className="font-medium">Physics:</span> {result.physics}
              </p>
              <p>
                <span className="font-medium">Chemistry:</span>{" "}
                {result.chemistry}
              </p>
              <p>
                <span className="font-medium">Maths:</span> {result.maths}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 print:hidden">
              <button
                onClick={handleDownload}
                disabled={pdfLoading}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition disabled:opacity-70"
              >
                {pdfLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Download Marksheet (PDF)
              </button>
              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}/results/${result.hallTicketNo}`;
                  navigator.clipboard.writeText(shareUrl);
                  alert("Shareable URL copied to clipboard!");
                }}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
              >
                🔗 Copy Shareable Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
