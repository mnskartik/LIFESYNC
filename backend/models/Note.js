// backend/models/Note.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true } // ✅ ensures createdAt/updatedAt exist
);

export default mongoose.model("Note", noteSchema);
