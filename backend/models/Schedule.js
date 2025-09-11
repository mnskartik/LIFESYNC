import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;
