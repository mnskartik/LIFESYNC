// src/components/ExpenseTracker.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
export default function ExpenseTracker() {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  // Axios instance with token
  const API = axios.create({
    baseURL: `${API_URL}/api/expenses`,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

  // Fetch expenses + budget
  const fetchExpenses = async () => {
    try {
      const { data } = await API.get("/");
      setBudget(data.budget || 0);
      setExpenses(data.expenses || []);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line
  }, []);

  // Save budget
  const updateBudget = async (value) => {
    setBudget(value);
    try {
      await API.post("/budget", { budget: value });
    } catch (err) {
      console.error("Error updating budget:", err);
    }
  };

  // Add expense
  const addExpense = async (e) => {
    e.preventDefault();
    if (!title || !category || !amount || isNaN(amount) || Number(amount) <= 0)
      return;

    try {
      const { data } = await API.post("/add", {
        title,
        category,
        amount: Number(amount),
      });
      setExpenses(data.expenses);
      setBudget(data.budget);
      setTitle("");
      setCategory("");
      setAmount("");
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  // Reset month
  const resetMonth = async () => {
    if (window.confirm("Reset all expenses for this month?")) {
      try {
        await API.delete("/reset");
        setExpenses([]);
        setBudget(0);
      } catch (err) {
        console.error("Error resetting expenses:", err);
      }
    }
  };

  const totalSpent = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const remaining = budget - totalSpent;
  const progress = budget ? Math.min(Math.round((totalSpent / budget) * 100), 100) : 0;

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
        💰 Expense Tracker
      </h2>

      {/* Budget Setup */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <input
          type="number"
          placeholder="Set monthly budget"
          value={budget || ""}
          onChange={(e) => updateBudget(Number(e.target.value))}
          style={{
            flex: "1 1 200px",
            padding: "0.75rem",
            border: "1px solid #cbd5e1",
            borderRadius: "0.5rem",
          }}
        />
      </div>

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
            background: progress > 100 ? "#ef4444" : "#3b82f6",
            color: "white",
            textAlign: "center",
            padding: "0.4rem",
            fontSize: "0.85rem",
            transition: "width 0.3s ease",
          }}
        >
          {progress}%
        </div>
      </div>

      <p style={{ marginBottom: "0.5rem", fontWeight: "500" }}>
        Spent: ₹{totalSpent} / ₹{budget} | Remaining: ₹{remaining >= 0 ? remaining : 0}
      </p>

      {/* Add Expense Form */}
      <form
        onSubmit={addExpense}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={btnStyle}>
          Add
        </button>
      </form>

      {/* Expenses Table */}
      {expenses.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "1rem",
              minWidth: "400px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f1f5f9" }}>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{exp.title}</td>
                  <td style={tdStyle}>{exp.category}</td>
                  <td style={tdStyle}>{exp.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ marginTop: "1rem", color: "#6b7280" }}>No expenses logged yet.</p>
      )}

      <button
        onClick={resetMonth}
        style={{
          marginTop: "1rem",
          padding: "0.75rem",
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Reset Month
      </button>
    </div>
  );
}

// Styles
const inputStyle = {
  padding: "0.75rem",
  border: "1px solid #cbd5e1",
  borderRadius: "0.5rem",
};

const btnStyle = {
  padding: "0.75rem 1rem",
  backgroundColor: "#10b981",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontWeight: "600",
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
