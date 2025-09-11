// src/components/WaterIntake.jsx
import React, { useState, useEffect } from "react";

const WaterIntake = () => {
  const [intake, setIntake] = useState(0);
  const [goal, setGoal] = useState(3000); // default 3L
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("waterIntake")) || null;
    const savedHistory = JSON.parse(localStorage.getItem("waterHistory")) || [];

    if (savedData && savedData.date === new Date().toDateString()) {
      setIntake(savedData.intake);
      setGoal(savedData.goal || 3000);
    } else {
      // Reset for a new day
      localStorage.setItem(
        "waterIntake",
        JSON.stringify({ date: new Date().toDateString(), intake: 0, goal: 3000 })
      );

      // Save yesterday’s record if exists
      if (savedData) {
        const updatedHistory = [...savedHistory, savedData];
        localStorage.setItem("waterHistory", JSON.stringify(updatedHistory));
        setHistory(updatedHistory);

        // Calculate streak
        let currentStreak = 0;
        for (let i = updatedHistory.length - 1; i >= 0; i--) {
          if (updatedHistory[i].intake >= updatedHistory[i].goal) {
            currentStreak++;
          } else {
            break;
          }
        }
        setStreak(currentStreak);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "waterIntake",
      JSON.stringify({ date: new Date().toDateString(), intake, goal })
    );
  }, [intake, goal]);

  const handleAddWater = (amount) => {
    setIntake((prev) => prev + amount);
  };

  const handleReset = () => {
    if (window.confirm("Reset today's progress?")) {
      setIntake(0);
      localStorage.setItem(
        "waterIntake",
        JSON.stringify({ date: new Date().toDateString(), intake: 0, goal })
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "1rem auto",
        padding: "1.5rem",
        border: "1px solid #ddd",
        borderRadius: "1rem",
        textAlign: "center",
        background: "#f9f9f9",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: "1rem", color: "#2563eb" }}>
        💧 Water Intake Tracker
      </h2>
      <p style={{ marginBottom: "0.5rem", fontWeight: "500" }}>
        {intake} ml / {goal} ml
      </p>
      <p style={{ color: "#3b82f6", fontWeight: "600" }}>
        🔥 Streak: {streak} days
      </p>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#ddd",
          borderRadius: "1rem",
          overflow: "hidden",
          marginBottom: "1rem",
          height: "20px",
        }}
      >
        <div
          style={{
            width: `${Math.min((intake / goal) * 100, 100)}%`,
            backgroundColor: intake >= goal ? "#22c55e" : "#3b82f6", // green if goal met
            height: "100%",
            transition: "width 0.3s ease",
          }}
        ></div>
      </div>

      {/* Quick Add Buttons */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {[250, 500, 1000].map((val) => (
          <button
            key={val}
            onClick={() => handleAddWater(val)}
            style={{
              flex: 1,
              padding: "0.75rem",
              backgroundColor: "#38bdf8",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            +{val} ml
          </button>
        ))}
      </div>

      {/* Custom Add */}
      <button
        onClick={() => handleAddWater(250)}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          cursor: "pointer",
          fontWeight: "600",
          marginBottom: "1rem",
        }}
      >
        Add 250ml
      </button>

      {/* Goal Input */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.25rem" }}>
          Set Daily Goal (ml):
        </label>
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          style={{
            padding: "0.5rem",
            width: "100%",
            borderRadius: "0.5rem",
            border: "1px solid #ddd",
            textAlign: "center",
          }}
        />
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Reset Progress
      </button>
    </div>
  );
};

export default WaterIntake;
