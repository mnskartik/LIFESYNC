// src/components/GymProgress.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/gym";
axios.defaults.headers.common["Authorization"] =
  `Bearer ${localStorage.getItem("token")}`;

export default function GymProgress() {
  const [goal, setGoal] = useState("");
  const [targetWorkouts, setTargetWorkouts] = useState(0);
  const [workouts, setWorkouts] = useState([]);

  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");

  // ✅ Load workouts + goal together
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [resWorkouts, resGoal] = await Promise.all([
          axios.get(`${API_URL}/workouts`, { headers }),
          axios.get(`${API_URL}/goal`, { headers }),
        ]);

        setWorkouts(resWorkouts.data || []);
        if (resGoal.data) {
          setGoal(resGoal.data.goal || "");
          setTargetWorkouts(resGoal.data.targetWorkouts || 0);
        }
      } catch (err) {
        console.error("Error fetching gym data:", err.message);
      }
    };
    fetchData();
  }, []);

  // ✅ Add workout
  const addWorkout = async (e) => {
    e.preventDefault();
    if (!exercise || !sets || !reps || !weight || !date) return;

    try {
      const res = await axios.post(`${API_URL}/workouts`, {
        exercise,
        sets,
        reps,
        weight,
        date,
      });
      setWorkouts([...workouts, res.data]);

      setExercise("");
      setSets("");
      setReps("");
      setWeight("");
      setDate("");
    } catch (err) {
      console.error("Error adding workout:", err.message);
    }
  };

  // ✅ Delete workout
  const deleteWorkout = async (id) => {
    try {
      await axios.delete(`${API_URL}/workouts/${id}`);
      setWorkouts(workouts.filter((w) => w._id !== id));
    } catch (err) {
      console.error("Error deleting workout:", err.message);
    }
  };

  // ✅ Reset all progress
  const resetProgress = async () => {
    if (window.confirm("Reset all gym progress?")) {
      try {
        await axios.delete(`${API_URL}/reset`);
        setGoal("");
        setTargetWorkouts(0);
        setWorkouts([]);
      } catch (err) {
        console.error("Error resetting progress:", err.message);
      }
    }
  };

  // ✅ Save goal
  const saveGoal = async () => {
    try {
      const res = await axios.post(`${API_URL}/goal`, {
        goal,
        targetWorkouts,
      });
      setGoal(res.data.goal);
      setTargetWorkouts(res.data.targetWorkouts);
    } catch (err) {
      console.error("Error saving goal:", err.message);
    }
  };

  // ✅ Count workouts by unique dates
  const uniqueDates = [...new Set(workouts.map((w) => w.date))];
  const progress = targetWorkouts
    ? Math.min(Math.round((uniqueDates.length / targetWorkouts) * 100), 100)
    : 0;

  // ✅ Stats
  const heaviestWeight = workouts.length
    ? Math.max(...workouts.map((w) => Number(w.weight) || 0))
    : 0;
  const mostFrequentExercise =
    workouts.length > 0
      ? Object.entries(
          workouts.reduce((acc, w) => {
            acc[w.exercise] = (acc[w.exercise] || 0) + 1;
            return acc;
          }, {})
        ).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "1rem",
        boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
        marginTop: "1rem",
        maxWidth: "800px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", fontWeight: "600", textAlign: "center" }}>
        🏋️ Gym Progress Tracker
      </h2>

      {/* Show Goal */}
      {goal && (
        <p style={{ textAlign: "center", fontWeight: "500", marginBottom: "1rem" }}>
          🎯 Goal: {goal}
        </p>
      )}

      {/* Goal Setup */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Fitness Goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Target Workouts/Month"
          value={targetWorkouts || ""}
          onChange={(e) => setTargetWorkouts(Number(e.target.value))}
          style={inputStyle}
        />
        <button onClick={saveGoal} style={btnStyle}>
          Save Goal
        </button>
      </div>

      {/* Progress Bar */}
      {targetWorkouts > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ marginBottom: "0.5rem", background: "#e2e8f0", borderRadius: "0.5rem", overflow: "hidden" }}>
            <div
              style={{
                width: `${progress}%`,
                background: progress >= 100 ? "#10b981" : "#3b82f6",
                color: "white",
                textAlign: "center",
                padding: "0.4rem",
                fontSize: "0.85rem",
              }}
            >
              {progress}%
            </div>
          </div>
          <p style={{ fontWeight: "500", textAlign: "center" }}>
            Workouts (unique days): {uniqueDates.length} / {targetWorkouts}
          </p>
        </div>
      )}

      {/* Add Workout Form */}
      <form onSubmit={addWorkout} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <input type="text" placeholder="Exercise" value={exercise} onChange={(e) => setExercise(e.target.value)} style={inputStyle} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "0.5rem", width: "100%", maxWidth: "500px" }}>
          <input type="number" placeholder="Sets" value={sets} onChange={(e) => setSets(e.target.value)} style={inputStyle} />
          <input type="number" placeholder="Reps" value={reps} onChange={(e) => setReps(e.target.value)} style={inputStyle} />
          <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} style={inputStyle} />
        </div>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
        <button type="submit" style={btnStyle}>
          Log Workout
        </button>
      </form>

      {/* Workouts Table */}
      {workouts.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem", minWidth: "600px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f1f5f9" }}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Exercise</th>
                <th style={thStyle}>Sets</th>
                <th style={thStyle}>Reps</th>
                <th style={thStyle}>Weight (kg)</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((w) => (
                <tr key={w._id}>
                  <td style={tdStyle}>{w.date}</td>
                  <td style={tdStyle}>{w.exercise}</td>
                  <td style={tdStyle}>{w.sets}</td>
                  <td style={tdStyle}>{w.reps}</td>
                  <td style={tdStyle}>{w.weight}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => deleteWorkout(w._id)}
                      style={{ background: "#ef4444", color: "white", border: "none", padding: "0.4rem 0.6rem", borderRadius: "0.4rem", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ marginTop: "1rem", color: "#6b7280", textAlign: "center" }}>
          No workouts logged yet.
        </p>
      )}

      {/* Stats */}
      {workouts.length > 0 && (
        <p style={{ marginTop: "1rem", fontWeight: "500", textAlign: "center" }}>
          📊 Total Workouts: {workouts.length} | 🏋️ Heaviest Weight: {heaviestWeight}kg | 🔥 Most Frequent Exercise: {mostFrequentExercise}
        </p>
      )}

      <div style={{ textAlign: "center" }}>
        <button
          onClick={resetProgress}
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: "600",
            cursor: "pointer",
            width: "50%",
            maxWidth: "200px",
          }}
        >
          Reset Progress
        </button>
      </div>
    </div>
  );
}

// Styles
const inputStyle = {
  padding: "0.75rem",
  border: "1px solid #cbd5e1",
  borderRadius: "0.5rem",
  width: "100%",
  maxWidth: "500px",
};

const btnStyle = {
  padding: "0.75rem 1rem",
  backgroundColor: "#4f46e5",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontWeight: "600",
  width: "50%",
  maxWidth: "200px",
};

const thStyle = {
  textAlign: "left",
  padding: "0.75rem",
  borderBottom: "1px solid #e2e8f0",
};

const tdStyle = {
  padding: "0.75rem",
  borderBottom: "1px solid #e2e8f0",
};
