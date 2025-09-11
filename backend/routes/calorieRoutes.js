import express from "express";
import {
  getTodayLog,
  setTarget,
  addFood,
  deleteFood,
  getHistory,
} from "../controllers/calorieController.js";
import  protect  from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getTodayLog);
router.post("/target", protect, setTarget);
router.post("/add", protect, addFood);
router.delete("/delete/:logId", protect, deleteFood);
router.get("/history", protect, getHistory);

export default router;
