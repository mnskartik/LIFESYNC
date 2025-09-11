// src/components/CalorieTracker.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CalorieTracker() {
  const [target, setTarget] = useState("");
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  const [logs, setLogs] = useState([]);
  const [history, setHistory] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedDay, setSelectedDay] = useState("today");

  const API_BASE = "http://localhost:5000/api/calories";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const todayRes = await axios.get(`${API_BASE}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(todayRes.data.logs || []);
        setTarget(todayRes.data.target || "");

        const historyRes = await axios.get(`${API_BASE}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(historyRes.data || []);
      } catch (err) {
        console.error("Error fetching calorie logs:", err);
      }
    };
    fetchLogs();
  }, [token]);

  const handleSetTarget = async (e) => {
    e.preventDefault();
    if (!target || target <= 0) {
      alert("Please enter a valid target!");
      return;
    }
    try {
      await axios.post(
        `${API_BASE}/target`,
        { target: Number(target) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Target updated!");
    } catch (err) {
      console.error("Error setting target:", err);
    }
  };

  const addLog = async (e) => {
    e.preventDefault();
    if (!food || !calories || calories <= 0) return;

    try {
      const res = await axios.post(
        `${API_BASE}/add`,
        { food, calories: Number(calories) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLogs(res.data.logs);
      setFood("");
      setCalories("");
    } catch (err) {
      console.error("Error adding food:", err);
    }
  };

  const deleteLog = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data.logs);
    } catch (err) {
      console.error("Error deleting food:", err);
    }
  };

  const resetLogs = async () => {
    if (window.confirm("Clear all logs and reset target?")) {
      try {
        await axios.post(
          `${API_BASE}/target`,
          { target: 0 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLogs([]);
        setTarget("");
      } catch (err) {
        console.error("Error resetting logs:", err);
      }
    }
  };

  const totalConsumed = logs.reduce((acc, curr) => acc + curr.calories, 0);
  const remaining = target ? target - totalConsumed : 0;
  const progress = target ? Math.min((totalConsumed / target) * 100, 100) : 0;
  const remainingText =
    remaining > 0
      ? `${remaining} kcal left`
      : remaining === 0
      ? "Target reached 🎉"
      : `Exceeded by ${Math.abs(remaining)} kcal ⚠️`;

  const getSummary = (dayLogs, dayTarget) => {
    const consumed = dayLogs.reduce((acc, curr) => acc + curr.calories, 0);
    const left = dayTarget ? dayTarget - consumed : 0;
    const percent = dayTarget ? Math.min((consumed / dayTarget) * 100, 100) : 0;
    return { consumed, left, percent };
  };

  const renderSummaryModal = () => {
    const todaySummary = { date: "today", logs, target };
    const allSummaries = [...history, todaySummary];
    const current =
      selectedDay === "today"
        ? todaySummary
        : allSummaries.find((s) => s.date === selectedDay);

    if (!current) return null;
    const summary = getSummary(current.logs, current.target);

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "1rem",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>📊 Summary for {selectedDay}</h2>
          <p><strong>Target:</strong> {current.target || "-"} kcal</p>
          <p><strong>Consumed:</strong> {summary.consumed} kcal</p>
          <p>
            <strong>Status:</strong>{" "}
            {summary.left >= 0
              ? `${summary.left} kcal left`
              : `Exceeded by ${Math.abs(summary.left)} kcal`}
          </p>
          <p><strong>Completion:</strong> {summary.percent.toFixed(1)}%</p>

          <h3 style={{ marginTop: "1rem" }}>Food Logs</h3>
          {current.logs.length === 0 ? (
            <p>No logs recorded.</p>
          ) : (
            <ul style={{ paddingLeft: "1.2rem" }}>
              {current.logs.map((item) => (
                <li key={item._id || item.id}>
                  {item.food} - {item.calories} kcal
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: "1rem" }}>
            <label><strong>View Past Day:</strong> </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              style={{ marginLeft: "0.5rem", padding: "0.3rem" }}
            >
              <option value="today">Today</option>
              {history.map((h) => (
                <option key={h.date} value={h.date}>
                  {h.date}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowSummary(false)}
            style={{
              marginTop: "1.5rem",
              padding: "0.5rem 1rem",
              background: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "0.3rem",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        margin: "auto",
        background: "#f9f9f9",
        borderRadius: "1rem",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
        🍎 Calorie Tracker
      </h2>

      {/* Target Form */}
      <form onSubmit={handleSetTarget} style={{ marginBottom: "1rem" }}>
        <input
          type="number"
          placeholder="Set Target Calories"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "0.5rem", width: "70%" }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "0.3rem",
            cursor: "pointer",
          }}
        >
          Set
        </button>
      </form>

      {target > 0 && (
        <>
          <p><strong>Target:</strong> {target} kcal</p>
          <p><strong>Consumed:</strong> {totalConsumed} kcal</p>
          <p><strong>Status:</strong> {remainingText}</p>
          <p><strong>Progress:</strong> {progress.toFixed(1)}%</p>
        </>
      )}

      {/* Add Food */}
      {target > 0 && (
        <form onSubmit={addLog} style={{ marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="Food Item"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            style={{ padding: "0.5rem", marginRight: "0.5rem", width: "40%" }}
          />
          <input
            type="number"
            placeholder="Calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            style={{ padding: "0.5rem", marginRight: "0.5rem", width: "30%" }}
          />
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              background: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "0.3rem",
              cursor: "pointer",
            }}
          >
            Add Food
          </button>
        </form>
      )}

      {/* Logs */}
      {logs.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h3>Logs</h3>
          <ul style={{ paddingLeft: "1.2rem" }}>
            {logs.map((item) => (
              <li key={item._id || item.id} style={{ marginBottom: "0.5rem" }}>
                {item.food} - {item.calories} kcal{" "}
                <button
                  onClick={() => deleteLog(item._id || item.id)}
                  style={{
                    marginLeft: "0.5rem",
                    padding: "0.2rem 0.5rem",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "0.3rem",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={resetLogs}
              style={{
                marginRight: "0.5rem",
                padding: "0.5rem 1rem",
                background: "#ffc107",
                color: "#333",
                border: "none",
                borderRadius: "0.3rem",
                cursor: "pointer",
              }}
            >
              Reset Logs
            </button>
            <button
              onClick={() => setShowSummary(true)}
              style={{
                padding: "0.5rem 1rem",
                background: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "0.3rem",
                cursor: "pointer",
              }}
            >
              View Summary
            </button>
          </div>
        </div>
      )}

      {showSummary && renderSummaryModal()}
    </div>
  );
}
