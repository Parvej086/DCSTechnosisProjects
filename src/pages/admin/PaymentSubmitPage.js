import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PaymentSubmitPage = () => {
  const { submissionId } = useParams(); // from URL
  const [payment, setPayment] = useState({
    provider: "",
    amount: "",
    currency: "USD",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      submissionId: parseInt(submissionId),
      provider: payment.provider,
      amount: parseFloat(payment.amount),
      currency: payment.currency,
    };

    try {
      const response = await axios.post("https://localhost:7100/api/Payment", payload, {
        withCredentials: true,
      });

      console.log("Payment response:", response.data);
      setMessage("✅ Payment submitted successfully!");
      setPayment({ provider: "", amount: "", currency: "USD" });
    } catch (error) {
      console.error("Payment submission failed:", error);
      setMessage("❌ Failed to submit payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-4">Submit Payment</h3>

      <div className="card shadow-sm p-4 border-0 mx-auto" style={{ maxWidth: "600px" }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Submission ID</label>
            <input
              type="text"
              className="form-control"
              value={submissionId}
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Payment Provider</label>
            <select
              name="provider"
              className="form-select"
              value={payment.provider}
              onChange={handleChange}
              required
            >
              <option value="">Select Provider</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
              <option value="razorpay">Razorpay</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Amount</label>
            <input
              type="number"
              className="form-control"
              name="amount"
              value={payment.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Currency</label>
            <input
              type="text"
              className="form-control"
              name="currency"
              value={payment.currency}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Submitting..." : "Submit Payment"}
          </button>
        </form>

        {message && <p className="mt-3 text-center fw-semibold">{message}</p>}
      </div>
    </div>
  );
};

export default PaymentSubmitPage;
