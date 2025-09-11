import express from "express";
import  protect  from "../middleware/authMiddleware.js";
import { getExpenses, setBudget, addExpense, resetExpenses } from "../controllers/expenseController.js";

const router = express.Router();

router.get("/", protect, getExpenses);
router.post("/budget", protect, setBudget);
router.post("/add", protect, addExpense);
router.delete("/reset", protect, resetExpenses);

export default router;
