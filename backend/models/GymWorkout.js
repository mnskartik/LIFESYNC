import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  exercise: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
  date: { type: String, required: true },
});

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  goal: { type: String, required: true },
  targetWorkouts: { type: Number, required: true },
});

export const Workout = mongoose.model("Workout", workoutSchema);
export const Goal = mongoose.model("Goal", goalSchema);
