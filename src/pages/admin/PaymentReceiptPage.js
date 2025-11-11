import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PaymentReceiptPage = () => {
  const { paymentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);

  // Fetch PDF receipt
  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7100/api/Payment/receipt/${paymentId}`,
          { responseType: "blob", withCredentials: true }
        );
        const file = new Blob([response.data], { type: "application/pdf" });
        setPdfUrl(URL.createObjectURL(file));
      } catch (err) {
        console.error("Error fetching receipt:", err);
        setError("Failed to load receipt.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [paymentId]);

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  if (loading) return <p className="text-center mt-4">Loading receipt...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;
  if (!pdfUrl) return <p className="text-center mt-4">No receipt available.</p>;

  return (
    <div className="container mt-4 text-center">
      <h3 className="fw-bold mb-3">Payment Receipt #{paymentId}</h3>
      <div className="mb-3">
        <iframe
          src={pdfUrl}
          title="Receipt PDF"
          width="100%"
          height="600px"
          style={{ border: "1px solid #ccc", borderRadius: "5px" }}
        ></iframe>
      </div>
      <a href={pdfUrl} download={`Receipt_${paymentId}.pdf`} className="btn btn-primary">
        ⬇️ Download Receipt
      </a>
    </div>
  );
};

export default PaymentReceiptPage;
