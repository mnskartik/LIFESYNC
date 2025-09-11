// backend/routes/noteRoutes.js
import express from "express";
import {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
  
} from "../controllers/noteController.js";
import  protect  from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotes);
router.post("/", protect, addNote);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);


export default router;
