import express from "express";
import {
  getWorkouts,
  addWorkout,
  deleteWorkout,
  resetWorkouts,
  setGoal,
  getGoal,
} from "../controllers/gymContoller.js";
import  protect  from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/workouts", protect, getWorkouts);
router.post("/workouts", protect, addWorkout);
router.delete("/workouts/:id", protect, deleteWorkout);
router.delete("/reset", protect, resetWorkouts);

router.get("/goal", protect, getGoal);
router.post("/goal", protect, setGoal);

export default router;
