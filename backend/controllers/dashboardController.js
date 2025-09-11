import Habit from "../models/Habit.js";
import Note from "../models/Note.js";
import { Workout, Goal } from "../models/GymWorkout.js";

import Expense from "../models/expenseModel.js";
import Reminder from "../models/Reminder.js";
import Schedule from "../models/Schedule.js";
import Calorie from "../models/CalorieLog.js";




// GET /api/dashboard/summary
export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // fetch all collections
    const habits = await Habit.find({ user: userId });
    const notes = await Note.find({ user: userId });
    const workouts = await Workout.find({ user: userId });
    const goal = await Goal.findOne({ user: userId });
    const expenses = await Expense.find({ user: userId });
    const reminders = await Reminder.find({ user: userId });
    const schedule = await Schedule.find({ user: userId });

    // ✅ fetch today's calorie log
    const today = new Date().toISOString().split("T")[0];
    const todayCalorie = await Calorie.findOne({ user: userId, date: today });

    // 📝 prepare summary
    const habitsCount = habits.length;
    const notesCount = notes.length;

    // ✅ Expenses summary (spent / budget)
    let expensesSummary = "₹0 / ₹0";
if (expenses.length > 0) {
  const userExpenseDoc = expenses[0]; // since per-user one doc
  const spent = userExpenseDoc.expenses.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );
  const budget = userExpenseDoc.budget || 0;
  expensesSummary = `₹${spent} / ₹${budget}`;
}

    let gymStr = "No progress yet";
    if (workouts.length > 0) {
      const uniqueDates = [...new Set(workouts.map((w) => w.date))];
      gymStr = `${uniqueDates.length} workout day(s)`;
      if (goal) {
        gymStr += ` / Goal: ${goal.targetWorkouts} workouts`;
      }
    }

    // ✅ Calories summary (consumed/target)
    // ✅ Calories summary (consumed/target)
let caloriesSummary = { consumed: 0, target: 0 };
if (todayCalorie) {
  const consumed = todayCalorie.logs.reduce(
    (sum, entry) => sum + (entry.calories || 0),
    0
  );
  caloriesSummary = {
    consumed,
    target: todayCalorie.target || 0
  };
}


    const scheduleSummary = schedule.length
      ? `${schedule.length} day(s) scheduled`
      : "";

    const remindersCount = reminders.length;

    const summary = {
      alarms: remindersCount,
      schedule: scheduleSummary,
      calories: caloriesSummary, // 👈 now shows "200/5000"
      notes: notesCount,
      habits: habitsCount,
      expenses: expensesSummary,
      gym: gymStr,
    };

    res.json(summary);
  } catch (err) {
    console.error("Error fetching dashboard summary:", err);
    res.status(500).json({ message: "Server error while fetching summary" });
  }
};


export const updateDashboardSummary = async (req, res) => {
  try {
    const { calories, caloriesGoal, gym, gymGoal, water, waterGoal, study, studyGoal } = req.body;

    // Get old data
    const stored = JSON.parse(localStorage.getItem("dashboardSummary")) || {
      calories: 0,
      caloriesGoal: 2000,
      gym: 0,
      gymGoal: 5,
      water: 0,
      waterGoal: 3000,
      study: 0,
      studyGoal: 5,
    };

    // Merge updates
    const updated = {
      ...stored,
      ...(calories !== undefined && { calories }),
      ...(caloriesGoal !== undefined && { caloriesGoal }),
      ...(gym !== undefined && { gym }),
      ...(gymGoal !== undefined && { gymGoal }),
      ...(water !== undefined && { water }),
      ...(waterGoal !== undefined && { waterGoal }),
      ...(study !== undefined && { study }),
      ...(studyGoal !== undefined && { studyGoal }),
    };

    // Save back to localStorage
    localStorage.setItem("dashboardSummary", JSON.stringify(updated));

    res.json(updated);
  } catch (err) {
    console.error("Error updating dashboard summary:", err);
    res.status(500).json({ message: "Server error while updating summary" });
  }
};

