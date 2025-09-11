import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // link to logged-in user
    required: true,
  },
  title: { type: String, required: true },
  time: { type: String, required: true }, // HH:mm format
  triggered: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Reminder", reminderSchema);
