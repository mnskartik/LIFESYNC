import mongoose from "mongoose";

const calorieLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  target: { type: Number, default: 0 },
  logs: [
    {
      food: String,
      calories: Number,
    },
  ],
});

export default mongoose.model("CalorieLog", calorieLogSchema);
