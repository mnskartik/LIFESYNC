// src/components/NotesJournal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/notes"; // ✅ point to notes backend route

// 🔑 Attach JWT token to every request
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export default function NotesJournal() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);


  const fetchNotes = async () => {
  try {
    console.log("Fetching notes...");
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Check if token exists
    
    const res = await axios.get(API_BASE, getAuthConfig());
    console.log("Response:", res); // Check the full response
    console.log("Response data:", res.data); // Check the data specifically
    
    if (res.data && Array.isArray(res.data)) {
      setNotes(res.data);
    } else {
      console.error("Unexpected response format:", res.data);
    }
  } catch (err) {
    console.error("Error fetching notes:", err);
    console.error("Error response:", err.response); // More detailed error info
  }
};
  // Load notes from backend
  useEffect(() => {
  fetchNotes();
}, []);

  const addNote = async (e) => {
  e.preventDefault();
  if (!title.trim() || !content.trim()) return;

  try {
    console.log("Saving note:", { title, content, editId });
    
    if (editId) {
      const updateResponse = await axios.put(
        `${API_BASE}/${editId}`, 
        { title, content }, 
        getAuthConfig()
      );
      console.log("Update response:", updateResponse.data);
    } else {
      const createResponse = await axios.post(
        API_BASE, 
        { title, content }, 
        getAuthConfig()
      );
      console.log("Create response:", createResponse.data);
    }
    
    setTitle("");
    setContent("");
    setEditId(null);

    // Always reload fresh from backend
    fetchNotes();
  } catch (err) {
    console.error("Error saving note:", err);
    console.error("Error response:", err.response);
  }
};
  const deleteNote = async (id) => {
  try {
    await axios.delete(`${API_BASE}/${id}`, getAuthConfig());
    fetchNotes();  // refresh
  } catch (err) {
    console.error("Error deleting note:", err);
  }
};

  const clearAll = async () => {
    if (window.confirm("Clear all notes?")) {
      try {
        await axios.delete(API_BASE, getAuthConfig());
        setNotes([]);
      } catch (err) {
        console.error("Error clearing notes:", err);
      }
    }
  };

  const togglePin = async (id) => {
    const note = notes.find((n) => n._id === id);
    try {
      const res = await axios.put(
        `${API_BASE}/${id}`,
        { ...note, pinned: !note.pinned },
        getAuthConfig()
      );
      setNotes(notes.map((n) => (n._id === id ? res.data : n)));
    } catch (err) {
      console.error("Error pinning note:", err);
    }
  };

  const startEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note._id);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  const sortedNotes = [
    ...filteredNotes.filter((n) => n.pinned),
    ...filteredNotes.filter((n) => !n.pinned),
  ];

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "1rem",
        boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
        marginTop: "1rem",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
        📔 Notes & Journal
      </h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "0.75rem",
          border: "1px solid #cbd5e1",
          borderRadius: "0.5rem",
          marginBottom: "1rem",
          width: "100%",
        }}
      />

      {/* Add/Edit Note Form */}
      <form
        onSubmit={addNote}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: "0.75rem",
            border: "1px solid #cbd5e1",
            borderRadius: "0.5rem",
          }}
        />
        <textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          style={{
            padding: "0.75rem",
            border: "1px solid #cbd5e1",
            borderRadius: "0.5rem",
            resize: "vertical",
          }}
        ></textarea>
        <button
          type="submit"
          style={{
            padding: "0.75rem",
            backgroundColor: editId ? "#f59e0b" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {editId ? "Update Note" : "Add Note"}
        </button>
      </form>

      {/* Notes List */}
      {sortedNotes.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          {sortedNotes.map((note) => (
            <div
              key={note._id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "0.75rem",
                padding: "1rem",
                backgroundColor: note.pinned ? "#fffbe6" : "#f9fafb",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                {note.title}
              </h3>
              <p style={{ color: "#334155" }}>{note.content}</p>
              <small style={{ color: "#64748b", fontSize: "0.8rem" }}>
                 {note.createdAt ? new Date(note.createdAt).toLocaleString() : ""}
              </small>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => startEdit(note)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteNote(note._id)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Delete
                </button>
              </div>
              <button
                onClick={() => togglePin(note._id)}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem",
                  backgroundColor: note.pinned ? "#fbbf24" : "#64748b",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                {note.pinned ? "Unpin" : "Pin"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#64748b" }}>No notes yet. Start writing!</p>
      )}

      {notes.length > 1 && (
        <button
          onClick={clearAll}
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            backgroundColor: "#f97316",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Clear All Notes
        </button>
      )}
    </div>
  );
}
