// src/pages/admin/SubmissionsPage.js
import React, { useEffect, useState } from "react";

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://localhost:7100/api/Submissions", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const submissionsArray = Array.isArray(data) ? data : [data];
        setSubmissions(submissionsArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading submissions...</div>;
  if (submissions.length === 0) return <div>No submissions found.</div>;

  return (
    <div>
      <h3 className="fw-bold mb-4">Form Submissions</h3>
      <table className="table table-striped table-bordered">
        <thead className="table-primary">
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Form ID</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.userName || "Anonymous"}</td>
              <td>{s.formId}</td>
              <td>{new Date(s.submittedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionsPage;
