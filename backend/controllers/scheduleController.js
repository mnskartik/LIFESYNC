import Schedule from "../models/Schedule.js";

// Add new task
export const addTask = async (req, res) => {
  try {
    const { day, time, task } = req.body;
    if (!day || !time || !task) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTask = await Schedule.create({
      user: req.user.id,
      day,
      time,
      task,
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tasks for a user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Schedule.find({ user: req.user.id }).sort({ day: 1, time: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Schedule.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
