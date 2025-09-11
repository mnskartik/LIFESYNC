import Reminder from "../models/Reminder.js";

// Create reminder
export const createReminder = async (req, res) => {
  try {
    const { title, time } = req.body;

    if (!title || !time) {
      return res.status(400).json({ message: "Title and time are required" });
    }

    const reminder = await Reminder.create({
      user: req.user.id,
      title,
      time,
    });

    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all reminders for user
export const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete reminder
export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) return res.status(404).json({ message: "Reminder not found" });
    if (reminder.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await reminder.deleteOne();
    res.json({ message: "Reminder deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
