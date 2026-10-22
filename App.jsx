
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Users, UserPlus } from "lucide-react";

import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import "./App.css";

const API_URL =
  `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/contacts`;

function App() {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      const data = response.data;
      const list = Array.isArray(data)
        ? data
        : data.contacts ?? data.data ?? [];

      if (!Array.isArray(list)) {
        throw new Error("Backend se contacts ki list nahi mili.");
      }

      setContacts(list);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Contacts load nahi ho paaye."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  async function handleSave(form) {
    try {
      setError("");

      if (editingContact) {
        await axios.put(
          `${API_URL}/${editingContact._id}`,
          form
        );
        setEditingContact(null);
      } else {
        await axios.post(API_URL, form);
      }

      await fetchContacts();
    } catch (err) {
      const message =
        err.response?.data?.message || "Contact save nahi hua.";

      setError(message);
      throw new Error(message);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Kya tum ye contact delete karna chahti ho?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await axios.delete(`${API_URL}/${id}`);

      if (editingContact?._id === id) {
        setEditingContact(null);
      }

      await fetchContacts();
    } catch (err) {
      setError(
        err.response?.data?.message || "Contact delete nahi hua."
      );
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <Users size={23} />
          </div>
          <div>
            <h1>Contact Manager</h1>
            <p>All your contacts in one place</p>
          </div>
        </div>

        <div className="total-badge">
          <Users size={17} />
          {contacts.length} Contacts
        </div>
      </header>

      <main className="dashboard">
        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR PERSONAL DIRECTORY</p>
            <h2>Manage your connections.</h2>
            <p>Add, organize and update your contacts easily.</p>
          </div>
          <UserPlus size={45} />
        </section>

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={fetchContacts}>Retry</button>
          </div>
        )}

        <div className="dashboard-grid">
          <ContactForm
            onSave={handleSave}
            editingContact={editingContact}
            onCancel={() => setEditingContact(null)}
          />

          <div>
            {loading ? (
              <p className="status-message">Loading contacts...</p>
            ) : (
              <ContactList
                contacts={contacts}
                search={search}
                setSearch={setSearch}
                onEdit={setEditingContact}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        Contact Manager · Keep your connections organized
      </footer>
    </div>
  );
}

export default App;
