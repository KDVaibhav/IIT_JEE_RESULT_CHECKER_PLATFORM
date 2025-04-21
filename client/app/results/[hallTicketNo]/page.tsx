"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { fetchResultByHallTicket } from "@/lib/api";
import { jsPDF } from "jspdf";
import { Loader2, Download } from "lucide-react";

export default function SharedResultPage() {
  const { hallTicketNo } = useParams() as { hallTicketNo: string };
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchResultByHallTicket(hallTicketNo);
        setResult(data);
      } catch (err: any) {
        setError(err.message || "Failed to load result.");
      } finally {
        setLoading(false);
      }
    };

    if (hallTicketNo) fetchData();
  }, [hallTicketNo]);

  const handleDownload = () => {
    if (!result) return;
    setPdfLoading(true);
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("IIT JEE 2025 Result", 105, 20, { align: "center" });

    let y = 40;
    const gap = 8;

    doc.setFontSize(12);
    doc.text(`Name: ${result.name}`, 20, y);
    y += gap;
    doc.text(`Email: ${result.email}`, 20, y);
    y += gap;
    doc.text(`Hall Ticket: ${result.hallTicketNo}`, 20, y);
    y += gap;
    doc.text(`Maths: ${result.maths}`, 20, y);
    y += gap;
    doc.text(`Physics: ${result.physics}`, 20, y);
    y += gap;
    doc.text(`Chemistry: ${result.chemistry}`, 20, y);
    y += gap;
    doc.text(`Total: ${result.total} / 210`, 20, y);
    y += gap;
    doc.text(`Rank: ${result.rank}`, 20, y);
    y += gap;
    doc.text(`Status: ${result.pass ? "Passed ✅" : "Failed ❌"}`, 20, y);
    doc.save(`JEE_Result_${hallTicketNo}.pdf`);
    setPdfLoading(false);
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex justify-center items-center text-red-600 font-semibold">
        {error}
      </div>
    );

  if (!result)
    return (
      <div className="h-screen flex justify-center items-center">
        No result found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-10">
      <div
        ref={pdfRef}
        className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full print:shadow-none"
      >
        <h1 className="text-2xl font-bold text-indigo-700 text-center mb-6 print:text-black">
          🎓 Result for {result.name}
        </h1>

        <div className="grid grid-cols-2 gap-4 text-gray-700 print:text-black">
          <p>
            <span className="font-semibold">Email:</span> {result.email}
          </p>
          <p>
            <span className="font-semibold">Hall Ticket:</span>{" "}
            {result.hallTicketNo}
          </p>
          <p>
            <span className="font-semibold">Maths:</span> {result.maths}
          </p>
          <p>
            <span className="font-semibold">Physics:</span> {result.physics}
          </p>
          <p>
            <span className="font-semibold">Chemistry:</span> {result.chemistry}
          </p>
          <p>
            <span className="font-semibold">Total Marks:</span> {result.total} /
            210
          </p>
          <p>
            <span className="font-semibold">Rank:</span> {result.rank}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`font-bold ${
                result.pass ? "text-green-600" : "text-red-600"
              } print:text-black`}
            >
              {result.pass ? "Passed ✅" : "Failed ❌"}
            </span>
          </p>
        </div>

        <div className="mt-6 flex justify-center print:hidden">
          <button
            onClick={handleDownload}
            disabled={pdfLoading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition disabled:opacity-70"
          >
            {pdfLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download Marksheet (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
