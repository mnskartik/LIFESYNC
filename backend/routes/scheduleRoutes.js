import express from "express";
import { addTask, getTasks, deleteTask } from "../controllers/scheduleController.js";
import  protect  from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getTasks)   // GET /api/schedule
  .post(protect, addTask);  // POST /api/schedule

router.route("/:id")
  .delete(protect, deleteTask);  // DELETE /api/schedule/:id

export default router;
