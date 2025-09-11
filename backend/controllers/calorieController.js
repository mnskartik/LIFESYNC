import CalorieLog from "../models/CalorieLog.js";

// Get today's data
export const getTodayLog = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    let log = await CalorieLog.findOne({ user: req.user.id, date: today });

    if (!log) {
      log = await CalorieLog.create({ user: req.user.id, date: today, logs: [] });
    }

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: "Error fetching calorie log" });
  }
};

// Set target
export const setTarget = async (req, res) => {
  try {
    const { target } = req.body;
    const today = new Date().toISOString().split("T")[0];

    let log = await CalorieLog.findOneAndUpdate(
      { user: req.user.id, date: today },
      { $set: { target } },
      { new: true, upsert: true }
    );

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: "Error setting target" });
  }
};

// Add food log
export const addFood = async (req, res) => {
  try {
    const { food, calories } = req.body;
    const today = new Date().toISOString().split("T")[0];

    const log = await CalorieLog.findOneAndUpdate(
      { user: req.user.id, date: today },
      { $push: { logs: { food, calories } } },
      { new: true, upsert: true }
    );

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: "Error adding food log" });
  }
};

// Delete food log
export const deleteFood = async (req, res) => {
  try {
    const { logId } = req.params;
    const today = new Date().toISOString().split("T")[0];

    const log = await CalorieLog.findOneAndUpdate(
      { user: req.user.id, date: today },
      { $pull: { logs: { _id: logId } } },
      { new: true }
    );

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: "Error deleting food log" });
  }
};

// Get history
export const getHistory = async (req, res) => {
  try {
    const history = await CalorieLog.find({ user: req.user.id }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
};
