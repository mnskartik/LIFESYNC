import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  budget: {
    type: Number,
    default: 0,
  },
  expenses: [
    {
      title: { type: String, required: true },
      category: { type: String, required: true },
      amount: { type: Number, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
