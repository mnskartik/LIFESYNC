import express from "express";
import { getDashboardSummary,updateDashboardSummary} from "../controllers/dashboardController.js";
import protect from "../middleware/authMiddleware.js"; // ✅ import the default export

const router = express.Router();

// GET and PUT routes for summary
router.get("/summary", protect, getDashboardSummary);
router.put("/summary",protect, updateDashboardSummary);

export default router;
