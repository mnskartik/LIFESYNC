import { Workout, Goal } from "../models/GymWorkout.js";

// ✅ Get all workouts for logged-in user
export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Add new workout for logged-in user
export const addWorkout = async (req, res) => {
  try {
    const { exercise, sets, reps, weight, date } = req.body;
    const workout = new Workout({
      user: req.user._id,
      exercise,
      sets,
      reps,
      weight,
      date,
    });
    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete workout (only if it belongs to the logged-in user)
export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json({ message: "Workout deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Reset all workouts + goals for this user
export const resetWorkouts = async (req, res) => {
  try {
    await Workout.deleteMany({ user: req.user._id });
    await Goal.deleteMany({ user: req.user._id });
    res.json({ message: "Progress reset" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Set or update goal for this user
export const setGoal = async (req, res) => {
  try {
    const { goal, targetWorkouts } = req.body;
    let savedGoal = await Goal.findOne({ user: req.user._id });

    if (savedGoal) {
      savedGoal.goal = goal;
      savedGoal.targetWorkouts = targetWorkouts;
      await savedGoal.save();
    } else {
      savedGoal = await Goal.create({
        user: req.user._id,
        goal,
        targetWorkouts,
      });
    }

    res.json(savedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get goal for this user
export const getGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ user: req.user._id });
    res.json(goal || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
