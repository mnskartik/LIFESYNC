import express from "express";
import { createReminder, getReminders, deleteReminder } from "../controllers/reminderController.js";
import  protect  from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReminder);   // Add reminder
router.get("/", protect, getReminders);      // Get all reminders
router.delete("/:id", protect, deleteReminder); // Delete reminder

export default router;
