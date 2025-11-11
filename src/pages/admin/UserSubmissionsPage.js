// src/pages/admin/UserSubmissionsPage.js
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserSubmissionsPage = () => {
  const { formId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [pdfUrls, setPdfUrls] = useState({}); // store blob URLs keyed by paymentId

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://localhost:7100/api/Submission/form/${formId}`,
        { withCredentials: true }
      );

      // Safely handle empty response
      const data = response.data ? (Array.isArray(response.data) ? response.data : [response.data]) : [];

      const parsedSubmissions = data.map((item) => ({
        ...item,
        answers:
          typeof item.answersJson === "string"
            ? JSON.parse(item.answersJson)
            : item.answersJson || {},
      }));

      setSubmissions(parsedSubmissions);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setError("Failed to fetch submissions.");
    } finally {
      setLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handlePayment = async (submissionId) => {
    setProcessingId(submissionId);
    try {
      const payload = {
        submissionId,
        provider: "paypal",
        amount: 1000,
        currency: "USD",
      };

      const response = await axios.post(
        "https://localhost:7100/api/Payment",
        payload,
        { withCredentials: true }
      );

      alert(`✅ Payment successful! Payment ID: ${response.data.id || "N/A"}`);

      // Refresh submissions to get paymentId
      await fetchSubmissions();
    } catch (err) {
      console.error("Payment error:", err);
      alert("❌ Payment failed. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const fetchReceiptPdf = async (paymentId) => {
    if (pdfUrls[paymentId]) return; // already fetched

    try {
      const response = await axios.get(
        `https://localhost:7100/api/Payment/receipt/${paymentId}`,
        { responseType: "blob", withCredentials: true }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);

      setPdfUrls((prev) => ({ ...prev, [paymentId]: fileURL }));
    } catch (err) {
      console.error("Error fetching receipt:", err);
      alert("❌ Failed to load receipt PDF.");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading submissions...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;
  if (submissions.length === 0) return <p className="text-center mt-4">No submissions found.</p>;

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-4">Submissions for Form ID: {formId}</h3>

      {submissions.map((submission, index) => (
        <div key={index} className="card shadow-sm p-3 mb-3 border-0">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              Submission #{submission.id} (User ID: {submission.userId || "N/A"})
            </h5>

            <div>
              {/* Payment Button */}
              {!submission.paymentId && (
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => handlePayment(submission.id)}
                  disabled={processingId === submission.id}
                >
                  {processingId === submission.id ? "Processing..." : "Make Payment"}
                </button>
              )}

              {/* View Receipt Button */}
              {submission.paymentId && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => fetchReceiptPdf(submission.paymentId)}
                >
                  View Receipt
                </button>
              )}
            </div>
          </div>

          <table className="table table-bordered mt-3">
            <tbody>
              {Object.entries(submission.answers).map(([key, value], idx) => (
                <tr key={idx}>
                  <th style={{ width: "30%" }}>{key}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PDF Preview */}
          {submission.paymentId && pdfUrls[submission.paymentId] && (
            <div className="mt-3 text-center">
              <iframe
                src={pdfUrls[submission.paymentId]}
                title={`Receipt ${submission.paymentId}`}
                width="100%"
                height="500px"
                style={{ border: "1px solid #ccc", borderRadius: "5px" }}
              />
              <a
                href={pdfUrls[submission.paymentId]}
                download={`Receipt_${submission.paymentId}.pdf`}
                className="btn btn-primary mt-2"
              >
                ⬇️ Download Receipt
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserSubmissionsPage;
