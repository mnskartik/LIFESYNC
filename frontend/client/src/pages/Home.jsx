// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import AlarmsReminders from "../components/AlarmsReminders";
import PersonalizedSchedule from "../components/PersonalizedSchedule"; 
import CalorieTracker from "../components/CalorieTracker";
import NotesJournal from "../components/NotesJournal";
import HabitTracker from "../components/HabitTracker";
import WaterIntake from "../components/WaterIntake";
import ExpenseTracker from "../components/ExpenseTracker";
import GymProgress from "../components/GymProgress";
import Dashboard from "../components/Dashboard";
import UserProfile from "../components/UserProfile";

export default function Home() {
  
  const [activeFeature, setActiveFeature] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName, setUserName] = useState("");

  
  

  useEffect(() => {
    

    // Load user name from localStorage if available
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed.name || "");
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  // Listen to window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar menu items
  const menuItems = [
    "Dashboard",
    "Alarms & Reminders",
    "Personalized Schedule",
    "Calorie Tracker",
    
    "Habit Tracker",
    "Water Intake",
    "Expense Tracker",
    "Gym Progress",
    "Profile"
  ];

  // Render feature content
  const renderContent = () => {
    switch (activeFeature) {
      case "Alarms & Reminders":
        return <AlarmsReminders />;
      case "Personalized Schedule":
        return <PersonalizedSchedule />;
      case "Calorie Tracker":
        return <CalorieTracker />;
      case "Profile":
        return <UserProfile/>
      
      case "Habit Tracker":
        return <HabitTracker />;
      case "Water Intake":
        return <WaterIntake />;
      case "Expense Tracker":
        return <ExpenseTracker />;
      case "Gym Progress":
        return <GymProgress />;
      case "Dashboard":
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        backgroundColor: "#f1f5f9",
      }}
    >
      {/* Sidebar (desktop only) */}
      {!isMobile && (
        <div
          style={{
            width: "250px",
            backgroundColor: "#1e293b",
            color: "white",
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
            gap: "1rem",
            position: "relative", // allow absolute positioning inside
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Life Sync</h2>
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveFeature(item)}
              style={{
                backgroundColor:
                  activeFeature === item ? "#4f46e5" : "transparent",
                color: "white",
                border: "none",
                textAlign: "left",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              {item}
            </button>
          ))}

          {/* User name at bottom left */}
           
        </div>
      )}

      {/* Mobile Header */}
      {isMobile && (
        <div
          style={{
            backgroundColor: "#1e293b",
            color: "white",
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "700" }}>Life Hub</h2>
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            ☰
          </button>
        </div>
      )}

      {/* Drawer (mobile only) */}
      {isMobile && drawerOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            width: "220px",
            backgroundColor: "#1e293b",
            color: "white",
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
            gap: "1rem",
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "1.25rem",
              alignSelf: "flex-end",
              cursor: "pointer",
            }}
          >
            ✖
          </button>
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveFeature(item);
                setDrawerOpen(false);
              }}
              style={{
                backgroundColor:
                  activeFeature === item ? "#4f46e5" : "transparent",
                color: "white",
                border: "none",
                textAlign: "left",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              {item}
            </button>
          ))}

          
         
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, padding: "2rem" }}>{renderContent()}</div>
    </div>
  );
}
