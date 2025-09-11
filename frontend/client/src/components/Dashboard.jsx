// src/components/Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AlarmsReminders from "./AlarmsReminders";
import CalorieTracker from "./CalorieTracker";
import ExpenseTracker from "./ExpenseTracker";
import WaterIntake from "./WaterIntake";
import GymProgress from "./GymProgress";
import PersonalizedSchedule from "./PersonalizedSchedule";

import HabitTracker from "./HabitTracker";

const API_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const [summary, setSummary] = useState({
    alarms: 0,
    schedule: "",
    calories: { target: 0, consumed: 0 },
    
    habits: 0,
    water: "0 / 0",
    expenses: "₹0",
    gym: "No progress yet",
  });

  // ✅ Fetch summary from backend (instead of only localStorage)
  const loadSummaryFromDatabase = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/summary`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // if JWT auth
      },
    });

      // Backend should return same shape as summary
      if (res.data) {
        setSummary(res.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
    }
  }, []);

  // run on mount
  useEffect(() => {
    loadSummaryFromDatabase();
  }, [loadSummaryFromDatabase]);

  // Optional: refresh in realtime every 30s
  useEffect(() => {
    const interval = setInterval(loadSummaryFromDatabase, 30000);
    return () => clearInterval(interval);
  }, [loadSummaryFromDatabase]);

  // Children call this for instant UI updates
  const updateSummary = (key, value) => {
    setSummary((prev) => ({ ...prev, [key]: value }));
    // Optional: also sync back to DB
    axios.put(`${API_URL}/api/dashboard/summary`, {
      ...summary,
      [key]: value,
    }).catch((err) => console.error("Failed to update summary:", err));
  };

  const renderComponent = () => {
    const childProps = { updateSummary };
    switch (activeComponent) {
      case "alarms":
        return <AlarmsReminders {...childProps} />;
      case "schedule":
        return <PersonalizedSchedule {...childProps} />;
      case "calories":
        return <CalorieTracker {...childProps} />;
      
      case "habits":
        return <HabitTracker {...childProps} />;
      case "water":
        return <WaterIntake {...childProps} />;
      case "expenses":
        return <ExpenseTracker {...childProps} />;
      case "gym":
        return <GymProgress {...childProps} />;
      default:
        return null;
    }
  };

  const cardStyle = {
    flex: "1 1 calc(33% - 1rem)",
    minWidth: "250px",
    padding: "1rem",
    margin: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s ease-in-out",
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      {!activeComponent ? (
        <>
          <h2
            style={{
              fontSize: "1.75rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            📊 Dashboard
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div style={cardStyle} onClick={() => setActiveComponent("alarms")}>
              <h3>⏰ Alarms</h3>
              <p>{summary.alarms} active reminders</p>
            </div>

            <div style={cardStyle} onClick={() => setActiveComponent("schedule")}>
              <h3>📅 Schedule</h3>
              <p>{summary.schedule || "No tasks today"}</p>
            </div>

            <div style={cardStyle} onClick={() => setActiveComponent("calories")}>
              <h3>🥗 Calories</h3>
              <p>
                {summary.calories.consumed}/{summary.calories.target} kcal
              </p>
            </div>

            

            <div style={cardStyle} onClick={() => setActiveComponent("habits")}>
              <h3>🔥 Habits</h3>
              <p>{summary.habits} active habits</p>
            </div>

            <div style={cardStyle} onClick={() => setActiveComponent("water")}>
              <h3>💧 Water</h3>
              <p>{summary.water}</p>
            </div>

            <div style={cardStyle} onClick={() => setActiveComponent("expenses")}>
              <h3>💰 Expenses</h3>
              <p>{summary.expenses}</p>
            </div>

            <div style={cardStyle} onClick={() => setActiveComponent("gym")}>
              <h3>🏋️ Gym</h3>
              <p>{summary.gym}</p>
            </div>
          </div>
        </>
      ) : (
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setActiveComponent(null)}
            aria-label="Back to Dashboard"
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              width: 40,
              height: 40,
              borderRadius: 8,
              border: "none",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="#4f46e5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div style={{ marginTop: 0, paddingTop: 0 }}>{renderComponent()}</div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
