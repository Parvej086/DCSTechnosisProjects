import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FillFormPage = () => {
  const { id } = useParams(); // form id from URL
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`https://localhost:7100/api/Form/${id}`, { withCredentials: true });
        const data = response.data;

        if (!data.fieldsJson) {
          setError("Form fields not found.");
          return;
        }

        let parsedFields = [];
        try {
          parsedFields = JSON.parse(data.fieldsJson);
        } catch (err) {
          setError("Invalid form fields JSON.");
          return;
        }

        setForm({ ...data, fields: parsedFields });

        // Initialize form values
        const initialValues = {};
        parsedFields.forEach((field) => {
          const type = field.Type.toLowerCase();
          if (type === "checkbox") initialValues[field.Label] = false;
          else initialValues[field.Label] = "";
        });
        setFormValues(initialValues);
      } catch (err) {
        console.error("API error:", err.response ? err.response.data : err.message);
        setError("Failed to fetch form.");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  const handleChange = (label, value) => {
    setFormValues((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      formId: parseInt(id),
      answersJson: JSON.stringify(formValues)
    };

    try {
      await axios.post("https://localhost:7100/api/Submission", payload, { withCredentials: true });
      alert("Form submitted successfully!");
      // Reset form values if you want
      const resetValues = {};
      form.fields.forEach((field) => {
        const type = field.Type.toLowerCase();
        resetValues[field.Label] = type === "checkbox" ? false : "";
      });
      setFormValues(resetValues);
    } catch (err) {
      console.error("Submission error:", err.response ? err.response.data : err.message);
      alert("Failed to submit form.");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading form...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-3">{form.title}</h3>
      <p className="mb-4">{form.description}</p>

      <div className="card shadow-sm p-4 border-0 mx-auto" style={{ maxWidth: "800px" }}>
        <form onSubmit={handleSubmit}>
          {form.fields.map((field, index) => {
            const type = field.Type.toLowerCase();
            const label = field.Label;
            const required = field.Required;

            switch (type) {
              case "text":
              case "email":
              case "number":
              case "date":
                return (
                  <div key={index} className="mb-3">
                    <label className="form-label fw-semibold">{label}</label>
                    <input
                      type={type}
                      className="form-control"
                      value={formValues[label]}
                      onChange={(e) => handleChange(label, e.target.value)}
                      required={required}
                    />
                  </div>
                );

              case "checkbox":
                return (
                  <div key={index} className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`checkbox-${index}`}
                      checked={formValues[label]}
                      onChange={(e) => handleChange(label, e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor={`checkbox-${index}`}>
                      {label}
                    </label>
                  </div>
                );

              case "radio":
              case "dropdown":
                if (!field.Options || field.Options.length === 0) return null;

                if (type === "radio") {
                  return (
                    <div key={index} className="mb-3">
                      <label className="form-label fw-semibold">{label}</label>
                      {field.Options.map((option, i) => (
                        <div className="form-check" key={i}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name={label}
                            id={`${label}-radio-${i}`}
                            value={option}
                            checked={formValues[label] === option}
                            onChange={(e) => handleChange(label, e.target.value)}
                            required={required}
                          />
                          <label className="form-check-label" htmlFor={`${label}-radio-${i}`}>
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  );
                }

                if (type === "dropdown") {
                  return (
                    <div key={index} className="mb-3">
                      <label className="form-label fw-semibold">{label}</label>
                      <select
                        className="form-select"
                        value={formValues[label]}
                        onChange={(e) => handleChange(label, e.target.value)}
                        required={required}
                      >
                        <option value="">Select an option</option>
                        {field.Options.map((option, i) => (
                          <option key={i} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                return null;

              default:
                return null;
            }
          })}

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FillFormPage;
