// src/components/AlarmsReminders.jsx
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function AlarmsReminders({ updateSummary }) {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  const token = localStorage.getItem("token"); // store from login

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/reminders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setReminders(res.data))
    .catch(err => console.error(err));
  }, []);

  const addReminder = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reminders`,
        { title, time },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReminders([...reminders, res.data]);
      setTitle("");
      setTime("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReminder = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/reminders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(reminders.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "1rem",
        boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
        ⏰ Alarms & Reminders
      </h2>

      {/* Form */}
      <form
        onSubmit={addReminder}
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
      >
        <input
          type="text"
          placeholder="Reminder title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: "0.75rem",
            border: "1px solid #cbd5e1",
            borderRadius: "0.5rem",
          }}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{
            padding: "0.75rem",
            border: "1px solid #cbd5e1",
            borderRadius: "0.5rem",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Add Reminder
        </button>
      </form>

      {/* List */}
      <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0 }}>
        {reminders.map((reminder) => (
          <li
            key={reminder.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.75rem",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <span>
              {reminder.title} — {reminder.time}
            </span>
            <button
              onClick={() => deleteReminder(reminder.id)}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                padding: "0.4rem 0.75rem",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
