// src/components/HabitTracker.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function HabitTracker() {
  const [habitName, setHabitName] = useState("");
  const [habits, setHabits] = useState([]);

  const API_URL = `${process.env.REACT_APP_API_URL}/api/habits`;

  const token = localStorage.getItem("token");

  // Load habits from backend
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const { data } = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHabits(data);
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };
    fetchHabits();
  }, [API_URL, token]);

  // Add habit
  const addHabit = async (e) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    try {
      const { data } = await axios.post(
        API_URL,
        { name: habitName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHabits([...habits, data]);
      setHabitName("");
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  // Toggle habit
  const toggleHabit = async (id) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHabits(habits.map((h) => (h._id === id ? data : h)));
    } catch (error) {
      console.error("Error toggling habit:", error);
    }
  };

  // Delete habit
  const deleteHabit = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(habits.filter((habit) => habit._id !== id));
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  // Clear all habits
  const clearAll = async () => {
    if (!window.confirm("Clear all habits?")) return;
    try {
      await axios.delete(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits([]);
    } catch (error) {
      console.error("Error clearing habits:", error);
    }
  };

  // Progress Calculation
  const completedCount = habits.filter((h) => h.completed).length;
  const progress =
    habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

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
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          marginBottom: "1rem",
        }}
      >
        📊 Habit Tracker
      </h2>

      {/* Progress Bar */}
      <div
        style={{
          marginBottom: "1rem",
          background: "#e2e8f0",
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            background: "#10b981",
            color: "white",
            textAlign: "center",
            padding: "0.25rem",
            fontSize: "0.85rem",
            transition: "width 0.3s ease",
          }}
        >
          {progress}%
        </div>
      </div>

      {/* Add Habit */}
      <form
        onSubmit={addHabit}
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Enter new habit..."
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          style={{
            flex: 1,
            padding: "0.75rem",
            border: "1px solid #cbd5e1",
            borderRadius: "0.5rem",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem 1rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Add
        </button>
      </form>

      {/* Habits List */}
      {habits.length > 0 ? (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {habits.map((habit) => (
            <li
              key={habit._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                backgroundColor: habit.completed ? "#ecfdf5" : "#f9fafb",
              }}
            >
              <div>
                <span
                  style={{
                    textDecoration: habit.completed ? "line-through" : "none",
                    color: habit.completed ? "#059669" : "#1e293b",
                    fontWeight: "500",
                  }}
                >
                  {habit.name}
                </span>
                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  🔥 Streak: {habit.streak} days
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => toggleHabit(habit._id)}
                  style={{
                    padding: "0.5rem 0.75rem",
                    backgroundColor: habit.completed ? "#facc15" : "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  {habit.completed ? "Undo" : "Done"}
                </button>
                <button
                  onClick={() => deleteHabit(habit._id)}
                  style={{
                    padding: "0.5rem 0.75rem",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#64748b" }}>No habits yet. Add one above!</p>
      )}

      {habits.length > 1 && (
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
          Clear All
        </button>
      )}
    </div>
  );
}
