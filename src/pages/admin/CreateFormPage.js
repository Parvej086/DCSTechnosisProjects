// src/pages/admin/CreateFormPage.js
import React, { useState } from "react";
import axios from "axios";

const CreateFormPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([{ label: "", type: "text", required: true }]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const addField = () => {
    setFields([...fields, { label: "", type: "text", required: true }]);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "https://localhost:7100/api/Form",
        { title, description, fields },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || response.status === 201) {
        setMessage("✅ Form created successfully!");
        setTitle("");
        setDescription("");
        setFields([{ label: "", type: "text", required: true }]);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to create form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: "-68px" }}>
      <h3 className="fw-bold mb-4">Create a New Form</h3>
       <div className="card shadow-sm p-4 border-0 mx-auto" style={{ maxWidth: "900px" }}>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter form title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Enter form description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Fields */}
          <h5 className="fw-semibold mt-4 mb-3">Fields</h5>
          {fields.map((field, index) => (
            <div key={index} className="border p-3 mb-3 rounded">
              <div className="row g-3">
                {/* Label */}
                <div className="col-12 col-md-6">
                  <label className="form-label">Label</label>
                  <input
                    type="text"
                    className="form-control"
                    value={field.label}
                    onChange={(e) => handleFieldChange(index, "label", e.target.value)}
                    required
                  />
                </div>

                {/* Type */}
                <div className="col-12 col-md-4">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={field.type}
                    onChange={(e) => handleFieldChange(index, "type", e.target.value)}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="date">Date</option>
                    <option value="checkbox">Checkbox</option>
                  </select>
                </div>

                {/* Required */}
                <div className="col-12 col-md-2 d-flex align-items-center">
                  <div className="form-check mt-3 mt-md-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => handleFieldChange(index, "required", e.target.checked)}
                      id={`required-${index}`}
                    />
                    <label className="form-check-label" htmlFor={`required-${index}`}>
                      Required
                    </label>
                  </div>
                </div>
              </div>

              {/* Remove Button */}
              {fields.length > 1 && (
                <div className="mt-3">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removeField(index)}
                  >
                    Remove Field
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add Field */}
          <button type="button" className="btn btn-secondary mb-3" onClick={addField}>
            + Add Field
          </button>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-100 fw-semibold" disabled={loading}>
            {loading ? "Creating..." : "Create Form"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className={`alert mt-3 ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateFormPage;
