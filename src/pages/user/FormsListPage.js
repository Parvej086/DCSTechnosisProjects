// src/pages/user/FormsListPage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FormsListPage = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://localhost:7100/api/Form", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const formsArray = Array.isArray(data) ? data : [data];
        setForms(formsArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading forms...</div>;
  if (forms.length === 0) return <div>No forms available.</div>;

  return (
    <div>
      <h3 className="fw-bold mb-4">Available Forms</h3>
      <table className="table table-hover table-bordered">
        <thead className="table-primary">
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr key={form.id}>
              <td>{form.id}</td>
              <td>{form.title}</td>
              <td>{form.description}</td>
              <td>
                <Link
                  to={`/user-dashboard/forms/fill/${form.id}`}
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  Fill Form
                </Link>
                <Link
                  to={`/user-dashboard/submissions`}
                  className="btn btn-sm btn-outline-success"
                >
                  View My Submissions
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormsListPage;
