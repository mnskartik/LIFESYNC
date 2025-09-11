// backend/controllers/noteController.js
import mongoose from "mongoose";
import Note from "../models/Note.js";

// ✅ Get notes
export const getNotes = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add note
export const addNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const note = await Note.create({
      user: userId,
      title,
      content,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Update note
export const updateNote = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete note
export const deleteNote = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
