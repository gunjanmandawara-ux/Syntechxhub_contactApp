
import { Search, Pencil, Trash2, UserRound } from "lucide-react";
import "./ContactList.css";

function ContactList({
  contacts,
  search,
  setSearch,
  onEdit,
  onDelete,
}) {
  const filteredContacts = contacts.filter((contact) => {
    const query = search.toLowerCase();

    return (
      contact.name?.toLowerCase().includes(query) ||
      contact.email?.toLowerCase().includes(query) ||
      contact.phone?.includes(query)
    );
  });

  return (
    <section className="contacts-section">
      <div className="contacts-heading">
        <div>
          <h2>My Contacts</h2>
          <p>{filteredContacts.length} contacts found</p>
        </div>
      </div>

      <div className="search-box">
        <Search size={19} />
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredContacts.length === 0 ? (
        <div className="empty-state">
          <UserRound size={40} />
          <h3>No contacts found</h3>
          <p>Add a contact or try a different search.</p>
        </div>
      ) : (
        <div className="contact-grid">
          {filteredContacts.map((contact) => (
            <article className="contact-card" key={contact._id}>
              <div className="contact-avatar">
                {contact.name?.charAt(0).toUpperCase()}
              </div>

              <div className="contact-info">
                <h3>{contact.name}</h3>
                <p>{contact.email}</p>
                <p>{contact.phone}</p>
                {contact.address && <p>{contact.address}</p>}
              </div>

              <div className="contact-actions">
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => onEdit(contact)}
                  aria-label={`Edit ${contact.name}`}
                  title="Edit contact"
                >
                  <Pencil size={17} />
                </button>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => onDelete(contact._id)}
                  aria-label={`Delete ${contact.name}`}
                  title="Delete contact"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ContactList;
