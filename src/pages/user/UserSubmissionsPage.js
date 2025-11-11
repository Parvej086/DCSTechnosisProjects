// src/pages/user/UserSubmissionsPage.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const UserSubmissionsPage = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfUrls, setPdfUrls] = useState({});

 useEffect(() => {
  if (!user) return;

  const fetchSubmissions = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://localhost:7100/api/Submission/user/${user.id}`,
        { withCredentials: true }
      );

      console.log(user);
      // Safely handle empty response
      const data = response.data ? (Array.isArray(response.data) ? response.data : [response.data]) : [];
      const parsed = data.map((item) => ({
        ...item,
        answers:
          typeof item.answersJson === "string"
            ? JSON.parse(item.answersJson)
            : item.answersJson || {},
      }));

      setSubmissions(parsed);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setError("Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  };

  fetchSubmissions();
}, [user]);

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
      <h3 className="fw-bold mb-4">Your Submissions</h3>

      {submissions.map((submission, index) => (
        <div key={index} className="card shadow-sm p-3 mb-3 border-0">
          <h5 className="mb-3">Submission #{submission.id}</h5>

          <table className="table table-bordered">
            <tbody>
              {Object.entries(submission.answers).map(([key, value], idx) => (
                <tr key={idx}>
                  <th style={{ width: "30%" }}>{key}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PDF Receipt */}
          {submission.paymentId && (
            <div className="mt-3 text-center">
              {!pdfUrls[submission.paymentId] ? (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => fetchReceiptPdf(submission.paymentId)}
                >
                  View Receipt
                </button>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserSubmissionsPage;
