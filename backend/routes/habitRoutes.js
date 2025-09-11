import express from "express";
import {
  getHabits,
  addHabit,
  toggleHabit,
  deleteHabit,
  clearHabits,
} from "../controllers/habitController.js";
import  protect  from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getHabits);
router.post("/", protect, addHabit);
router.put("/:id/toggle", protect, toggleHabit);
router.delete("/:id", protect, deleteHabit);
router.delete("/", protect, clearHabits);

export default router;
