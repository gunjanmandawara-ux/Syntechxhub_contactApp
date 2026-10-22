
import { useEffect, useState } from "react";

function ContactForm({ onSave, editingContact, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingContact) {
      setForm({
        name: editingContact.name || "",
        email: editingContact.email || "",
        phone: editingContact.phone || "",
        address: editingContact.address || "",
      });
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    }

    setError("");
  }, [editingContact]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Name, email aur phone required hain.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Valid email address enter karo.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone number 10 digits ka hona chahiye.");
      return;
    }

    try {
      setError("");
      await onSave(form);

      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    } catch (err) {
      setError(err.message || "Contact save nahi hua.");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>{editingContact ? "Edit Contact" : "Add New Contact"}</h2>

      <label>Full Name *</label>
      <input
        name="name"
        placeholder="Enter full name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <label>Email *</label>
      <input
        name="email"
        type="email"
        placeholder="example@gmail.com"
        value={form.email}
        onChange={handleChange}
        required
      />

      <label>Phone Number *</label>
      <input
        name="phone"
        type="tel"
        placeholder="10 digit mobile number"
        value={form.phone}
        onChange={handleChange}
        required
      />

      <label>Address</label>
      <textarea
        name="address"
        placeholder="Enter address (optional)"
        value={form.address}
        onChange={handleChange}
        rows="3"
      />

      {error && <p className="error-message">{error}</p>}

      <button type="submit" className="primary-btn">
        {editingContact ? "Update Contact" : "Save Contact"}
      </button>

      {editingContact && (
        <button
          type="button"
          className="cancel-btn"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
}

export default ContactForm;
