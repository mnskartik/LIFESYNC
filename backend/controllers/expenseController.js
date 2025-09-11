import Expense from "../models/expenseModel.js";

// Get all expenses + budget
export const getExpenses = async (req, res) => {
  try {
    const expenseData = await Expense.findOne({ user: req.user._id });
    if (!expenseData) {
      return res.json({ budget: 0, expenses: [] });
    }
    res.json(expenseData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Set / Update budget
export const setBudget = async (req, res) => {
  try {
    const { budget } = req.body;
    let expenseData = await Expense.findOne({ user: req.user._id });

    if (!expenseData) {
      expenseData = new Expense({ user: req.user._id, budget });
    } else {
      expenseData.budget = budget;
    }
    await expenseData.save();
    res.json(expenseData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add expense
export const addExpense = async (req, res) => {
  try {
    const { title, category, amount } = req.body;
    let expenseData = await Expense.findOne({ user: req.user._id });

    if (!expenseData) {
      expenseData = new Expense({ user: req.user._id, budget: 0, expenses: [] });
    }

    expenseData.expenses.push({ title, category, amount });
    await expenseData.save();
    res.json(expenseData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset month (clear everything)
export const resetExpenses = async (req, res) => {
  try {
    let expenseData = await Expense.findOne({ user: req.user._id });

    if (expenseData) {
      expenseData.expenses = [];
      expenseData.budget = 0;
      await expenseData.save();
    }

    res.json({ message: "Expenses reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
