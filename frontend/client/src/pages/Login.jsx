// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0f2fe, #f1f5f9)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2.5rem",
          borderRadius: "1rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: "400px",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "2rem",
            color: "#0f172a",
          }}
        >
          Welcome Back 👋
        </h2>

        {error && (
          <p
            style={{
              color: "#ef4444",
              background: "#fee2e2",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              fontSize: "0.9rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        <form
          onSubmit={handleEmailLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.85rem",
              border: "1px solid #cbd5e1",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "#3b82f6") ||
              (e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.3)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "#cbd5e1") ||
              (e.target.style.boxShadow = "none")
            }
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.85rem",
              border: "1px solid #cbd5e1",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "#3b82f6") ||
              (e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.3)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "#cbd5e1") ||
              (e.target.style.boxShadow = "none")
            }
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.9rem",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s, transform 0.1s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseDown={(e) => (e.target.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          >
            Login
          </button>
        </form>

        <p
          style={{
            marginTop: "1.75rem",
            fontSize: "0.9rem",
            textAlign: "center",
            color: "#475569",
          }}
        >
          Don’t have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#3b82f6",
              fontWeight: "600",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.color = "#1d4ed8")}
            onMouseOut={(e) => (e.target.style.color = "#3b82f6")}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
