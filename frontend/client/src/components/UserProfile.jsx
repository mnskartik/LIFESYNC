// src/components/UserProfile.jsx
import React, { useState, useEffect } from "react";

export default function UserProfile() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
  localStorage.clear(); // remove all stored data
  setUser({ name: "", email: "" }); // reset state
  setMessage("Logged out successfully 🚪");
  // optional: redirect to login page
  window.location.href = "/login";
};


  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = user.token || JSON.parse(localStorage.getItem("user")).token;

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      // Update localStorage and state
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setMessage("Profile updated successfully ✅");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "white",
        padding: "2rem",
        borderRadius: "1rem",
        maxWidth: "500px",
        margin: "0 auto",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1.5rem" }}>
        User Profile
      </h2>

      {message && (
        <p
          style={{
            color: message.includes("success") ? "green" : "red",
            marginBottom: "1rem",
          }}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleUpdate}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          placeholder="Name"
          required
          style={{
            padding: "0.75rem",
            border: "1px solid #cbd5e1",
            borderRadius: "0.5rem",
          }}
        />

        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
          required
          style={{
            padding: "0.75rem",
            border: "1px solid #cbd5e1",
            borderRadius: "0.5rem",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#1e293b",
            color: "white",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
         

          {loading ? "Updating..." : "Update Profile"}
        </button>

        <button
  type="button"
  onClick={handleLogout}
  style={{
    backgroundColor: "#ef4444",
    color: "white",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
  Logout
</button>

      </form>
    </div>
  );
}
