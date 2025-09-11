// src/components/PersonalizedSchedule.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PersonalizedSchedule() {
  const [day, setDay] = useState("Monday");
  const [time, setTime] = useState("");
  const [task, setTask] = useState("");
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");

  // ✅ Fetch schedule from backend
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/schedule`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Format schedule into { Monday: [...], Tuesday: [...] }
        const grouped = res.data.reduce((acc, item) => {
          if (!acc[item.day]) acc[item.day] = [];
          acc[item.day].push(item);
          return acc;
        }, {});
        setSchedule(grouped);
      } catch (err) {
        console.error("Error fetching schedule:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchSchedule();
  }, [API_URL, token]);

  // ✅ Add new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!day || !time || !task) return;

    try {
      const res = await axios.post(
        `${API_URL}/api/schedule`,
        { day, time, task },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newTask = res.data;
      setSchedule((prev) => {
        const updated = { ...prev };
        if (!updated[day]) updated[day] = [];
        updated[day].push(newTask);
        return updated;
      });

      setTime("");
      setTask("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // ✅ Delete task
  const deleteTask = async (day, id) => {
    try {
      await axios.delete(`${API_URL}/api/schedule/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSchedule((prev) => {
        const updated = { ...prev };
        updated[day] = updated[day].filter((t) => t._id !== id);
        if (updated[day].length === 0) delete updated[day];
        return updated;
      });
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  if (loading) return <p>Loading schedule...</p>;

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
        📅 Personalized Schedule
      </h2>

      {/* Form */}
      <form
        onSubmit={addTask}
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
      >
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          style={{
            padding: "0.75rem",
            border: "1px solid #cbd5e1",
            borderRadius: "0.5rem",
          }}
        >
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

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

        <input
          type="text"
          placeholder="Task / Activity"
          value={task}
          onChange={(e) => setTask(e.target.value)}
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
            backgroundColor: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Add Task
        </button>
      </form>

      {/* Schedule Table */}
      <div style={{ marginTop: "1.5rem" }}>
        {Object.keys(schedule).map((dayKey) => (
          <div key={dayKey} style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ marginBottom: "0.5rem", color: "#2563eb" }}>{dayKey}</h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "1rem",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #e2e8f0",
                      padding: "0.75rem",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    Time
                  </th>
                  <th
                    style={{
                      border: "1px solid #e2e8f0",
                      padding: "0.75rem",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    Task
                  </th>
                  <th
                    style={{
                      border: "1px solid #e2e8f0",
                      padding: "0.75rem",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedule[dayKey].map((item) => (
                  <tr key={item._id}>
                    <td
                      style={{
                        border: "1px solid #e2e8f0",
                        padding: "0.75rem",
                        textAlign: "center",
                      }}
                    >
                      {item.time}
                    </td>
                    <td
                      style={{
                        border: "1px solid #e2e8f0",
                        padding: "0.75rem",
                      }}
                    >
                      {item.task}
                    </td>
                    <td
                      style={{
                        border: "1px solid #e2e8f0",
                        padding: "0.75rem",
                        textAlign: "center",
                      }}
                    >
                      <button
                        onClick={() => deleteTask(dayKey, item._id)}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
