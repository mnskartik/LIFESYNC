import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import calorieRoutes from "./routes/calorieRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import gymRoutes from "./routes/gymRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/schedule",scheduleRoutes);
app.use("/api/calories", calorieRoutes);
app.use("/api/notes",noteRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/gym", gymRoutes);
app.use("/api/dashboard",dashboardRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
