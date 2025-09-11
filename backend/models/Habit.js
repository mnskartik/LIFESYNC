import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastCompleted: {
      type: String, // store as date string (e.g. "9/7/2025")
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);
