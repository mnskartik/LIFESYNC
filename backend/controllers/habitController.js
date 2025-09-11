import Habit from "../models/Habit.js";

// 📌 Get all habits for logged-in user
export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch habits" });
  }
};

// ➕ Add new habit
export const addHabit = async (req, res) => {
  try {
    const { name } = req.body;
    const habit = await Habit.create({
      user: req.user._id,
      name,
      completed: false,
      streak: 0,
      lastCompleted: null,
    });
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: "Failed to add habit" });
  }
};

// 🔄 Toggle completion (with streak logic)
export const toggleHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit || habit.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date().toLocaleDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString();

    let streak = habit.streak;
    let lastCompleted = habit.lastCompleted;
    const isCompleting = !habit.completed;

    if (isCompleting) {
      if (habit.lastCompleted === yesterdayStr) {
        streak += 1;
      } else {
        streak = 1;
      }
      lastCompleted = today;
    }

    habit.completed = isCompleting;
    habit.streak = streak;
    habit.lastCompleted = lastCompleted;

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle habit" });
  }
};

// ❌ Delete habit
export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit || habit.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Habit not found" });
    }

    await habit.deleteOne();
    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete habit" });
  }
};

// 🗑️ Clear all habits
export const clearHabits = async (req, res) => {
  try {
    await Habit.deleteMany({ user: req.user._id });
    res.json({ message: "All habits cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear habits" });
  }
};
